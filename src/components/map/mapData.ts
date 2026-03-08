// ── Types ──────────────────────────────────────────────────────
export interface MapPoint {
  x: number;
  y: number;
}

export interface MapLocation extends MapPoint {
  id: string;
  label: string;
  emoji: string;
  category: 'checkpoint' | 'landmark';
  crowdLevel?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface MapZone {
  id: string;
  label: string;
  path: string;
  fill: string;
  fillDark: string;
  fillHighContrast: string;
  category: 'shops' | 'gates' | 'security' | 'quiet' | 'terminal' | 'entrance';
}

export interface RouteSegment {
  from: string; // location id
  to: string;
  points: MapPoint[];
  walkMinutes: number;
}

// ── Locations ──────────────────────────────────────────────────
export const LOCATIONS: MapLocation[] = [
  { id: 'entrance', x: 210, y: 590, label: 'Entrance', emoji: '🚪', category: 'checkpoint', crowdLevel: 'medium', description: 'Terminal 3 main entrance' },
  { id: 'checkin', x: 210, y: 460, label: 'Check-in', emoji: '🎫', category: 'checkpoint', crowdLevel: 'high', description: 'Check-in counter B' },
  { id: 'bathroom', x: 90, y: 400, label: 'WC', emoji: '🚻', category: 'checkpoint', crowdLevel: 'low', description: 'Near Gate A area' },
  { id: 'security', x: 210, y: 310, label: 'Security', emoji: '🛡️', category: 'checkpoint', crowdLevel: 'high', description: 'Security checkpoint' },
  { id: 'snack', x: 250, y: 210, label: 'Café', emoji: '☕', category: 'checkpoint', crowdLevel: 'medium', description: 'Café after security' },
  { id: 'gateA12', x: 260, y: 80, label: 'A12', emoji: '✈️', category: 'checkpoint', crowdLevel: 'medium', description: 'Gate A12 — Boarding' },
  { id: 'gateA18', x: 120, y: 65, label: 'A18', emoji: '✈️', category: 'checkpoint', crowdLevel: 'low', description: 'Gate A18 — Updated' },
];

export const LANDMARKS: MapLocation[] = [
  { id: 'mcdonalds', x: 330, y: 460, label: "McDonald's", emoji: '🍔', category: 'landmark', crowdLevel: 'high' },
  { id: 'starbucks', x: 140, y: 195, label: 'Starbucks', emoji: '☕', category: 'landmark', crowdLevel: 'medium' },
  { id: 'quiet', x: 80, y: 140, label: 'Quiet Zone', emoji: '🤫', category: 'landmark', crowdLevel: 'low' },
  { id: 'dutyfree', x: 320, y: 240, label: 'Duty Free', emoji: '🛍️', category: 'landmark', crowdLevel: 'high' },
  { id: 'info', x: 140, y: 460, label: 'Info Desk', emoji: 'ℹ️', category: 'landmark', crowdLevel: 'low' },
  { id: 'lounge', x: 330, y: 200, label: 'Lounge', emoji: '🛋️', category: 'landmark', crowdLevel: 'low' },
  { id: 'wc2', x: 300, y: 310, label: 'WC', emoji: '🚻', category: 'landmark', crowdLevel: 'low' },
];

// ── Route points (full ordered path) ──────────────────────────
export const ROUTE_POINTS: MapPoint[] = [
  { x: 210, y: 590 }, // 0  entrance
  { x: 210, y: 460 }, // 1  checkin
  { x: 150, y: 430 }, // 2  toward bathroom
  { x: 90, y: 400 },  // 3  bathroom
  { x: 150, y: 400 }, // 4  back from bathroom
  { x: 210, y: 310 }, // 5  security
  { x: 250, y: 210 }, // 6  snack/café
  { x: 210, y: 180 }, // 7  toward pier
  { x: 180, y: 140 }, // 8  pier junction
  { x: 260, y: 80 },  // 9  A12
  { x: 120, y: 65 },  // 10 A18
];

// ── Route segments (per-checkpoint) ───────────────────────────
export const ROUTE_SEGMENTS: RouteSegment[] = [
  {
    from: 'start',
    to: 'entrance',
    points: [ROUTE_POINTS[0]],
    walkMinutes: 0,
  },
  {
    from: 'entrance',
    to: 'checkin',
    points: [ROUTE_POINTS[0], ROUTE_POINTS[1]],
    walkMinutes: 3,
  },
  {
    from: 'checkin',
    to: 'bathroom',
    points: [ROUTE_POINTS[1], ROUTE_POINTS[2], ROUTE_POINTS[3]],
    walkMinutes: 2,
  },
  {
    from: 'bathroom',
    to: 'security',
    points: [ROUTE_POINTS[3], ROUTE_POINTS[4], ROUTE_POINTS[5]],
    walkMinutes: 4,
  },
  {
    from: 'security',
    to: 'snack',
    points: [ROUTE_POINTS[5], ROUTE_POINTS[6]],
    walkMinutes: 2,
  },
  {
    from: 'snack',
    to: 'gateA12',
    points: [ROUTE_POINTS[6], ROUTE_POINTS[7], ROUTE_POINTS[8], ROUTE_POINTS[9]],
    walkMinutes: 5,
  },
  {
    from: 'snack',
    to: 'gateA18',
    points: [ROUTE_POINTS[6], ROUTE_POINTS[7], ROUTE_POINTS[8], ROUTE_POINTS[10]],
    walkMinutes: 5,
  },
];

// Maps checkpoint index → route point index for avatar positioning
export const CHECKPOINT_ROUTE_MAP = [0, 1, 3, 5, 6, 9]; // default (A12)
export const CHECKPOINT_ROUTE_MAP_CHANGED = [0, 1, 3, 5, 6, 10]; // gate change (A18)

// Checkpoint IDs in order
export const CHECKPOINT_IDS = ['entrance', 'checkin', 'bathroom', 'security', 'snack', 'gateA12'];
export const CHECKPOINT_IDS_CHANGED = ['entrance', 'checkin', 'bathroom', 'security', 'snack', 'gateA18'];

// Walk time for the segment leading TO each checkpoint index
export const WALK_TIMES = [0, 3, 2, 4, 2, 5]; // minutes

// ── Zones ─────────────────────────────────────────────────────
export const ZONES: MapZone[] = [
  {
    id: 'terminal',
    label: 'Terminal 3',
    path: 'M 50 350 Q 50 330 70 330 L 350 330 Q 370 330 370 350 L 370 480 Q 370 500 350 500 L 70 500 Q 50 500 50 480 Z',
    fill: 'hsl(220 15% 93%)',
    fillDark: 'hsl(220 15% 18%)',
    fillHighContrast: 'hsl(220 10% 88%)',
    category: 'terminal',
  },
  {
    id: 'shops',
    label: 'Shops',
    path: 'M 270 335 L 360 335 L 360 400 L 270 400 Z',
    fill: 'hsl(30 40% 94%)',
    fillDark: 'hsl(30 20% 18%)',
    fillHighContrast: 'hsl(30 35% 88%)',
    category: 'shops',
  },
  {
    id: 'security-zone',
    label: 'Security',
    path: 'M 60 295 Q 60 285 70 285 L 350 285 Q 360 285 360 295 L 360 325 Q 360 335 350 335 L 70 335 Q 60 335 60 325 Z',
    fill: 'hsl(220 18% 89%)',
    fillDark: 'hsl(220 15% 20%)',
    fillHighContrast: 'hsl(220 15% 82%)',
    category: 'security',
  },
  {
    id: 'quiet-zone',
    label: 'Quiet Zone',
    path: 'M 55 100 L 115 100 L 115 170 L 55 170 Z',
    fill: 'hsl(150 30% 93%)',
    fillDark: 'hsl(150 20% 16%)',
    fillHighContrast: 'hsl(150 25% 88%)',
    category: 'quiet',
  },
  {
    id: 'entrance-zone',
    label: 'Entrance',
    path: 'M 160 572 Q 160 554 178 554 L 242 554 Q 260 554 260 572 L 260 608 Q 260 626 242 626 L 178 626 Q 160 626 160 608 Z',
    fill: 'hsl(210 25% 88%)',
    fillDark: 'hsl(210 20% 18%)',
    fillHighContrast: 'hsl(210 20% 82%)',
    category: 'entrance',
  },
];

// ── Utilities ──────────────────────────────────────────────────

/** Distance between two points */
function dist(a: MapPoint, b: MapPoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Get a point along a polyline at parameter t (0..1) */
export function getPointOnPath(points: MapPoint[], t: number): MapPoint {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1 || t <= 0) return points[0];
  if (t >= 1) return points[points.length - 1];

  // Compute total length
  const segLengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const d = dist(points[i - 1], points[i]);
    segLengths.push(d);
    total += d;
  }

  const targetDist = t * total;
  let accumulated = 0;

  for (let i = 0; i < segLengths.length; i++) {
    if (accumulated + segLengths[i] >= targetDist) {
      const segT = (targetDist - accumulated) / segLengths[i];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * segT,
        y: points[i].y + (points[i + 1].y - points[i].y) * segT,
      };
    }
    accumulated += segLengths[i];
  }

  return points[points.length - 1];
}

/** Build a smooth SVG path through a set of points using quadratic curves */
export function buildSmoothPath(pts: MapPoint[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mx = (prev.x + cur.x) / 2;
    const my = (prev.y + cur.y) / 2;
    d += ` Q ${prev.x} ${my} ${mx} ${my} T ${cur.x} ${cur.y}`;
  }
  return d;
}

/** Get route points slice for a given checkpoint range */
export function getRouteSlice(
  fromCheckpointIdx: number,
  toCheckpointIdx: number,
  gateChanged: boolean,
): MapPoint[] {
  const map = gateChanged ? CHECKPOINT_ROUTE_MAP_CHANGED : CHECKPOINT_ROUTE_MAP;
  const start = map[Math.max(0, fromCheckpointIdx)] ?? 0;
  const end = map[Math.min(toCheckpointIdx, map.length - 1)] ?? 0;
  return ROUTE_POINTS.slice(start, end + 1);
}
