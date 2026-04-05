/**
 * Local multiplayer room host — WebSocket authoritative server (Milestone H).
 *
 * Run: `npm run room-server` (requires deps: `ws`, `tsx`).
 */

import { randomUUID } from "node:crypto";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import { resolveHostCaseId } from "../data/caseRegistry";
import { MatchCore } from "../game/matchCore";
import type { ClientCommand } from "../net/roomProtocol";
import {
  assignRoleForSlot,
  type AssignedRole,
  type ClientToServerMessage,
  type RoomPlayerPublic,
  type ServerToClientMessage,
  validateCommand,
} from "../net/roomProtocol";

const PORT = Number(process.env.ROOM_PORT ?? "8787");

type PlayerConn = {
  ws: WebSocket;
  displayName: string;
  role: AssignedRole;
};

class Room {
  readonly id: string;
  readonly hostId: string;
  readonly core: MatchCore;
  readonly players = new Map<string, PlayerConn>();
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  constructor(id: string, hostId: string, caseId: string) {
    this.id = id;
    this.hostId = hostId;
    this.core = new MatchCore(caseId);
    this.core.beginOpeningPhase();
  }

  ensureTicker(broadcast: () => void): void {
    if (this.tickHandle) return;
    this.tickHandle = setInterval(() => {
      this.core.tick(Date.now());
      broadcast();
    }, 100);
  }

  dispose(): void {
    if (this.tickHandle) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }
}

function publicPlayers(room: Room): RoomPlayerPublic[] {
  const out: RoomPlayerPublic[] = [];
  for (const [id, p] of room.players) {
    out.push({ id, displayName: p.displayName, role: p.role });
  }
  return out;
}

function broadcastState(room: Room): void {
  const msg: ServerToClientMessage = {
    type: "state",
    state: room.core.getState(),
    players: publicPlayers(room),
  };
  const raw = JSON.stringify(msg);
  for (const { ws } of room.players.values()) {
    if (ws.readyState === 1) ws.send(raw);
  }
}

function applyCommand(room: Room, cmd: ClientCommand): void {
  const core = room.core;
  switch (cmd.kind) {
    case "playCard":
      core.playCard(cmd.side, cmd.cardId);
      break;
    case "revealEvidence":
      core.revealEvidence(cmd.evidenceId);
      break;
    case "recordJudgeRuling":
      core.recordJudgeRuling(cmd.rulingId);
      break;
    case "castJuryVote":
      core.castJuryVote(cmd.vote);
      break;
    case "advanceLegal":
      core.advanceLegal();
      break;
    case "devCycle":
      core.devCycle(cmd.delta);
      break;
    case "patchSeatFill":
      core.patchSeatFill(cmd.patch);
      break;
    case "setSeatFill":
      core.setSeatFill(cmd.seatFill);
      break;
  }
}

const rooms = new Map<string, Room>();

function findRoomByPlayerId(playerId: string): Room | null {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) return room;
  }
  return null;
}

function shortRoomId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`[room] WebSocket rooms on ws://127.0.0.1:${PORT}`);
});

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (raw: Buffer) => {
    let msg: ClientToServerMessage;
    try {
      msg = JSON.parse(String(raw)) as ClientToServerMessage;
    } catch {
      const err: ServerToClientMessage = { type: "error", message: "Invalid JSON" };
      ws.send(JSON.stringify(err));
      return;
    }

    if (msg.type === "host") {
      const roomId = shortRoomId();
      const playerId = randomUUID();
      const caseId = resolveHostCaseId(
        typeof msg.caseId === "string" ? msg.caseId : undefined,
      );
      const room = new Room(roomId, playerId, caseId);
      const role = assignRoleForSlot(0);
      room.players.set(playerId, { ws, displayName: msg.displayName, role });
      rooms.set(roomId, room);
      room.ensureTicker(() => {
        broadcastState(room);
      });
      const welcome: ServerToClientMessage = {
        type: "welcome",
        playerId,
        roomId,
        role,
        state: room.core.getState(),
        players: publicPlayers(room),
        hostId: room.hostId,
      };
      ws.send(JSON.stringify(welcome));
      return;
    }

    if (msg.type === "join") {
      const room = rooms.get(msg.roomId);
      if (!room) {
        const err: ServerToClientMessage = { type: "error", message: "Room not found" };
        ws.send(JSON.stringify(err));
        return;
      }
      const playerId = randomUUID();
      const slot = room.players.size;
      const role = assignRoleForSlot(slot);
      room.players.set(playerId, { ws, displayName: msg.displayName, role });
      room.ensureTicker(() => broadcastState(room));
      const welcome: ServerToClientMessage = {
        type: "welcome",
        playerId,
        roomId: room.id,
        role,
        state: room.core.getState(),
        players: publicPlayers(room),
        hostId: room.hostId,
      };
      ws.send(JSON.stringify(welcome));
      broadcastState(room);
      return;
    }

    if (msg.type === "command") {
      const room = findRoomByPlayerId(msg.playerId);
      if (!room) {
        const err: ServerToClientMessage = { type: "error", message: "No room for player" };
        ws.send(JSON.stringify(err));
        return;
      }
      const conn = room.players.get(msg.playerId);
      if (!conn || conn.ws !== ws) {
        const err: ServerToClientMessage = { type: "error", message: "Bad player socket" };
        ws.send(JSON.stringify(err));
        return;
      }
      if (!validateCommand(conn.role, msg.command, msg.playerId, room.hostId)) {
        const err: ServerToClientMessage = { type: "error", message: "Action not allowed for your role" };
        ws.send(JSON.stringify(err));
        return;
      }
      applyCommand(room, msg.command);
      broadcastState(room);
    }
  });

  ws.on("close", () => {
    for (const room of rooms.values()) {
      for (const [pid, p] of room.players) {
        if (p.ws === ws) {
          room.players.delete(pid);
          if (room.players.size === 0) {
            room.dispose();
            rooms.delete(room.id);
          } else {
            broadcastState(room);
          }
          return;
        }
      }
    }
  });
});
