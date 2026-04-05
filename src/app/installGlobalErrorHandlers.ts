function formatReason(reason: unknown): string {
  if (reason instanceof Error) return reason.stack ?? reason.message;
  return String(reason);
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

export function installGlobalErrorHandlers(): void {
  const el = (): HTMLElement | null => document.getElementById("global-error");

  const show = (msg: string): void => {
    const banner = el();
    if (!banner) return;
    banner.textContent = msg;
    banner.hidden = false;
  };

  window.addEventListener("error", (event) => {
    console.error("[app] error:", event.error ?? event.message);
    show(truncate(event.message || "Script error", 400));
  });

  window.addEventListener("unhandledrejection", (event) => {
    const r = formatReason(event.reason);
    console.error("[app] unhandledrejection:", r);
    show(truncate(r, 400));
  });
}
