import { createAudioBusStub } from "../audio/audioBus";
import { resolveHostCaseId } from "../data/caseRegistry";
import { loadCaseCatalog } from "../data/loaders";
import { mountDebugHud } from "../debug/hud";
import { MatchController } from "../game/matchController";
import { RoomClient } from "../net/roomClient";
import { createStage } from "../rendering/stage";
import { mountUiOverlay } from "../ui/overlay";

const DEFAULT_ROOM_WS = import.meta.env.VITE_ROOM_WS ?? "ws://127.0.0.1:8787";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing required element #${id}`);
  return el as T;
}

export class AppRoot {
  private stageReturn: ReturnType<typeof createStage> | null = null;
  private match: MatchController | null = null;
  private readonly room = new RoomClient();
  private cleanupHud: (() => void) | null = null;
  private cleanupUi: (() => void) | null = null;

  start(): void {
    const canvas = requireElement<HTMLCanvasElement>("canvas");
    const uiRoot = requireElement<HTMLDivElement>("ui-root");
    const debugRoot = requireElement<HTMLDivElement>("debug-root");

    const params = new URLSearchParams(location.search);
    const prejoinRoomId = params.get("room");
    const wsUrl = DEFAULT_ROOM_WS;
    const initialCaseId = resolveHostCaseId(params.get("case") ?? undefined);

    this.stageReturn = createStage(canvas);
    this.match = new MatchController(
      this.stageReturn.sceneState,
      () => {
        this.stageReturn?.refreshCamera();
      },
      { initialCaseId },
    );

    this.room.onState = (state) => {
      this.match?.hydrateFromNetwork(state);
    };
    this.room.onWelcome = () => {
      this.match?.setNetworkClientMode(true, {
        advanceLegal: () => this.room.sendCommand({ kind: "advanceLegal" }),
        devCycle: (delta) => this.room.sendCommand({ kind: "devCycle", delta }),
      });
      const id = this.room.getRoomId();
      if (id) {
        const url = new URL(location.href);
        url.searchParams.set("room", id);
        history.replaceState(null, "", url.toString());
      }
    };
    this.room.onDisconnect = () => {
      this.match?.setNetworkClientMode(false, null);
    };
    this.room.onError = (m) => {
      console.warn("[room]", m);
    };

    this.cleanupUi = mountUiOverlay(uiRoot, this.match, this.room, {
      wsUrl,
      prejoinRoomId,
    });
    this.cleanupHud = mountDebugHud(debugRoot, this.stageReturn, this.match);

    void loadCaseCatalog();
    void createAudioBusStub();

    if (prejoinRoomId) {
      // Suppress local simulation until the server snapshot arrives (see tick + key handling).
      this.match.setNetworkClientMode(true, null);
    }

    this.match.start({ skipOpeningPhase: Boolean(prejoinRoomId) });

    if (prejoinRoomId) {
      this.room.joinRoom(prejoinRoomId, "Player", wsUrl);
    }
  }

  dispose(): void {
    this.cleanupHud?.();
    this.cleanupHud = null;
    this.cleanupUi?.();
    this.cleanupUi = null;
    this.room.disconnect();
    this.match?.dispose();
    this.match = null;
    this.stageReturn?.dispose();
    this.stageReturn = null;
  }
}
