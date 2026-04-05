import * as THREE from "three";

/** Seats matching [`docs/art_direction_and_assets.md`](../../../docs/art_direction_and_assets.md) layout. */
export type CourtroomRoleId =
  | "judge"
  | "prosecution"
  | "defense"
  | "witness"
  | "jury"
  | "defendant";

export type SeatAnchors = Record<CourtroomRoleId, THREE.Object3D>;

const ROLE_ORDER: CourtroomRoleId[] = [
  "judge",
  "prosecution",
  "defense",
  "witness",
  "jury",
  "defendant",
];

/**
 * Empty anchors parented into `courtroom` for props and character stacks.
 */
export function createSeatAnchors(courtroom: THREE.Group): SeatAnchors {
  const anchors = {} as SeatAnchors;

  const defs: Record<CourtroomRoleId, [number, number, number]> = {
    judge: [0, 0.85, -4.2],
    prosecution: [-4.2, 0, 1.2],
    defense: [4.2, 0, 1.2],
    witness: [0, 0, 2.8],
    jury: [5.5, 0.4, 3.2],
    defendant: [3.3, 0, 1.0],
  };

  for (const role of ROLE_ORDER) {
    const anchor = new THREE.Object3D();
    anchor.position.set(...defs[role]);
    anchor.name = `anchor_${role}`;
    courtroom.add(anchor);
    anchors[role] = anchor;
  }

  return anchors;
}
