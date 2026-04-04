export function mountUiOverlay(container: HTMLElement): void {
  container.innerHTML = `
    <div class="ui-shell">
      <p class="ui-title">Court of Public Opinion</p>
      <p class="ui-sub">Bootstrap — UI overlay root</p>
    </div>
  `;
}
