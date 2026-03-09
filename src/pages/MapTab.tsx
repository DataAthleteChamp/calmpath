import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useReadAloud } from '@/hooks/useReadAloud';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Volume2, Camera, MapPin, HelpCircle, Check, Eye, ZoomIn, ZoomOut, Locate, Clock } from 'lucide-react';
import CphAirportMap from '@/components/CphAirportMap';
import { useMapGestures } from '@/components/map/useMapGestures';
import { WALK_TIMES } from '@/components/map/mapData';
import { t } from '@/lib/i18n';

const VISUAL_HINTS: Record<string, string> = {
  entrance: '🔍 Look for the large glass doors with "Terminal 3" sign above',
  checkin: '🔍 Look for the blue Check-in counters on your right',
  bathroom: '🔍 Look for the WC sign on the left wall, past the info desk',
  security: '🔍 Follow the overhead signs to the security lanes ahead',
  snack: '🔍 The cafe is right after security — look for the Starbucks logo',
  gate: '🔍 Follow signs along Pier A — your gate is on the left side',
};

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🎊', '🏆', '💫', '🎈', '🌟'];

function boardingCountdownColor(min: number) {
  if (min > 30) return 'text-green-700 bg-green-50 dark:bg-green-900/40 dark:text-green-300';
  if (min > 15) return 'text-amber-700 bg-amber-50 dark:bg-amber-900/40 dark:text-amber-300';
  return 'text-red-700 bg-red-50 dark:bg-red-900/40 dark:text-red-300';
}

const MapTab = () => {
  const navigate = useNavigate();
  const { checkpoints, currentCheckpointIndex, completeCheckpoint, journeyStarted, setJourneyStarted, accessibility, boardingMinutes, language } = useApp();
  const { viewBox, handlers, zoomIn, zoomOut, recenter, focusOnPoint } = useMapGestures();
  const { speak } = useReadAloud();
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

  // Auto-speak on checkpoint change
  useEffect(() => {
    if (currentCheckpointIndex > prevCheckpointRef.current) {
      setShowXP(true);
      const t = setTimeout(() => setShowXP(false), 1300);
      prevCheckpointRef.current = currentCheckpointIndex;

      // Speak new checkpoint + visual hint
      const cp = checkpoints[currentCheckpointIndex];
      if (cp) {
        const hKey = cp.id === 'gate' ? 'gate' : cp.id;
        const hint = hKey ? VISUAL_HINTS[hKey] : '';
        speak(`Next stop: ${cp.name}. ${hint}`);
      }

      return () => clearTimeout(t);
    }
    prevCheckpointRef.current = currentCheckpointIndex;
  }, [currentCheckpointIndex, checkpoints, speak]);

  // Voice button handler
  const handleVoice = () => {
    if (visualHint) {
      speak(visualHint);
    }
  };

  if (!journeyStarted && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center animate-fade-in-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-foreground">{t('map.ready', language)}</h2>
        <p className="text-muted-foreground mb-6">{t('map.readyHint', language)}</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center animate-fade-in-up relative overflow-hidden">
        {/* Confetti celebration */}
        {!reduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_EMOJIS.map((emoji, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${8 + i * 12}%`,
                  top: '40%',
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
        <span className="text-7xl mb-6">✈️</span>
        <h2 className="text-2xl font-bold mb-2 text-foreground">{t('map.complete.title', language)}</h2>
        <p className="text-muted-foreground">{t('map.complete.subtitle', language)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in-up">
      {/* Top: Current Objective + Boarding Countdown */}
      <div className="px-5 py-3 bg-card border-b">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">{t('map.nextStop', language)}</p>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${boardingCountdownColor(boardingMinutes)}`}>
            <Clock className="h-2.5 w-2.5" />
            {t('map.boarding', language)} {boardingMinutes} {t('header.min', language)}
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">{currentCp?.emoji}</span>
          {currentCp?.name}
          {walkTime > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ~{walkTime} {t('map.walk', language)}
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
          <button
            onClick={handleVoice}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Volume2 className="h-4 w-4" />
            <span className="text-[10px] font-medium">{t('map.voice', language)}</span>
          </button>
          <button className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors">
            <Camera className="h-4 w-4" />
            <span className="text-[10px] font-medium">{t('map.camera', language)}</span>
          </button>
          <button
            onClick={() => navigate('/quiet-place')}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] font-medium">{t('map.quiet', language)}</span>
          </button>
          <button
            onClick={() => navigate('/support-card')}
            className="flex-1 flex flex-col items-center gap-1 rounded-xl bg-muted p-2.5 text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-[10px] font-medium">{t('map.support', language)}</span>
          </button>
        </div>

        <Button
          size="lg"
          className="w-full rounded-2xl py-6 text-base font-semibold"
          onClick={completeCheckpoint}
        >
          <Check className="mr-2 h-4 w-4" />
          {t('map.mark', language)} "{currentCp?.name}" {t('map.markComplete', language)}
        </Button>
      </div>
    </div>
  );
};

export default MapTab;
