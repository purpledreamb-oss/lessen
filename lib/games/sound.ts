// Synthesized SFX via Web Audio API — no files, no network.
// All sounds are generated on-the-fly so they always work offline.

type SfxName =
  | 'hit'       // normal attack landing
  | 'crit'      // critical hit sparkle
  | 'super'     // type-advantage hit (deeper boom)
  | 'weak'      // type-disadvantage (soft tap)
  | 'victory'   // win a battle
  | 'defeat'    // lose a battle
  | 'select'   // menu/skill button tap
  | 'boom'      // explode a monster
  | 'star'      // star pickup sparkle
  | 'hurt'      // hero got hit
  | 'startGame' // shooter start
  | 'timeUp';   // shooter time over

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  // iOS / mobile require resume after user gesture
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setMuted(v: boolean) {
  muted = v;
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem('lessen-games:muted', v ? '1' : '0'); } catch { /* ignore */ }
  }
}

export function isMuted(): boolean {
  return muted;
}

export function loadMuted() {
  if (typeof window === 'undefined') return;
  try {
    muted = window.localStorage.getItem('lessen-games:muted') === '1';
  } catch { /* ignore */ }
}

export function unlockAudio() {
  // Called on first user gesture — wakes up AudioContext on iOS
  getCtx();
}

type Note = { freq: number; t: number; dur: number; type?: OscillatorType; vol?: number; sweepTo?: number };

function playNotes(notes: Note[], masterVol = 0.18) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const master = c.createGain();
  master.gain.value = masterVol;
  master.connect(c.destination);
  for (const n of notes) {
    const osc = c.createOscillator();
    osc.type = n.type ?? 'square';
    osc.frequency.setValueAtTime(n.freq, now + n.t);
    if (n.sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(n.sweepTo, now + n.t + n.dur);
    }
    const g = c.createGain();
    const peak = n.vol ?? 1;
    g.gain.setValueAtTime(0.001, now + n.t);
    g.gain.exponentialRampToValueAtTime(peak, now + n.t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.dur);
    osc.connect(g).connect(master);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.dur + 0.02);
  }
  // auto-cleanup
  setTimeout(() => { try { master.disconnect(); } catch { /* noop */ } }, 3000);
}

function playNoise(dur: number, freq = 800, q = 1, vol = 0.3) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const bufSize = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(filter).connect(g).connect(c.destination);
  src.start(now);
  src.stop(now + dur);
}

export function play(name: SfxName) {
  switch (name) {
    case 'hit':
      playNotes([
        { freq: 440, sweepTo: 120, t: 0, dur: 0.12, type: 'square' },
      ], 0.2);
      playNoise(0.05, 600, 1, 0.15);
      break;
    case 'crit':
      playNotes([
        { freq: 880, t: 0, dur: 0.08, type: 'square' },
        { freq: 1320, t: 0.06, dur: 0.1, type: 'square' },
        { freq: 1760, t: 0.14, dur: 0.18, type: 'square' },
      ], 0.18);
      break;
    case 'super':
      playNotes([
        { freq: 200, sweepTo: 60, t: 0, dur: 0.35, type: 'sawtooth' },
      ], 0.22);
      playNoise(0.25, 200, 1, 0.2);
      break;
    case 'weak':
      playNotes([
        { freq: 180, t: 0, dur: 0.1, type: 'triangle' },
      ], 0.15);
      break;
    case 'victory':
      playNotes([
        { freq: 523, t: 0, dur: 0.15, type: 'square' },   // C5
        { freq: 659, t: 0.12, dur: 0.15, type: 'square' }, // E5
        { freq: 784, t: 0.24, dur: 0.15, type: 'square' }, // G5
        { freq: 1047, t: 0.36, dur: 0.35, type: 'square' }, // C6
      ], 0.2);
      break;
    case 'defeat':
      playNotes([
        { freq: 400, sweepTo: 80, t: 0, dur: 0.8, type: 'sawtooth' },
      ], 0.18);
      break;
    case 'select':
      playNotes([
        { freq: 660, t: 0, dur: 0.06, type: 'square' },
        { freq: 990, t: 0.04, dur: 0.06, type: 'square' },
      ], 0.1);
      break;
    case 'boom':
      playNoise(0.3, 120, 1, 0.35);
      playNotes([
        { freq: 220, sweepTo: 50, t: 0, dur: 0.3, type: 'sawtooth' },
      ], 0.25);
      break;
    case 'star':
      playNotes([
        { freq: 1200, t: 0, dur: 0.08, type: 'sine' },
        { freq: 1800, t: 0.06, dur: 0.12, type: 'sine' },
        { freq: 2400, t: 0.16, dur: 0.15, type: 'sine' },
      ], 0.15);
      break;
    case 'hurt':
      playNotes([
        { freq: 300, sweepTo: 100, t: 0, dur: 0.25, type: 'square' },
      ], 0.22);
      playNoise(0.15, 400, 1, 0.2);
      break;
    case 'startGame':
      playNotes([
        { freq: 523, t: 0, dur: 0.1, type: 'square' },
        { freq: 659, t: 0.1, dur: 0.1, type: 'square' },
        { freq: 1047, t: 0.2, dur: 0.2, type: 'square' },
      ], 0.18);
      break;
    case 'timeUp':
      playNotes([
        { freq: 880, t: 0, dur: 0.12, type: 'square' },
        { freq: 660, t: 0.12, dur: 0.12, type: 'square' },
        { freq: 440, t: 0.24, dur: 0.3, type: 'square' },
      ], 0.2);
      break;
  }
}
