export type AudioBusStub = {
  readonly ready: boolean;
};

/**
 * Future: Web Audio hooks for music and SFX.
 */
export function createAudioBusStub(): AudioBusStub {
  return { ready: false };
}
