import { DEFAULT_CASE_ID, getCasePack } from "../data/caseRegistry";

export type CounselSide = "prosecution" | "defense";

export type PlayedCardEntry = {
  side: CounselSide;
  cardId: string;
  atMs: number;
};

export type StubCard = { readonly id: string; readonly label: string };
export type StubEvidence = { readonly id: string; readonly label: string };

const defaultPack = (): ReturnType<typeof getCasePack> => getCasePack(DEFAULT_CASE_ID);

/** Legacy export: decks for the default bundled docket (tests + AI fallback ids). */
export const STUB_PROSECUTION_CARDS: readonly StubCard[] = defaultPack().prosecutionCards;
export const STUB_DEFENSE_CARDS: readonly StubCard[] = defaultPack().defenseCards;
export const STUB_EVIDENCE_BANK: readonly StubEvidence[] = defaultPack().evidence;
