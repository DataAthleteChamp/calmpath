import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AvatarId = 'fox' | 'owl' | 'panda' | 'bunny' | 'cat' | 'turtle';

export const AVATARS = [
  { id: 'fox' as AvatarId, emoji: '🦊', name: 'Fox' },
  { id: 'owl' as AvatarId, emoji: '🦉', name: 'Owl' },
  { id: 'panda' as AvatarId, emoji: '🐼', name: 'Panda' },
  { id: 'bunny' as AvatarId, emoji: '🐰', name: 'Bunny' },
  { id: 'cat' as AvatarId, emoji: '🐱', name: 'Cat' },
  { id: 'turtle' as AvatarId, emoji: '🐢', name: 'Turtle' },
];

export interface Preferences {
  avoidCrowds: boolean;
  simplerDirections: boolean;
  extraReassurance: boolean;
  voiceGuidance: boolean;
  conciseMode: boolean;
  avoidNoise: boolean;
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

const initialCheckpoints: Checkpoint[] = [
  { id: 'entrance', name: 'Entrance', emoji: '🚪', description: 'Terminal 3 main entrance', status: 'active' },
  { id: 'checkin', name: 'Check-in', emoji: '🎫', description: 'Check-in counter B', status: 'locked' },
  { id: 'bathroom', name: 'Bathroom', emoji: '🚻', description: 'Near Gate A area', status: 'locked' },
  { id: 'security', name: 'Security', emoji: '🛡️', description: 'Security checkpoint', status: 'locked' },
  { id: 'snack', name: 'Snack', emoji: '☕', description: 'Café after security', status: 'locked' },
  { id: 'gate', name: 'Gate A12', emoji: '✈️', description: 'Gate A12 — Boarding', status: 'locked' },
];

interface AppState {
  avatar: AvatarId | null;
  setAvatar: (a: AvatarId) => void;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
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
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [setupComplete, setSetupComplete] = useState(false);
  const [xp, setXp] = useState(0);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(initialCheckpoints);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [gateChanged, setGateChanged] = useState(false);
  const [showStressModal, setShowStressModal] = useState(false);
  const [showGateChangeModal, setShowGateChangeModal] = useState(false);
  const [showSupportCard, setShowSupportCard] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('relax');

  const addXp = (n: number) => setXp(prev => prev + n);
  const level = Math.floor(xp / 100) + 1;

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

    // After bathroom → stress modal before security
    if (idx === 2) {
      setTimeout(() => setShowStressModal(true), 800);
    }
    // After snack → gate change
    if (idx === 4) {
      setTimeout(() => {
        setGateChanged(true);
        setShowGateChangeModal(true);
        setCheckpoints(prev => {
          const next = [...prev];
          next[5] = { ...next[5], name: 'Gate A18', description: 'Gate A18 — Updated' };
          return next;
        });
      }, 800);
    }
  };

  return (
    <AppContext.Provider value={{
      avatar, setAvatar,
      preferences, setPreferences,
      setupComplete, setSetupComplete,
      xp, addXp, level,
      checkpoints, currentCheckpointIndex, completeCheckpoint,
      gateChanged,
      showStressModal, setShowStressModal,
      showGateChangeModal, setShowGateChangeModal,
      showSupportCard, setShowSupportCard,
      journeyStarted, setJourneyStarted,
      activeTab, setActiveTab,
    }}>
      {children}
    </AppContext.Provider>
  );
};
