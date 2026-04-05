import { formatVerdictOutcome, JUROR_COUNT } from "../game/jury";
import type { MatchController } from "../game/matchController";
import type { StageHandles } from "../rendering/stage";

export function mountDebugHud(
  container: HTMLElement,
  stage: StageHandles,
  match: MatchController,
): () => void {
  const tick = (): void => {
    const { x, y, z } = stage.camera.position;
    const cam = stage.getCameraLabel();
    const { phase, activeSpeaker } = stage.sceneState;
    const ms = match.getState();
    const snap = ms.turnTimer;
    const timerLine =
      snap.totalMs > 0
        ? `timer: ${Math.ceil(snap.remainingMs / 1000)}s`
        : "timer: —";
    const juryLine =
      phase === "jury_deliberation"
        ? `jury poll: ${ms.juryVotes.length}/${JUROR_COUNT}`
        : ms.verdictOutcome
          ? `verdict: ${formatVerdictOutcome(ms.verdictOutcome)}`
          : "";
    const lines = [
      `cam: ${cam}`,
      `trial: ${phase} · speaker: ${activeSpeaker}`,
      timerLine,
      juryLine,
      `pos: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`,
      `keys: 1–6 preset · 0 auto · ] legal · [ \\ dev`,
    ].filter(Boolean);
    container.textContent = lines.join("\n");
  };

  tick();
  const unsubMatch = match.subscribe(tick);
  const id = window.setInterval(tick, 300);
  return (): void => {
    unsubMatch();
    window.clearInterval(id);
  };
}
