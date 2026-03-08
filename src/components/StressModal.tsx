import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useReadAloud } from '@/hooks/useReadAloud';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wind, MapPin, HelpCircle } from 'lucide-react';

const StressModal = () => {
  const navigate = useNavigate();
  const { setShowStressModal, setShowSupportCard } = useApp();
  const { speak } = useReadAloud();

  // Speak the warning on mount
  useEffect(() => {
    speak('Heads up: busy area ahead. Security can be crowded and noisy. Take a moment to breathe.');
  }, [speak]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Busy area ahead</h3>
            <p className="text-sm text-muted-foreground">Security can be crowded and noisy</p>
          </div>
        </div>

        <div className="rounded-2xl bg-secondary/50 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Take a moment to breathe</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Breathe in for 4 seconds, hold for 4, breathe out for 4. You've got this.
          </p>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full rounded-2xl py-6 text-base"
            onClick={() => {
              setShowStressModal(false);
              navigate('/quiet-place');
            }}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Take me to a quieter area
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-2xl py-6 text-base"
            onClick={() => setShowStressModal(false)}
          >
            Continue on current route
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-2xl py-5 text-sm text-muted-foreground"
            onClick={() => {
              setShowStressModal(false);
              navigate('/support-card');
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Show support card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StressModal;
