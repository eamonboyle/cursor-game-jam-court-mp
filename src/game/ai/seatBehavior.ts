import type { CounselSide } from "../counsel";
import { BOUNDED_JUDGE_RULINGS, type JudgeRulingId } from "../judgeRulings";
import { JUROR_COUNT, type JuryVote } from "../jury";
import type { MatchState } from "../matchState";

/** Deterministic “personality” without RNG so tests and replays stay stable. */
export function pickAiJuryVote(sentiment: number, jurorIndex: number): JuryVote {
  const i = Math.max(1, Math.min(JUROR_COUNT, jurorIndex));
  const bias = sentiment > 0 ? 1 : sentiment < 0 ? -1 : 0;
  const wave = Math.sin(i * 1.7 + bias * 0.9);
  const threshold = 0.15 * bias;
  return wave + threshold >= 0 ? "guilty" : "not_guilty";
}

export function pickAiJudgeRuling(state: MatchState): JudgeRulingId {
  const n = BOUNDED_JUDGE_RULINGS.length;
  const phaseLen = state.phase.length;
  const idx =
    (phaseLen + state.playedCards.length + state.evidenceStack.length) % n;
  const def = BOUNDED_JUDGE_RULINGS[idx];
  return def?.id ?? "overrule";
}

export function pickAiCounselCardId(
  side: CounselSide,
  salt: number,
  prosecutionDeck: readonly { id: string }[],
  defenseDeck: readonly { id: string }[],
): string {
  const deck = side === "prosecution" ? prosecutionDeck : defenseDeck;
  const i = Math.abs(salt) % deck.length;
  return deck[i]?.id ?? deck[0]?.id ?? "pro_press";
}
