import { useApp } from '@/context/AppContext';
import { AVATARS } from '@/context/AppContext';

const LOCATIONS = [
  { id: 'entrance', x: 200, y: 540, label: 'Entrance', emoji: '🚪' },
  { id: 'checkin', x: 200, y: 430, label: 'Check-in', emoji: '🎫' },
  { id: 'bathroom', x: 95, y: 395, label: 'WC', emoji: '🚻' },
  { id: 'security', x: 200, y: 310, label: 'Security', emoji: '🛡️' },
  { id: 'snack', x: 260, y: 240, label: 'Café', emoji: '☕' },
  { id: 'gateA12', x: 105, y: 120, label: 'Gate A12', emoji: '✈️' },
  { id: 'gateA18', x: 75, y: 60, label: 'Gate A18', emoji: '✈️' },
];

const LANDMARKS = [
  { x: 310, y: 440, label: "McDonald's", emoji: '🍔' },
  { x: 310, y: 395, label: '7-Eleven', emoji: '🏪' },
  { x: 160, y: 240, label: 'Starbucks', emoji: '☕' },
  { x: 70, y: 180, label: 'Quiet Zone', emoji: '🤫' },
  { x: 300, y: 310, label: 'Info', emoji: 'ℹ️' },
  { x: 70, y: 260, label: 'Charging', emoji: '🔌' },
];

const ROUTE_POINTS = [
  { x: 200, y: 540 }, // entrance
  { x: 200, y: 430 }, // checkin
  { x: 145, y: 430 }, // toward bathroom
  { x: 95, y: 395 },  // bathroom
  { x: 145, y: 395 }, // back
  { x: 200, y: 310 }, // security
  { x: 260, y: 240 }, // snack/café
  { x: 200, y: 230 }, // toward pier A
  { x: 140, y: 200 }, // pier junction
  { x: 105, y: 120 }, // A12
  { x: 75, y: 60 },   // A18
];

const CphAirportMap = () => {
  const { currentCheckpointIndex, gateChanged, avatar } = useApp();

  const avatarEmoji = AVATARS.find(a => a.id === avatar)?.emoji || '📍';

  // Map checkpoint index to route point index
  const routeSegmentMap = [0, 1, 3, 5, 6, gateChanged ? 10 : 9];
  const activeRouteEnd = routeSegmentMap[Math.min(currentCheckpointIndex, 5)] || 0;
  const completedRouteEnd = currentCheckpointIndex > 0 ? routeSegmentMap[currentCheckpointIndex - 1] : -1;

  const currentPos = ROUTE_POINTS[activeRouteEnd] || ROUTE_POINTS[0];

  const pointsToString = (pts: typeof ROUTE_POINTS) => pts.map(p => `${p.x},${p.y}`).join(' ');

  const completedPoints = ROUTE_POINTS.slice(0, completedRouteEnd + 1);
  const activePoints = ROUTE_POINTS.slice(Math.max(0, completedRouteEnd), activeRouteEnd + 1);
  const futurePoints = ROUTE_POINTS.slice(activeRouteEnd);

  // Find the active destination location
  const destIds = ['entrance', 'checkin', 'bathroom', 'security', 'snack', gateChanged ? 'gateA18' : 'gateA12'];
  const destId = destIds[Math.min(currentCheckpointIndex, 5)];
  const destLoc = LOCATIONS.find(l => l.id === destId);

  return (
    <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Background */}
      <rect width="400" height="600" fill="hsl(210 30% 96%)" />

      {/* Main Terminal Building */}
      <rect x="50" y="350" width="300" height="120" rx="14" fill="hsl(210 25% 90%)" stroke="hsl(210 20% 78%)" strokeWidth="2" />
      <text x="200" y="465" textAnchor="middle" fontSize="11" fill="hsl(210 20% 55%)" fontWeight="700" letterSpacing="2">TERMINAL 3</text>

      {/* Pier A */}
      <path d="M 140 350 L 125 280 L 100 180 L 65 40 L 40 40 L 70 180 L 90 280 L 105 350 Z"
        fill="hsl(210 25% 90%)" stroke="hsl(210 20% 78%)" strokeWidth="2" />
      <text x="55" y: 30" textAnchor="middle" fontSize="10" fill="hsl(210 20% 55%)" fontWeight="700" letterSpacing="1">PIER A</text>

      {/* Security band */}
      <rect x="60" y="300" width="280" height="24" rx="6" fill="hsl(210 30% 85%)" stroke="hsl(210 20% 75%)" strokeWidth="1.5" />
      <text x="200" y="316" textAnchor="middle" fontSize="10" fill="hsl(210 20% 50%)" fontWeight="600">🛡️ SECURITY</text>

      {/* Entrance */}
      <rect x="160" y="525" width="80" height="35" rx="10" fill="hsl(200 40% 82%)" stroke="hsl(200 30% 70%)" strokeWidth="1.5" />
      <text x="200" y="548" textAnchor="middle" fontSize="10" fill="hsl(200 30% 35%)" fontWeight="700">ENTRANCE</text>

      {/* Busy area badge */}
      <rect x="270" y: "415" width="80" height="22" rx="11" fill="hsl(35 90% 92%)" stroke="hsl(35 80% 70%)" strokeWidth="1" />
      <text x="310" y="430" textAnchor="middle" fontSize="8" fill="hsl(35 70% 40%)" fontWeight="600">⚠️ Busy area</text>

      {/* Future route (gray dashed) */}
      {futurePoints.length > 1 && (
        <polyline
          points={pointsToString(futurePoints)}
          fill="none" stroke="hsl(210 20% 78%)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="8 6"
        />
      )}

      {/* Active route (blue dashed) */}
      {activePoints.length > 1 && (
        <polyline
          points={pointsToString(activePoints)}
          fill="none" stroke="hsl(205 70% 55%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="10 6"
          opacity="0.8"
        />
      )}

      {/* Completed route (green solid) */}
      {completedPoints.length > 1 && (
        <polyline
          points={pointsToString(completedPoints)}
          fill="none" stroke="hsl(142 55% 45%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        />
      )}

      {/* Location markers */}
      {LOCATIONS.map((loc) => {
        const cpIdx = ['entrance', 'checkin', 'bathroom', 'security', 'snack', 'gateA12'].indexOf(loc.id);
        const isGateA18 = loc.id === 'gateA18';
        const isActive = loc.id === destId;
        const isCompleted = cpIdx >= 0 && cpIdx < currentCheckpointIndex;

        if (loc.id === 'gateA12' && gateChanged) return null;
        if (isGateA18 && !gateChanged) return null;

        return (
          <g key={loc.id}>
            {/* Destination pulsing green ring */}
            {isActive && (
              <>
                <circle cx={loc.x} cy={loc.y} r="22" fill="hsl(142 55% 45%)" opacity="0.15" className="animate-pulse" />
                <circle cx={loc.x} cy={loc.y} r="16" fill="hsl(142 55% 45%)" opacity="0.1" />
              </>
            )}
            {/* Badge background */}
            <rect
              x={loc.x - 28} y={loc.y - 14} width="56" height="28" rx="8"
              fill={isCompleted ? 'hsl(142 55% 95%)' : isActive ? 'hsl(142 55% 92%)' : 'hsl(0 0% 100%)'}
              stroke={isCompleted ? 'hsl(142 55% 60%)' : isActive ? 'hsl(142 55% 50%)' : 'hsl(210 20% 82%)'}
              strokeWidth="1.5"
              opacity="0.95"
            />
            <text x={loc.x - 12} y={loc.y + 5} textAnchor="middle" fontSize="14">{loc.emoji}</text>
            <text
              x={loc.x + 12} y={loc.y + 4}
              textAnchor="middle"
              fontSize="8"
              fill={isCompleted ? 'hsl(142 55% 30%)' : isActive ? 'hsl(142 55% 25%)' : 'hsl(210 20% 35%)'}
              fontWeight={isActive ? '700' : '600'}
            >
              {loc.label}
            </text>
            {/* Completed check */}
            {isCompleted && (
              <text x={loc.x + 24} y={loc.y - 6} fontSize="12">✅</text>
            )}
          </g>
        );
      })}

      {/* Landmarks */}
      {LANDMARKS.map(lm => (
        <g key={lm.label}>
          <rect x={lm.x - 22} y={lm.y - 12} width="44" height="24" rx="6"
            fill="hsl(0 0% 100%)" stroke="hsl(210 15% 85%)" strokeWidth="1" opacity="0.85" />
          <text x={lm.x - 8} y={lm.y + 5} textAnchor="middle" fontSize="12">{lm.emoji}</text>
          <text x={lm.x + 10} y={lm.y + 4} textAnchor="middle" fontSize="7" fill="hsl(210 15% 45%)" fontWeight="500">{lm.label}</text>
        </g>
      ))}

      {/* User avatar at current position */}
      <circle cx={currentPos.x} cy={currentPos.y} r="20" fill="hsl(205 70% 55%)" opacity="0.18" className="animate-pulse" />
      <circle cx={currentPos.x} cy={currentPos.y} r="14" fill="hsl(0 0% 100%)" stroke="hsl(205 70% 55%)" strokeWidth="3" />
      <text x={currentPos.x} y={currentPos.y + 6} textAnchor="middle" fontSize="16">{avatarEmoji}</text>

      {/* Calm route badge */}
      <rect x="290" y="560" width="95" height="28" rx="14" fill="hsl(142 40% 94%)" stroke="hsl(142 40% 65%)" strokeWidth="1" />
      <text x="337" y="578" textAnchor="middle" fontSize="9" fill="hsl(142 40% 30%)" fontWeight="600">🌿 Calm route</text>
    </svg>
  );
};

export default CphAirportMap;
