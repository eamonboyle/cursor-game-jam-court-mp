import type { CameraPresetId } from "./camera/cinematicPresets";

/** Stub trial phases until gameplay loop checklist wires real enums. */
export type TrialPhaseStub =
  | "idle"
  | "opening"
  | "examination"
  | "cross"
  | "objection"
  | "closing"
  | "jury_deliberation"
  | "verdict";

export type CourtroomSpeakerRole =
  | "judge"
  | "prosecution"
  | "defense"
  | "witness"
  | "none";

/**
 * Maps high-level trial context → cinematic camera preset (Tech arch Phase 2 Step 10).
 */
export class CourtroomSceneState {
  phase: TrialPhaseStub = "idle";
  activeSpeaker: CourtroomSpeakerRole = "none";

  getSuggestedCameraPreset(): CameraPresetId {
    if (this.phase === "verdict" || this.phase === "jury_deliberation") return "jury";
    if (this.phase === "objection") return "wide";
    if (this.activeSpeaker === "witness") return "witness";
    if (this.activeSpeaker === "judge") return "judge";
    if (this.activeSpeaker === "prosecution") return "prosecution";
    if (this.activeSpeaker === "defense") return "defense";
    return "wide";
  }

  setPhase(phase: TrialPhaseStub): void {
    this.phase = phase;
  }

  setActiveSpeaker(role: CourtroomSpeakerRole): void {
    this.activeSpeaker = role;
  }
}
