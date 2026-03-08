import { useCallback } from 'react';
import { useApp } from '@/context/AppContext';

export const useReadAloud = () => {
  const { accessibility } = useApp();

  const speak = useCallback((text: string) => {
    if (!accessibility.readAloud) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [accessibility.readAloud]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop, enabled: accessibility.readAloud };
};
