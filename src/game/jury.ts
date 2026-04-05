import type { MatchState } from "./matchState";

/** Local stub: six-person jury poll (Milestone F). */
export const JUROR_COUNT = 6;

export type JuryVote = "guilty" | "not_guilty";

export type VerdictOutcome = "guilty" | "not_guilty" | "hung";

export type JuryVoteEntry = {
  jurorIndex: number;
  vote: JuryVote;
  atMs: number;
};

export function tryCastJuryVote(
  state: MatchState,
  vote: JuryVote,
  atMs: number,
):
  | { ok: true; state: MatchState }
  | { ok: false; reason: "not_deliberation" | "poll_complete" } {
  if (state.phase !== "jury_deliberation") {
    return { ok: false, reason: "not_deliberation" };
  }
  if (state.juryVotes.length >= JUROR_COUNT) {
    return { ok: false, reason: "poll_complete" };
  }
  const jurorIndex = state.juryVotes.length + 1;
  return {
    ok: true,
    state: {
      ...state,
      juryVotes: [...state.juryVotes, { jurorIndex, vote, atMs }],
    },
  };
}

export function summarizeJuryVotes(votes: readonly JuryVoteEntry[]): {
  guilty: number;
  notGuilty: number;
} {
  let guilty = 0;
  for (const v of votes) {
    if (v.vote === "guilty") guilty++;
  }
  return { guilty, notGuilty: votes.length - guilty };
}

export function resolveVerdictFromVotes(votes: readonly JuryVoteEntry[]): VerdictOutcome {
  if (votes.length < JUROR_COUNT) return "hung";
  const { guilty, notGuilty } = summarizeJuryVotes(votes);
  if (guilty > notGuilty) return "guilty";
  if (notGuilty > guilty) return "not_guilty";
  return "hung";
}

export function formatVerdictOutcome(o: VerdictOutcome): string {
  switch (o) {
    case "guilty":
      return "Guilty";
    case "not_guilty":
      return "Not guilty";
    case "hung":
      return "Hung jury";
  }
}
