import * as THREE from "three";

export type CameraPresetId =
  | "wide"
  | "judge"
  | "witness"
  | "jury"
  | "prosecution"
  | "defense";

/** All positions are *inside* the room (roughly z ∈ [-7.5, 7], x ∈ [-10, 10]) so we never stare through the back wall. */
const PRESETS: Record<
  CameraPresetId,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  wide: { position: [0, 7, 11], target: [0, 1.1, 0] },
  /** In front of the judge bench (bench ~ z -5.4); look toward witness / well. */
  judge: { position: [0, 3.8, -5.0], target: [0, 1.3, 2.5] },
  witness: { position: [2.2, 2.9, 4.2], target: [0, 1.35, 2.9] },
  jury: { position: [4.2, 3.2, 4.8], target: [0, 1.2, 1.5] },
  prosecution: { position: [-5.5, 3.0, 3.2], target: [-1.5, 1.15, 1.8] },
  defense: { position: [5.5, 3.0, 3.2], target: [1.5, 1.15, 1.8] },
};

export function getCameraVectors(preset: CameraPresetId): {
  position: THREE.Vector3;
  target: THREE.Vector3;
} {
  const p = PRESETS[preset];
  return {
    position: new THREE.Vector3(...p.position),
    target: new THREE.Vector3(...p.target),
  };
}

export function applyCameraPreset(
  camera: THREE.PerspectiveCamera,
  preset: CameraPresetId,
): void {
  const { position, target } = getCameraVectors(preset);
  camera.position.copy(position);
  camera.lookAt(target);
}

export function listCameraPresetIds(): CameraPresetId[] {
  return Object.keys(PRESETS) as CameraPresetId[];
}
