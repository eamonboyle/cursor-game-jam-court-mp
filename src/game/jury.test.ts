import { describe, expect, it } from "vitest";
import { createInitialMatchState } from "./matchState";
import { applyPhaseTransition } from "./phaseTransitions";
import {
  JUROR_COUNT,
  resolveVerdictFromVotes,
  tryCastJuryVote,
} from "./jury";

describe("tryCastJuryVote", () => {
  it("only during jury_deliberation", () => {
    const { state } = createInitialMatchState();
    const r = tryCastJuryVote(state, "guilty", 1);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("not_deliberation");
  });

  it("stops at JUROR_COUNT", () => {
    const { state: s0, timer } = createInitialMatchState();
    const s1 = applyPhaseTransition(s0, timer, "jury_deliberation", {
      force: true,
      atMs: 0,
    });
    if (!s1.ok) throw new Error("setup");
    let s = s1.state;
    for (let i = 0; i < JUROR_COUNT; i++) {
      const v = tryCastJuryVote(s, i % 2 === 0 ? "guilty" : "not_guilty", i);
      expect(v.ok).toBe(true);
      if (!v.ok) return;
      s = v.state;
    }
    const done = tryCastJuryVote(s, "guilty", 99);
    expect(done.ok).toBe(false);
    if (done.ok) return;
    expect(done.reason).toBe("poll_complete");
  });
});

describe("resolveVerdictFromVotes", () => {
  it("majority guilty", () => {
    const votes = Array.from({ length: JUROR_COUNT }, (_, i) => ({
      jurorIndex: i + 1,
      vote: i < 4 ? ("guilty" as const) : ("not_guilty" as const),
      atMs: i,
    }));
    expect(resolveVerdictFromVotes(votes)).toBe("guilty");
  });

  it("incomplete poll is hung", () => {
    expect(
      resolveVerdictFromVotes([
        { jurorIndex: 1, vote: "guilty", atMs: 0 },
        { jurorIndex: 2, vote: "not_guilty", atMs: 1 },
      ]),
    ).toBe("hung");
  });

  it("tie is hung", () => {
    const votes = Array.from({ length: JUROR_COUNT }, (_, i) => ({
      jurorIndex: i + 1,
      vote: i % 2 === 0 ? ("guilty" as const) : ("not_guilty" as const),
      atMs: i,
    }));
    expect(resolveVerdictFromVotes(votes)).toBe("hung");
  });
});
