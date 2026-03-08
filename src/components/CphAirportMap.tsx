import { useApp } from '@/context/AppContext';

const LOCATIONS = [
  { id: 'entrance', x: 190, y: 435, label: 'Entrance' },
  { id: 'checkin', x: 190, y: 385, label: 'Check-in' },
  { id: 'bathroom', x: 115, y: 370, label: 'Bathroom' },
  { id: 'security', x: 190, y: 335, label: 'Security' },
  { id: 'snack', x: 230, y: 295, label: 'Café' },
  { id: 'gateA12', x: 72, y: 195, label: 'A12' },
  { id: 'gateA18', x: 55, y: 130, label: 'A18' },
];

const LANDMARKS = [
  { x: 60, y: 165, label: 'Quiet', emoji: '🤫' },
  { x: 270, y: 380, label: 'Help', emoji: 'ℹ️' },
  { x: 80, y: 235, label: 'Charge', emoji: '🔌' },
];

// Route path: entrance → checkin → bathroom → security → snack → gate
const ROUTE_POINTS = [
  { x: 190, y: 435 }, // entrance
  { x: 190, y: 385 }, // checkin
  { x: 115, y: 370 }, // bathroom
  { x: 115, y: 335 }, // up to security level
  { x: 190, y: 335 }, // security
  { x: 230, y: 295 }, // snack
  { x: 190, y: 290 }, // toward pier A
  { x: 100, y: 280 }, // pier A junction
  { x: 80, y: 235 },  // along pier A
  { x: 72, y: 195 },  // A12
  { x: 55, y: 130 },  // A18
];

const CphAirportMap = () => {
  const { currentCheckpointIndex, gateChanged } = useApp();

  // Map checkpoint index to route segment index
  const routeSegmentMap = [0, 1, 2, 4, 5, gateChanged ? 10 : 9];
  const activeRouteEnd = routeSegmentMap[Math.min(currentCheckpointIndex, 5)] || 0;
  const completedRouteEnd = currentCheckpointIndex > 0 ? routeSegmentMap[currentCheckpointIndex - 1] : -1;

  // Current position on route
  const currentPos = ROUTE_POINTS[activeRouteEnd] || ROUTE_POINTS[0];

  const pointsToString = (pts: typeof ROUTE_POINTS) => pts.map(p => `${p.x},${p.y}`).join(' ');

  // Completed route (green)
  const completedPoints = ROUTE_POINTS.slice(0, completedRouteEnd + 1);
  // Active route segment (blue, dashed)
  const activePoints = ROUTE_POINTS.slice(Math.max(0, completedRouteEnd), activeRouteEnd + 1);
  // Future route (gray)
  const futurePoints = ROUTE_POINTS.slice(activeRouteEnd);

  return (
    <svg viewBox="0 0 380 500" className="w-full h-full" style={{ maxHeight: '50vh' }}>
      {/* Background */}
      <rect width="380" height="500" fill="#F0F5FA" rx="0" />

      {/* Main Terminal Building */}
      <rect x="55" y="330" width="270" height="90" rx="10" fill="#DEE7F0" stroke="#B8C9DB" strokeWidth="1.5" />
      <text x="190" y="405" textAnchor="middle" fontSize="9" fill="#6B8299" fontWeight="600">TERMINAL</text>

      {/* Pier A - upper left */}
      <path d="M 105 330 L 95 280 L 75 200 L 55 110 L 35 110 L 50 200 L 65 280 L 75 330 Z"
        fill="#DEE7F0" stroke="#B8C9DB" strokeWidth="1.5" />
      <text x="48" y="100" textAnchor="middle" fontSize="8" fill="#6B8299" fontWeight="600">PIER A</text>

      {/* Pier B - upper center */}
      <rect x="170" y="85" width="40" height="245" rx="8" fill="#DEE7F0" stroke="#B8C9DB" strokeWidth="1.5" />
      <text x="190" y="80" textAnchor="middle" fontSize="8" fill="#6B8299" fontWeight="600">PIER B</text>

      {/* Pier C - upper right */}
      <path d="M 275 330 L 285 280 L 305 200 L 325 110 L 345 110 L 330 200 L 315 280 L 305 330 Z"
        fill="#DEE7F0" stroke="#B8C9DB" strokeWidth="1.5" />
      <text x="332" y="100" textAnchor="middle" fontSize="8" fill="#6B8299" fontWeight="600">PIER C</text>

      {/* Security zone */}
      <rect x="85" y="325" width="210" height="15" rx="4" fill="#D4E0ED" stroke="#B8C9DB" strokeWidth="0.5" />
      <text x="190" y="336" textAnchor="middle" fontSize="7" fill="#6B8299">SECURITY</text>

      {/* Entrance markers */}
      <rect x="165" y="420" width="50" height="25" rx="6" fill="#C4D7EA" stroke="#B8C9DB" strokeWidth="1" />
      <text x="190" y="437" textAnchor="middle" fontSize="7" fill="#4A6B8A" fontWeight="600">ENTRY</text>

      {/* Future route (gray) */}
      {futurePoints.length > 1 && (
        <polyline
          points={pointsToString(futurePoints)}
          fill="none" stroke="#B8C9DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="6 4"
        />
      )}

      {/* Active route segment (blue dashed) */}
      {activePoints.length > 1 && (
        <polyline
          points={pointsToString(activePoints)}
          fill="none" stroke="#3B9AE1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="8 5"
          opacity="0.7"
        />
      )}

      {/* Completed route (green) */}
      {completedPoints.length > 1 && (
        <polyline
          points={pointsToString(completedPoints)}
          fill="none" stroke="#34A853" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        />
      )}

      {/* Location markers */}
      {LOCATIONS.map((loc) => {
        const cpIdx = ['entrance', 'checkin', 'bathroom', 'security', 'snack', 'gateA12'].indexOf(loc.id);
        const isGateA18 = loc.id === 'gateA18';
        const isActive = (loc.id === 'gateA12' && !gateChanged && currentCheckpointIndex === 5) ||
                          (isGateA18 && gateChanged && currentCheckpointIndex === 5) ||
                          (cpIdx >= 0 && cpIdx === currentCheckpointIndex);
        const isCompleted = cpIdx >= 0 && cpIdx < currentCheckpointIndex;
        const isGateTarget = (loc.id === 'gateA12' && !gateChanged) || (isGateA18 && gateChanged);

        if (loc.id === 'gateA12' && gateChanged) return null; // Hide old gate
        if (isGateA18 && !gateChanged) return null; // Hide new gate until changed

        let fill = '#94A3B8';
        if (isCompleted) fill = '#34A853';
        if (isActive) fill = '#3B9AE1';
        if (isGateTarget && currentCheckpointIndex === 5) fill = '#3B9AE1';

        return (
          <g key={loc.id}>
            <circle cx={loc.x} cy={loc.y} r="10" fill={fill} opacity="0.15" />
            <circle cx={loc.x} cy={loc.y} r="5" fill={fill} />
            <text
              x={loc.x}
              y={loc.y + 18}
              textAnchor="middle"
              fontSize="8"
              fill="#334155"
              fontWeight={isActive ? '700' : '500'}
            >
              {loc.label}
            </text>
          </g>
        );
      })}

      {/* Landmark markers */}
      {LANDMARKS.map(lm => (
        <g key={lm.label}>
          <text x={lm.x} y={lm.y} textAnchor="middle" fontSize="12">{lm.emoji}</text>
          <text x={lm.x} y={lm.y + 13} textAnchor="middle" fontSize="7" fill="#6B8299">{lm.label}</text>
        </g>
      ))}

      {/* Current location pulsing dot */}
      <circle cx={currentPos.x} cy={currentPos.y} r="12" fill="#3B9AE1" opacity="0.2" className="animate-pulse-dot" />
      <circle cx={currentPos.x} cy={currentPos.y} r="6" fill="#3B9AE1" stroke="white" strokeWidth="2" />

      {/* Calm route badge */}
      <rect x="280" y="455" width="85" height="28" rx="14" fill="#E8F5E9" stroke="#81C784" strokeWidth="1" />
      <text x="322" y="473" textAnchor="middle" fontSize="8" fill="#2E7D32" fontWeight="600">🌿 Calm route</text>
    </svg>
  );
};

export default CphAirportMap;
