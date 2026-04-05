export type TurnTimerSnapshot = {
  totalMs: number;
  remainingMs: number;
  isPaused: boolean;
};

export class TurnTimer {
  totalMs: number;
  remainingMs: number;
  isPaused: boolean;

  constructor(totalMs: number) {
    this.totalMs = totalMs;
    this.remainingMs = totalMs;
    this.isPaused = false;
  }

  snapshot(): TurnTimerSnapshot {
    return {
      totalMs: this.totalMs,
      remainingMs: this.remainingMs,
      isPaused: this.isPaused,
    };
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  reset(totalMs: number): void {
    this.totalMs = totalMs;
    this.remainingMs = totalMs;
  }

  /**
   * Advance timer. Returns whether timer just expired this tick.
   */
  tick(dtMs: number): boolean {
    if (this.isPaused) return false;
    const before = this.remainingMs;
    this.remainingMs = Math.max(0, this.remainingMs - dtMs);
    return before > 0 && this.remainingMs === 0;
  }
}
