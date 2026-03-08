import { useApp, AVATARS, AvatarId, DISABILITY_OPTIONS, DisabilityProfile, Preferences, AccessibilitySettings } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, HelpCircle, Sun, Moon, Eye, Type, Volume2, Minimize2, Pointer } from 'lucide-react';

const PREFS = [
  { key: 'avoidCrowds' as keyof Preferences, label: 'Avoid crowds', icon: '👥' },
  { key: 'simplerDirections' as keyof Preferences, label: 'Simpler directions', icon: '🧭' },
  { key: 'extraReassurance' as keyof Preferences, label: 'Extra reassurance', icon: '💚' },
  { key: 'voiceGuidance' as keyof Preferences, label: 'Voice guidance', icon: '🔊' },
  { key: 'conciseMode' as keyof Preferences, label: 'Concise mode', icon: '📝' },
  { key: 'avoidNoise' as keyof Preferences, label: 'Avoid noisy areas', icon: '🔇' },
];

const FONT_SIZES: AccessibilitySettings['fontSize'][] = ['small', 'medium', 'large', 'xl'];
const FONT_SIZE_LABELS = { small: 'S', medium: 'M', large: 'L', xl: 'XL' };

const SettingsTab = () => {
  const navigate = useNavigate();
  const { avatar, setAvatar, preferences, setPreferences, disabilityProfiles, setDisabilityProfiles, accessibility, setAccessibility } = useApp();

  const toggleProfile = (id: DisabilityProfile) => {
    const next = disabilityProfiles.includes(id)
      ? disabilityProfiles.filter(p => p !== id)
      : [...disabilityProfiles, id];
    setDisabilityProfiles(next);
  };

  const updateA11y = (key: keyof AccessibilitySettings, value: any) => {
    setAccessibility({ ...accessibility, [key]: value });
  };

  const fontSizeIndex = FONT_SIZES.indexOf(accessibility.fontSize);

  return (
    <div className="px-6 py-6 pb-28 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>

      {/* Avatar */}
      <h3 className="font-semibold text-foreground mb-3">Your companion</h3>
      <div className="grid grid-cols-6 gap-2 mb-8">
        {AVATARS.map(a => (
          <button
            key={a.id}
            onClick={() => setAvatar(a.id)}
            aria-label={`Select ${a.name}`}
            className={`flex items-center justify-center rounded-xl p-2 transition-all ${
              avatar === a.id ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'bg-card hover:bg-muted'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">{a.emoji}</span>
          </button>
        ))}
      </div>

      {/* Disability Profiles */}
      <h3 className="font-semibold text-foreground mb-3">Your profile</h3>
      <div className="space-y-2 mb-8">
        {DISABILITY_OPTIONS.map(opt => {
          const selected = disabilityProfiles.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleProfile(opt.id)}
              aria-pressed={selected}
              className={`w-full flex items-center gap-3 rounded-2xl p-3.5 border transition-all text-left ${
                selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'
              }`}
            >
              <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
              {selected && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] text-primary-foreground font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Preferences */}
      <h3 className="font-semibold text-foreground mb-3">Preferences</h3>
      <div className="space-y-2 mb-8">
        {PREFS.map(p => (
          <div key={p.key} className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
            <div className="flex items-center gap-2.5">
              <span className="text-lg" aria-hidden="true">{p.icon}</span>
              <span className="text-sm font-medium">{p.label}</span>
            </div>
            <Switch
              checked={preferences[p.key]}
              onCheckedChange={v => setPreferences({ ...preferences, [p.key]: v })}
            />
          </div>
        ))}
      </div>

      {/* Digital Accessibility */}
      <h3 className="font-semibold text-foreground mb-3">Digital Accessibility</h3>
      <div className="space-y-2 mb-8">
        {/* Font Size */}
        <div className="rounded-2xl bg-card p-4 border">
          <div className="flex items-center gap-2.5 mb-3">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Font size</span>
            <span className="ml-auto text-sm font-bold text-primary">{FONT_SIZE_LABELS[accessibility.fontSize]}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">A</span>
            <Slider
              value={[fontSizeIndex]}
              min={0}
              max={3}
              step={1}
              onValueChange={([v]) => updateA11y('fontSize', FONT_SIZES[v])}
              className="flex-1"
            />
            <span className="text-lg font-bold text-muted-foreground">A</span>
          </div>
        </div>

        {/* Dark/Light Theme */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            {accessibility.darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-medium">{accessibility.darkMode ? 'Dark mode' : 'Light mode'}</span>
          </div>
          <Switch checked={accessibility.darkMode} onCheckedChange={v => updateA11y('darkMode', v)} />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">High contrast</span>
          </div>
          <Switch checked={accessibility.highContrast} onCheckedChange={v => updateA11y('highContrast', v)} />
        </div>

        {/* Dyslexia Font */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            <span className="text-lg" aria-hidden="true">📖</span>
            <span className="text-sm font-medium">Dyslexia-friendly font</span>
          </div>
          <Switch checked={accessibility.dyslexiaFont} onCheckedChange={v => updateA11y('dyslexiaFont', v)} />
        </div>

        {/* Read Aloud */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Read aloud</span>
          </div>
          <Switch checked={accessibility.readAloud} onCheckedChange={v => updateA11y('readAloud', v)} />
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            <Minimize2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Reduce motion</span>
          </div>
          <Switch checked={accessibility.reduceMotion} onCheckedChange={v => updateA11y('reduceMotion', v)} />
        </div>

        {/* Large Tap Targets */}
        <div className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
          <div className="flex items-center gap-2.5">
            <Pointer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Large tap targets</span>
          </div>
          <Switch checked={accessibility.largeTapTargets} onCheckedChange={v => updateA11y('largeTapTargets', v)} />
        </div>
      </div>

      {/* Quick Links */}
      <h3 className="font-semibold text-foreground mb-3">Quick links</h3>
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start rounded-2xl py-6" onClick={() => navigate('/support-card')}>
          <HelpCircle className="mr-3 h-4 w-4" /> Support Card
        </Button>
        <Button variant="outline" className="w-full justify-start rounded-2xl py-6" onClick={() => navigate('/quiet-place')}>
          <MapPin className="mr-3 h-4 w-4" /> Quiet Places
        </Button>
        <Button variant="outline" className="w-full justify-start rounded-2xl py-6" onClick={() => navigate('/fallback-guide')}>
          <FileText className="mr-3 h-4 w-4" /> Fallback Guide
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">CalmPath v1.0 — Hackathon Demo</p>
    </div>
  );
};

export default SettingsTab;
