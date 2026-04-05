import { describe, expect, it } from "vitest";
import { createInitialMatchState } from "./matchState";
import { applyPhaseTransition } from "./phaseTransitions";
import {
  BOUNDED_JUDGE_RULINGS,
  JUDGE_RULING_PHASE,
  tryAppendJudgeRuling,
} from "./judgeRulings";

describe("tryAppendJudgeRuling", () => {
  it("rejects rulings outside objection phase", () => {
    const { state: s0 } = createInitialMatchState();
    const r = tryAppendJudgeRuling(s0, "sustain", 1);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("not_objection");
  });

  it("appends bounded ruling during objection", () => {
    const { state: s0, timer } = createInitialMatchState();
    const s1 = applyPhaseTransition(s0, timer, "opening", { force: true, atMs: 0 });
    if (!s1.ok) throw new Error("setup");
    const s2 = applyPhaseTransition(s1.state, timer, "examination", { atMs: 1 });
    if (!s2.ok) throw new Error("setup");
    const s3 = applyPhaseTransition(s2.state, timer, "objection", { atMs: 2 });
    if (!s3.ok) throw new Error("setup");
    expect(s3.state.phase).toBe(JUDGE_RULING_PHASE);

    const r = tryAppendJudgeRuling(s3.state, "sustain", 99);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.rulingHistory).toHaveLength(1);
    expect(r.state.rulingHistory[0]?.summary).toBe("Sustained");
    expect(r.state.rulingHistory[0]?.rulingId).toBe("sustain");
  });

  it("palette count is stable", () => {
    expect(BOUNDED_JUDGE_RULINGS.length).toBeGreaterThanOrEqual(4);
  });
});
