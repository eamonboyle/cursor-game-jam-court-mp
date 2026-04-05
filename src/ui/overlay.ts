import type { MatchController } from "../game/matchController";

function formatMs(ms: number): string {
  return `${Math.ceil(ms / 1000)}s`;
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
      </div>
    </div>
  `;

  const phaseEl = container.querySelector("#trial-phase");
  const roleEl = container.querySelector("#trial-role");
  const timerEl = container.querySelector("#trial-timer");
  const witnessEl = container.querySelector("#trial-witness");

  const render = (): void => {
    const s = match.getState();
    if (phaseEl) phaseEl.textContent = s.phase;
    if (roleEl) roleEl.textContent = s.activeRole;
    if (witnessEl) witnessEl.textContent = s.currentWitnessId ?? "—";
    if (timerEl) {
      const { remainingMs, isPaused, totalMs } = s.turnTimer;
      timerEl.textContent =
        totalMs <= 0 ? "—" : `${formatMs(remainingMs)} / ${formatMs(totalMs)}${isPaused ? " (paused)" : ""}`;
    }
  };

  const unsub = match.subscribe(render);
  render();
  return unsub;
}
