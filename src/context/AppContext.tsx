import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

export type AvatarId = 'fox' | 'owl' | 'panda' | 'bunny' | 'cat' | 'turtle';
export type DisabilityProfile = 'adhd' | 'autism' | 'dyslexia' | 'anxiety' | 'lowVision';

export const AVATARS = [
  { id: 'fox' as AvatarId, emoji: '🦊', name: 'Fox' },
  { id: 'owl' as AvatarId, emoji: '🦉', name: 'Owl' },
  { id: 'panda' as AvatarId, emoji: '🐼', name: 'Panda' },
  { id: 'bunny' as AvatarId, emoji: '🐰', name: 'Bunny' },
  { id: 'cat' as AvatarId, emoji: '🐱', name: 'Cat' },
  { id: 'turtle' as AvatarId, emoji: '🐢', name: 'Turtle' },
];

export const DISABILITY_OPTIONS = [
  { id: 'adhd' as DisabilityProfile, emoji: '⚡', label: 'ADHD', description: 'Short next-step cues, minimal distractions' },
  { id: 'autism' as DisabilityProfile, emoji: '🧩', label: 'Autism', description: 'Predictable sequence, transition warnings' },
  { id: 'dyslexia' as DisabilityProfile, emoji: '📖', label: 'Dyslexia', description: 'Icon-first, low-text mode' },
  { id: 'anxiety' as DisabilityProfile, emoji: '💚', label: 'Anxiety', description: 'Reassuring tone, fallback certainty' },
  { id: 'lowVision' as DisabilityProfile, emoji: '👁️', label: 'Low Vision', description: 'Audio-first, high contrast' },
];

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: 'firstStep', emoji: '🏅', name: 'First Step', description: 'Complete first checkpoint' },
  { id: 'securityPro', emoji: '🛡️', name: 'Security Pro', description: 'Pass through security' },
  { id: 'zenMaster', emoji: '🧘', name: 'Zen Master', description: 'Use breathing exercise' },
  { id: 'halfway', emoji: '⭐', name: 'Halfway There', description: 'Complete 3 checkpoints' },
  { id: 'journeyComplete', emoji: '🏆', name: 'Journey Complete', description: 'Finish all 6 checkpoints' },
  { id: 'colorChamp', emoji: '🎮', name: 'Color Champ', description: 'Score 5+ in color match' },
];

export interface Preferences {
  avoidCrowds: boolean;
  simplerDirections: boolean;
  extraReassurance: boolean;
  voiceGuidance: boolean;
  conciseMode: boolean;
  avoidNoise: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  darkMode: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  readAloud: boolean;
  reduceMotion: boolean;
  largeTapTargets: boolean;
}

export interface Checkpoint {
  id: string;
  name: string;
  emoji: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
}

const defaultPreferences: Preferences = {
  avoidCrowds: true,
  simplerDirections: true,
  extraReassurance: false,
  voiceGuidance: false,
  conciseMode: false,
  avoidNoise: true,
};

const defaultAccessibility: AccessibilitySettings = {
  fontSize: 'medium',
  darkMode: false,
  highContrast: false,
  dyslexiaFont: false,
  readAloud: false,
  reduceMotion: false,
  largeTapTargets: false,
};

const initialCheckpoints: Checkpoint[] = [
  { id: 'entrance', name: 'Entrance', emoji: '🚪', description: 'Terminal 3 main entrance', status: 'active' },
  { id: 'checkin', name: 'Check-in', emoji: '🎫', description: 'Check-in counter B', status: 'locked' },
  { id: 'bathroom', name: 'Bathroom', emoji: '🚻', description: 'Near Gate A area', status: 'locked' },
  { id: 'security', name: 'Security', emoji: '🛡️', description: 'Security checkpoint', status: 'locked' },
  { id: 'snack', name: 'Snack', emoji: '☕', description: 'Café after security', status: 'locked' },
  { id: 'gate', name: 'Gate A12', emoji: '✈️', description: 'Gate A12 — Boarding', status: 'locked' },
];

/** Auto-enable preferences based on selected disability profiles */
export function getPreferencesForProfiles(profiles: DisabilityProfile[]): Partial<Preferences> {
  const p: Partial<Preferences> = {};
  if (profiles.includes('adhd')) { p.conciseMode = true; p.simplerDirections = true; }
  if (profiles.includes('autism')) { p.avoidCrowds = true; p.avoidNoise = true; }
  if (profiles.includes('dyslexia')) { p.simplerDirections = true; p.conciseMode = true; }
  if (profiles.includes('anxiety')) { p.extraReassurance = true; p.avoidCrowds = true; }
  if (profiles.includes('lowVision')) { p.voiceGuidance = true; }
  return p;
}

/** Haptic feedback utility — works on Android Chrome, safe no-op elsewhere */
export const haptic = (ms = 50) => { try { navigator.vibrate?.(ms); } catch {} };

const STORAGE_KEY = 'calmpath-state';

function loadPersistedState(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

interface AppState {
  avatar: AvatarId | null;
  setAvatar: (a: AvatarId) => void;
  disabilityProfiles: DisabilityProfile[];
  setDisabilityProfiles: (p: DisabilityProfile[]) => void;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: (a: AccessibilitySettings) => void;
  setupComplete: boolean;
  setSetupComplete: (v: boolean) => void;
  xp: number;
  addXp: (n: number) => void;
  level: number;
  checkpoints: Checkpoint[];
  currentCheckpointIndex: number;
  completeCheckpoint: () => void;
  gateChanged: boolean;
  showStressModal: boolean;
  setShowStressModal: (v: boolean) => void;
  showGateChangeModal: boolean;
  setShowGateChangeModal: (v: boolean) => void;
  showSupportCard: boolean;
  setShowSupportCard: (v: boolean) => void;
  journeyStarted: boolean;
  setJourneyStarted: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  mood: number | null;
  setMood: (m: number | null) => void;
  unlockedBadges: string[];
  unlockBadge: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const saved = loadPersistedState();

  const [avatar, setAvatar] = useState<AvatarId | null>((saved.avatar as AvatarId) ?? null);
  const [disabilityProfiles, setDisabilityProfiles] = useState<DisabilityProfile[]>((saved.disabilityProfiles as DisabilityProfile[]) ?? []);
  const [preferences, setPreferences] = useState<Preferences>((saved.preferences as Preferences) ?? defaultPreferences);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>((saved.accessibility as AccessibilitySettings) ?? defaultAccessibility);
  const [setupComplete, setSetupComplete] = useState((saved.setupComplete as boolean) ?? false);
  const [xp, setXp] = useState((saved.xp as number) ?? 0);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>((saved.checkpoints as Checkpoint[]) ?? initialCheckpoints);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState((saved.currentCheckpointIndex as number) ?? 0);
  const [gateChanged, setGateChanged] = useState((saved.gateChanged as boolean) ?? false);
  const [showStressModal, setShowStressModal] = useState(false);
  const [showGateChangeModal, setShowGateChangeModal] = useState(false);
  const [showSupportCard, setShowSupportCard] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState((saved.journeyStarted as boolean) ?? false);
  const [activeTab, setActiveTab] = useState('relax');
  const [mood, setMood] = useState<number | null>((saved.mood as number) ?? null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>((saved.unlockedBadges as string[]) ?? []);

  // Persist state to localStorage
  useEffect(() => {
    const state = {
      avatar, disabilityProfiles, preferences, accessibility,
      setupComplete, xp, checkpoints, currentCheckpointIndex,
      gateChanged, journeyStarted, unlockedBadges, mood,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [avatar, disabilityProfiles, preferences, accessibility, setupComplete, xp, checkpoints, currentCheckpointIndex, gateChanged, journeyStarted, unlockedBadges, mood]);

  // Apply accessibility classes to document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Font size
    const scaleMap = { small: '14px', medium: '16px', large: '18px', xl: '22px' };
    html.style.fontSize = scaleMap[accessibility.fontSize];

    // Dark mode
    html.classList.toggle('dark', accessibility.darkMode);

    // High contrast
    html.classList.toggle('high-contrast', accessibility.highContrast);

    // Dyslexia font
    body.classList.toggle('dyslexia-font', accessibility.dyslexiaFont);

    // Reduce motion
    html.classList.toggle('reduce-motion', accessibility.reduceMotion);

    // Large tap targets
    html.classList.toggle('large-targets', accessibility.largeTapTargets);
  }, [accessibility]);

  const addXp = (n: number) => setXp(prev => prev + n);
  const level = Math.floor(xp / 100) + 1;

  const unlockBadge = useCallback((badgeId: string) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) {
        toast(`${badge.emoji} Badge unlocked: ${badge.name}!`);
        haptic(100);
      }
      return [...prev, badgeId];
    });
  }, []);

  const completeCheckpoint = () => {
    const idx = currentCheckpointIndex;
    setCheckpoints(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: 'completed' };
      if (idx + 1 < next.length) {
        next[idx + 1] = { ...next[idx + 1], status: 'active' };
      }
      return next;
    });
    setCurrentCheckpointIndex(prev => prev + 1);
    addXp(25);
    toast('✅ Check-in complete! +25 XP');
    haptic();

    // Badge checks
    if (idx === 0) unlockBadge('firstStep');
    if (idx === 2) unlockBadge('halfway');
    if (idx === 3) unlockBadge('securityPro');
    if (idx === 5) {
      unlockBadge('journeyComplete');
      addXp(100);
      setTimeout(() => toast('🎉 Journey Complete! +100 Bonus XP!'), 600);
    }

    if (idx === 2) {
      setTimeout(() => setShowStressModal(true), 800);
    }
    if (idx === 4) {
      setTimeout(() => {
        setGateChanged(true);
        setShowGateChangeModal(true);
        setCheckpoints(prev => {
          const next = [...prev];
          next[5] = { ...next[5], name: 'Gate A18', description: 'Gate A18 — Updated' };
          return next;
        });
        toast('⚠️ Gate changed to A18');
      }, 800);
    }
  };

  return (
    <AppContext.Provider value={{
      avatar, setAvatar,
      disabilityProfiles, setDisabilityProfiles,
      preferences, setPreferences,
      accessibility, setAccessibility,
      setupComplete, setSetupComplete,
      xp, addXp, level,
      checkpoints, currentCheckpointIndex, completeCheckpoint,
      gateChanged,
      showStressModal, setShowStressModal,
      showGateChangeModal, setShowGateChangeModal,
      showSupportCard, setShowSupportCard,
      journeyStarted, setJourneyStarted,
      activeTab, setActiveTab,
      mood, setMood,
      unlockedBadges, unlockBadge,
    }}>
      {children}
    </AppContext.Provider>
  );
};
