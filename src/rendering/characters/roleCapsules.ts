import * as THREE from "three";
import type { CourtroomRoleId, SeatAnchors } from "../seats/roleAnchors";

const ROLE_COLORS: Record<CourtroomRoleId, number> = {
  judge: 0x2a4d6e,
  prosecution: 0x8b3a3a,
  defense: 0x3a5f8b,
  witness: 0x6b5a4a,
  jury: 0x4a6b4a,
  defendant: 0x5a4a6b,
};

function makeCapsule(color: number): THREE.Mesh {
  const geo = new THREE.CapsuleGeometry(0.35, 1.1, 4, 8);
  const mat = new THREE.MeshLambertMaterial({
    color,
    emissive: new THREE.Color(color).multiplyScalar(0.08),
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "role_capsule";
  return mesh;
}

export function addRoleCapsules(anchors: SeatAnchors): void {
  (Object.keys(ROLE_COLORS) as CourtroomRoleId[]).forEach((role) => {
    const cap = makeCapsule(ROLE_COLORS[role]);
    cap.position.y = 0.95;
    cap.name = `placeholder_${role}`;
    anchors[role].add(cap);
  });
}
