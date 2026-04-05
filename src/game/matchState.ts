import { DEFAULT_CASE_ID, getCasePack } from "../data/caseRegistry";
import type { PlayedCardEntry } from "./counsel";
import type { JudgeRulingId } from "./judgeRulings";
import type { JuryVoteEntry, VerdictOutcome } from "./jury";
import type { ActiveRole } from "./roles";
import type { SeatFillMap } from "./seatFill";
import { createAllHumanSeatFill } from "./seatFill";
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
  /** Active authored docket (Milestone I). */
  caseId: string;
  /** Witness seat ID during examination / cross; from case JSON. */
  examWitnessId: string;
  phase: TrialPhase;
  activeRole: ActiveRole;
  turnTimer: TurnTimerSnapshot;
  currentWitnessId: string | null;
  evidenceStack: readonly string[];
  /** counsel card plays (Milestone D). */
  playedCards: readonly PlayedCardEntry[];
  jurySentiment: number;
  rulingHistory: readonly RulingEntry[];
  /** Sealed when exiting deliberation into `verdict` (Milestone F). */
  verdictOutcome: VerdictOutcome | null;
  /** Cumulative poll during `jury_deliberation`; frozen after phase ends. */
  juryVotes: readonly JuryVoteEntry[];
  /** Milestone G — AI vs human per seat. */
  seatFill: SeatFillMap;
  /** One-shot AI actions per phase; reset on every phase transition. */
  aiLatch: {
    judgeObjection: boolean;
    prosecutionCard: boolean;
    defenseCard: boolean;
  };
};

export const DEFAULT_PHASE_MS = 45_000;

export function createInitialMatchState(
  caseId: string = DEFAULT_CASE_ID,
): { state: MatchState; timer: TurnTimer } {
  const pack = getCasePack(caseId);
  const timer = new TurnTimer(0);
  timer.pause();
  const state: MatchState = {
    caseId: pack.id,
    examWitnessId: pack.witnessId,
    phase: "idle",
    activeRole: "none",
    turnTimer: timer.snapshot(),
    currentWitnessId: null,
    evidenceStack: [],
    playedCards: [],
    jurySentiment: 0,
    rulingHistory: [],
    verdictOutcome: null,
    juryVotes: [],
    seatFill: createAllHumanSeatFill(),
    aiLatch: {
      judgeObjection: false,
      prosecutionCard: false,
      defenseCard: false,
    },
  };
  return { state, timer };
}

export function attachTimerSnapshot(state: MatchState, timer: TurnTimer): MatchState {
  return { ...state, turnTimer: timer.snapshot() };
}
