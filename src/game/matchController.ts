import type { CourtroomSceneState } from "../rendering/courtroomSceneState";
import {
  applyPhaseTransition,
  listLegalNextPhases,
} from "./phaseTransitions";
import {
  attachTimerSnapshot,
  createInitialMatchState,
  type MatchState,
} from "./matchState";
import { TRIAL_PHASES, trialPhaseIndex, type TrialPhase } from "./trialPhase";
import type { TurnTimer } from "./turnTimer";

const MAX_FRAME_MS = 100;

export class MatchController {
  private state: MatchState;
  private readonly timer: TurnTimer;
  private readonly listeners = new Set<(s: MatchState) => void>();
  private rafId = 0;
  private lastTs = performance.now();
  private readonly debugTransitions = true;

  private readonly phaseEndHandlers = new Map<TrialPhase, () => void>();
  private readonly phaseStartHandlers = new Map<TrialPhase, () => void>();

  readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      return;
    if (e.key === "]") {
      e.preventDefault();
      this.advanceLegal();
    } else if (e.key === "[") {
      e.preventDefault();
      this.devCycle(-1);
    } else if (e.key === "\\") {
      e.preventDefault();
      this.devCycle(1);
    }
  };

  constructor(
    private readonly visual: CourtroomSceneState,
    private readonly afterVisualSync?: () => void,
  ) {
    const initial = createInitialMatchState();
    this.state = initial.state;
    this.timer = initial.timer;
    this.syncVisual();
  }

  getState(): MatchState {
    return this.state;
  }

  subscribe(fn: (s: MatchState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Register cleanup when leaving a phase (Gameplay Phase 1 Step 9). */
  onPhaseEnd(phase: TrialPhase, fn: () => void): void {
    this.phaseEndHandlers.set(phase, fn);
  }

  onPhaseStart(phase: TrialPhase, fn: () => void): void {
    this.phaseStartHandlers.set(phase, fn);
  }

  start(): void {
    window.addEventListener("keydown", this.onKeyDown);
    void this.requestTransition("opening");
    this.rafId = requestAnimationFrame(this.tick);
  }

  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    cancelAnimationFrame(this.rafId);
  }

  requestTransition(target: TrialPhase, options?: { force?: boolean }): boolean {
    const prev = this.state.phase;
    const result = applyPhaseTransition(this.state, this.timer, target, {
      force: options?.force,
      atMs: performance.now(),
    });
    if (!result.ok) {
      if (this.debugTransitions) console.warn("[trial]", result.reason);
      return false;
    }
    this.phaseEndHandlers.get(prev)?.();
    this.state = result.state;
    if (this.debugTransitions) console.debug("[trial]", prev, "->", target);
    this.syncVisual();
    this.emit();
    this.phaseStartHandlers.get(target)?.();
    return true;
  }

  /** Deterministic: first legal edge from `listLegalNextPhases`. */
  advanceLegal(): void {
    const next = listLegalNextPhases(this.state.phase)[0];
    if (!next) return;
    void this.requestTransition(next);
  }

  /** Dev-only forced cycling across all phases (Gameplay Phase 1 Step 5). */
  devCycle(delta: 1 | -1): void {
    const idx = trialPhaseIndex(this.state.phase);
    const n = TRIAL_PHASES.length;
    const nextIdx = (idx + delta + n) % n;
    const target = TRIAL_PHASES[nextIdx];
    if (!target) return;
    void this.requestTransition(target, { force: true });
  }

  private readonly tick = (ts: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const dt = Math.min(ts - this.lastTs, MAX_FRAME_MS);
    this.lastTs = ts;
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
  };

  private syncVisual(): void {
    this.visual.setPhase(this.state.phase);
    this.visual.setActiveSpeaker(this.state.activeRole);
    this.afterVisualSync?.();
  }

  private emit(): void {
    for (const fn of this.listeners) fn(this.state);
  }
}
