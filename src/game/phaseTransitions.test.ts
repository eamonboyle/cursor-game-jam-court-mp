import { describe, expect, it } from "vitest";
import {
  ALLOWED_TRANSITIONS,
  applyPhaseTransition,
  isTransitionAllowed,
  listLegalNextPhases,
} from "./phaseTransitions";
import { createInitialMatchState } from "./matchState";

describe("phaseTransitions", () => {
  it("rejects illegal moves without force", () => {
    expect(isTransitionAllowed("idle", "verdict", false)).toBe(false);
    expect(isTransitionAllowed("opening", "verdict", false)).toBe(false);
  });

  it("allows forced moves", () => {
    expect(isTransitionAllowed("idle", "verdict", true)).toBe(true);
  });

  it("allows idle -> opening and opening -> examination", () => {
    expect(isTransitionAllowed("idle", "opening", false)).toBe(true);
    expect(isTransitionAllowed("opening", "examination", false)).toBe(true);
  });

  it("enumerates adjacency for each phase", () => {
    for (const key of Object.keys(ALLOWED_TRANSITIONS)) {
      const from = key as keyof typeof ALLOWED_TRANSITIONS;
      expect(listLegalNextPhases(from).length).toBeGreaterThan(0);
    }
  });

  it("applyPhaseTransition updates phase and timer", () => {
    const { state: s0, timer } = createInitialMatchState();
    const r0 = applyPhaseTransition(s0, timer, "opening", {
      force: true,
      atMs: 1,
    });
    expect(r0.ok).toBe(true);
    if (!r0.ok) return;
    expect(r0.state.phase).toBe("opening");
    expect(r0.state.turnTimer.remainingMs).toBeGreaterThan(0);
    expect(r0.state.activeRole).toBe("judge");

    const r1 = applyPhaseTransition(r0.state, timer, "examination", {
      atMs: 2,
    });
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.state.phase).toBe("examination");
    expect(r1.state.currentWitnessId).toBe("witness_stub");
  });

  it("rejects examination -> closing without force", () => {
    const { state: s0, timer } = createInitialMatchState();
    const s1 = applyPhaseTransition(s0, timer, "opening", { force: true, atMs: 0 });
    if (!s1.ok) throw new Error("setup");
    const s2 = applyPhaseTransition(s1.state, timer, "examination", {
      atMs: 1,
    });
    if (!s2.ok) throw new Error("setup");
    const bad = applyPhaseTransition(s2.state, timer, "closing", { atMs: 2 });
    expect(bad.ok).toBe(false);
  });
});
