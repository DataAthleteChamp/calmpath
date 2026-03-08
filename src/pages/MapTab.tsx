import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Volume2, Camera, MapPin, HelpCircle, Check } from 'lucide-react';
import CphAirportMap from '@/components/CphAirportMap';

const MapTab = () => {
  const navigate = useNavigate();
  const { checkpoints, currentCheckpointIndex, completeCheckpoint, journeyStarted, setJourneyStarted } = useApp();
  
  const currentCp = checkpoints[currentCheckpointIndex];
  const isComplete = currentCheckpointIndex >= checkpoints.length;

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
      <div className="px-5 py-4 bg-card border-b">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Next stop</p>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">{currentCp?.emoji}</span>
          {currentCp?.name}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{currentCp?.description}</p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-3 bg-card/50">
        {checkpoints.map((cp, i) => (
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

      {/* Map */}
      <div className="flex-1 relative">
        <CphAirportMap />
      </div>

      {/* Bottom Actions */}
      <div className="px-5 py-4 bg-card border-t space-y-3">
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
