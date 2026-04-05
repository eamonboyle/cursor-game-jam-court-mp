import type { MatchState } from "../game/matchState";
import type {
  AssignedRole,
  ClientCommand,
  ClientToServerMessage,
  RoomPlayerPublic,
  ServerToClientMessage,
} from "./roomProtocol";

const WS_OPEN = 1;

/**
 * Browser WebSocket client for the local room server (Milestone H).
 */
export class RoomClient {
  private ws: WebSocket | null = null;
  private _playerId: string | null = null;
  private _roomId: string | null = null;
  private _role: AssignedRole | null = null;
  private _hostId: string | null = null;

  onState: ((state: MatchState, players: RoomPlayerPublic[]) => void) | null = null;
  onWelcome: (() => void) | null = null;
  onError: ((message: string) => void) | null = null;
  onDisconnect: (() => void) | null = null;

  isConnected(): boolean {
    return this.ws?.readyState === WS_OPEN;
  }

  getPlayerId(): string | null {
    return this._playerId;
  }

  getRoomId(): string | null {
    return this._roomId;
  }

  getRole(): AssignedRole | null {
    return this._role;
  }

  isHost(): boolean {
    return this._playerId !== null && this._playerId === this._hostId;
  }

  hostRoom(displayName: string, baseUrl: string, caseId?: string): void {
    this.disconnect();
    this.ws = new WebSocket(baseUrl);
    this.ws.onopen = (): void => {
      const msg: ClientToServerMessage = { type: "host", displayName, caseId };
      this.ws?.send(JSON.stringify(msg));
    };
    this.attachHandlers();
  }

  joinRoom(roomId: string, displayName: string, baseUrl: string): void {
    this.disconnect();
    this.ws = new WebSocket(baseUrl);
    this.ws.onopen = (): void => {
      const msg: ClientToServerMessage = { type: "join", roomId, displayName };
      this.ws?.send(JSON.stringify(msg));
    };
    this.attachHandlers();
  }

  sendCommand(command: ClientCommand): void {
    if (!this._playerId || !this.isConnected()) return;
    const out: ClientToServerMessage = {
      type: "command",
      playerId: this._playerId,
      command,
    };
    this.ws?.send(JSON.stringify(out));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.clearSession();
  }

  private clearSession(): void {
    this._playerId = null;
    this._roomId = null;
    this._role = null;
    this._hostId = null;
  }

  private attachHandlers(): void {
    const socket = this.ws;
    if (!socket) return;
    socket.onmessage = (ev: MessageEvent<string>): void => {
      const msg = JSON.parse(ev.data) as ServerToClientMessage;
      if (msg.type === "error") {
        this.onError?.(msg.message);
        return;
      }
      if (msg.type === "welcome") {
        this._playerId = msg.playerId;
        this._roomId = msg.roomId;
        this._role = msg.role;
        this._hostId = msg.hostId;
        // Enable network mode before hydrating so RAF does not tick local core first.
        this.onWelcome?.();
        this.onState?.(msg.state, msg.players);
        return;
      }
      if (msg.type === "state") {
        this.onState?.(msg.state, msg.players);
      }
    };
    socket.onerror = (): void => {
      this.onError?.("WebSocket error");
    };
    socket.onclose = (): void => {
      this.clearSession();
      this.ws = null;
      this.onDisconnect?.();
    };
  }
}
