import * as THREE from "three";
import {
  applyCameraPreset,
  listCameraPresetIds,
  type CameraPresetId,
} from "./camera/cinematicPresets";
import { addRoleCapsules } from "./characters/roleCapsules";
import {
  buildCourtroomPlaceholderRoot,
  disposeCourtroomPlaceholder,
} from "./courtroom/buildCourtroomPlaceholder";
import { CourtroomSceneState } from "./courtroomSceneState";
import { createWebGLRenderer } from "./rendererBootstrap";
import { createSeatAnchors } from "./seats/roleAnchors";

export type StageHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  sceneState: CourtroomSceneState;
  getCameraLabel: () => string;
  refreshCamera: () => void;
  dispose: () => void;
};

/**
 * Milestone B: placeholder courtroom, seat anchors, capsules, fixed camera presets, scene state stub.
 */
export function createStage(canvas: HTMLCanvasElement): StageHandles {
  const renderer = createWebGLRenderer(canvas);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);
  scene.fog = new THREE.Fog(0x1a1a24, 18, 55);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);

  const ambient = new THREE.AmbientLight(0xffffff, 0.52);
  const key = new THREE.DirectionalLight(0xfff2dd, 1.05);
  key.position.set(-6, 14, 8);
  const fill = new THREE.DirectionalLight(0xccd8ff, 0.35);
  fill.position.set(8, 8, -4);
  scene.add(ambient, key, fill);

  const courtroom = buildCourtroomPlaceholderRoot();
  const anchors = createSeatAnchors(courtroom);
  addRoleCapsules(anchors);

  scene.add(courtroom);

  const sceneState = new CourtroomSceneState();

  let manualPreset: CameraPresetId | null = null;
  const presetIds = listCameraPresetIds();

  const syncCamera = (): void => {
    const preset = manualPreset ?? sceneState.getSuggestedCameraPreset();
    applyCameraPreset(camera, preset);
  };

  const getCameraLabel = (): string => {
    const preset = manualPreset ?? sceneState.getSuggestedCameraPreset();
    return manualPreset ? `manual:${preset}` : `auto:${preset}`;
  };

  const refreshCamera = (): void => {
    syncCamera();
  };

  refreshCamera();

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      return;
    const n = Number(e.key);
    if (e.key === "0") {
      manualPreset = null;
      syncCamera();
    } else if (Number.isInteger(n) && n >= 1 && n <= presetIds.length) {
      manualPreset = presetIds[n - 1] ?? "wide";
      if (manualPreset) applyCameraPreset(camera, manualPreset);
    }
  };
  window.addEventListener("keydown", onKeyDown);

  const resize = (): void => {
    const width = canvas.clientWidth;
    const height = Math.max(canvas.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener("resize", resize);

  let rafId = 0;
  const clock = new THREE.Clock();

  const tick = (): void => {
    rafId = requestAnimationFrame(tick);
    void clock.getDelta();
    renderer.render(scene, camera);
  };

  tick();

  return {
    renderer,
    scene,
    camera,
    sceneState,
    getCameraLabel,
    refreshCamera,
    dispose: (): void => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      scene.remove(courtroom);
      disposeCourtroomPlaceholder(courtroom);
      renderer.dispose();
    },
  };
}
