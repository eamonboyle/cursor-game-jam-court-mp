export const TRIAL_PHASES = [
  "idle",
  "opening",
  "examination",
  "cross",
  "objection",
  "closing",
  "jury_deliberation",
  "verdict",
] as const;

export type TrialPhase = (typeof TRIAL_PHASES)[number];

export function trialPhaseIndex(phase: TrialPhase): number {
  return TRIAL_PHASES.indexOf(phase);
}
