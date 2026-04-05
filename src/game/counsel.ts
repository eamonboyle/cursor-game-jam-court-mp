export type CounselSide = "prosecution" | "defense";

export type PlayedCardEntry = {
  side: CounselSide;
  cardId: string;
  atMs: number;
};

export type StubCard = { readonly id: string; readonly label: string };
export type StubEvidence = { readonly id: string; readonly label: string };

/** Authoring placeholders until `/data` cases load (Gameplay Phase 2). */
export const STUB_PROSECUTION_CARDS: readonly StubCard[] = [
  { id: "pro_press", label: "Press witness" },
  { id: "pro_impeach", label: "Impeach with prior" },
  { id: "pro_anchor", label: "Anchor timeline" },
];

export const STUB_DEFENSE_CARDS: readonly StubCard[] = [
  { id: "def_reframe", label: "Reframe context" },
  { id: "def_alibi", label: "Alibi poke" },
  { id: "def_doubt", label: "Reasonable doubt hook" },
];

export const STUB_EVIDENCE_BANK: readonly StubEvidence[] = [
  { id: "ev_screenshot", label: "Cropped screenshot" },
  { id: "ev_dm_log", label: "DM timestamps" },
  { id: "ev_receipt", label: "Sarcastic receipt" },
];
