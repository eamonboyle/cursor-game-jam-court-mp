function formatReason(reason: unknown): string {
  if (reason instanceof Error) return reason.stack ?? reason.message;
  return String(reason);
}

export function installGlobalErrorHandlers(): void {
  window.addEventListener("error", (event) => {
    console.error("[app] error:", event.error ?? event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("[app] unhandledrejection:", formatReason(event.reason));
  });
}
