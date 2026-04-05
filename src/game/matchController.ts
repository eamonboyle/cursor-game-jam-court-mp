import type { CourtroomSceneState } from "../rendering/courtroomSceneState";
import type { CounselSide } from "./counsel";
import type { JudgeRulingId } from "./judgeRulings";
import type { JuryVote } from "./jury";
import { MatchCore } from "./matchCore";
import type { MatchState } from "./matchState";
import type { SeatFillMap } from "./seatFill";
import type { TrialPhase } from "./trialPhase";

export type NetworkKeySink = {
  advanceLegal(): void;
  devCycle(delta: 1 | -1): void;
};

/**
 * Browser shell: RAF loop, keyboard shortcuts, Three.js visual sync + MatchCore.
 */
export class MatchController {
  private readonly core: MatchCore;
  private rafId = 0;
  /** When true, game clock + AI run on the room server; client only hydrates. */
  private networkClientMode = false;
  private networkKeySink: NetworkKeySink | null = null;

  readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      return;
    if (this.networkClientMode) {
      if (this.networkKeySink) {
        if (e.key === "]") {
          e.preventDefault();
          this.networkKeySink.advanceLegal();
        } else if (e.key === "[") {
          e.preventDefault();
          this.networkKeySink.devCycle(-1);
        } else if (e.key === "\\") {
          e.preventDefault();
          this.networkKeySink.devCycle(1);
        }
      }
      return;
    }
    if (e.key === "]") {
      e.preventDefault();
      this.core.advanceLegal();
    } else if (e.key === "[") {
      e.preventDefault();
      this.core.devCycle(-1);
    } else if (e.key === "\\") {
      e.preventDefault();
      this.core.devCycle(1);
    }
  };

  constructor(
    private readonly visual: CourtroomSceneState,
    private readonly afterVisualSync?: () => void,
  ) {
    this.core = new MatchCore();
    this.core.subscribe(() => {
      this.syncVisual();
      this.afterVisualSync?.();
    });
    this.syncVisual();
  }

  getState(): MatchState {
    return this.core.getState();
  }

  /** Authoritative snapshot from room server (Milestone H). */
  hydrateFromNetwork(snapshot: MatchState): void {
    this.core.hydrate(snapshot);
  }

  /** Client follows server clock; call before `start()` when joining a room. */
  setNetworkClientMode(
    enabled: boolean,
    keySink: NetworkKeySink | null = null,
  ): void {
    this.networkClientMode = enabled;
    this.networkKeySink = keySink;
  }

  setSeatFill(next: SeatFillMap): void {
    this.core.setSeatFill(next);
  }

  patchSeatFill(patch: Partial<SeatFillMap>): void {
    this.core.patchSeatFill(patch);
  }

  subscribe(fn: (s: MatchState) => void): () => void {
    return this.core.subscribe(fn);
  }

  onPhaseEnd(phase: TrialPhase, fn: () => void): void {
    this.core.onPhaseEnd(phase, fn);
  }

  onPhaseStart(phase: TrialPhase, fn: () => void): void {
    this.core.onPhaseStart(phase, fn);
  }

  /**
   * @param skipOpeningPhase Use when loading `?room=` — server snapshot will hydrate opening.
   */
  start(options?: { skipOpeningPhase?: boolean }): void {
    window.addEventListener("keydown", this.onKeyDown);
    const skip = options?.skipOpeningPhase ?? false;
    if (!this.networkClientMode && !skip) {
      this.core.beginOpeningPhase();
    }
    this.rafId = requestAnimationFrame(this.tick);
  }

  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    cancelAnimationFrame(this.rafId);
  }

  requestTransition(target: TrialPhase, options?: { force?: boolean }): boolean {
    return this.core.requestTransition(target, options);
  }

  advanceLegal(): void {
    this.core.advanceLegal();
  }

  devCycle(delta: 1 | -1): void {
    this.core.devCycle(delta);
  }

  castJuryVote(vote: JuryVote): boolean {
    return this.core.castJuryVote(vote);
  }

  recordJudgeRuling(rulingId: JudgeRulingId): boolean {
    return this.core.recordJudgeRuling(rulingId);
  }

  playCard(side: CounselSide, cardId: string): void {
    this.core.playCard(side, cardId);
  }

  revealEvidence(evidenceId: string): void {
    this.core.revealEvidence(evidenceId);
  }

  private readonly tick = (ts: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    if (!this.networkClientMode) {
      this.core.tick(ts);
    }
  };

  private syncVisual(): void {
    const s = this.core.getState();
    this.visual.setPhase(s.phase);
    this.visual.setActiveSpeaker(s.activeRole);
  }
}
