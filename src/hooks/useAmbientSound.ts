import { useRef, useCallback, useState } from 'react';

type SoundType = 'rain' | 'ocean' | 'forest' | 'birds';

interface ActiveSound {
  ctx: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
}

function createNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(1, sr * seconds, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function buildRain(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 800;
  lp.Q.value = 0.5;
  source.connect(lp);
  lp.connect(ctx.destination);
  return source;
}

function buildOcean(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  lp.Q.value = 1;
  // Slow LFO on filter frequency for wave-like effect
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();
  source.connect(lp);
  lp.connect(ctx.destination);
  return source;
}

function buildForest(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 500;
  bp.Q.value = 0.3;
  // Gentle sine undertone
  const sine = ctx.createOscillator();
  sine.frequency.value = 220;
  const sineGain = ctx.createGain();
  sineGain.gain.value = 0.03;
  sine.connect(sineGain);
  sineGain.connect(ctx.destination);
  sine.start();
  source.connect(bp);
  bp.connect(ctx.destination);
  return source;
}

function buildBirds(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  hp.Q.value = 0.5;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3500;
  bp.Q.value = 2;
  source.connect(hp);
  hp.connect(bp);
  bp.connect(ctx.destination);
  return source;
}

export const useAmbientSound = () => {
  const activeSounds = useRef<Map<SoundType, ActiveSound>>(new Map());
  const [playing, setPlaying] = useState<Set<SoundType>>(new Set());

  const toggle = useCallback((type: SoundType) => {
    const existing = activeSounds.current.get(type);
    if (existing) {
      existing.source.stop();
      existing.ctx.close();
      activeSounds.current.delete(type);
      setPlaying(prev => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
      return;
    }

    const ctx = new AudioContext();
    const buf = createNoiseBuffer(ctx, 2);

    const builders: Record<SoundType, (c: AudioContext, b: AudioBuffer) => AudioBufferSourceNode> = {
      rain: buildRain,
      ocean: buildOcean,
      forest: buildForest,
      birds: buildBirds,
    };

    const source = builders[type](ctx, buf);
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    activeSounds.current.set(type, { ctx, source, gain });
    setPlaying(prev => new Set(prev).add(type));
  }, []);

  const stopAll = useCallback(() => {
    activeSounds.current.forEach(({ source, ctx }) => {
      source.stop();
      ctx.close();
    });
    activeSounds.current.clear();
    setPlaying(new Set());
  }, []);

  return { toggle, stopAll, playing };
};
