import { useApp, AVATARS, AvatarId, Preferences } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, HelpCircle } from 'lucide-react';

const PREFS = [
  { key: 'avoidCrowds' as keyof Preferences, label: 'Avoid crowds', icon: '👥' },
  { key: 'simplerDirections' as keyof Preferences, label: 'Simpler directions', icon: '🧭' },
  { key: 'extraReassurance' as keyof Preferences, label: 'Extra reassurance', icon: '💚' },
  { key: 'voiceGuidance' as keyof Preferences, label: 'Voice guidance', icon: '🔊' },
  { key: 'conciseMode' as keyof Preferences, label: 'Concise mode', icon: '📝' },
  { key: 'avoidNoise' as keyof Preferences, label: 'Avoid noisy areas', icon: '🔇' },
];

const SettingsTab = () => {
  const navigate = useNavigate();
  const { avatar, setAvatar, preferences, setPreferences } = useApp();

  return (
    <div className="px-6 py-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>

      {/* Avatar */}
      <h3 className="font-semibold text-foreground mb-3">Your companion</h3>
      <div className="grid grid-cols-6 gap-2 mb-8">
        {AVATARS.map(a => (
          <button
            key={a.id}
            onClick={() => setAvatar(a.id)}
            className={`flex items-center justify-center rounded-xl p-2 transition-all ${
              avatar === a.id ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'bg-card hover:bg-muted'
            }`}
          >
            <span className="text-2xl">{a.emoji}</span>
          </button>
        ))}
      </div>

      {/* Preferences */}
      <h3 className="font-semibold text-foreground mb-3">Preferences</h3>
      <div className="space-y-2 mb-8">
        {PREFS.map(p => (
          <div key={p.key} className="flex items-center justify-between rounded-2xl bg-card p-3.5 border">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{p.icon}</span>
              <span className="text-sm font-medium">{p.label}</span>
            </div>
            <Switch
              checked={preferences[p.key]}
              onCheckedChange={v => setPreferences({ ...preferences, [p.key]: v })}
            />
          </div>
        ))}
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
