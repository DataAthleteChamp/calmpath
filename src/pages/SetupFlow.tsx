import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AVATARS, AvatarId, Preferences } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const PREFS = [
  { key: 'avoidCrowds' as keyof Preferences, label: 'Avoid crowds', icon: '👥' },
  { key: 'simplerDirections' as keyof Preferences, label: 'Simpler directions', icon: '🧭' },
  { key: 'extraReassurance' as keyof Preferences, label: 'Extra reassurance', icon: '💚' },
  { key: 'voiceGuidance' as keyof Preferences, label: 'Voice guidance', icon: '🔊' },
  { key: 'conciseMode' as keyof Preferences, label: 'Concise mode', icon: '📝' },
  { key: 'avoidNoise' as keyof Preferences, label: 'Avoid noisy areas', icon: '🔇' },
];

const SetupFlow = () => {
  const navigate = useNavigate();
  const { avatar, setAvatar, preferences, setPreferences, setSetupComplete } = useApp();
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    setSetupComplete(true);
    navigate('/app');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-6 py-8">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-10 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h2 className="text-2xl font-bold text-center mb-1">Choose your companion</h2>
          <p className="text-muted-foreground text-center mb-8">They'll guide you through the airport</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-200 border-2 ${
                  avatar === a.id
                    ? 'border-primary bg-primary/5 scale-105 shadow-md shadow-primary/10'
                    : 'border-transparent bg-card hover:bg-muted'
                }`}
              >
                <span className="text-5xl">{a.emoji}</span>
                <span className="text-sm font-medium text-foreground">{a.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <Button
              size="lg"
              className="w-full rounded-2xl py-7 text-base"
              disabled={!avatar}
              onClick={() => setStep(1)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h2 className="text-2xl font-bold text-center mb-1">Your preferences</h2>
          <p className="text-muted-foreground text-center mb-6">We'll customize your experience</p>

          <div className="space-y-3 mb-8">
            {PREFS.map(p => (
              <div key={p.key} className="flex items-center justify-between rounded-2xl bg-card p-4 border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-medium">{p.label}</span>
                </div>
                <Switch
                  checked={preferences[p.key]}
                  onCheckedChange={v => setPreferences({ ...preferences, [p.key]: v })}
                />
              </div>
            ))}
          </div>

          <div className="mt-auto flex gap-3">
            <Button variant="outline" size="lg" className="rounded-2xl py-7 px-5" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button size="lg" className="flex-1 rounded-2xl py-7 text-base" onClick={() => setStep(2)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="mb-6 text-8xl animate-gentle-bounce">
            {AVATARS.find(a => a.id === avatar)?.emoji}
          </div>
          <div className="rounded-full bg-success/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-success">✓ Profile ready</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your calm profile is ready</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your companion is ready to guide you<br />through Copenhagen Airport
          </p>
          <Button size="lg" className="w-full max-w-xs rounded-2xl py-7 text-lg font-semibold" onClick={handleComplete}>
            <Check className="mr-2 h-5 w-5" /> Let's go
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetupFlow;
