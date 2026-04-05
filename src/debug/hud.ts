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
    const snap = match.getState().turnTimer;
    const timerLine =
      snap.totalMs > 0
        ? `timer: ${Math.ceil(snap.remainingMs / 1000)}s`
        : "timer: —";
    container.textContent = [
      `cam: ${cam}`,
      `trial: ${phase} · speaker: ${activeSpeaker}`,
      timerLine,
      `pos: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`,
      `keys: 1–6 preset · 0 auto · ] legal · [ \\ dev`,
    ].join("\n");
  };

  tick();
  const unsubMatch = match.subscribe(tick);
  const id = window.setInterval(tick, 300);
  return (): void => {
    unsubMatch();
    window.clearInterval(id);
  };
}
