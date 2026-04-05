import * as THREE from "three";

function box(
  w: number,
  h: number,
  d: number,
  color: number,
  x: number,
  y: number,
  z: number,
  name: string,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}

/**
 * Low-poly labeled placeholders for MVP props per [`docs/art_direction_and_assets.md`](../../../docs/art_direction_and_assets.md) §7.
 */
export function buildCourtroomPlaceholderRoot(): THREE.Group {
  const root = new THREE.Group();
  root.name = "courtroom_placeholder";

  const floor = box(22, 0.2, 16, 0x2c241c, 0, -0.1, 0, "env_floor");
  root.add(floor);

  const backWall = box(22, 8, 0.4, 0x3a3530, 0, 4, -8, "env_back_wall");
  root.add(backWall);

  const leftWall = box(0.4, 8, 16, 0x33302c, -11, 4, 0, "env_wall_left");
  root.add(leftWall);

  const rightWall = box(0.4, 8, 16, 0x33302c, 11, 4, 0, "env_wall_right");
  root.add(rightWall);

  // Required props (scale = meters-ish)
  root.add(box(5, 0.35, 2.2, 0x4a3b2a, 0, 0.38, -5.4, "prop_judge_bench"));
  root.add(box(3.2, 0.35, 1.6, 0x4a3028, -5.2, 0.38, 0.9, "prop_prosecution_desk"));
  root.add(box(3.2, 0.35, 1.6, 0x4a3028, 5.2, 0.38, 0.9, "prop_defense_desk"));
  root.add(box(1.1, 1.2, 1.1, 0x5c5048, 0, 0.75, 3.1, "prop_witness_stand"));
  root.add(box(4, 0.9, 3, 0x3d4a36, 6.2, 0.55, 3.2, "prop_jury_box"));
  root.add(box(1.4, 0.35, 1.2, 0x453628, 3.1, 0.38, 0.85, "prop_defendant_seat"));
  root.add(box(2.2, 1.4, 0.15, 0x6a5a40, 0, 1.6, -7.6, "prop_verdict_signage"));

  return root;
}

export function disposeCourtroomPlaceholder(root: THREE.Group): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (!Array.isArray(mat)) mat?.dispose();
      else mat.forEach((m) => m.dispose());
    }
  });
}
