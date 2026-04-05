import type { ActiveRole } from "./roles";
import type { TrialPhase } from "./trialPhase";
import {
  attachTimerSnapshot,
  DEFAULT_PHASE_MS,
  type MatchState,
} from "./matchState";
import { TurnTimer } from "./turnTimer";

/**
 * Explicit directed edges for non-forced transitions (Gameplay Phase 1 Step 4 + Step 10 map).
 */
export const ALLOWED_TRANSITIONS: Record<TrialPhase, readonly TrialPhase[]> = {
  idle: ["opening"],
  opening: ["examination"],
  examination: ["cross", "objection"],
  objection: ["examination", "cross", "closing"],
  cross: ["closing"],
  closing: ["jury_deliberation"],
  jury_deliberation: ["verdict"],
  verdict: ["idle"],
};

export function isTransitionAllowed(
  from: TrialPhase,
  to: TrialPhase,
  force: boolean,
): boolean {
  if (force) return true;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function defaultActiveRoleForPhase(phase: TrialPhase): ActiveRole {
  switch (phase) {
    case "opening":
    case "closing":
      return "judge";
    case "examination":
    case "cross":
      return "witness";
    case "objection":
      /** Milestone E: judge has the floor for bounded rulings. */
      return "judge";
    case "jury_deliberation":
    case "verdict":
      return "jury";
    case "idle":
    default:
      return "none";
  }
}

export function defaultWitnessIdForPhase(phase: TrialPhase): string | null {
  if (phase === "examination" || phase === "cross") {
    return "witness_stub";
  }
  /** Objection: judge rules; witness line cleared until return to testimony. */
  return null;
}

export type PhaseTransitionResult =
  | { ok: true; state: MatchState; timer: TurnTimer }
  | { ok: false; reason: string };

export function applyPhaseTransition(
  prevState: MatchState,
  timer: TurnTimer,
  target: TrialPhase,
  options: { force?: boolean; atMs: number },
): PhaseTransitionResult {
  const force = options.force ?? false;
  if (!isTransitionAllowed(prevState.phase, target, force)) {
    return {
      ok: false,
      reason: `Illegal transition: ${prevState.phase} -> ${target}`,
    };
  }

  timer.reset(DEFAULT_PHASE_MS);
  timer.resume();

  const next: MatchState = {
    ...prevState,
    phase: target,
    activeRole: defaultActiveRoleForPhase(target),
    currentWitnessId: defaultWitnessIdForPhase(target),
    turnTimer: timer.snapshot(),
  };

  return { ok: true, state: attachTimerSnapshot(next, timer), timer };
}

export function listLegalNextPhases(from: TrialPhase): readonly TrialPhase[] {
  return ALLOWED_TRANSITIONS[from];
}
