import { createAudioBusStub } from "../audio/audioBus";
import { dataLoadersPlaceholder } from "../data/loaders";
import { mountDebugHud } from "../debug/hud";
import { createGameSessionStub } from "../game/session";
import { createStage } from "../rendering/stage";
import { mountUiOverlay } from "../ui/overlay";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing required element #${id}`);
  return el as T;
}

export class AppRoot {
  private stageReturn: ReturnType<typeof createStage> | null = null;
  private cleanupHud: (() => void) | null = null;

  start(): void {
    const canvas = requireElement<HTMLCanvasElement>("canvas");
    const uiRoot = requireElement<HTMLDivElement>("ui-root");
    const debugRoot = requireElement<HTMLDivElement>("debug-root");

    this.stageReturn = createStage(canvas);
    mountUiOverlay(uiRoot);
    this.cleanupHud = mountDebugHud(debugRoot, this.stageReturn);

    createGameSessionStub();
    void dataLoadersPlaceholder();
    void createAudioBusStub();
  }

  dispose(): void {
    this.cleanupHud?.();
    this.cleanupHud = null;
    this.stageReturn?.dispose();
    this.stageReturn = null;
  }
}
