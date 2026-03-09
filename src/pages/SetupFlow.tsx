import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AVATARS, AvatarId, DISABILITY_OPTIONS, DisabilityProfile, Preferences, getPreferencesForProfiles } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check, Plane } from 'lucide-react';
import { t } from '@/lib/i18n';

const PREFS = [
  { key: 'avoidCrowds' as keyof Preferences, label: 'Avoid crowds', icon: '👥' },
  { key: 'simplerDirections' as keyof Preferences, label: 'Simpler directions', icon: '🧭' },
  { key: 'extraReassurance' as keyof Preferences, label: 'Extra reassurance', icon: '💚' },
  { key: 'voiceGuidance' as keyof Preferences, label: 'Voice guidance', icon: '🔊' },
  { key: 'conciseMode' as keyof Preferences, label: 'Concise mode', icon: '📝' },
  { key: 'avoidNoise' as keyof Preferences, label: 'Avoid noisy areas', icon: '🔇' },
];

const TOTAL_STEPS = 4;

const SetupFlow = () => {
  const navigate = useNavigate();
  const { avatar, setAvatar, preferences, setPreferences, setSetupComplete, disabilityProfiles, setDisabilityProfiles, language } = useApp();
  const [step, setStep] = useState(0);

  const toggleProfile = (id: DisabilityProfile) => {
    const next = disabilityProfiles.includes(id)
      ? disabilityProfiles.filter(p => p !== id)
      : [...disabilityProfiles, id];
    setDisabilityProfiles(next);
    // Auto-set preferences based on profiles
    const autoPrefs = getPreferencesForProfiles(next);
    setPreferences({ ...preferences, ...autoPrefs });
  };

  const handleComplete = () => {
    setSetupComplete(true);
    navigate('/app');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-6 py-8">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-10 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Avatar */}
      {step === 0 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h2 className="text-2xl font-bold text-center mb-1">{t('setup.companion.title', language)}</h2>
          <p className="text-muted-foreground text-center mb-8">{t('setup.companion.subtitle', language)}</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                aria-label={`Select ${a.name} companion`}
                className={`flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-200 border-2 ${
                  avatar === a.id
                    ? 'border-primary bg-primary/5 scale-105 shadow-md shadow-primary/10'
                    : 'border-transparent bg-card hover:bg-muted'
                }`}
              >
                <span className="text-5xl" aria-hidden="true">{a.emoji}</span>
                <span className="text-sm font-medium text-foreground">{a.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <Button size="lg" className="w-full rounded-2xl py-7 text-base" disabled={!avatar} onClick={() => setStep(1)}>
              {t('setup.continue', language)} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Disability Profile */}
      {step === 1 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h2 className="text-2xl font-bold text-center mb-1">{t('setup.profile.title', language)}</h2>
          <p className="text-muted-foreground text-center mb-6">{t('setup.profile.subtitle', language)}</p>

          <div className="space-y-3 mb-6">
            {DISABILITY_OPTIONS.map(opt => {
              const selected = disabilityProfiles.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleProfile(opt.id)}
                  aria-pressed={selected}
                  className={`w-full flex items-center gap-4 rounded-2xl p-4 border-2 transition-all text-left ${
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-card hover:bg-muted'
                  }`}
                >
                  <span className="text-3xl" aria-hidden="true">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.description}</p>
                  </div>
                  {selected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className="text-sm text-muted-foreground underline underline-offset-4 mb-4 hover:text-foreground transition-colors"
          >
            {t('setup.profile.skip', language)}
          </button>

          <div className="mt-auto flex gap-3">
            <Button variant="outline" size="lg" className="rounded-2xl py-7 px-5" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button size="lg" className="flex-1 rounded-2xl py-7 text-base" onClick={() => setStep(2)}>
              {t('setup.continue', language)} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Preferences */}
      {step === 2 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h2 className="text-2xl font-bold text-center mb-1">{t('setup.prefs.title', language)}</h2>
          <p className="text-muted-foreground text-center mb-6">{t('setup.prefs.subtitle', language)}</p>

          <div className="space-y-3 mb-8">
            {PREFS.map(p => (
              <div key={p.key} className="flex items-center justify-between rounded-2xl bg-card p-4 border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{p.icon}</span>
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
            <Button variant="outline" size="lg" className="rounded-2xl py-7 px-5" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button size="lg" className="flex-1 rounded-2xl py-7 text-base" onClick={() => setStep(3)}>
              {t('setup.continue', language)} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Ready */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="mb-6 text-8xl animate-gentle-bounce">
            {AVATARS.find(a => a.id === avatar)?.emoji}
          </div>
          <div className="rounded-full bg-success/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-success">✓ {t('setup.ready.badge', language)}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('setup.ready.title', language)}</h2>
          <p className="text-muted-foreground mb-3 leading-relaxed">
            {t('setup.ready.subtitle', language)}
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-2.5 mb-8">
            <Plane className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('setup.ready.flight', language)}</span>
          </div>
          <Button size="lg" className="w-full max-w-xs rounded-2xl py-7 text-lg font-semibold" onClick={handleComplete}>
            <Check className="mr-2 h-5 w-5" /> {t('setup.ready.go', language)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetupFlow;
