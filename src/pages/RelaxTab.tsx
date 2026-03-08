import { useState } from 'react';
import { useApp, AVATARS } from '@/context/AppContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Palette, Headphones, Star } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';

const MOODS = [
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
];

const RelaxTab = () => {
  const { avatar, xp, level } = useApp();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [colorScore, setColorScore] = useState(0);
  const [colorTarget, setColorTarget] = useState(0);

  const avatarData = AVATARS.find(a => a.id === avatar);
  const xpInLevel = xp % 100;

  const COLORS = ['bg-primary', 'bg-accent', 'bg-warning', 'bg-destructive'];
  const COLOR_NAMES = ['Blue', 'Green', 'Orange', 'Red'];

  const startColorGame = () => {
    setColorScore(0);
    setColorTarget(Math.floor(Math.random() * 4));
    setActiveGame('colors');
  };

  const handleColorTap = (idx: number) => {
    if (idx === colorTarget) {
      setColorScore(prev => prev + 1);
      setColorTarget(Math.floor(Math.random() * 4));
    }
  };

  if (activeGame === 'breathing') {
    return <BreathingExercise onClose={() => setActiveGame(null)} />;
  }

  return (
    <div className="px-6 py-6 animate-fade-in-up">
      {/* Avatar & Level Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-sm">
            <span className="text-5xl">{avatarData?.emoji || '🦊'}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <span className="text-xs font-bold">{level}</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-sm text-muted-foreground mb-2">Your calm companion is here</p>
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-warning" />
            <Progress value={xpInLevel} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground font-medium">{xpInLevel}/100</span>
          </div>
        </div>
      </div>

      {/* How are you feeling */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-3">How are you feeling?</h3>
        <div className="flex gap-3">
          {MOODS.map((mood, i) => (
            <button
              key={i}
              onClick={() => setSelectedMood(i)}
              className={`flex-1 flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all ${
                selectedMood === i
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-transparent bg-card hover:bg-muted'
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mini Games */}
      <h3 className="font-semibold text-foreground mb-3">Calm activities</h3>
      <div className="space-y-3">
        {/* Breathing */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm" onClick={() => setActiveGame('breathing')}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Breathing exercise</p>
              <p className="text-sm text-muted-foreground">Follow the calm rhythm</p>
            </div>
            <span className="text-xs text-primary font-medium">+10 XP</span>
          </CardContent>
        </Card>

        {/* Color Match */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm" onClick={startColorGame}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
              <Palette className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Color match</p>
              <p className="text-sm text-muted-foreground">Simple color tapping game</p>
            </div>
            <span className="text-xs text-accent font-medium">+5 XP</span>
          </CardContent>
        </Card>

        {/* Calm Sounds */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm" onClick={() => setActiveGame('sounds')}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <Headphones className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Calm sounds</p>
              <p className="text-sm text-muted-foreground">Rain, ocean, forest</p>
            </div>
            <span className="text-xs text-muted-foreground">Relax</span>
          </CardContent>
        </Card>
      </div>

      {/* Color Match Game Overlay */}
      {activeGame === 'colors' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <button onClick={() => setActiveGame(null)} className="absolute top-6 right-6 text-2xl text-muted-foreground">✕</button>
          <p className="text-sm text-muted-foreground mb-2">Score: {colorScore}</p>
          <p className="text-2xl font-bold text-foreground mb-8">Tap <span className="text-primary">{COLOR_NAMES[colorTarget]}</span></p>
          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => handleColorTap(i)}
                className={`${color} h-28 w-28 rounded-3xl shadow-lg active:scale-95 transition-transform`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Calm Sounds Overlay */}
      {activeGame === 'sounds' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <button onClick={() => setActiveGame(null)} className="absolute top-6 right-6 text-2xl text-muted-foreground">✕</button>
          <h3 className="text-2xl font-bold mb-8 text-foreground">Calm Sounds</h3>
          <div className="grid grid-cols-2 gap-4 w-64">
            {['🌧️ Rain', '🌊 Ocean', '🌲 Forest', '🐦 Birds'].map(sound => (
              <button
                key={sound}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card p-6 border shadow-sm hover:bg-muted transition-colors active:scale-95"
              >
                <span className="text-3xl">{sound.split(' ')[0]}</span>
                <span className="text-sm font-medium text-foreground">{sound.split(' ')[1]}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">Audio is mocked for demo</p>
        </div>
      )}
    </div>
  );
};

export default RelaxTab;
