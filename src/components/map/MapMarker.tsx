import { useEffect, useRef, useState, useCallback } from 'react';
import type { MapLocation } from './mapData';

interface MapMarkerProps {
  location: MapLocation;
  state: 'completed' | 'active' | 'locked';
  justCompleted: boolean;
  isExpanded: boolean;
  onTap: (id: string) => void;
  walkMinutes?: number;
  reduceMotion: boolean;
  largeTapTargets: boolean;
  darkMode: boolean;
}

const CROWD_COLORS: Record<string, string> = {
  low: 'hsl(152 50% 50%)',
  medium: 'hsl(40 80% 55%)',
  high: 'hsl(0 65% 55%)',
};

const CROWD_LABELS: Record<string, string> = {
  low: 'Quiet',
  medium: 'Moderate',
  high: 'Busy',
};

const SPARKLE_COUNT = 8;

const MapMarker = ({
  location,
  state,
  justCompleted,
  isExpanded,
  onTap,
  walkMinutes,
  reduceMotion,
  largeTapTargets,
  darkMode,
}: MapMarkerProps) => {
  const [sparkles, setSparkles] = useState<{ angle: number; delay: number; size: number }[]>([]);
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>();

  // Auto-collapse after 4 seconds
  useEffect(() => {
    if (isExpanded) {
      collapseTimer.current = setTimeout(() => onTap(''), 4000);
      return () => clearTimeout(collapseTimer.current);
    }
  }, [isExpanded, onTap]);

  // Sparkle burst on completion
  useEffect(() => {
    if (justCompleted && !reduceMotion) {
      const s = Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        angle: (360 / SPARKLE_COUNT) * i + Math.random() * 20,
        delay: Math.random() * 150,
        size: 3 + Math.random() * 3,
      }));
      setSparkles(s);
      const t = setTimeout(() => setSparkles([]), 900);
      return () => clearTimeout(t);
    }
  }, [justCompleted, reduceMotion]);

  const handleTap = useCallback(() => {
    onTap(isExpanded ? '' : location.id);
  }, [onTap, isExpanded, location.id]);

  const isLandmark = location.category === 'landmark';

  // ── Landmark marker (smaller, muted) ──
  if (isLandmark) {
    return (
      <g
        style={{ cursor: 'pointer' }}
        onClick={handleTap}
        opacity={0.65}
      >
        <circle
          cx={location.x}
          cy={location.y}
          r={largeTapTargets ? 20 : 14}
          fill="transparent"
        />
        <text
          x={location.x - 7}
          y={location.y + 5}
          fontSize="12"
        >
          {location.emoji}
        </text>
        <text
          x={location.x + 10}
          y={location.y + 4}
          fontSize="9"
          fill={darkMode ? 'hsl(220 10% 55%)' : 'hsl(220 10% 50%)'}
          fontWeight="400"
        >
          {location.label}
        </text>
        {isExpanded && location.crowdLevel && (
          <g>
            <rect
              x={location.x - 35}
              y={location.y + 10}
              width="70"
              height="20"
              rx="6"
              fill={darkMode ? 'hsl(220 15% 20%)' : 'white'}
              stroke={darkMode ? 'hsl(220 12% 30%)' : 'hsl(220 12% 85%)'}
              strokeWidth="1"
            />
            <circle
              cx={location.x - 20}
              cy={location.y + 20}
              r="3"
              fill={CROWD_COLORS[location.crowdLevel]}
            />
            <text
              x={location.x - 10}
              y={location.y + 24}
              fontSize="8"
              fill={darkMode ? 'hsl(220 10% 65%)' : 'hsl(220 10% 40%)'}
            >
              {CROWD_LABELS[location.crowdLevel]}
            </text>
          </g>
        )}
      </g>
    );
  }

  // ── Checkpoint marker ──
  const pillW = isExpanded ? 130 : 92;
  const pillH = isExpanded ? 60 : 36;
  const hitRadius = largeTapTargets ? 32 : 24;

  const bgFill = state === 'completed'
    ? (darkMode ? 'hsl(152 30% 18%)' : 'hsl(152 45% 95%)')
    : state === 'active'
    ? (darkMode ? 'hsl(152 30% 16%)' : 'hsl(152 45% 93%)')
    : (darkMode ? 'hsl(220 12% 18%)' : 'hsl(0 0% 100%)');

  const borderColor = state === 'completed'
    ? 'hsl(152 45% 65%)'
    : state === 'active'
    ? 'hsl(152 50% 55%)'
    : (darkMode ? 'hsl(220 12% 30%)' : 'hsl(220 12% 88%)');

  const textFill = state === 'completed'
    ? (darkMode ? 'hsl(152 40% 70%)' : 'hsl(152 40% 30%)')
    : state === 'active'
    ? (darkMode ? 'hsl(152 45% 75%)' : 'hsl(152 45% 25%)')
    : (darkMode ? 'hsl(220 15% 65%)' : 'hsl(220 15% 35%)');

  return (
    <g style={{ cursor: 'pointer' }} onClick={handleTap}>
      {/* Hit area */}
      <circle cx={location.x} cy={location.y} r={hitRadius} fill="transparent" />

      {/* Active pulse ring */}
      {state === 'active' && (
        <circle
          cx={location.x}
          cy={location.y}
          r="30"
          fill="hsl(152 50% 50%)"
          opacity="0.1"
          className={reduceMotion ? '' : 'animate-pulse'}
        />
      )}

      {/* Pill background */}
      <rect
        x={location.x - pillW / 2}
        y={location.y - pillH / 2}
        width={pillW}
        height={pillH}
        rx="18"
        fill={bgFill}
        stroke={borderColor}
        strokeWidth={state === 'active' ? 2 : 1.5}
        className={justCompleted && !reduceMotion ? 'marker-expand-anim' : ''}
      />

      {/* Emoji */}
      <text
        x={location.x - 18}
        y={location.y + 6}
        textAnchor="middle"
        fontSize="16"
      >
        {location.emoji}
      </text>

      {/* Label */}
      <text
        x={location.x + 12}
        y={location.y + (isExpanded ? -2 : 5)}
        textAnchor="middle"
        fontSize="13"
        fill={textFill}
        fontWeight={state === 'active' ? '700' : '500'}
      >
        {location.label}
      </text>

      {/* Completed checkmark */}
      {state === 'completed' && (
        <text
          x={location.x + pillW / 2 - 6}
          y={location.y - pillH / 2 + 4}
          fontSize="13"
        >
          ✅
        </text>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <g>
          {/* Description */}
          {location.description && (
            <text
              x={location.x}
              y={location.y + 12}
              textAnchor="middle"
              fontSize="9"
              fill={darkMode ? 'hsl(220 10% 55%)' : 'hsl(220 10% 50%)'}
            >
              {location.description}
            </text>
          )}

          {/* Crowd level + walk time row */}
          <g>
            {location.crowdLevel && (
              <>
                <circle
                  cx={location.x - 30}
                  cy={location.y + 23}
                  r="3"
                  fill={CROWD_COLORS[location.crowdLevel]}
                />
                <text
                  x={location.x - 22}
                  y={location.y + 26}
                  fontSize="8"
                  fill={darkMode ? 'hsl(220 10% 60%)' : 'hsl(220 10% 45%)'}
                >
                  {CROWD_LABELS[location.crowdLevel]}
                </text>
              </>
            )}
            {walkMinutes !== undefined && walkMinutes > 0 && (
              <text
                x={location.x + 20}
                y={location.y + 26}
                fontSize="8"
                fill={darkMode ? 'hsl(205 50% 60%)' : 'hsl(205 60% 45%)'}
              >
                ~{walkMinutes} min walk
              </text>
            )}
          </g>
        </g>
      )}

      {/* Sparkle celebration */}
      {sparkles.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const dist = 28 + Math.random() * 12;
        return (
          <circle
            key={i}
            cx={location.x + Math.cos(rad) * dist}
            cy={location.y + Math.sin(rad) * dist}
            r={s.size}
            fill="hsl(45 100% 60%)"
            opacity="0"
            style={{
              animation: reduceMotion
                ? 'none'
                : `sparkle-burst 0.7s ${s.delay}ms ease-out forwards`,
            }}
          />
        );
      })}
    </g>
  );
};

export default MapMarker;
