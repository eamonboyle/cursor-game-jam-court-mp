/**
 * Milestone G — which courtroom seats are driven by local AI vs human UI.
 * Server multiplayer will own this later; local flags mirror “empty seat filled by bot.”
 */
export type SeatActor = "human" | "ai";

export type SeatFillMap = {
  prosecution: SeatActor;
  defense: SeatActor;
  judge: SeatActor;
  jury: SeatActor;
};

export function createAllHumanSeatFill(): SeatFillMap {
  return {
    prosecution: "human",
    defense: "human",
    judge: "human",
    jury: "human",
  };
}

export function createJamSoloSeatFill(): SeatFillMap {
  /** Typical low-player jam default: you take counsel; rest AI. */
  return {
    prosecution: "human",
    defense: "human",
    judge: "ai",
    jury: "ai",
  };
}
