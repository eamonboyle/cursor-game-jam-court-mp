import type { ActiveRole } from "../game/roles";
import type { TrialPhase } from "../game/trialPhase";
import type { CameraPresetId } from "./camera/cinematicPresets";

/**
 * Maps high-level trial context → cinematic camera preset (Tech arch Phase 2 Step 10).
 */
export class CourtroomSceneState {
  phase: TrialPhase = "idle";
  activeSpeaker: ActiveRole = "none";

  getSuggestedCameraPreset(): CameraPresetId {
    if (this.phase === "verdict" || this.phase === "jury_deliberation") return "jury";
    if (this.activeSpeaker === "witness") return "witness";
    if (this.activeSpeaker === "judge") return "judge";
    if (this.activeSpeaker === "prosecution") return "prosecution";
    if (this.activeSpeaker === "defense") return "defense";
    if (this.activeSpeaker === "jury") return "jury";
    return "wide";
  }

  setPhase(phase: TrialPhase): void {
    this.phase = phase;
  }

  setActiveSpeaker(role: ActiveRole): void {
    this.activeSpeaker = role;
  }
}
