import type { PlayedCardEntry } from "./counsel";
import type { JudgeRulingId } from "./judgeRulings";
import type { ActiveRole } from "./roles";
import type { TrialPhase } from "./trialPhase";
import type { TurnTimerSnapshot } from "./turnTimer";
import { TurnTimer } from "./turnTimer";

export type RulingEntry = {
  phase: TrialPhase;
  summary: string;
  atMs: number;
  /** Set when entered from the bounded judge palette (Milestone E). */
  rulingId?: JudgeRulingId;
};

export type MatchState = {
  phase: TrialPhase;
  activeRole: ActiveRole;
  turnTimer: TurnTimerSnapshot;
  currentWitnessId: string | null;
  evidenceStack: readonly string[];
  /** counsel card plays (Milestone D). */
  playedCards: readonly PlayedCardEntry[];
  jurySentiment: number;
  rulingHistory: readonly RulingEntry[];
};

export const DEFAULT_PHASE_MS = 45_000;

export function createInitialMatchState(): { state: MatchState; timer: TurnTimer } {
  const timer = new TurnTimer(0);
  timer.pause();
  const state: MatchState = {
    phase: "idle",
    activeRole: "none",
    turnTimer: timer.snapshot(),
    currentWitnessId: null,
    evidenceStack: [],
    playedCards: [],
    jurySentiment: 0,
    rulingHistory: [],
  };
  return { state, timer };
}

export function attachTimerSnapshot(state: MatchState, timer: TurnTimer): MatchState {
  return { ...state, turnTimer: timer.snapshot() };
}
