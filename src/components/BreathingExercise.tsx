import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { haptic } from '@/context/AppContext';

interface Props {
  onClose: () => void;
}

const BreathingExercise = ({ onClose }: Props) => {
  const { addXp, unlockBadge } = useApp();

  const handleClose = () => {
    addXp(10);
    toast('🧘 +10 XP — nice breathing!');
    haptic();
    unlockBadge('zenMaster');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 backdrop-blur-sm">
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute h-56 w-56 animate-breathe rounded-full bg-primary/5" />
        <div className="absolute h-44 w-44 animate-breathe rounded-full bg-primary/10" style={{ animationDelay: '0.4s' }} />
        <div className="absolute h-32 w-32 animate-breathe rounded-full bg-primary/20" style={{ animationDelay: '0.8s' }} />
        <div className="absolute h-20 w-20 animate-breathe rounded-full bg-primary/30" style={{ animationDelay: '1.2s' }} />
      </div>

      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-foreground mb-2">Follow the rhythm</h2>
        <p className="text-muted-foreground">Breathe with the expanding circle</p>
        <p className="text-xs text-muted-foreground mt-6">Tap ✕ to close and earn 10 XP</p>
      </div>
    </div>
  );
};

export default BreathingExercise;
