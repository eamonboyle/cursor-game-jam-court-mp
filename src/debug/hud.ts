import type { StageHandles } from "../rendering/stage";

export function mountDebugHud(
  container: HTMLElement,
  stage: StageHandles,
): () => void {
  const tick = (): void => {
    const { x, y, z } = stage.camera.position;
    const cam = stage.getCameraLabel();
    const { phase, activeSpeaker } = stage.sceneState;
    container.textContent = [
      `cam: ${cam}`,
      `trial: ${phase} · speaker: ${activeSpeaker}`,
      `pos: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`,
      `keys: 1–6 preset · 0 auto`,
    ].join("\n");
  };

  tick();
  const id = window.setInterval(tick, 300);
  return () => window.clearInterval(id);
}
