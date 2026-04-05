import {
  STUB_DEFENSE_CARDS,
  STUB_EVIDENCE_BANK,
  STUB_PROSECUTION_CARDS,
} from "../game/counsel";
import { BOUNDED_JUDGE_RULINGS } from "../game/judgeRulings";
import type { MatchController } from "../game/matchController";

function formatMs(ms: number): string {
  return `${Math.ceil(ms / 1000)}s`;
}

function wireCounselButtons(
  root: HTMLElement,
  match: MatchController,
): void {
  const pro = root.querySelector<HTMLDivElement>("#pro-cards");
  const def = root.querySelector<HTMLDivElement>("#def-cards");
  const ev = root.querySelector<HTMLDivElement>("#evidence-bank");
  if (!pro || !def || !ev) return;

  for (const c of STUB_PROSECUTION_CARDS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "counsel-card-btn counsel-card-btn--pro";
    btn.textContent = c.label;
    btn.addEventListener("click", () => match.playCard("prosecution", c.id));
    pro.appendChild(btn);
  }
  for (const c of STUB_DEFENSE_CARDS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "counsel-card-btn counsel-card-btn--def";
    btn.textContent = c.label;
    btn.addEventListener("click", () => match.playCard("defense", c.id));
    def.appendChild(btn);
  }
  for (const item of STUB_EVIDENCE_BANK) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "evidence-btn";
    btn.textContent = item.label;
    btn.addEventListener("click", () => match.revealEvidence(item.id));
    ev.appendChild(btn);
  }
}

function wireJudgeRulingButtons(
  root: HTMLElement,
  match: MatchController,
): void {
  const row = root.querySelector<HTMLDivElement>("#judge-rulings");
  if (!row) return;
  for (const r of BOUNDED_JUDGE_RULINGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "judge-ruling-btn";
    btn.textContent = r.label;
    btn.addEventListener("click", () => match.recordJudgeRuling(r.id));
    row.appendChild(btn);
  }
}

export function mountUiOverlay(
  container: HTMLElement,
  match: MatchController,
): () => void {
  container.innerHTML = `
    <div class="ui-shell">
      <p class="ui-title">Court of Public Opinion</p>
      <p class="ui-sub">Placeholder courtroom · <kbd>]</kbd> legal next · <kbd>[</kbd> / <kbd>\\</kbd> dev cycle</p>
      <div class="trial-panel" aria-live="polite">
        <p class="trial-case">Case: <span id="trial-case-id">stub_v_internet</span></p>
        <p class="trial-phase">Phase: <span id="trial-phase">—</span></p>
        <p class="trial-role">Active: <span id="trial-role">—</span></p>
        <p class="trial-timer">Timer: <span id="trial-timer">—</span></p>
        <p class="trial-hint">Witness: <span id="trial-witness">—</span></p>
        <p class="trial-log">Cards: <span id="played-summary">—</span></p>
        <p class="trial-log">Record: <span id="evidence-record">—</span></p>
        <p class="trial-log">Last ruling: <span id="last-ruling">—</span></p>
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

  wireCounselButtons(container, match);
  wireJudgeRulingButtons(container, match);

  const phaseEl = container.querySelector("#trial-phase");
  const roleEl = container.querySelector("#trial-role");
  const timerEl = container.querySelector("#trial-timer");
  const witnessEl = container.querySelector("#trial-witness");
  const playedEl = container.querySelector("#played-summary");
  const recordEl = container.querySelector("#evidence-record");
  const rulingEl = container.querySelector("#last-ruling");

  const render = (): void => {
    const s = match.getState();
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

    const objection = s.phase === "objection";
    for (const btn of container.querySelectorAll<HTMLButtonElement>(
      ".counsel-card-btn, .evidence-btn",
    )) {
      btn.disabled = objection;
    }
    for (const btn of container.querySelectorAll<HTMLButtonElement>(".judge-ruling-btn")) {
      btn.disabled = !objection;
    }
  };

  const unsub = match.subscribe(render);
  render();
  return unsub;
}
