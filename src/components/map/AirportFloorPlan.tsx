import { ZONES } from './mapData';

interface AirportFloorPlanProps {
  highContrast: boolean;
  darkMode: boolean;
}

const AirportFloorPlan = ({ highContrast, darkMode }: AirportFloorPlanProps) => {
  const getZoneFill = (zone: typeof ZONES[number]) => {
    if (highContrast) return zone.fillHighContrast;
    if (darkMode) return zone.fillDark;
    return zone.fill;
  };

  const bgFill = darkMode ? 'hsl(215 28% 12%)' : 'hsl(40 20% 96%)';
  const buildingFill = darkMode ? 'hsl(220 15% 18%)' : 'hsl(220 15% 93%)';
  const corridorFill = darkMode ? 'hsl(220 12% 15%)' : 'hsl(40 15% 94%)';
  const textColor = darkMode ? 'hsl(220 10% 55%)' : 'hsl(220 10% 62%)';
  const textColorStrong = darkMode ? 'hsl(220 10% 50%)' : 'hsl(220 10% 55%)';
  const lineColor = darkMode ? 'hsl(220 12% 22%)' : 'hsl(220 12% 86%)';
  const shadowColor = darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)';
  const quietBorder = darkMode ? 'hsl(150 20% 30%)' : 'hsl(150 30% 70%)';

  return (
    <g id="floor-plan">
      {/* Background */}
      <rect width="420" height="650" rx="12" fill={bgFill} />

      {/* Drop shadow for terminal building */}
      <defs>
        <filter id="buildingShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={shadowColor} />
        </filter>
        {/* Security hatched pattern */}
        <pattern id="securityHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={lineColor} strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Terminal 3 — outer shell */}
      <rect
        x="50" y="330" width="320" height="170" rx="20"
        fill={buildingFill}
        filter="url(#buildingShadow)"
      />

      {/* Interior corridor lines */}
      <line x1="70" y1="380" x2="350" y2="380" stroke={lineColor} strokeWidth="1" />
      <line x1="70" y1="430" x2="350" y2="430" stroke={lineColor} strokeWidth="1" />
      <line x1="210" y1="340" x2="210" y2="490" stroke={lineColor} strokeWidth="0.5" opacity="0.5" />

      {/* Room outlines — check-in counters */}
      <rect x="140" y="440" width="140" height="50" rx="6" fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="4 3" />
      {/* Shop block */}
      <rect x="280" y="340" width="70" height="55" rx="6" fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="4 3" />

      {/* Pier A — left wing */}
      <path
        d="M 165 330 Q 155 270 140 200 Q 120 120 90 40 L 60 40 Q 85 120 100 200 Q 115 270 120 330 Z"
        fill={buildingFill}
        filter="url(#buildingShadow)"
      />
      {/* Pier A — right wing */}
      <path
        d="M 165 330 Q 175 270 190 200 Q 210 120 280 40 L 310 40 Q 230 120 215 200 Q 200 270 195 330 Z"
        fill={buildingFill}
        filter="url(#buildingShadow)"
      />

      {/* Central spine corridor */}
      <line x1="157" y1="320" x2="145" y2="50" stroke={lineColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="180" y1="320" x2="220" y2="50" stroke={lineColor} strokeWidth="0.8" opacity="0.4" />

      {/* Gate alcoves — left wing */}
      {[80, 110, 140, 170].map((y) => (
        <rect key={`alcove-l-${y}`} x={68 + (200 - y) * 0.15} y={y} width="20" height="12" rx="3"
          fill="none" stroke={lineColor} strokeWidth="0.8" opacity="0.5" />
      ))}
      {/* Gate alcoves — right wing */}
      {[80, 110, 140, 170].map((y) => (
        <rect key={`alcove-r-${y}`} x={240 + (200 - y) * 0.25} y={y} width="20" height="12" rx="3"
          fill="none" stroke={lineColor} strokeWidth="0.8" opacity="0.5" />
      ))}

      {/* Color-coded zone fills */}
      {ZONES.map(zone => (
        <path
          key={zone.id}
          d={zone.path}
          fill={getZoneFill(zone)}
          opacity="0.6"
        />
      ))}

      {/* Security hatched overlay */}
      <path
        d="M 60 295 Q 60 285 70 285 L 350 285 Q 360 285 360 295 L 360 325 Q 360 335 350 335 L 70 335 Q 60 335 60 325 Z"
        fill="url(#securityHatch)"
        opacity="0.3"
      />

      {/* Quiet zone dotted border */}
      <rect x="55" y="100" width="60" height="70" rx="8"
        fill="none" stroke={quietBorder} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Walkway corridor hints */}
      <rect x="185" y="500" width="50" height="72" rx="6" fill={corridorFill} opacity="0.6" />
      <rect x="145" y="330" width="130" height="25" rx="6" fill={corridorFill} opacity="0.4" />

      {/* Labels */}
      <text x="210" y="508" textAnchor="middle" fontSize="10" fill={textColor} fontWeight="600" letterSpacing="3">
        TERMINAL 3
      </text>
      <text x="157" y="35" textAnchor="middle" fontSize="9" fill={textColor} fontWeight="600" letterSpacing="2">
        PIER A
      </text>
      <text x="210" y="318" textAnchor="middle" fontSize="10" fill={textColorStrong} fontWeight="600">
        🛡️ Security
      </text>
      <text x="210" y="598" textAnchor="middle" fontSize="10" fill={textColorStrong} fontWeight="600">
        ENTRANCE
      </text>
    </g>
  );
};

export default AirportFloorPlan;
