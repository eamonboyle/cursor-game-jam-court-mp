import * as THREE from "three";
import { getCameraVectors, listCameraPresetIds, type CameraPresetId } from "./camera/cinematicPresets";
import { addRoleCapsules } from "./characters/roleCapsules";
import {
  buildCourtroomPlaceholderRoot,
  disposeCourtroomPlaceholder,
} from "./courtroom/buildCourtroomPlaceholder";
import { CourtroomSceneState } from "./courtroomSceneState";
import { createWebGLRenderer } from "./rendererBootstrap";
import { createSeatAnchors } from "./seats/roleAnchors";

const CAMERA_LERP = 0.11;

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
 * Placeholder courtroom, seat anchors, capsules, fixed camera presets, scene state stub.
 * Camera eases between presets when the trial phase / speaker changes (Milestone J).
 */
export function createStage(canvas: HTMLCanvasElement): StageHandles {
  const renderer = createWebGLRenderer(canvas);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);
  /// Wide fog range so fixed cameras (especially judge / sides) never wash the room to background.
  scene.fog = new THREE.Fog(0x1a1a24, 50, 130);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

  const hemi = new THREE.HemisphereLight(0xebf2ff, 0x5c4636, 0.82);
  const ambient = new THREE.AmbientLight(0xffffff, 0.78);
  const key = new THREE.DirectionalLight(0xfff4e0, 0.95);
  key.position.set(-8, 16, 6);
  const fill = new THREE.DirectionalLight(0xd0dcff, 0.55);
  fill.position.set(10, 10, 2);
  const rim = new THREE.DirectionalLight(0xffeedd, 0.35);
  rim.position.set(0, 6, -12);
  const well = new THREE.PointLight(0xffeedd, 0.85, 80, 1.8);
  well.position.set(0, 9, 1.5);
  scene.add(hemi, ambient, key, fill, rim, well);

  const courtroom = buildCourtroomPlaceholderRoot();
  const anchors = createSeatAnchors(courtroom);
  addRoleCapsules(anchors);

  scene.add(courtroom);

  const sceneState = new CourtroomSceneState();

  let manualPreset: CameraPresetId | null = null;
  const presetIds = listCameraPresetIds();
  const activePos = new THREE.Vector3();
  const activeTarget = new THREE.Vector3();

  const syncCameraTargets = (): void => {
    const preset = manualPreset ?? sceneState.getSuggestedCameraPreset();
    const { position, target } = getCameraVectors(preset);
    activePos.copy(position);
    activeTarget.copy(target);
  };

  const snapCameraToTargets = (): void => {
    camera.position.copy(activePos);
    camera.lookAt(activeTarget);
  };

  const camPosCur = new THREE.Vector3();
  const camLookCur = new THREE.Vector3();
  const camPosTo = new THREE.Vector3();
  const camLookTo = new THREE.Vector3();

  const refreshCamera = (): void => {
    syncCameraTargets();
    camPosTo.copy(activePos);
    camLookTo.copy(activeTarget);
    if (manualPreset !== null) {
      camPosCur.copy(camPosTo);
      camLookCur.copy(camLookTo);
      snapCameraToTargets();
    }
  };

  const getCameraLabel = (): string => {
    const preset = manualPreset ?? sceneState.getSuggestedCameraPreset();
    return manualPreset ? `manual:${preset}` : `auto:${preset}`;
  };

  syncCameraTargets();
  camPosCur.copy(activePos);
  camLookCur.copy(activeTarget);
  camPosTo.copy(activePos);
  camLookTo.copy(activeTarget);
  snapCameraToTargets();

  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      return;
    const n = Number(e.key);
    if (e.key === "0") {
      manualPreset = null;
      refreshCamera();
    } else if (Number.isInteger(n) && n >= 1 && n <= presetIds.length) {
      manualPreset = presetIds[n - 1] ?? "wide";
      syncCameraTargets();
      camPosTo.copy(activePos);
      camLookTo.copy(activeTarget);
      camPosCur.copy(camPosTo);
      camLookCur.copy(camLookTo);
      snapCameraToTargets();
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
    if (manualPreset === null) {
      camPosCur.lerp(camPosTo, CAMERA_LERP);
      camLookCur.lerp(camLookTo, CAMERA_LERP);
      camera.position.copy(camPosCur);
      camera.lookAt(camLookCur);
    }
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
