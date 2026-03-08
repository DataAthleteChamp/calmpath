import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Volume2, Camera, MapPin, HelpCircle, Check, Eye, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import CphAirportMap from '@/components/CphAirportMap';
import { useMapGestures } from '@/components/map/useMapGestures';
import { WALK_TIMES } from '@/components/map/mapData';

const VISUAL_HINTS: Record<string, string> = {
  entrance: '🔍 Look for the large glass doors with "Terminal 3" sign above',
  checkin: '🔍 Look for the blue Check-in counters on your right',
  bathroom: '🔍 Look for the WC sign on the left wall, past the info desk',
  security: '🔍 Follow the overhead signs to the security lanes ahead',
  snack: '🔍 The café is right after security — look for the Starbucks logo',
  gate: '🔍 Follow signs along Pier A — your gate is on the left side',
};

const MapTab = () => {
  const navigate = useNavigate();
  const { checkpoints, currentCheckpointIndex, completeCheckpoint, journeyStarted, setJourneyStarted, accessibility } = useApp();
  const { viewBox, handlers, zoomIn, zoomOut, recenter, focusOnPoint } = useMapGestures();
  const { reduceMotion } = accessibility;

  const currentCp = checkpoints[currentCheckpointIndex];
  const isComplete = currentCheckpointIndex >= checkpoints.length;

  const hintKey = currentCp?.id === 'gate' ? 'gate' : currentCp?.id;
  const visualHint = hintKey ? VISUAL_HINTS[hintKey] : '';

  // Walk time ETA
  const walkTime = currentCheckpointIndex < WALK_TIMES.length ? WALK_TIMES[currentCheckpointIndex] : 0;

  // XP celebration float-up
  const [showXP, setShowXP] = useState(false);
  const prevCheckpointRef = useRef(currentCheckpointIndex);

  useEffect(() => {
    if (currentCheckpointIndex > prevCheckpointRef.current) {
      setShowXP(true);
      const t = setTimeout(() => setShowXP(false), 1300);
      prevCheckpointRef.current = currentCheckpointIndex;
      return () => clearTimeout(t);
    }
    prevCheckpointRef.current = currentCheckpointIndex;
  }, [currentCheckpointIndex]);

  if (!journeyStarted && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center animate-fade-in-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-foreground">Ready to navigate?</h2>
        <p className="text-muted-foreground mb-6">Go to the Trips tab to start your journey</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center animate-fade-in-up">
        <span className="text-7xl mb-6">✈️</span>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Destination reached!</h2>
        <p className="text-muted-foreground">You're at your gate. Have a calm flight!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Top: Current Objective */}
      <div className="px-5 py-3 bg-card border-b">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-0.5">Next stop</p>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">{currentCp?.emoji}</span>
          {currentCp?.name}
          {walkTime > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ~{walkTime} min walk
            </span>
          )}
        </h2>
        {visualHint && (
          <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 text-muted-foreground text-xs">
            <Eye className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{visualHint}</span>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-2.5 bg-card/50">
        {checkpoints.map((cp) => (
          <div
            key={cp.id}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              cp.status === 'completed'
                ? 'bg-success'
                : cp.status === 'active'
                ? 'bg-primary w-6 rounded-lg'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Map — large with floating controls */}
      <div className="flex-1 relative min-h-[55vh]">
        <CphAirportMap
          viewBox={viewBox}
          gestureHandlers={handlers}
          focusOnPoint={focusOnPoint}
        />

        {/* Floating zoom controls — bottom-right */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={zoomOut}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={recenter}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Re-center map"
          >
            <Locate className="h-4 w-4" />
          </button>
        </div>

        {/* +25 XP celebration */}
        {showXP && (
          <div
            className={`absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none ${
              reduceMotion ? 'opacity-0' : 'float-xp-anim'
            }`}
          >
            <span className="text-2xl font-bold text-primary drop-shadow-lg">
              +25 XP ✨
            </span>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-5 py-3 bg-card border-t space-y-2.5">
        <div className="flex gap-2">
          <button className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors">
            <Volume2 className="h-4 w-4" />
            <span className="text-[10px] font-medium">Voice</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors">
            <Camera className="h-4 w-4" />
            <span className="text-[10px] font-medium">Camera</span>
          </button>
          <button
            onClick={() => navigate('/quiet-place')}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] font-medium">Quiet</span>
          </button>
          <button
            onClick={() => navigate('/support-card')}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-[10px] font-medium">Support</span>
          </button>
        </div>

        <Button
          size="lg"
          className="w-full rounded-2xl py-6 text-base font-semibold"
          onClick={completeCheckpoint}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark "{currentCp?.name}" complete
        </Button>
      </div>
    </div>
  );
};

export default MapTab;
