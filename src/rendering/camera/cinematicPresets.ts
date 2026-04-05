import * as THREE from "three";

export type CameraPresetId =
  | "wide"
  | "judge"
  | "witness"
  | "jury"
  | "prosecution"
  | "defense";

const PRESETS: Record<
  CameraPresetId,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  wide: { position: [0, 6.5, 14], target: [0, 1.2, 0] },
  judge: { position: [0, 3.2, -8.5], target: [0, 1.4, 2] },
  witness: { position: [0, 2.4, 7.2], target: [0, 1.5, 0.5] },
  jury: { position: [7, 2.8, 4.5], target: [2, 1.5, 2] },
  prosecution: { position: [-7.5, 2.6, 5], target: [-2.5, 1.2, 1] },
  defense: { position: [7.5, 2.6, 5], target: [2.5, 1.2, 1] },
};

export function applyCameraPreset(
  camera: THREE.PerspectiveCamera,
  preset: CameraPresetId,
): void {
  const p = PRESETS[preset];
  camera.position.set(...p.position);
  camera.lookAt(new THREE.Vector3(...p.target));
}

export function listCameraPresetIds(): CameraPresetId[] {
  return Object.keys(PRESETS) as CameraPresetId[];
}
