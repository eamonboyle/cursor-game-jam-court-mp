import type { StageHandles } from "../rendering/stage";

export function mountDebugHud(
  container: HTMLElement,
  stage: StageHandles,
): () => void {
  const tick = (): void => {
    const { x, y, z } = stage.camera.position;
    container.textContent = `debug: camera (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`;
  };

  tick();
  const id = window.setInterval(tick, 300);
  return () => window.clearInterval(id);
}
