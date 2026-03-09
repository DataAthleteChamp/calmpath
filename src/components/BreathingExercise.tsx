import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { haptic } from '@/context/AppContext';
import { t } from '@/lib/i18n';

interface Props {
  onClose: () => void;
}

function useBreathingAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 220;
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      ctxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;

      // 12s cycle: 4s inhale (rise), 4s hold (sustain), 4s exhale (fall)
      const cycleDuration = 12000;
      const tick = () => {
        const now = ctx.currentTime;
        const g = gain.gain;
        const f = osc.frequency;

        // Inhale: 4s — volume up, pitch rises
        g.cancelScheduledValues(now);
        f.cancelScheduledValues(now);

        g.setValueAtTime(0.02, now);
        g.linearRampToValueAtTime(0.08, now + 4);

        f.setValueAtTime(220, now);
        f.linearRampToValueAtTime(330, now + 4);

        // Hold: 4s — sustain
        g.linearRampToValueAtTime(0.08, now + 8);
        f.linearRampToValueAtTime(330, now + 8);

        // Exhale: 4s — volume down, pitch falls
        g.linearRampToValueAtTime(0.01, now + 12);
        f.linearRampToValueAtTime(220, now + 12);
      };

      tick();
      intervalRef.current = window.setInterval(tick, cycleDuration);
    } catch {
      // Web Audio not available — silent fallback
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        oscRef.current?.stop();
        ctxRef.current?.close();
      } catch {}
    };
  }, []);
}

const BreathingExercise = ({ onClose }: Props) => {
  const { addXp, unlockBadge, language } = useApp();

  useBreathingAudio();

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
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('breathing.title', language)}</h2>
        <p className="text-muted-foreground">{t('breathing.subtitle', language)}</p>
        <p className="text-xs text-muted-foreground mt-6">{t('breathing.close', language)}</p>
      </div>
    </div>
  );
};

export default BreathingExercise;
