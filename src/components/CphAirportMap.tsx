import { useApp } from '@/context/AppContext';
import { AVATARS } from '@/context/AppContext';

const LOCATIONS = [
  { id: 'entrance', x: 210, y: 590, label: 'Entrance', emoji: '🚪' },
  { id: 'checkin', x: 210, y: 460, label: 'Check-in', emoji: '🎫' },
  { id: 'bathroom', x: 90, y: 400, label: 'WC', emoji: '🚻' },
  { id: 'security', x: 210, y: 310, label: 'Security', emoji: '🛡️' },
  { id: 'snack', x: 250, y: 210, label: 'Café', emoji: '☕' },
  { id: 'gateA12', x: 260, y: 80, label: 'A12', emoji: '✈️' },
  { id: 'gateA18', x: 120, y: 65, label: 'A18', emoji: '✈️' },
];

const LANDMARKS = [
  { x: 330, y: 460, label: "McDonald's", emoji: '🍔' },
  { x: 140, y: 195, label: 'Starbucks', emoji: '☕' },
  { x: 80, y: 140, label: 'Quiet Zone', emoji: '🤫' },
];

const ROUTE_POINTS = [
  { x: 210, y: 590 }, // entrance
  { x: 210, y: 460 }, // checkin
  { x: 150, y: 430 }, // toward bathroom
  { x: 90, y: 400 },  // bathroom
  { x: 150, y: 400 }, // back
  { x: 210, y: 310 }, // security
  { x: 250, y: 210 }, // snack/café
  { x: 210, y: 180 }, // toward pier
  { x: 180, y: 140 }, // pier junction
  { x: 260, y: 80 },  // A12
  { x: 120, y: 65 },  // A18
];

const CphAirportMap = () => {
  const { currentCheckpointIndex, gateChanged, avatar } = useApp();
  const avatarEmoji = AVATARS.find(a => a.id === avatar)?.emoji || '📍';

  const routeSegmentMap = [0, 1, 3, 5, 6, gateChanged ? 10 : 9];
  const activeRouteEnd = routeSegmentMap[Math.min(currentCheckpointIndex, 5)] || 0;
  const completedRouteEnd = currentCheckpointIndex > 0 ? routeSegmentMap[currentCheckpointIndex - 1] : -1;
  const currentPos = ROUTE_POINTS[activeRouteEnd] || ROUTE_POINTS[0];

  const buildPath = (pts: { x: number; y: number }[]) => {
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
  };

  const completedPoints = ROUTE_POINTS.slice(0, completedRouteEnd + 1);
  const activePoints = ROUTE_POINTS.slice(Math.max(0, completedRouteEnd), activeRouteEnd + 1);
  const futurePoints = ROUTE_POINTS.slice(activeRouteEnd);

  const destIds = ['entrance', 'checkin', 'bathroom', 'security', 'snack', gateChanged ? 'gateA18' : 'gateA12'];
  const destId = destIds[Math.min(currentCheckpointIndex, 5)];

  return (
    <svg viewBox="0 0 420 650" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="avatarGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="420" height="650" rx="12" fill="hsl(40 20% 96%)" />

      {/* Terminal building — soft fill, no stroke */}
      <rect x="50" y="350" width="320" height="150" rx="20" fill="hsl(220 15% 93%)" />
      <text x="210" y="500" textAnchor="middle" fontSize="11" fill="hsl(220 10% 62%)" fontWeight="600" letterSpacing="3">TERMINAL 3</text>

      {/* Pier A — soft shape */}
      <path d="M 165 350 Q 155 280 140 200 Q 120 120 90 40 L 60 40 Q 85 120 100 200 Q 115 280 120 350 Z"
        fill="hsl(220 15% 93%)" />
      {/* Pier A right wing for A12 */}
      <path d="M 165 350 Q 175 280 190 200 Q 210 120 280 40 L 310 40 Q 230 120 215 200 Q 200 280 195 350 Z"
        fill="hsl(220 15% 93%)" />
      <text x="185" y="35" textAnchor="middle" fontSize="10" fill="hsl(220 10% 62%)" fontWeight="600" letterSpacing="2">PIER A</text>

      {/* Security band — subtle */}
      <rect x="60" y="295" width="300" height="30" rx="10" fill="hsl(220 18% 89%)" />
      <text x="210" y="315" textAnchor="middle" fontSize="11" fill="hsl(220 10% 55%)" fontWeight="600">🛡️ Security</text>

      {/* Entrance zone */}
      <rect x="160" y="572" width="100" height="36" rx="18" fill="hsl(210 25% 88%)" />
      <text x="210" y="595" textAnchor="middle" fontSize="11" fill="hsl(210 20% 45%)" fontWeight="600">ENTRANCE</text>

      {/* Walkway corridor hints */}
      <rect x="185" y="500" width="50" height="72" rx="6" fill="hsl(40 15% 94%)" opacity="0.6" />
      <rect x="145" y="325" width="130" height="25" rx="6" fill="hsl(40 15% 94%)" opacity="0.4" />

      {/* Future route */}
      {futurePoints.length > 1 && (
        <path d={buildPath(futurePoints)} fill="none" stroke="hsl(220 12% 82%)" strokeWidth="5"
          strokeLinecap="round" strokeDasharray="8 6" />
      )}

      {/* Active route */}
      {activePoints.length > 1 && (
        <path d={buildPath(activePoints)} fill="none" stroke="hsl(205 65% 55%)" strokeWidth="6"
          strokeLinecap="round" strokeDasharray="10 6" opacity="0.9" />
      )}

      {/* Completed route */}
      {completedPoints.length > 1 && (
        <path d={buildPath(completedPoints)} fill="none" stroke="hsl(152 50% 50%)" strokeWidth="6"
          strokeLinecap="round" />
      )}

      {/* Location markers */}
      {LOCATIONS.map((loc) => {
        const cpIdx = ['entrance', 'checkin', 'bathroom', 'security', 'snack', 'gateA12'].indexOf(loc.id);
        const isGateA18 = loc.id === 'gateA18';
        const isActive = loc.id === destId;
        const isCompleted = cpIdx >= 0 && cpIdx < currentCheckpointIndex;

        if (loc.id === 'gateA12' && gateChanged) return null;
        if (isGateA18 && !gateChanged) return null;

        const pillW = 92;
        const pillH = 36;

        return (
          <g key={loc.id}>
            {isActive && (
              <circle cx={loc.x} cy={loc.y} r="30" fill="hsl(152 50% 50%)" opacity="0.1" className="animate-pulse" />
            )}
            <rect
              x={loc.x - pillW / 2} y={loc.y - pillH / 2}
              width={pillW} height={pillH} rx="18"
              fill={isCompleted ? 'hsl(152 45% 95%)' : isActive ? 'hsl(152 45% 93%)' : 'hsl(0 0% 100%)'}
              stroke={isCompleted ? 'hsl(152 45% 65%)' : isActive ? 'hsl(152 50% 55%)' : 'hsl(220 12% 88%)'}
              strokeWidth="1.5"
            />
            <text x={loc.x - 18} y={loc.y + 6} textAnchor="middle" fontSize="16">{loc.emoji}</text>
            <text
              x={loc.x + 12} y={loc.y + 5}
              textAnchor="middle" fontSize="13"
              fill={isCompleted ? 'hsl(152 40% 30%)' : isActive ? 'hsl(152 45% 25%)' : 'hsl(220 15% 35%)'}
              fontWeight={isActive ? '700' : '500'}
            >
              {loc.label}
            </text>
            {isCompleted && (
              <text x={loc.x + pillW / 2 - 6} y={loc.y - pillH / 2 + 4} fontSize="13">✅</text>
            )}
          </g>
        );
      })}

      {/* Landmarks — muted */}
      {LANDMARKS.map(lm => (
        <g key={lm.label} opacity="0.6">
          <text x={lm.x - 8} y={lm.y + 5} fontSize="13">{lm.emoji}</text>
          <text x={lm.x + 10} y={lm.y + 4} fontSize="10" fill="hsl(220 10% 50%)" fontWeight="400">{lm.label}</text>
        </g>
      ))}

      {/* User avatar */}
      <circle cx={currentPos.x} cy={currentPos.y} r="26" fill="hsl(205 65% 55%)" opacity="0.15" className="animate-pulse" />
      <circle cx={currentPos.x} cy={currentPos.y} r="20" fill="hsl(0 0% 100%)" stroke="hsl(205 65% 55%)" strokeWidth="3" filter="url(#avatarGlow)" />
      <text x={currentPos.x} y={currentPos.y + 7} textAnchor="middle" fontSize="18">{avatarEmoji}</text>
    </svg>
  );
};

export default CphAirportMap;
