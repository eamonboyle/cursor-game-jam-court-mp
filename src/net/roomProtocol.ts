import type { CounselSide } from "../game/counsel";
import type { JudgeRulingId } from "../game/judgeRulings";
import type { JuryVote } from "../game/jury";
import type { MatchState } from "../game/matchState";
import type { SeatFillMap } from "../game/seatFill";

export type AssignedRole = "prosecution" | "defense" | "judge" | "jury" | "spectator";

export type RoomPlayerPublic = {
  id: string;
  displayName: string;
  role: AssignedRole;
};

export type ClientCommand =
  | { kind: "playCard"; side: CounselSide; cardId: string }
  | { kind: "revealEvidence"; evidenceId: string }
  | { kind: "recordJudgeRuling"; rulingId: JudgeRulingId }
  | { kind: "castJuryVote"; vote: JuryVote }
  | { kind: "advanceLegal" }
  | { kind: "devCycle"; delta: 1 | -1 }
  | { kind: "patchSeatFill"; patch: Partial<SeatFillMap> }
  | { kind: "setSeatFill"; seatFill: SeatFillMap };

export type ClientToServerMessage =
  | { type: "host"; displayName: string; caseId?: string }
  | { type: "join"; roomId: string; displayName: string }
  | { type: "command"; playerId: string; command: ClientCommand };

export type ServerToClientMessage =
  | {
      type: "welcome";
      playerId: string;
      roomId: string;
      role: AssignedRole;
      state: MatchState;
      players: RoomPlayerPublic[];
      hostId: string;
    }
  | { type: "state"; state: MatchState; players: RoomPlayerPublic[] }
  | { type: "error"; message: string };

const ROLE_ORDER: AssignedRole[] = ["prosecution", "defense", "judge", "jury"];

export function assignRoleForSlot(slotIndex: number): AssignedRole {
  return ROLE_ORDER[slotIndex] ?? "spectator";
}

export function validateCommand(
  role: AssignedRole,
  cmd: ClientCommand,
  playerId: string,
  hostId: string,
): boolean {
  if (cmd.kind === "patchSeatFill" || cmd.kind === "setSeatFill") {
    return playerId === hostId;
  }
  if (cmd.kind === "advanceLegal" || cmd.kind === "devCycle") {
    return playerId === hostId;
  }
  if (role === "spectator") return false;
  if (cmd.kind === "playCard") {
    if (cmd.side === "prosecution") return role === "prosecution";
    return role === "defense";
  }
  if (cmd.kind === "revealEvidence") {
    return role === "prosecution" || role === "defense";
  }
  if (cmd.kind === "recordJudgeRuling") {
    return role === "judge";
  }
  if (cmd.kind === "castJuryVote") {
    return role === "jury";
  }
  return false;
}
