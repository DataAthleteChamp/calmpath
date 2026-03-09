import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Check, Lock, ChevronRight, Clock } from 'lucide-react';
import { t } from '@/lib/i18n';

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🎊', '🏆', '💫', '🎈', '🌟', '🥳', '🎆'];

function boardingBadgeColor(min: number) {
  if (min > 30) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
  if (min > 15) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
}

const TripsTab = () => {
  const { checkpoints, currentCheckpointIndex, journeyStarted, setJourneyStarted, setActiveTab, gateChanged, accessibility, flightInfo, boardingMinutes, language } = useApp();
  const { reduceMotion } = accessibility;

  const handleStartNavigation = () => {
    setJourneyStarted(true);
    setActiveTab('map');
  };

  return (
    <div className="px-6 py-6 animate-fade-in-up">
      {/* Flight Card */}
      <Card className="mb-6 border-0 shadow-md bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{flightInfo.airline} {flightInfo.flightNumber} → {flightInfo.destination}</p>
              <p className="text-sm text-muted-foreground">
                Gate {flightInfo.gate} · Terminal {flightInfo.terminal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${boardingBadgeColor(boardingMinutes)}`}>
              <Clock className="h-3 w-3" />
              {t('trips.boarding', language)} {boardingMinutes} {t('trips.min', language)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <h3 className="font-semibold text-foreground mb-4">{t('trips.journey', language)}</h3>
      <div className="space-y-2 mb-8">
        {checkpoints.map((cp, i) => (
          <div
            key={cp.id}
            className={`flex items-center gap-3 rounded-2xl p-4 transition-all ${
              cp.status === 'completed'
                ? 'bg-success/5 border border-success/20'
                : cp.status === 'active'
                ? 'bg-primary/5 border-2 border-primary/30 shadow-sm'
                : 'bg-muted/50 border border-transparent opacity-60'
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              cp.status === 'completed'
                ? 'bg-success/10'
                : cp.status === 'active'
                ? 'bg-primary/10'
                : 'bg-muted'
            }`}>
              {cp.status === 'completed' ? (
                <Check className="h-5 w-5 text-success" />
              ) : cp.status === 'active' ? (
                <span className="text-xl">{cp.emoji}</span>
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${cp.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
                {cp.name}
              </p>
              <p className="text-xs text-muted-foreground">{cp.description}</p>
            </div>
            {cp.status === 'active' && (
              <ChevronRight className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>

      {/* Action Button */}
      {currentCheckpointIndex < checkpoints.length && (
        <Button
          size="lg"
          className="w-full rounded-2xl py-7 text-base font-semibold shadow-md shadow-primary/20"
          onClick={handleStartNavigation}
        >
          {journeyStarted ? t('trips.continue', language) : t('trips.start', language)}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {currentCheckpointIndex >= checkpoints.length && (
        <div className="text-center py-8 relative overflow-hidden">
          {/* Confetti celebration */}
          {!reduceMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {CONFETTI_EMOJIS.map((emoji, i) => (
                <span
                  key={i}
                  className="absolute text-xl confetti-anim"
                  style={{
                    left: `${5 + i * 10}%`,
                    top: '30%',
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
          <span className="text-5xl mb-4 block">🎉</span>
          <h3 className="text-xl font-bold text-foreground mb-2">{t('trips.complete.title', language)}</h3>
          <p className="text-muted-foreground mb-1">{t('trips.complete.subtitle', language)}</p>
          <p className="text-sm text-primary font-medium">{t('trips.complete.bonus', language)}</p>
        </div>
      )}
    </div>
  );
};

export default TripsTab;
