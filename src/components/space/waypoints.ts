import { Vector3 } from 'three';

export type PanelSide = 'left' | 'right';

export interface Waypoint {
  /** Camera world position. */
  pos: Vector3;
  /** Where the camera looks (typically the moon, possibly offset). */
  lookAt: Vector3;
  /** Which side of the screen the section panel hints at. */
  panelSide?: PanelSide | null;
  /** Roll the camera (radians) for cinematic banking. */
  roll?: number;
  /** Display label for HUD telemetry. */
  label: string;
}

/** Geometry constants. The moon stays at the origin and the camera flies a
 *  slow, wide orbit around it — Apollo / Artemis style flyby distance, not a
 *  close-up. */
export const MOON_POSITION = new Vector3(0, 0, 0);
export const MOON_RADIUS = 3.0;

export const EARTH_POSITION = new Vector3(-32, 6, 26);
export const EARTH_RADIUS = 1.7;

// Pushed far back so the sun reads as a distant bright star, not a giant
// halo competing with the moon for visual weight.
export const SUN_POSITION = new Vector3(-130, 32, -55);
export const SUN_RADIUS = 9;

/**
 * Helper: build a waypoint position that sits on a circle around the moon,
 * angle in degrees from +X (counter-clockwise), at the given radius and y.
 */
function orbitPos(angleDeg: number, radius: number, y: number): Vector3 {
  const a = (angleDeg * Math.PI) / 180;
  return new Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius);
}

/**
 * The 5 waypoints are distributed around the moon so the Catmull-Rom curve
 * connecting them traces a continuous orbital arc — no more "dart left/right"
 * movement, just one smooth flight path.
 *
 *   index 0 — Landing: far hero shot, framing Earth in the distance
 *   index 1 — About Me: near-side approach
 *   index 2 — Experience: rounding the eastern limb (sun rising)
 *   index 3 — Projects: deep over the far side (twilight)
 *   index 4 — Contact: south polar arc, Earth swings back into view
 */
const RAW_PATH: Array<{
  pos: Vector3;
  side: PanelSide | null;
  roll?: number;
  label: string;
}> = [
  {
    pos: orbitPos(28, 22, 5),
    side: null,
    roll: 0,
    label: 'Translunar coast',
  },
  {
    pos: orbitPos(58, 14, 2.4),
    side: 'left',
    roll: -0.025,
    label: 'Near side · approach',
  },
  {
    pos: orbitPos(132, 14, 1.4),
    side: 'right',
    roll: 0.04,
    label: 'Eastern limb · sun rising',
  },
  {
    pos: orbitPos(210, 14, -1.8),
    side: 'left',
    roll: 0.05,
    label: 'Far side · twilight',
  },
  {
    pos: orbitPos(300, 15, 1.8),
    side: 'right',
    roll: -0.03,
    label: 'Trans-Earth coast',
  },
];

export const WAYPOINTS: Waypoint[] = RAW_PATH.map((wp) => ({
  pos: wp.pos,
  lookAt: MOON_POSITION.clone(),
  panelSide: wp.side,
  roll: wp.roll,
  label: wp.label,
}));

/**
 * Progress (0..1) along the orbital curve where each anchor sits. With 5
 * waypoints, anchors land on 1/(N-1) intervals of the Catmull-Rom curve.
 *
 *   index 0 — landing (translunar coast)
 *   index 1 — About Me
 *   index 2 — Experience
 *   index 3 — Projects
 *   index 4 — Contact
 */
export const ANCHORS = [0, 0.25, 0.5, 0.75, 1.0];
export const SECTION_ANCHORS = ANCHORS.slice(1);

/** Direction from moon to sun — used by the moon shader for shading. */
export function sunDirection() {
  return SUN_POSITION.clone().normalize();
}
