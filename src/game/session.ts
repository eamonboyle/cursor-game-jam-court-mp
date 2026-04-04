export type GameSessionStub = {
  readonly id: string;
};

/**
 * Placeholder until match / trial state lands (gameplay loop checklist).
 */
export function createGameSessionStub(): GameSessionStub {
  return { id: "local-stub-session" };
}
