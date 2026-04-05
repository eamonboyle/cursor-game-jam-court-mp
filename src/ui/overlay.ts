import type { CounselSide } from "../game/counsel";
import { getCasePack, listCaseSummaries } from "../data/caseRegistry";
import type { CasePack } from "../data/caseTypes";
import type { JudgeRulingId } from "../game/judgeRulings";
import { BOUNDED_JUDGE_RULINGS } from "../game/judgeRulings";
import {
  formatVerdictOutcome,
  JUROR_COUNT,
  summarizeJuryVotes,
  type JuryVote,
} from "../game/jury";
import type { MatchController } from "../game/matchController";
import { createJamSoloSeatFill } from "../game/seatFill";
import type { SeatFillMap } from "../game/seatFill";
import type { RoomClient } from "../net/roomClient";

function formatMs(ms: number): string {
  return `${Math.ceil(ms / 1000)}s`;
}

/** UI-facing actions (local MatchController or room commands). */
export type UiMatchActions = {
  playCard(side: CounselSide, cardId: string): void;
  revealEvidence(evidenceId: string): void;
  castJuryVote(vote: JuryVote): void;
  recordJudgeRuling(rulingId: JudgeRulingId): void;
  patchSeatFill(patch: Partial<SeatFillMap>): void;
  setSeatFill(seatFill: SeatFillMap): void;
};

function createUiMatchActions(match: MatchController, room: RoomClient): UiMatchActions {
  const useNet = (): boolean => room.isConnected();
  return {
    playCard(side, cardId) {
      if (useNet()) room.sendCommand({ kind: "playCard", side, cardId });
      else match.playCard(side, cardId);
    },
    revealEvidence(evidenceId) {
      if (useNet()) room.sendCommand({ kind: "revealEvidence", evidenceId });
      else match.revealEvidence(evidenceId);
    },
    castJuryVote(vote) {
      if (useNet()) room.sendCommand({ kind: "castJuryVote", vote });
      else match.castJuryVote(vote);
    },
    recordJudgeRuling(rulingId) {
      if (useNet()) room.sendCommand({ kind: "recordJudgeRuling", rulingId });
      else match.recordJudgeRuling(rulingId);
    },
    patchSeatFill(patch) {
      if (useNet()) room.sendCommand({ kind: "patchSeatFill", patch });
      else match.patchSeatFill(patch);
    },
    setSeatFill(seatFill) {
      if (useNet()) room.sendCommand({ kind: "setSeatFill", seatFill });
      else match.setSeatFill(seatFill);
    },
  };
}

function rebuildCounselPanel(root: HTMLElement, pack: CasePack, actions: UiMatchActions): void {
  const pro = root.querySelector<HTMLDivElement>("#pro-cards");
  const def = root.querySelector<HTMLDivElement>("#def-cards");
  const ev = root.querySelector<HTMLDivElement>("#evidence-bank");
  if (!pro || !def || !ev) return;
  pro.replaceChildren();
  def.replaceChildren();
  ev.replaceChildren();

  for (const c of pack.prosecutionCards) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "counsel-card-btn counsel-card-btn--pro";
    btn.textContent = c.label;
    btn.addEventListener("click", () => actions.playCard("prosecution", c.id));
    pro.appendChild(btn);
  }
  for (const c of pack.defenseCards) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "counsel-card-btn counsel-card-btn--def";
    btn.textContent = c.label;
    btn.addEventListener("click", () => actions.playCard("defense", c.id));
    def.appendChild(btn);
  }
  for (const item of pack.evidence) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "evidence-btn";
    btn.textContent = item.label;
    btn.addEventListener("click", () => actions.revealEvidence(item.id));
    ev.appendChild(btn);
  }
}

function wireAiSeatPanel(root: HTMLElement, actions: UiMatchActions): void {
  const pro = root.querySelector<HTMLInputElement>("#ai-seat-pro");
  const def = root.querySelector<HTMLInputElement>("#ai-seat-def");
  const judge = root.querySelector<HTMLInputElement>("#ai-seat-judge");
  const jury = root.querySelector<HTMLInputElement>("#ai-seat-jury");
  const preset = root.querySelector<HTMLButtonElement>("#ai-preset-jam-solo");
  pro?.addEventListener("change", () => {
    actions.patchSeatFill({ prosecution: pro.checked ? "ai" : "human" });
  });
  def?.addEventListener("change", () => {
    actions.patchSeatFill({ defense: def.checked ? "ai" : "human" });
  });
  judge?.addEventListener("change", () => {
    actions.patchSeatFill({ judge: judge.checked ? "ai" : "human" });
  });
  jury?.addEventListener("change", () => {
    actions.patchSeatFill({ jury: jury.checked ? "ai" : "human" });
  });
  preset?.addEventListener("click", () => actions.setSeatFill(createJamSoloSeatFill()));
}

function wireJuryVoteButtons(root: HTMLElement, actions: UiMatchActions): void {
  const guilty = root.querySelector<HTMLButtonElement>("#jury-vote-guilty");
  const notGuilty = root.querySelector<HTMLButtonElement>("#jury-vote-not-guilty");
  guilty?.addEventListener("click", () => actions.castJuryVote("guilty"));
  notGuilty?.addEventListener("click", () => actions.castJuryVote("not_guilty"));
}

function wireJudgeRulingButtons(root: HTMLElement, actions: UiMatchActions): void {
  const row = root.querySelector<HTMLDivElement>("#judge-rulings");
  if (!row) return;
  for (const r of BOUNDED_JUDGE_RULINGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "judge-ruling-btn";
    btn.textContent = r.label;
    btn.addEventListener("click", () => actions.recordJudgeRuling(r.id));
    row.appendChild(btn);
  }
}

function wireRoomLobby(
  root: HTMLElement,
  room: RoomClient,
  wsUrl: string,
  prefillRoomId: string | null,
  getSelectedCaseId: () => string,
): void {
  const nameIn = root.querySelector<HTMLInputElement>("#room-display-name");
  const hostBtn = root.querySelector<HTMLButtonElement>("#room-host");
  const joinBtn = root.querySelector<HTMLButtonElement>("#room-join");
  const codeIn = root.querySelector<HTMLInputElement>("#room-code-input");
  if (prefillRoomId && codeIn) codeIn.value = prefillRoomId;

  hostBtn?.addEventListener("click", () => {
    const n = nameIn?.value?.trim() || "Player";
    room.hostRoom(n, wsUrl, getSelectedCaseId());
  });
  joinBtn?.addEventListener("click", () => {
    const id = codeIn?.value?.trim();
    if (!id) return;
    const n = nameIn?.value?.trim() || "Player";
    room.joinRoom(id, n, wsUrl);
  });
}

export type MountUiOptions = {
  wsUrl: string;
  /** If set, room code field is prefilled and you may auto-join from AppRoot. */
  prejoinRoomId: string | null;
};

export function mountUiOverlay(
  container: HTMLElement,
  match: MatchController,
  room: RoomClient,
  options: MountUiOptions,
): () => void {
  const { wsUrl, prejoinRoomId } = options;

  container.innerHTML = `
    <div class="ui-shell">
      <p class="ui-title">Court of Public Opinion</p>
      <p class="ui-sub">Placeholder courtroom · <kbd>]</kbd> legal next · <kbd>[</kbd> / <kbd>\\</kbd> dev cycle · room server · <strong>Milestone I</strong> data dossiers</p>
      <div class="case-panel" aria-label="Case selection">
        <h3 class="counsel-heading">Docket</h3>
        <p class="case-tagline" id="case-tagline-display">—</p>
        <div class="case-row">
          <label class="case-select-label">Trial
            <select id="case-select" class="case-select"></select>
          </label>
          <button type="button" id="case-new-local" class="room-btn">New local trial</button>
        </div>
        <p class="room-hint">Offline: pick a dossier, then <strong>New local trial</strong>. Online: Host opens the selected docket; clients sync from the server.</p>
      </div>
      <div class="room-panel" aria-label="Multiplayer room">
        <h3 class="counsel-heading">Room</h3>
        <p class="room-status" id="room-status">Offline (local trial)</p>
        <div class="room-row">
          <input type="text" id="room-display-name" class="room-input" placeholder="Display name" value="Player" maxlength="32" />
        </div>
        <div class="room-row room-row--actions">
          <button type="button" id="room-host" class="room-btn">Host</button>
          <input type="text" id="room-code-input" class="room-input room-input--code" placeholder="Room code" maxlength="16" />
          <button type="button" id="room-join" class="room-btn">Join</button>
        </div>
        <p class="room-hint">Terminal: <kbd>npm run room-server</kbd> · default <code id="room-ws-hint"></code></p>
      </div>
      <div class="trial-panel" aria-live="polite">
        <p class="trial-case">Case: <span id="trial-case-title">—</span> <span class="trial-case-id mono" id="trial-case-id">—</span></p>
        <p class="trial-phase">Phase: <span id="trial-phase">—</span></p>
        <p class="trial-role">Active: <span id="trial-role">—</span></p>
        <p class="trial-timer">Timer: <span id="trial-timer">—</span></p>
        <p class="trial-hint">Witness: <span id="trial-witness">—</span></p>
        <p class="trial-log">Cards: <span id="played-summary">—</span></p>
        <p class="trial-log">Record: <span id="evidence-record">—</span></p>
        <p class="trial-log">Last ruling: <span id="last-ruling">—</span></p>
        <p class="trial-log">Jury poll: <span id="jury-poll-summary">—</span></p>
        <p class="trial-log">Verdict: <span id="verdict-outcome">—</span></p>
        <p class="trial-log">AI seats: <span id="seat-fill-summary">—</span></p>
      </div>
      <div class="ai-seat-panel" aria-label="AI seat fill">
        <h3 class="counsel-heading">AI seats</h3>
        <p class="ai-seat-hint">Checked roles are driven by deterministic local bots. Preset = jam solo (AI judge + jury). In a room, only the <strong>host</strong> can change these.</p>
        <div class="ai-seat-grid">
          <label class="ai-seat-label"><input type="checkbox" id="ai-seat-pro" /> Prosecution</label>
          <label class="ai-seat-label"><input type="checkbox" id="ai-seat-def" /> Defense</label>
          <label class="ai-seat-label"><input type="checkbox" id="ai-seat-judge" /> Judge</label>
          <label class="ai-seat-label"><input type="checkbox" id="ai-seat-jury" /> Jury</label>
        </div>
        <button type="button" id="ai-preset-jam-solo" class="ai-preset-btn">Preset: AI judge + jury</button>
      </div>
      <div class="jury-panel" aria-label="Jury deliberation votes">
        <h3 class="counsel-heading">Jury</h3>
        <p class="jury-panel-hint">Cast <strong>${JUROR_COUNT}</strong> votes (local stub panel), then <kbd>]</kbd> for <strong>verdict</strong></p>
        <div class="counsel-card-row">
          <button type="button" id="jury-vote-guilty" class="jury-vote-btn jury-vote-btn--guilty">Guilty</button>
          <button type="button" id="jury-vote-not-guilty" class="jury-vote-btn jury-vote-btn--innocent">Not guilty</button>
        </div>
      </div>
      <div class="judge-panel" aria-label="Judge rulings during objection">
        <h3 class="counsel-heading">Judge</h3>
        <p class="judge-panel-hint">Rulings available only during <strong>objection</strong></p>
        <div id="judge-rulings" class="counsel-card-row"></div>
      </div>
      <div class="counsel-panel">
        <div class="counsel-col">
          <h3 class="counsel-heading">Prosecution</h3>
          <div id="pro-cards" class="counsel-card-row"></div>
        </div>
        <div class="counsel-col">
          <h3 class="counsel-heading">Defense</h3>
          <div id="def-cards" class="counsel-card-row"></div>
        </div>
        <div class="counsel-col counsel-col--wide">
          <h3 class="counsel-heading">Evidence</h3>
          <div id="evidence-bank" class="counsel-card-row"></div>
        </div>
      </div>
    </div>
  `;

  const wsHint = container.querySelector("#room-ws-hint");
  if (wsHint) wsHint.textContent = wsUrl;

  const caseSelect = container.querySelector<HTMLSelectElement>("#case-select");
  if (caseSelect) {
    for (const c of listCaseSummaries()) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.title;
      caseSelect.appendChild(opt);
    }
    caseSelect.value = match.getState().caseId;
  }

  const getSelectedCaseId = (): string => caseSelect?.value ?? match.getState().caseId;

  const actions = createUiMatchActions(match, room);
  let lastRenderedCaseId: string | undefined;
  wireRoomLobby(container, room, wsUrl, prejoinRoomId, getSelectedCaseId);
  wireAiSeatPanel(container, actions);
  wireJuryVoteButtons(container, actions);
  wireJudgeRulingButtons(container, actions);

  container.querySelector<HTMLButtonElement>("#case-new-local")?.addEventListener("click", () => {
    if (room.isConnected()) return;
    match.restartLocalTrial(getSelectedCaseId());
  });

  const phaseEl = container.querySelector("#trial-phase");
  const roleEl = container.querySelector("#trial-role");
  const timerEl = container.querySelector("#trial-timer");
  const witnessEl = container.querySelector("#trial-witness");
  const playedEl = container.querySelector("#played-summary");
  const recordEl = container.querySelector("#evidence-record");
  const rulingEl = container.querySelector("#last-ruling");
  const pollEl = container.querySelector("#jury-poll-summary");
  const verdictEl = container.querySelector("#verdict-outcome");
  const seatFillEl = container.querySelector("#seat-fill-summary");
  const roomStatusEl = container.querySelector("#room-status");
  const aiPro = container.querySelector<HTMLInputElement>("#ai-seat-pro");
  const aiDef = container.querySelector<HTMLInputElement>("#ai-seat-def");
  const aiJudge = container.querySelector<HTMLInputElement>("#ai-seat-judge");
  const aiJury = container.querySelector<HTMLInputElement>("#ai-seat-jury");
  const caseTaglineEl = container.querySelector("#case-tagline-display");
  const trialCaseTitleEl = container.querySelector("#trial-case-title");
  const trialCaseIdEl = container.querySelector("#trial-case-id");
  const newLocalBtn = container.querySelector<HTMLButtonElement>("#case-new-local");

  const render = (): void => {
    const s = match.getState();
    const net = room.isConnected();
    const myRole = room.getRole();

    if (s.caseId !== lastRenderedCaseId) {
      lastRenderedCaseId = s.caseId;
      rebuildCounselPanel(container, getCasePack(s.caseId), actions);
      if (caseSelect) caseSelect.value = s.caseId;
    }

    const pack = getCasePack(s.caseId);
    if (caseTaglineEl) caseTaglineEl.textContent = pack.tagline || "—";
    if (trialCaseTitleEl) trialCaseTitleEl.textContent = pack.title;
    if (trialCaseIdEl) trialCaseIdEl.textContent = `(${s.caseId})`;

    if (roomStatusEl) {
      if (net && room.getRoomId()) {
        const host = room.isHost() ? " · Host" : "";
        roomStatusEl.textContent = `Room ${room.getRoomId()} · Seat: ${myRole ?? "—"}${host}`;
      } else {
        roomStatusEl.textContent = "Offline (local trial)";
      }
    }

    if (phaseEl) phaseEl.textContent = s.phase;
    if (roleEl) roleEl.textContent = s.activeRole;
    if (witnessEl) witnessEl.textContent = s.currentWitnessId ?? "—";
    if (timerEl) {
      const { remainingMs, isPaused, totalMs } = s.turnTimer;
      timerEl.textContent =
        totalMs <= 0
          ? "—"
          : `${formatMs(remainingMs)} / ${formatMs(totalMs)}${isPaused ? " (paused)" : ""}`;
    }
    if (playedEl) {
      playedEl.textContent =
        s.playedCards.length === 0
          ? "—"
          : s.playedCards.map((p) => `${p.side[0]}:${p.cardId}`).join(", ");
    }
    if (recordEl) {
      recordEl.textContent =
        s.evidenceStack.length === 0 ? "—" : s.evidenceStack.join(", ");
    }
    if (rulingEl) {
      const last = s.rulingHistory[s.rulingHistory.length - 1];
      rulingEl.textContent = last ? last.summary : "—";
    }
    if (pollEl) {
      if (s.phase === "jury_deliberation") {
        const { guilty, notGuilty } = summarizeJuryVotes(s.juryVotes);
        pollEl.textContent = `${s.juryVotes.length}/${JUROR_COUNT} · ${guilty} G / ${notGuilty} NG`;
      } else if (s.juryVotes.length > 0) {
        const { guilty, notGuilty } = summarizeJuryVotes(s.juryVotes);
        pollEl.textContent = `${guilty} G / ${notGuilty} NG (sealed)`;
      } else {
        pollEl.textContent = "—";
      }
    }
    if (verdictEl) {
      verdictEl.textContent = s.verdictOutcome ? formatVerdictOutcome(s.verdictOutcome) : "—";
    }
    if (seatFillEl) {
      const tags: string[] = [];
      if (s.seatFill.prosecution === "ai") tags.push("prosecution");
      if (s.seatFill.defense === "ai") tags.push("defense");
      if (s.seatFill.judge === "ai") tags.push("judge");
      if (s.seatFill.jury === "ai") tags.push("jury");
      seatFillEl.textContent = tags.length === 0 ? "all human" : tags.join(", ");
    }
    if (aiPro) aiPro.checked = s.seatFill.prosecution === "ai";
    if (aiDef) aiDef.checked = s.seatFill.defense === "ai";
    if (aiJudge) aiJudge.checked = s.seatFill.judge === "ai";
    if (aiJury) aiJury.checked = s.seatFill.jury === "ai";

    if (caseSelect) caseSelect.disabled = net;
    if (newLocalBtn) newLocalBtn.disabled = net;

    const objection = s.phase === "objection";
    const deliberation = s.phase === "jury_deliberation";
    const verdictPhase = s.phase === "verdict";
    const pollFull = s.juryVotes.length >= JUROR_COUNT;

    const canPro = !net || myRole === "prosecution";
    const canDef = !net || myRole === "defense";
    const canCounselEvidence = !net || myRole === "prosecution" || myRole === "defense";
    const canJudge = !net || myRole === "judge";
    const canJury = !net || myRole === "jury";
    const hostAi = !net || room.isHost();

    for (const btn of container.querySelectorAll<HTMLButtonElement>(".counsel-card-btn--pro")) {
      btn.disabled =
        objection || deliberation || verdictPhase || s.seatFill.prosecution === "ai" || !canPro;
    }
    for (const btn of container.querySelectorAll<HTMLButtonElement>(".counsel-card-btn--def")) {
      btn.disabled =
        objection || deliberation || verdictPhase || s.seatFill.defense === "ai" || !canDef;
    }
    for (const btn of container.querySelectorAll<HTMLButtonElement>(".evidence-btn")) {
      btn.disabled = objection || deliberation || verdictPhase || !canCounselEvidence;
    }
    for (const btn of container.querySelectorAll<HTMLButtonElement>(".judge-ruling-btn")) {
      btn.disabled = !objection || s.seatFill.judge === "ai" || !canJudge;
    }
    for (const sel of ["#jury-vote-guilty", "#jury-vote-not-guilty"] as const) {
      const btn = container.querySelector<HTMLButtonElement>(sel);
      if (btn) btn.disabled = !deliberation || pollFull || s.seatFill.jury === "ai" || !canJury;
    }

    if (aiPro) aiPro.disabled = !hostAi;
    if (aiDef) aiDef.disabled = !hostAi;
    if (aiJudge) aiJudge.disabled = !hostAi;
    if (aiJury) aiJury.disabled = !hostAi;
    const presetBtn = container.querySelector<HTMLButtonElement>("#ai-preset-jam-solo");
    if (presetBtn) presetBtn.disabled = !hostAi;
  };

  const unsub = match.subscribe(render);
  render();
  return unsub;
}
