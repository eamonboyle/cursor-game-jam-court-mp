import * as THREE from "three";

export type StageHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  dispose: () => void;
};

/**
 * Minimal Three.js stage: neutral background, one lit mesh, resize-safe render loop.
 */
export function createStage(canvas: HTMLCanvasElement): StageHandles {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a24);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(2.2, 1.6, 3.2);
  camera.lookAt(0, 0, 0);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x8899aa });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  const directional = new THREE.DirectionalLight(0xffffff, 1.1);
  directional.position.set(3, 5, 2);
  scene.add(ambient, directional);

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
    const dt = clock.getDelta();
    mesh.rotation.y += dt * 0.35;
    renderer.render(scene, camera);
  };

  tick();

  return {
    renderer,
    scene,
    camera,
    dispose: (): void => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
