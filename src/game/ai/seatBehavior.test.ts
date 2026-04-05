import { describe, expect, it } from "vitest";
import { STUB_DEFENSE_CARDS, STUB_PROSECUTION_CARDS } from "../counsel";
import { createInitialMatchState } from "../matchState";
import { applyPhaseTransition } from "../phaseTransitions";
import { pickAiCounselCardId, pickAiJudgeRuling, pickAiJuryVote } from "./seatBehavior";

describe("pickAiJuryVote", () => {
  it("is deterministic for the same inputs", () => {
    expect(pickAiJuryVote(0, 1)).toBe(pickAiJuryVote(0, 1));
    const v = pickAiJuryVote(0, 3);
    expect(v === "guilty" || v === "not_guilty").toBe(true);
  });
});

describe("pickAiJudgeRuling", () => {
  it("returns a valid bounded id", () => {
    const { state } = createInitialMatchState();
    const id = pickAiJudgeRuling(state);
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(2);
  });
});

describe("pickAiCounselCardId", () => {
  it("cycles stubs", () => {
    expect(
      pickAiCounselCardId("prosecution", 0, STUB_PROSECUTION_CARDS, STUB_DEFENSE_CARDS),
    ).toMatch(/^pro_/);
    expect(
      pickAiCounselCardId("defense", 0, STUB_PROSECUTION_CARDS, STUB_DEFENSE_CARDS),
    ).toMatch(/^def_/);
  });
});

describe("phase transition resets aiLatch", () => {
  it("clears latch fields", () => {
    const { state: s0, timer } = createInitialMatchState();
    const s1 = applyPhaseTransition(s0, timer, "opening", { force: true, atMs: 0 });
    if (!s1.ok) throw new Error("setup");
    expect(s1.state.aiLatch.judgeObjection).toBe(false);
    expect(s1.state.aiLatch.prosecutionCard).toBe(false);
    expect(s1.state.aiLatch.defenseCard).toBe(false);
  });
});
