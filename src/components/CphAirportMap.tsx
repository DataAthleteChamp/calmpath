import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATARS } from '@/context/AppContext';
import AirportFloorPlan from './map/AirportFloorPlan';
import MapMarker from './map/MapMarker';
import AnimatedAvatar from './map/AnimatedAvatar';
import {
  LOCATIONS,
  LANDMARKS,
  ROUTE_POINTS,
  CHECKPOINT_ROUTE_MAP,
  CHECKPOINT_ROUTE_MAP_CHANGED,
  CHECKPOINT_IDS,
  CHECKPOINT_IDS_CHANGED,
  WALK_TIMES,
  buildSmoothPath,
} from './map/mapData';
import type { MapGestureHandlers } from './map/useMapGestures';

interface CphAirportMapProps {
  viewBox?: string;
  gestureHandlers?: MapGestureHandlers;
  focusOnPoint?: (x: number, y: number, zoom?: number) => void;
}

const CphAirportMap = ({ viewBox, gestureHandlers, focusOnPoint }: CphAirportMapProps) => {
  const { currentCheckpointIndex, gateChanged, avatar, accessibility } = useApp();
  const avatarEmoji = AVATARS.find(a => a.id === avatar)?.emoji || '📍';
  const { darkMode, highContrast, reduceMotion, largeTapTargets } = accessibility;

  const [expandedMarkerId, setExpandedMarkerId] = useState<string>('');
  const prevCheckpointRef = useRef(currentCheckpointIndex);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Detect checkpoint completion for sparkle effect
  useEffect(() => {
    const prev = prevCheckpointRef.current;
    prevCheckpointRef.current = currentCheckpointIndex;

    if (currentCheckpointIndex > prev) {
      const ids = gateChanged ? CHECKPOINT_IDS_CHANGED : CHECKPOINT_IDS;
      const completedId = ids[prev];
      if (completedId) {
        setJustCompletedId(completedId);
        const t = setTimeout(() => setJustCompletedId(null), 1000);
        return () => clearTimeout(t);
      }
    }
  }, [currentCheckpointIndex, gateChanged]);

  // Route segments
  const routeMap = gateChanged ? CHECKPOINT_ROUTE_MAP_CHANGED : CHECKPOINT_ROUTE_MAP;
  const activeRouteEnd = routeMap[Math.min(currentCheckpointIndex, 5)] ?? 0;
  const completedRouteEnd = currentCheckpointIndex > 0
    ? (routeMap[currentCheckpointIndex - 1] ?? -1)
    : -1;

  const completedPoints = ROUTE_POINTS.slice(0, completedRouteEnd + 1);
  const activePoints = ROUTE_POINTS.slice(Math.max(0, completedRouteEnd), activeRouteEnd + 1);
  const futurePoints = ROUTE_POINTS.slice(activeRouteEnd);

  const destIds = gateChanged ? CHECKPOINT_IDS_CHANGED : CHECKPOINT_IDS;
  const destId = destIds[Math.min(currentCheckpointIndex, 5)];

  const handleMarkerTap = useCallback((id: string) => {
    setExpandedMarkerId(id);
  }, []);

  const handleAvatarPositionChange = useCallback((pos: { x: number; y: number }) => {
    focusOnPoint?.(pos.x, pos.y, 1.5);
  }, [focusOnPoint]);

  // Determine which locations to show
  const visibleLocations = LOCATIONS.filter(loc => {
    if (loc.id === 'gateA12' && gateChanged) return false;
    if (loc.id === 'gateA18' && !gateChanged) return false;
    return true;
  });

  return (
    <svg
      viewBox={viewBox || '0 0 420 650'}
      className="w-full h-full touch-none"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Airport navigation map showing your route through Copenhagen Airport Terminal 3"
      {...gestureHandlers}
    >
      <title>Copenhagen Airport Terminal 3 Map</title>
      <desc>Interactive map showing checkpoints, route, and your current position in the airport</desc>

      <defs>
        {/* Route glow filter */}
        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Completed route gradient */}
        <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(152 55% 55%)" />
          <stop offset="100%" stopColor="hsl(152 45% 45%)" />
        </linearGradient>
      </defs>

      {/* Layer 1: Floor plan */}
      <AirportFloorPlan highContrast={highContrast} darkMode={darkMode} />

      {/* Layer 2: Route paths */}
      <g id="routes">
        {/* Future route — very faint dotted */}
        {futurePoints.length > 1 && (
          <path
            d={buildSmoothPath(futurePoints)}
            fill="none"
            stroke={darkMode ? 'hsl(220 12% 35%)' : 'hsl(220 12% 82%)'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 8"
            opacity="0.5"
          />
        )}

        {/* Active route — glow underneath */}
        {activePoints.length > 1 && (
          <path
            d={buildSmoothPath(activePoints)}
            fill="none"
            stroke="hsl(205 65% 55%)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.15"
            filter="url(#routeGlow)"
          />
        )}

        {/* Active route — animated dashed line */}
        {activePoints.length > 1 && (
          <path
            d={buildSmoothPath(activePoints)}
            fill="none"
            stroke="hsl(205 65% 55%)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 6"
            opacity="0.9"
            className={reduceMotion ? '' : 'dash-flow-anim'}
          />
        )}

        {/* Completed route — solid green with gradient */}
        {completedPoints.length > 1 && (
          <path
            d={buildSmoothPath(completedPoints)}
            fill="none"
            stroke="url(#completedGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}

        {/* Distance marker on active segment */}
        {activePoints.length > 1 && currentCheckpointIndex < WALK_TIMES.length && WALK_TIMES[currentCheckpointIndex] > 0 && (
          <g>
            {(() => {
              const mid = activePoints[Math.floor(activePoints.length / 2)];
              if (!mid) return null;
              return (
                <>
                  <rect
                    x={mid.x + 12}
                    y={mid.y - 8}
                    width="42"
                    height="16"
                    rx="8"
                    fill={darkMode ? 'hsl(215 20% 18%)' : 'white'}
                    stroke={darkMode ? 'hsl(215 15% 30%)' : 'hsl(220 12% 85%)'}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x={mid.x + 33}
                    y={mid.y + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fill={darkMode ? 'hsl(205 50% 60%)' : 'hsl(205 60% 45%)'}
                    fontWeight="600"
                  >
                    ~{WALK_TIMES[currentCheckpointIndex]}m
                  </text>
                </>
              );
            })()}
          </g>
        )}
      </g>

      {/* Layer 3: Landmark markers */}
      {LANDMARKS.map(lm => (
        <MapMarker
          key={lm.id}
          location={lm}
          state="locked"
          justCompleted={false}
          isExpanded={expandedMarkerId === lm.id}
          onTap={handleMarkerTap}
          reduceMotion={reduceMotion}
          largeTapTargets={largeTapTargets}
          darkMode={darkMode}
        />
      ))}

      {/* Layer 3: Checkpoint markers */}
      {visibleLocations.map((loc) => {
        const cpIdx = CHECKPOINT_IDS.indexOf(loc.id);
        const cpIdxChanged = CHECKPOINT_IDS_CHANGED.indexOf(loc.id);
        const idx = gateChanged ? cpIdxChanged : cpIdx;

        let state: 'completed' | 'active' | 'locked' = 'locked';
        if (idx >= 0 && idx < currentCheckpointIndex) state = 'completed';
        else if (loc.id === destId) state = 'active';

        return (
          <MapMarker
            key={loc.id}
            location={loc}
            state={state}
            justCompleted={justCompletedId === loc.id}
            isExpanded={expandedMarkerId === loc.id}
            onTap={handleMarkerTap}
            walkMinutes={idx >= 0 ? WALK_TIMES[idx] : undefined}
            reduceMotion={reduceMotion}
            largeTapTargets={largeTapTargets}
            darkMode={darkMode}
          />
        );
      })}

      {/* Layer 4: Animated avatar */}
      <AnimatedAvatar
        currentCheckpointIndex={currentCheckpointIndex}
        gateChanged={gateChanged}
        avatarEmoji={avatarEmoji}
        reduceMotion={reduceMotion}
        onPositionChange={handleAvatarPositionChange}
      />
    </svg>
  );
};

export default CphAirportMap;
