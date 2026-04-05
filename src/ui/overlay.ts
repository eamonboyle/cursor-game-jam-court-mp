export function mountUiOverlay(container: HTMLElement): void {
  container.innerHTML = `
    <div class="ui-shell">
      <p class="ui-title">Court of Public Opinion</p>
      <p class="ui-sub">Placeholder courtroom · keys 1–6 cameras · 0 auto</p>
    </div>
  `;
}
