import { useEffect, useRef, useState } from 'react';
import { getPointOnPath, ROUTE_POINTS, CHECKPOINT_ROUTE_MAP, CHECKPOINT_ROUTE_MAP_CHANGED } from './mapData';
import type { MapPoint } from './mapData';

interface AnimatedAvatarProps {
  currentCheckpointIndex: number;
  gateChanged: boolean;
  avatarEmoji: string;
  reduceMotion: boolean;
  onPositionChange?: (pos: MapPoint) => void;
}

const ANIMATION_DURATION = 1500; // ms per segment

const AnimatedAvatar = ({
  currentCheckpointIndex,
  gateChanged,
  avatarEmoji,
  reduceMotion,
  onPositionChange,
}: AnimatedAvatarProps) => {
  const prevIndexRef = useRef(currentCheckpointIndex);
  const rafRef = useRef<number>(0);
  const [pos, setPos] = useState<MapPoint>(() => {
    const map = gateChanged ? CHECKPOINT_ROUTE_MAP_CHANGED : CHECKPOINT_ROUTE_MAP;
    const rpIdx = map[Math.min(currentCheckpointIndex, map.length - 1)] ?? 0;
    return ROUTE_POINTS[rpIdx] ?? { x: 210, y: 590 };
  });
  const [isMoving, setIsMoving] = useState(false);
  const [bounceOffset, setBounceOffset] = useState(0);

  useEffect(() => {
    const prevIdx = prevIndexRef.current;
    prevIndexRef.current = currentCheckpointIndex;

    if (prevIdx === currentCheckpointIndex) return;

    const map = gateChanged ? CHECKPOINT_ROUTE_MAP_CHANGED : CHECKPOINT_ROUTE_MAP;
    const fromRP = map[Math.min(prevIdx, map.length - 1)] ?? 0;
    const toRP = map[Math.min(currentCheckpointIndex, map.length - 1)] ?? 0;

    // Build the sub-path to animate along
    const start = Math.min(fromRP, toRP);
    const end = Math.max(fromRP, toRP);
    const pathPoints = ROUTE_POINTS.slice(start, end + 1);
    if (fromRP > toRP) pathPoints.reverse();

    if (pathPoints.length < 2) {
      const target = ROUTE_POINTS[toRP] ?? { x: 210, y: 590 };
      setPos(target);
      onPositionChange?.(target);
      return;
    }

    if (reduceMotion) {
      const target = pathPoints[pathPoints.length - 1];
      setPos(target);
      onPositionChange?.(target);
      return;
    }

    // Animate
    setIsMoving(true);
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / ANIMATION_DURATION);
      // Ease-in-out
      const eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const point = getPointOnPath(pathPoints, eased);

      // Walking bounce
      const bounce = Math.sin(t * Math.PI * 6) * 2 * (1 - t);
      setBounceOffset(bounce);

      setPos(point);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        setBounceOffset(0);
        onPositionChange?.(point);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    // Trigger camera follow slightly after avatar starts moving
    setTimeout(() => {
      const midT = 0.5;
      const midPoint = getPointOnPath(pathPoints, midT);
      onPositionChange?.(midPoint);
    }, 300);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentCheckpointIndex, gateChanged, reduceMotion, onPositionChange]);

  const displayY = pos.y + (reduceMotion ? 0 : bounceOffset);

  // Direction chevron: compute angle from movement
  const [angle, setAngle] = useState(0);
  const prevPosRef = useRef(pos);
  useEffect(() => {
    if (isMoving) {
      const dx = pos.x - prevPosRef.current.x;
      const dy = pos.y - prevPosRef.current.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        setAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 90);
      }
    }
    prevPosRef.current = pos;
  }, [pos, isMoving]);

  return (
    <g>
      {/* Shadow ellipse */}
      <ellipse
        cx={pos.x}
        cy={pos.y + 14}
        rx="12"
        ry="4"
        fill="rgba(0,0,0,0.12)"
      />

      {/* Pulse ring */}
      <circle
        cx={pos.x}
        cy={displayY}
        r="26"
        fill="hsl(205 65% 55%)"
        opacity="0.15"
        className={reduceMotion ? '' : 'animate-pulse'}
      />

      {/* White circle with blue border */}
      <circle
        cx={pos.x}
        cy={displayY}
        r="20"
        fill="hsl(0 0% 100%)"
        stroke="hsl(205 65% 55%)"
        strokeWidth="3"
      />

      {/* Avatar emoji */}
      <text
        x={pos.x}
        y={displayY + 7}
        textAnchor="middle"
        fontSize="18"
      >
        {avatarEmoji}
      </text>

      {/* Direction chevron during movement */}
      {isMoving && (
        <g transform={`translate(${pos.x}, ${displayY - 24}) rotate(${angle}, 0, 0)`}>
          <polygon
            points="0,-6 -4,0 4,0"
            fill="hsl(205 65% 55%)"
            opacity="0.8"
          />
        </g>
      )}
    </g>
  );
};

export default AnimatedAvatar;
