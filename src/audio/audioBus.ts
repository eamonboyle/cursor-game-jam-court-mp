import type { TrialPhase } from "../game/trialPhase";

const PHASE_FREQ: Record<TrialPhase, number> = {
  idle: 180,
  opening: 220,
  examination: 260,
  cross: 240,
  objection: 150,
  closing: 200,
  jury_deliberation: 300,
  verdict: 340,
};

export type TrialPhaseAudio = {
  /** Call after a user gesture so phase cues can play. */
  resumeIfNeeded(): Promise<void>;
  playPhaseChange(phase: TrialPhase): void;
  dispose(): void;
};

/**
 * Minimal Web Audio cues on phase changes (Milestone J polish).
 * Safe no-op until the AudioContext is running.
 */
export function createTrialPhaseAudio(): TrialPhaseAudio {
  let ctx: AudioContext | null = null;

  const ensureCtx = (): AudioContext => {
    ctx ??= new AudioContext();
    return ctx;
  };

  return {
    async resumeIfNeeded(): Promise<void> {
      const c = ensureCtx();
      if (c.state === "suspended") await c.resume();
    },
    playPhaseChange(phase: TrialPhase): void {
      const c = ctx;
      if (!c || c.state !== "running") return;
      const t0 = c.currentTime;
      const freq = PHASE_FREQ[phase] ?? 220;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + 0.13);
    },
    dispose(): void {
      void ctx?.close();
      ctx = null;
    },
  };
}
