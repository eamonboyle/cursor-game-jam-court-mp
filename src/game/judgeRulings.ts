import type { MatchState, RulingEntry } from "./matchState";
import type { TrialPhase } from "./trialPhase";

/** Enumerated rulings the judge may enter — no free text (Milestone E). */
export type JudgeRulingId =
  | "sustain"
  | "overrule"
  | "strike_testimony"
  | "admit_with_caution"
  | "sidebar_denied";

export type JudgeRulingDefinition = {
  id: JudgeRulingId;
  label: string;
};

export const BOUNDED_JUDGE_RULINGS: readonly JudgeRulingDefinition[] = [
  { id: "sustain", label: "Sustained" },
  { id: "overrule", label: "Overruled" },
  { id: "strike_testimony", label: "Stricken from the record" },
  { id: "admit_with_caution", label: "Admitted — jury will weigh credibility" },
  { id: "sidebar_denied", label: "Sidebar denied — keep the record clean" },
] as const;

const RULING_BY_ID: Record<JudgeRulingId, JudgeRulingDefinition> = Object.fromEntries(
  BOUNDED_JUDGE_RULINGS.map((d) => [d.id, d]),
) as Record<JudgeRulingId, JudgeRulingDefinition>;

/** Judge rulings are only accepted in this phase (bounded window). */
export const JUDGE_RULING_PHASE: TrialPhase = "objection";

export function tryAppendJudgeRuling(
  state: MatchState,
  rulingId: JudgeRulingId,
  atMs: number,
):
  | { ok: true; state: MatchState }
  | { ok: false; reason: "not_objection" | "unknown_ruling" } {
  if (state.phase !== JUDGE_RULING_PHASE) {
    return { ok: false, reason: "not_objection" };
  }
  const def = RULING_BY_ID[rulingId];
  if (!def) return { ok: false, reason: "unknown_ruling" };

  const entry: RulingEntry = {
    phase: state.phase,
    summary: def.label,
    rulingId,
    atMs,
  };

  return {
    ok: true,
    state: {
      ...state,
      rulingHistory: [...state.rulingHistory, entry],
    },
  };
}
