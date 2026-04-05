const STORAGE_KEY = "cop_mvp_welcome_seen";

/** Skip onboarding for QA, embeds, or return visits via sessionStorage. */
export function shouldSkipWelcomeScreen(): boolean {
  const p = new URLSearchParams(location.search);
  if (p.has("play") || p.has("skipWelcome")) return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * First-run modal: controls summary + enter (Milestone J).
 * Call `onBegin` after user confirms; typically starts `AppRoot` (unlocking audio).
 */
export function mountWelcomeGate(container: HTMLElement, onBegin: () => void): () => void {
  if (shouldSkipWelcomeScreen()) {
    onBegin();
    return (): void => {};
  }

  const layer = document.createElement("div");
  layer.className = "welcome-gate";
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "true");
  layer.setAttribute("aria-labelledby", "welcome-title");
  layer.innerHTML = `
    <div class="welcome-card">
      <h1 id="welcome-title" class="welcome-title">Court of Public Opinion</h1>
      <p class="welcome-lead">Browser MVP — structured trial phases, roles, and jury verdict. Retro courtroom, data-driven dockets.</p>
      <ul class="welcome-list">
        <li><kbd>]</kbd> — Legal next (host advances phase when allowed)</li>
        <li><kbd>[</kbd> / <kbd>\\</kbd> — Dev phase cycle (skip broken edges locally)</li>
        <li><kbd>1</kbd>–<kbd>6</kbd> — Camera presets on the 3D view (when not typing)</li>
        <li>Docket menu — pick a case; <strong>New local trial</strong> resets offline</li>
        <li>Multiplayer — run <code>npm run room-server</code>, then Host / Join</li>
      </ul>
      <p class="welcome-foot">Sound: short chime when the trial phase changes (after you press Enter below).</p>
      <button type="button" class="welcome-cta" id="welcome-enter">Enter courtroom</button>
    </div>
  `;

  container.appendChild(layer);

  const btn = layer.querySelector<HTMLButtonElement>("#welcome-enter");
  const close = (): void => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    layer.remove();
  };

  const onClick = (): void => {
    close();
    onBegin();
  };

  btn?.addEventListener("click", onClick);
  btn?.focus();

  return (): void => {
    btn?.removeEventListener("click", onClick);
    layer.remove();
  };
}
