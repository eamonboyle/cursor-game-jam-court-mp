import {
  pickAiCounselCardId,
  pickAiJudgeRuling,
  pickAiJuryVote,
} from "./ai/seatBehavior";
import type { CounselSide } from "./counsel";
import {
  tryAppendJudgeRuling,
  type JudgeRulingId,
} from "./judgeRulings";
import { JUROR_COUNT, tryCastJuryVote, type JuryVote } from "./jury";
import {
  applyPhaseTransition,
  listLegalNextPhases,
} from "./phaseTransitions";
import {
  attachTimerSnapshot,
  createInitialMatchState,
  type MatchState,
} from "./matchState";
import type { SeatFillMap } from "./seatFill";
import { TRIAL_PHASES, trialPhaseIndex, type TrialPhase } from "./trialPhase";
import { TurnTimer } from "./turnTimer";

const MAX_FRAME_MS = 100;
const AI_JURY_COOLDOWN_MS = 320;
const AI_OBJECTION_DELAY_MS = 380;

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

/**
 * Authoritative trial state + timer + AI fill — no DOM (Milestone H: shared by
 * client controller and room server).
 */
export class MatchCore {
  private state: MatchState;
  private readonly timer: TurnTimer;
  private readonly listeners = new Set<(s: MatchState) => void>();
  private lastTs = nowMs();
  private readonly debugTransitions = true;

  private readonly phaseEndHandlers = new Map<TrialPhase, () => void>();
  private readonly phaseStartHandlers = new Map<TrialPhase, () => void>();

  private lastAiJuryMs = 0;
  private objectionEnteredMs = 0;

  constructor() {
    const initial = createInitialMatchState();
    this.state = initial.state;
    this.timer = initial.timer;
  }

  getState(): MatchState {
    return this.state;
  }

  /** Replace all state from server snapshot (network client). */
  hydrate(snapshot: MatchState): void {
    this.state = snapshot;
    this.timer.reset(snapshot.turnTimer.totalMs);
    this.timer.remainingMs = snapshot.turnTimer.remainingMs;
    this.timer.isPaused = snapshot.turnTimer.isPaused;
    this.emit();
  }

  subscribe(fn: (s: MatchState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  onPhaseEnd(phase: TrialPhase, fn: () => void): void {
    this.phaseEndHandlers.set(phase, fn);
  }

  onPhaseStart(phase: TrialPhase, fn: () => void): void {
    this.phaseStartHandlers.set(phase, fn);
  }

  setSeatFill(next: SeatFillMap): void {
    this.state = { ...this.state, seatFill: next };
    this.emit();
  }

  patchSeatFill(patch: Partial<SeatFillMap>): void {
    this.setSeatFill({ ...this.state.seatFill, ...patch });
  }

  requestTransition(target: TrialPhase, options?: { force?: boolean }): boolean {
    const prev = this.state.phase;
    const result = applyPhaseTransition(this.state, this.timer, target, {
      force: options?.force,
      atMs: nowMs(),
    });
    if (!result.ok) {
      if (this.debugTransitions) console.warn("[trial]", result.reason);
      return false;
    }
    this.phaseEndHandlers.get(prev)?.();
    this.state = result.state;
    if (target === "objection") {
      this.objectionEnteredMs = nowMs();
    }
    if (target === "jury_deliberation") {
      this.lastAiJuryMs = 0;
    }
    if (this.debugTransitions) console.debug("[trial]", prev, "->", target);
    this.emit();
    this.phaseStartHandlers.get(target)?.();
    return true;
  }

  advanceLegal(): void {
    const next = listLegalNextPhases(this.state.phase)[0];
    if (!next) return;
    void this.requestTransition(next);
  }

  devCycle(delta: 1 | -1): void {
    const idx = trialPhaseIndex(this.state.phase);
    const n = TRIAL_PHASES.length;
    const nextIdx = (idx + delta + n) % n;
    const target = TRIAL_PHASES[nextIdx];
    if (!target) return;
    void this.requestTransition(target, { force: true });
  }

  castJuryVote(vote: JuryVote): boolean {
    const result = tryCastJuryVote(this.state, vote, nowMs());
    if (!result.ok) {
      if (this.debugTransitions) console.warn("[trial] jury vote:", result.reason);
      return false;
    }
    this.state = result.state;
    if (this.debugTransitions) console.debug("[trial] jury vote", vote, this.state.juryVotes.length);
    this.emit();
    return true;
  }

  recordJudgeRuling(rulingId: JudgeRulingId): boolean {
    const result = tryAppendJudgeRuling(this.state, rulingId, nowMs());
    if (!result.ok) {
      if (this.debugTransitions) console.warn("[trial] judge ruling:", result.reason);
      return false;
    }
    this.state = {
      ...result.state,
      aiLatch: { ...result.state.aiLatch, judgeObjection: true },
    };
    if (this.debugTransitions) console.debug("[trial] ruling", rulingId);
    this.emit();
    return true;
  }

  playCard(side: CounselSide, cardId: string): void {
    if (
      this.state.phase === "objection" ||
      this.state.phase === "jury_deliberation" ||
      this.state.phase === "verdict"
    ) {
      if (this.debugTransitions)
        console.warn("[trial] counsel cards disabled in this phase");
      return;
    }
    this.state = {
      ...this.state,
      playedCards: [
        ...this.state.playedCards,
        { side, cardId, atMs: nowMs() },
      ],
    };
    if (this.debugTransitions) console.debug("[trial] card", side, cardId);
    this.emit();
  }

  revealEvidence(evidenceId: string): void {
    if (
      this.state.phase === "objection" ||
      this.state.phase === "jury_deliberation" ||
      this.state.phase === "verdict"
    ) {
      if (this.debugTransitions)
        console.warn("[trial] evidence reveals disabled in this phase");
      return;
    }
    if (this.state.evidenceStack.includes(evidenceId)) return;
    this.state = {
      ...this.state,
      evidenceStack: [...this.state.evidenceStack, evidenceId],
    };
    if (this.debugTransitions) console.debug("[trial] evidence", evidenceId);
    this.emit();
  }

  beginOpeningPhase(): void {
    void this.requestTransition("opening");
  }

  tick(ts: number): void {
    const dt = Math.min(ts - this.lastTs, MAX_FRAME_MS);
    this.lastTs = ts;
    this.runAiSeatFill(ts);
    const expired = this.timer.tick(dt);
    const next = attachTimerSnapshot(this.state, this.timer);
    const timerChanged =
      next.turnTimer.remainingMs !== this.state.turnTimer.remainingMs ||
      next.turnTimer.isPaused !== this.state.turnTimer.isPaused;
    if (timerChanged) {
      this.state = next;
      this.emit();
    }
    if (expired && this.debugTransitions) {
      console.debug("[trial] timer expired", this.state.phase);
    }
  }

  private runAiSeatFill(now: number): void {
    const s = this.state;
    if (s.phase === "jury_deliberation" && s.seatFill.jury === "ai" && s.juryVotes.length < JUROR_COUNT) {
      if (now - this.lastAiJuryMs < AI_JURY_COOLDOWN_MS) return;
      this.lastAiJuryMs = now;
      const vote = pickAiJuryVote(s.jurySentiment, s.juryVotes.length + 1);
      void this.castJuryVote(vote);
      return;
    }
    if (
      s.phase === "objection" &&
      s.seatFill.judge === "ai" &&
      !s.aiLatch.judgeObjection &&
      now - this.objectionEnteredMs >= AI_OBJECTION_DELAY_MS
    ) {
      void this.recordJudgeRuling(pickAiJudgeRuling(s));
      return;
    }
    if (s.phase === "examination" || s.phase === "cross") {
      if (s.seatFill.prosecution === "ai" && !s.aiLatch.prosecutionCard) {
        this.aiPlayProsecutionCard();
      }
      if (s.seatFill.defense === "ai" && !s.aiLatch.defenseCard) {
        this.aiPlayDefenseCard();
      }
    }
  }

  private aiPlayProsecutionCard(): void {
    if (
      this.state.phase === "objection" ||
      this.state.phase === "jury_deliberation" ||
      this.state.phase === "verdict"
    ) {
      return;
    }
    const salt = this.state.playedCards.length + this.state.phase.length;
    const id = pickAiCounselCardId("prosecution", salt);
    this.state = {
      ...this.state,
      playedCards: [
        ...this.state.playedCards,
        { side: "prosecution", cardId: id, atMs: nowMs() },
      ],
      aiLatch: { ...this.state.aiLatch, prosecutionCard: true },
    };
    if (this.debugTransitions) console.debug("[trial] AI prosecution", id);
    this.emit();
  }

  private aiPlayDefenseCard(): void {
    if (
      this.state.phase === "objection" ||
      this.state.phase === "jury_deliberation" ||
      this.state.phase === "verdict"
    ) {
      return;
    }
    const salt = this.state.playedCards.length + this.state.phase.length + 3;
    const id = pickAiCounselCardId("defense", salt);
    this.state = {
      ...this.state,
      playedCards: [
        ...this.state.playedCards,
        { side: "defense", cardId: id, atMs: nowMs() },
      ],
      aiLatch: { ...this.state.aiLatch, defenseCard: true },
    };
    if (this.debugTransitions) console.debug("[trial] AI defense", id);
    this.emit();
  }

  private emit(): void {
    for (const fn of this.listeners) fn(this.state);
  }
}
