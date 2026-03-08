import { useApp } from '@/context/AppContext';
import { AVATARS } from '@/context/AppContext';

const LOCATIONS = [
  { id: 'entrance', x: 200, y: 550, label: 'Entrance', emoji: '🚪' },
  { id: 'checkin', x: 200, y: 440, label: 'Check-in', emoji: '🎫' },
  { id: 'bathroom', x: 85, y: 390, label: 'WC', emoji: '🚻' },
  { id: 'security', x: 200, y: 300, label: 'Security', emoji: '🛡️' },
  { id: 'snack', x: 270, y: 220, label: 'Café', emoji: '☕' },
  { id: 'gateA12', x: 110, y: 105, label: 'A12', emoji: '✈️' },
  { id: 'gateA18', x: 75, y: 55, label: 'A18', emoji: '✈️' },
];

const LANDMARKS = [
  { x: 320, y: 450, label: "McDonald's", emoji: '🍔' },
  { x: 320, y: 390, label: '7-Eleven', emoji: '🏪' },
  { x: 155, y: 220, label: 'Starbucks', emoji: '☕' },
  { x: 60, y: 170, label: 'Quiet Zone', emoji: '🤫' },
  { x: 320, y: 300, label: 'Info', emoji: 'ℹ️' },
  { x: 60, y: 260, label: 'Charging', emoji: '🔌' },
];

const ROUTE_POINTS = [
  { x: 200, y: 550 }, // entrance
  { x: 200, y: 440 }, // checkin
  { x: 140, y: 440 }, // toward bathroom
  { x: 85, y: 390 },  // bathroom
  { x: 140, y: 390 }, // back
  { x: 200, y: 300 }, // security
  { x: 270, y: 220 }, // snack/café
  { x: 200, y: 210 }, // toward pier A
  { x: 145, y: 180 }, // pier junction
  { x: 110, y: 105 }, // A12
  { x: 75, y: 55 },   // A18
];

const CphAirportMap = () => {
  const { currentCheckpointIndex, gateChanged, avatar } = useApp();

  const avatarEmoji = AVATARS.find(a => a.id === avatar)?.emoji || '📍';

  const routeSegmentMap = [0, 1, 3, 5, 6, gateChanged ? 10 : 9];
  const activeRouteEnd = routeSegmentMap[Math.min(currentCheckpointIndex, 5)] || 0;
  const completedRouteEnd = currentCheckpointIndex > 0 ? routeSegmentMap[currentCheckpointIndex - 1] : -1;

  const currentPos = ROUTE_POINTS[activeRouteEnd] || ROUTE_POINTS[0];

  const pointsToString = (pts: typeof ROUTE_POINTS) => pts.map(p => `${p.x},${p.y}`).join(' ');

  const completedPoints = ROUTE_POINTS.slice(0, completedRouteEnd + 1);
  const activePoints = ROUTE_POINTS.slice(Math.max(0, completedRouteEnd), activeRouteEnd + 1);
  const futurePoints = ROUTE_POINTS.slice(activeRouteEnd);

  const destIds = ['entrance', 'checkin', 'bathroom', 'security', 'snack', gateChanged ? 'gateA18' : 'gateA12'];
  const destId = destIds[Math.min(currentCheckpointIndex, 5)];

  return (
    <svg viewBox="0 0 400 620" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Background */}
      <rect width="400" height="620" fill="hsl(210 30% 96%)" />

      {/* Main Terminal Building */}
      <rect x="40" y="340" width="320" height="140" rx="16" fill="hsl(210 25% 90%)" stroke="hsl(210 20% 78%)" strokeWidth="2" />
      <text x="200" y="475" textAnchor="middle" fontSize="13" fill="hsl(210 20% 55%)" fontWeight="700" letterSpacing="2">TERMINAL 3</text>

      {/* Pier A */}
      <path d="M 145 340 L 130 270 L 105 170 L 65 30 L 35 30 L 65 170 L 85 270 L 100 340 Z"
        fill="hsl(210 25% 90%)" stroke="hsl(210 20% 78%)" strokeWidth="2" />
      <text x="50" y={22} textAnchor="middle" fontSize="12" fill="hsl(210 20% 55%)" fontWeight="700" letterSpacing="1">PIER A</text>

      {/* Security band */}
      <rect x="50" y="288" width="300" height="30" rx="8" fill="hsl(210 30% 85%)" stroke="hsl(210 20% 75%)" strokeWidth="1.5" />
      <text x="200" y="308" textAnchor="middle" fontSize="12" fill="hsl(210 20% 50%)" fontWeight="600">🛡️ SECURITY</text>

      {/* Entrance zone */}
      <rect x="150" y="530" width="100" height="40" rx="12" fill="hsl(200 40% 82%)" stroke="hsl(200 30% 70%)" strokeWidth="1.5" />
      <text x="200" y="556" textAnchor="middle" fontSize="12" fill="hsl(200 30% 35%)" fontWeight="700">ENTRANCE</text>

      {/* Busy area badge */}
      <rect x="270" y="420" width="90" height="26" rx="13" fill="hsl(35 90% 92%)" stroke="hsl(35 80% 70%)" strokeWidth="1" />
      <text x="315" y="438" textAnchor="middle" fontSize="10" fill="hsl(35 70% 40%)" fontWeight="600">⚠️ Busy area</text>

      {/* Future route (gray dashed) */}
      {futurePoints.length > 1 && (
        <polyline
          points={pointsToString(futurePoints)}
          fill="none" stroke="hsl(210 20% 78%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="10 7"
        />
      )}

      {/* Active route (blue dashed) */}
      {activePoints.length > 1 && (
        <polyline
          points={pointsToString(activePoints)}
          fill="none" stroke="hsl(205 70% 55%)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="12 7"
          opacity="0.85"
        />
      )}

      {/* Completed route (green solid) */}
      {completedPoints.length > 1 && (
        <polyline
          points={pointsToString(completedPoints)}
          fill="none" stroke="hsl(142 55% 45%)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
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

        const badgeW = loc.label.length > 4 ? 80 : 60;
        const badgeH = 32;

        return (
          <g key={loc.id}>
            {/* Destination pulsing green ring */}
            {isActive && (
              <>
                <circle cx={loc.x} cy={loc.y} r="28" fill="hsl(142 55% 45%)" opacity="0.12" className="animate-pulse" />
                <circle cx={loc.x} cy={loc.y} r="20" fill="hsl(142 55% 45%)" opacity="0.08" />
              </>
            )}
            {/* Badge background */}
            <rect
              x={loc.x - badgeW / 2} y={loc.y - badgeH / 2} width={badgeW} height={badgeH} rx="10"
              fill={isCompleted ? 'hsl(142 55% 95%)' : isActive ? 'hsl(142 55% 92%)' : 'hsl(0 0% 100%)'}
              stroke={isCompleted ? 'hsl(142 55% 60%)' : isActive ? 'hsl(142 55% 50%)' : 'hsl(210 20% 82%)'}
              strokeWidth="2"
              opacity="0.95"
            />
            <text x={loc.x - badgeW / 2 + 18} y={loc.y + 6} textAnchor="middle" fontSize="17">{loc.emoji}</text>
            <text
              x={loc.x + 8} y={loc.y + 5}
              textAnchor="middle"
              fontSize="12"
              fill={isCompleted ? 'hsl(142 55% 30%)' : isActive ? 'hsl(142 55% 25%)' : 'hsl(210 20% 35%)'}
              fontWeight={isActive ? '700' : '600'}
            >
              {loc.label}
            </text>
            {/* Completed check */}
            {isCompleted && (
              <text x={loc.x + badgeW / 2 - 2} y={loc.y - badgeH / 2 + 2} fontSize="14">✅</text>
            )}
          </g>
        );
      })}

      {/* Landmarks */}
      {LANDMARKS.map(lm => {
        const lmW = lm.label.length > 6 ? 80 : 60;
        return (
          <g key={lm.label}>
            <rect x={lm.x - lmW / 2} y={lm.y - 14} width={lmW} height="28" rx="8"
              fill="hsl(0 0% 100%)" stroke="hsl(210 15% 85%)" strokeWidth="1" opacity="0.9" />
            <text x={lm.x - lmW / 2 + 16} y={lm.y + 6} textAnchor="middle" fontSize="14">{lm.emoji}</text>
            <text x={lm.x + 8} y={lm.y + 5} textAnchor="middle" fontSize="9" fill="hsl(210 15% 45%)" fontWeight="500">{lm.label}</text>
          </g>
        );
      })}

      {/* User avatar at current position */}
      <circle cx={currentPos.x} cy={currentPos.y} r="24" fill="hsl(205 70% 55%)" opacity="0.18" className="animate-pulse" />
      <circle cx={currentPos.x} cy={currentPos.y} r="17" fill="hsl(0 0% 100%)" stroke="hsl(205 70% 55%)" strokeWidth="3" />
      <text x={currentPos.x} y={currentPos.y + 7} textAnchor="middle" fontSize="18">{avatarEmoji}</text>

      {/* Calm route badge */}
      <rect x="285" y="575" width="105" height="30" rx="15" fill="hsl(142 40% 94%)" stroke="hsl(142 40% 65%)" strokeWidth="1" />
      <text x="337" y="595" textAnchor="middle" fontSize="11" fill="hsl(142 40% 30%)" fontWeight="600">🌿 Calm route</text>
    </svg>
  );
};

export default CphAirportMap;
