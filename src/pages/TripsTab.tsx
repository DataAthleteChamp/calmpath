import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Check, Lock, ChevronRight, MapPin } from 'lucide-react';

const TripsTab = () => {
  const { checkpoints, currentCheckpointIndex, journeyStarted, setJourneyStarted, setActiveTab, gateChanged } = useApp();

  const handleStartNavigation = () => {
    setJourneyStarted(true);
    setActiveTab('map');
  };

  return (
    <div className="px-6 py-6 animate-fade-in-up">
      {/* Trip Header */}
      <Card className="mb-6 border-0 shadow-md bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">Copenhagen Airport</p>
              <p className="text-sm text-muted-foreground">
                {gateChanged ? 'Gate A18' : 'Gate A12'} · Terminal 3
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>CPH · Kastrup</span>
          </div>
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <h3 className="font-semibold text-foreground mb-4">Your journey</h3>
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
          {journeyStarted ? 'Continue Navigation' : 'Start Navigation'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {currentCheckpointIndex >= checkpoints.length && (
        <div className="text-center py-8">
          <span className="text-5xl mb-4 block">🎉</span>
          <h3 className="text-xl font-bold text-foreground mb-2">Journey complete!</h3>
          <p className="text-muted-foreground">You made it. Well done!</p>
        </div>
      )}
    </div>
  );
};

export default TripsTab;
