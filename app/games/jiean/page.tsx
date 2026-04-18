'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '../games.module.css';
import {
  getLeaderboard,
  getPlayerName,
  loadSave,
  saveSave,
  setPlayerName,
  submitScore,
  LeaderboardEntry,
} from '@/lib/games/storage';
import { play, loadMuted, isMuted, setMuted, unlockAudio } from '@/lib/games/sound';

const GAME_KEY = 'jiean';
const GAME_DURATION = 60; // seconds

type Save = {
  playerName: string;
  highScore: number;
  totalStars: number;
  selectedHero: string;
  unlocked: string[];
};

type HeroSkin = { id: string; name: string; sprite: string; needStars: number; tint: string };

const HEROES: HeroSkin[] = [
  { id: 'ultra-1', name: '原光戰士', sprite: '/games/assets/ultra/ultra1.svg', needStars: 0, tint: '#ff6b6b' },
  { id: 'ultra-5', name: '高光戰士', sprite: '/games/assets/ultra/ultra5.svg', needStars: 50, tint: '#4dabf7' },
  { id: 'ultra-3', name: '泰光戰士', sprite: '/games/assets/ultra/ultra3.svg', needStars: 120, tint: '#ffd43b' },
  { id: 'ultra-4', name: '迪光戰士', sprite: '/games/assets/ultra/ultra4.svg', needStars: 200, tint: '#cc5de8' },
  { id: 'ultra-8', name: '澤光戰士', sprite: '/games/assets/ultra/ultra8.svg', needStars: 300, tint: '#ffd700' },
];

type MotionKind = 'straight' | 'zigzag' | 'jumper' | 'flyer';

type MonsterKind = {
  id: string;
  name: string;
  sprite: string;
  score: number;
  speedMul: number;
  motion: MotionKind;
};

const MONSTERS: MonsterKind[] = [
  { id: 'trex', name: '暴龍', sprite: '/games/assets/dinos/trex.svg', score: 10, speedMul: 1, motion: 'straight' },
  { id: 'tri', name: '三角龍', sprite: '/games/assets/dinos/triceratops.svg', score: 8, speedMul: 0.9, motion: 'straight' },
  { id: 'stego', name: '劍龍', sprite: '/games/assets/dinos/stegosaurus.svg', score: 8, speedMul: 0.9, motion: 'jumper' },
  { id: 'ptero', name: '翼龍', sprite: '/games/assets/dinos/pterodactyl.svg', score: 12, speedMul: 1.3, motion: 'flyer' },
  { id: 'velo', name: '迅猛龍', sprite: '/games/assets/dinos/velociraptor.svg', score: 15, speedMul: 1.5, motion: 'zigzag' },
  { id: 'brachio', name: '長頸龍', sprite: '/games/assets/dinos/brachiosaurus.svg', score: 6, speedMul: 0.7, motion: 'straight' },
];

type Monster = {
  id: number;
  kind: MonsterKind;
  x: number;
  y: number;
  y0: number; // baseline for oscillation
  vx: number;
  img: HTMLImageElement;
  scale: number;
  hp: number;
  maxHp: number;
  phase: number; // motion phase offset
  isBoss: boolean;
};

type PowerupKind = 'bomb' | 'shield' | 'rapid';

type Powerup = {
  id: number;
  x: number;
  y: number;
  vy: number;
  kind: PowerupKind;
  emoji: string;
};

type Effect = {
  id: number;
  x: number;
  y: number;
  age: number;
  life: number;
  kind: 'boom' | 'star' | 'beam' | 'text';
  bx?: number;
  by?: number;
  text?: string;
  color?: string;
};

const POWERUPS: Record<PowerupKind, { emoji: string; label: string }> = {
  bomb:   { emoji: '💣', label: 'BOOM!' },
  shield: { emoji: '🛡', label: 'SHIELD!' },
  rapid:  { emoji: '⚡', label: 'RAPID!' },
};

type Scene = { name: string; bgTop: string; bgBot: string; ground: string; particle?: 'stars' | 'leaves' | 'snow' };
const SCENES: Scene[] = [
  { name: '森林', bgTop: '#1a4d2e', bgBot: '#2d6a4f', ground: '#081c28', particle: 'leaves' },
  { name: '城市', bgTop: '#2d1b4e', bgBot: '#4a2478', ground: '#1a0d2e' },
  { name: '太空', bgTop: '#0a0a2e', bgBot: '#1d1d4e', ground: '#050518', particle: 'stars' },
];

function defaultSave(): Save {
  return { playerName: '', highScore: 0, totalStars: 0, selectedHero: 'ultra-1', unlocked: ['ultra-1'] };
}

export default function JieanGame() {
  const [save, setSave] = useState<Save>(defaultSave);
  const [view, setView] = useState<'name' | 'home' | 'play' | 'result' | 'hero-select'>('name');
  const [nameInput, setNameInput] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalStars, setFinalStars] = useState(0);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount (SSR-safe)
    loadMuted();
    const loaded = loadSave<Save>(GAME_KEY, defaultSave());
    const name = loaded.playerName || getPlayerName();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating client-only state from localStorage
    setSave(loaded);
    setMutedState(isMuted());
    if (name) {

      setNameInput(name);

      setView('home');
    }

    setLeaderboard(getLeaderboard(GAME_KEY));
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) { unlockAudio(); play('select'); }
  }

  useEffect(() => {
    if (view !== 'name') saveSave(GAME_KEY, save);
  }, [save, view]);

  function confirmName() {
    const n = nameInput.trim();
    if (!n) return;
    unlockAudio();
    play('select');
    setPlayerName(n);
    setSave(s => ({ ...s, playerName: n }));
    setView('home');
  }

  function onGameOver(score: number, stars: number) {
    play('timeUp');
    setFinalScore(score);
    setFinalStars(stars);
    setSave(s => {
      const hi = Math.max(s.highScore, score);
      const totalStars = s.totalStars + stars;
      const unlocked = [...s.unlocked];
      for (const h of HEROES) {
        if (totalStars >= h.needStars && !unlocked.includes(h.id)) unlocked.push(h.id);
      }
      return { ...s, highScore: hi, totalStars, unlocked };
    });
    submitScore(GAME_KEY, { name: save.playerName || '玩家', score, meta: { stars } });
    setLeaderboard(getLeaderboard(GAME_KEY));
    setView('result');
  }

  if (view === 'name') {
    return (
      <div className={styles.shell}>
        <div className={styles.namePrompt}>
          <h2>你好！你叫什麼？</h2>
          <input
            className={styles.nameInput}
            maxLength={12}
            placeholder="輸入名字"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirmName()}
            autoFocus
          />
          <button className={styles.bigBtn} onClick={confirmName} disabled={!nameInput.trim()}>
            開始 →
          </button>
          <div style={{ marginTop: 16 }}>
            <Link href="/games" style={{ color: '#9fb3d6', fontSize: '0.85rem' }}>← 回大廳</Link>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'play') {
    return <ShooterCanvas heroSprite={HEROES.find(h => h.id === save.selectedHero)!.sprite}
      heroTint={HEROES.find(h => h.id === save.selectedHero)!.tint}
      onGameOver={onGameOver} onQuit={() => setView('home')} />;
  }

  if (view === 'result') {
    const newHigh = finalScore >= save.highScore && finalScore > 0;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <Link href="/games" className={styles.backBtn}>← 大廳</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>
            {newHigh ? '🏆 新紀錄！' : '🎉 遊戲結束'}
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#ffd43b', margin: '20px 0' }}>
            {finalScore}
          </div>
          <div style={{ fontSize: '1.4rem', marginBottom: 24 }}>
            ⭐ × {finalStars}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className={`${styles.bigBtn} ${styles.warm}`} onClick={() => setView('play')}>
              再玩一次 🔁
            </button>
            <button className={styles.bigBtn} onClick={() => setView('home')}>
              回主頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'hero-select') {
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => setView('home')}>← 回去</button>
          <div style={{ fontWeight: 700 }}>⭐ {save.totalStars}</div>
        </div>
        <h2 className={styles.sectionTitle}>選戰士</h2>
        <div className={styles.dexGrid}>
          {HEROES.map(h => {
            const unlocked = save.unlocked.includes(h.id);
            const selected = save.selectedHero === h.id;
            return (
              <div
                key={h.id}
                className={styles.dexCard}
                style={{
                  borderColor: selected ? '#ffd43b' : undefined,
                  opacity: unlocked ? 1 : 0.4,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  filter: unlocked ? 'none' : 'grayscale(1)',
                }}
                onClick={() => unlocked && setSave(s => ({ ...s, selectedHero: h.id }))}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.sprite} alt={h.name} style={{ filter: `drop-shadow(0 0 6px ${h.tint}) brightness(1.4)` }} />
                <div className={styles.dexName}>{unlocked ? h.name : `🔒 ${h.needStars}⭐`}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // home
  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link href="/games" className={styles.backBtn}>← 大廳</Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className={styles.backBtn} onClick={toggleMute} aria-label={muted ? '開聲音' : '關聲音'}>
            {muted ? '🔇' : '🔊'}
          </button>
          <div style={{ fontWeight: 700 }}>{save.playerName}</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: '1rem', color: '#9fb3d6' }}>最高分</div>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffd43b' }}>{save.highScore}</div>
        <div style={{ fontSize: '1rem' }}>⭐ 總星星 {save.totalStars}</div>
      </div>

      <div style={{ textAlign: 'center', margin: '28px 0' }}>
        <button className={`${styles.bigBtn} ${styles.warm}`} onClick={() => { unlockAudio(); play('startGame'); setView('play'); }} style={{ fontSize: '1.3rem', padding: '18px 40px' }}>
          ▶ 開始打怪
        </button>
        <div style={{ marginTop: 14 }}>
          <button className={styles.bigBtn} onClick={() => setView('hero-select')}>
            換戰士 (有 {save.unlocked.length}/{HEROES.length})
          </button>
        </div>
      </div>

      <div className={styles.leaderBoard}>
        <h3>🏆 排行榜</h3>
        {leaderboard.length === 0 ? (
          <p style={{ color: '#9fb3d6', fontSize: '0.9rem' }}>還沒有紀錄，來當第一名！</p>
        ) : (
          leaderboard.slice(0, 5).map((e, i) => (
            <div key={i} className={styles.leaderRow}>
              <span className={styles.rank}>#{i + 1}</span>
              <span className={styles.name}>{e.name}</span>
              <span className={styles.score}>{e.score}</span>
            </div>
          ))
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, color: '#9fb3d6', fontSize: '0.85rem' }}>
        怎麼玩：點怪獸就能打爆牠！越晚點越危險！
      </p>
    </div>
  );
}

// ---------- Canvas Game ----------

function ShooterCanvas({
  heroSprite,
  heroTint,
  onGameOver,
  onQuit,
}: {
  heroSprite: string;
  heroTint: string;
  onGameOver: (score: number, stars: number) => void;
  onQuit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [activeBuff, setActiveBuff] = useState<PowerupKind | null>(null);
  const [sceneName, setSceneName] = useState(SCENES[0].name);

  const scoreRef = useRef(0);
  const starsRef = useRef(0);
  const comboRef = useRef(0);
  const lastHitTimeRef = useRef(0);
  const monstersRef = useRef<Monster[]>([]);
  const effectsRef = useRef<Effect[]>([]);
  const powerupsRef = useRef<Powerup[]>([]);
  const nextIdRef = useRef(1);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const monsterImgs = useRef<Map<string, HTMLImageElement>>(new Map());
  const lastSpawnRef = useRef(0);
  const lastBossRef = useRef(0);
  const shieldUntilRef = useRef(0);
  const rapidUntilRef = useRef(0);
  const sceneIdxRef = useRef(0);

  useEffect(() => {
    const hero = new Image();
    hero.src = heroSprite;
    heroImgRef.current = hero;
    MONSTERS.forEach(m => {
      const img = new Image();
      img.src = m.sprite;
      monsterImgs.current.set(m.id, img);
    });
  }, [heroSprite]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    startTimeRef.current = performance.now();
    runningRef.current = true;
    monstersRef.current = [];
    effectsRef.current = [];
    powerupsRef.current = [];
    scoreRef.current = 0;
    starsRef.current = 0;
    comboRef.current = 0;
    lastHitTimeRef.current = 0;
    lastSpawnRef.current = 0;
    lastBossRef.current = performance.now(); // no boss at 0
    shieldUntilRef.current = 0;
    rapidUntilRef.current = 0;
    sceneIdxRef.current = 0;
    setScore(0); setStars(0); setCombo(0); setActiveBuff(null); setSceneName(SCENES[0].name);
    setTimeLeft(GAME_DURATION);

    const killMonster = (m: Monster, fromTap = true) => {
      const now = performance.now();
      // Combo logic
      if (now - lastHitTimeRef.current < 1500) {
        comboRef.current += 1;
      } else {
        comboRef.current = 1;
      }
      lastHitTimeRef.current = now;
      const multiplier = Math.min(5, 1 + Math.floor(comboRef.current / 3));
      const gained = Math.round((m.isBoss ? 50 : m.kind.score) * multiplier);

      effectsRef.current.push({ id: nextIdRef.current++, x: m.x, y: m.y, age: 0, life: 500, kind: 'boom' });
      if (fromTap) {
        const rect = canvas.getBoundingClientRect();
        effectsRef.current.push({
          id: nextIdRef.current++,
          x: rect.width / 2, y: rect.height - 90, bx: m.x, by: m.y,
          age: 0, life: 180, kind: 'beam',
        });
      }
      effectsRef.current.push({ id: nextIdRef.current++, x: m.x, y: m.y - 20, age: 0, life: 700, kind: 'star' });
      if (multiplier > 1) {
        effectsRef.current.push({
          id: nextIdRef.current++, x: m.x, y: m.y - 50,
          age: 0, life: 800, kind: 'text',
          text: `×${multiplier}`, color: '#ffd43b',
        });
      }
      scoreRef.current += gained;
      starsRef.current += m.isBoss ? 3 : 1;
      setScore(scoreRef.current);
      setStars(starsRef.current);
      setCombo(comboRef.current);
      play('boom');
      setTimeout(() => play('star'), 80);

      // Boss drops a powerup on death
      if (m.isBoss || Math.random() < 0.12) {
        const kinds: PowerupKind[] = ['bomb', 'shield', 'rapid'];
        const pk = kinds[Math.floor(Math.random() * kinds.length)];
        powerupsRef.current.push({
          id: nextIdRef.current++,
          x: m.x, y: m.y,
          vy: 60,
          kind: pk,
          emoji: POWERUPS[pk].emoji,
        });
      }
      monstersRef.current = monstersRef.current.filter(x => x.id !== m.id);
    };

    const activatePowerup = (kind: PowerupKind) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      effectsRef.current.push({
        id: nextIdRef.current++, x: w / 2, y: h / 2,
        age: 0, life: 900, kind: 'text',
        text: POWERUPS[kind].label, color: '#ffd43b',
      });
      play('startGame');
      setActiveBuff(kind);
      if (kind === 'bomb') {
        // Kill all monsters on screen
        const snapshot = [...monstersRef.current];
        for (const m of snapshot) killMonster(m, false);
        setTimeout(() => setActiveBuff(null), 300);
      } else if (kind === 'shield') {
        shieldUntilRef.current = performance.now() + 5000;
        setTimeout(() => setActiveBuff(null), 5000);
      } else if (kind === 'rapid') {
        rapidUntilRef.current = performance.now() + 5000;
        setTimeout(() => setActiveBuff(null), 5000);
      }
    };

    const handleTap = (cx: number, cy: number) => {
      if (!runningRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = cx - rect.left;
      const y = cy - rect.top;

      // Check powerup picks
      for (const p of powerupsRef.current) {
        const dx = p.x - x;
        const dy = p.y - y;
        if (dx * dx + dy * dy < 42 * 42) {
          activatePowerup(p.kind);
          powerupsRef.current = powerupsRef.current.filter(q => q.id !== p.id);
          return;
        }
      }

      // Find nearest monster (larger radius if rapid fire)
      const rapidActive = performance.now() < rapidUntilRef.current;
      const hitBoost = rapidActive ? 1.5 : 1;
      let best: Monster | null = null;
      let bestD = Infinity;
      for (const m of monstersRef.current) {
        const dx = m.x - x;
        const dy = m.y - y;
        const d = dx * dx + dy * dy;
        const radius = 45 * m.scale * hitBoost;
        if (d < radius * radius && d < bestD) {
          best = m;
          bestD = d;
        }
      }
      if (best) {
         
        best.hp -= 1;
        if (best.hp <= 0) {
          killMonster(best, true);
        } else {
          play('hit');
          effectsRef.current.push({ id: nextIdRef.current++, x: best.x, y: best.y, age: 0, life: 200, kind: 'boom' });
        }
      }
    };

    const onPointer = (ev: PointerEvent) => {
      ev.preventDefault();
      handleTap(ev.clientX, ev.clientY);
    };
    canvas.addEventListener('pointerdown', onPointer);

    const spawnMonster = (w: number, h: number, difficulty: number) => {
      const kind = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
      const fromLeft = Math.random() < 0.5;
      const img = monsterImgs.current.get(kind.id)!;
      const scale = 0.8 + Math.random() * 0.3;
      const y0 = h * 0.25 + Math.random() * (h * 0.45);
      const baseSpeed = 38 + Math.random() * 18;
      const speed = baseSpeed * kind.speedMul * difficulty;
      monstersRef.current.push({
        id: nextIdRef.current++,
        kind,
        x: fromLeft ? -60 : w + 60,
        y: y0, y0,
        vx: fromLeft ? speed : -speed,
        img, scale,
        hp: 1, maxHp: 1,
        phase: Math.random() * Math.PI * 2,
        isBoss: false,
      });
    };

    const spawnBoss = (w: number, h: number) => {
      const kind = MONSTERS.find(k => k.id === 'trex') ?? MONSTERS[0];
      const fromLeft = Math.random() < 0.5;
      const img = monsterImgs.current.get(kind.id)!;
      const y0 = h * 0.4;
      const speed = 30;
      monstersRef.current.push({
        id: nextIdRef.current++,
        kind,
        x: fromLeft ? -100 : w + 100,
        y: y0, y0,
        vx: fromLeft ? speed : -speed,
        img, scale: 2.0,
        hp: 3, maxHp: 3,
        phase: 0,
        isBoss: true,
      });
      effectsRef.current.push({
        id: nextIdRef.current++, x: w / 2, y: h / 2 - 40,
        age: 0, life: 1000, kind: 'text',
        text: '⚠ BOSS!', color: '#ff6b6b',
      });
    };

    const loop = (now: number) => {
      if (!runningRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const elapsed = (now - startTimeRef.current) / 1000;
      const timeLeftSec = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(Math.ceil(timeLeftSec));

      // Scene index based on time
      const newSceneIdx = elapsed < 20 ? 0 : elapsed < 40 ? 1 : 2;
      if (newSceneIdx !== sceneIdxRef.current) {
        sceneIdxRef.current = newSceneIdx;
        setSceneName(SCENES[newSceneIdx].name);
        effectsRef.current.push({
          id: nextIdRef.current++, x: w / 2, y: h / 2,
          age: 0, life: 1500, kind: 'text',
          text: `— ${SCENES[newSceneIdx].name} —`, color: '#fff',
        });
      }
      const scene = SCENES[sceneIdxRef.current];

      if (timeLeftSec <= 0) {
        runningRef.current = false;
        canvas.removeEventListener('pointerdown', onPointer);
        onGameOver(scoreRef.current, starsRef.current);
        return;
      }

      // Combo decay (visual)
      if (now - lastHitTimeRef.current > 1500 && comboRef.current > 0) {
        comboRef.current = 0;
        setCombo(0);
      }

      // Difficulty / spawn
      const difficulty = 1 + elapsed / 20;
      const spawnInterval = Math.max(300, 1100 - elapsed * 13);
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        spawnMonster(w, h, difficulty);
      }
      // Boss every 20s
      if (now - lastBossRef.current > 20000) {
        lastBossRef.current = now;
        spawnBoss(w, h);
      }

      // Draw background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, scene.bgTop);
      grad.addColorStop(1, scene.bgBot);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Scene particles
      if (scene.particle === 'stars') {
        for (let i = 0; i < 40; i++) {
          const sx = (i * 97 + (elapsed * 10)) % w;
          const sy = (i * 53 + elapsed * 20) % h;
          ctx.fillStyle = `rgba(255,255,255,${0.15 + (i % 3) * 0.1})`;
          ctx.fillRect(sx, sy, 2, 2);
        }
      } else if (scene.particle === 'leaves') {
        for (let i = 0; i < 18; i++) {
          const sx = (i * 71 + elapsed * 30) % w;
          const sy = (i * 37 + elapsed * 50) % h;
          ctx.fillStyle = `rgba(139,220,88,${0.2 + (i % 4) * 0.05})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // City lights
        for (let i = 0; i < 15; i++) {
          const sx = (i * 113) % w;
          const sy = h * 0.55 + (i % 3) * 25;
          ctx.fillStyle = `rgba(255,212,59,${0.3 + 0.3 * Math.sin(elapsed * 2 + i)})`;
          ctx.fillRect(sx, sy, 4, 4);
        }
      }

      // Ground
      ctx.fillStyle = scene.ground;
      ctx.fillRect(0, h - 50, w, 50);

      // Hero
      const hero = heroImgRef.current;
      if (hero && hero.complete) {
        ctx.save();
        const shieldOn = performance.now() < shieldUntilRef.current;
        ctx.filter = `drop-shadow(0 0 ${shieldOn ? 24 : 14}px ${shieldOn ? '#4dabf7' : heroTint}) brightness(1.5)`;
        const heroSize = 110;
        ctx.drawImage(hero, w / 2 - heroSize / 2, h - heroSize - 20, heroSize, heroSize);
        if (shieldOn) {
          ctx.filter = 'none';
          ctx.strokeStyle = 'rgba(77,171,247,0.8)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(w / 2, h - heroSize / 2 - 20, heroSize * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update + draw monsters
      const dt = 1 / 60;
      for (const m of monstersRef.current) {
        m.x += m.vx * dt;
        // Motion patterns
        if (m.kind.motion === 'zigzag') {
          m.y = m.y0 + Math.sin((elapsed + m.phase) * 5) * 30;
        } else if (m.kind.motion === 'jumper') {
          const t = (elapsed + m.phase) * 3;
          m.y = m.y0 - Math.max(0, Math.sin(t)) * 45;
        } else if (m.kind.motion === 'flyer') {
          m.y = m.y0 + Math.sin((elapsed + m.phase) * 2) * 60 - 40;
        }
      }

      // Hero hit zone
      const heroZone = { xMin: w / 2 - 60, xMax: w / 2 + 60, yMin: h - 140 };
      const shieldOn = performance.now() < shieldUntilRef.current;
      for (const m of [...monstersRef.current]) {
        if (m.x > heroZone.xMin && m.x < heroZone.xMax && m.y > heroZone.yMin) {
          if (shieldOn) {
            // Shield kills them
            killMonster(m, false);
          } else {
            startTimeRef.current -= 3000;
            effectsRef.current.push({
              id: nextIdRef.current++, x: w / 2, y: h - 90,
              age: 0, life: 300, kind: 'boom',
            });
            play('hurt');
            comboRef.current = 0;
            setCombo(0);
            monstersRef.current = monstersRef.current.filter(x => x.id !== m.id);
          }
        }
      }
      monstersRef.current = monstersRef.current.filter(m => m.x > -150 && m.x < w + 150);

      // Draw monsters
      for (const m of monstersRef.current) {
        if (!m.img.complete) continue;
        ctx.save();
        const size = 80 * m.scale;
        ctx.filter = m.isBoss
          ? 'drop-shadow(0 0 16px #ff6b6b) brightness(1.4)'
          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4)) brightness(1.3)';
        if (m.vx > 0) {
          ctx.translate(m.x + size / 2, m.y);
          ctx.scale(-1, 1);
          ctx.drawImage(m.img, 0, -size / 2, size, size);
        } else {
          ctx.drawImage(m.img, m.x - size / 2, m.y - size / 2, size, size);
        }
        ctx.restore();
        // Boss HP bar
        if (m.isBoss) {
          const bx = m.x - 50;
          const by = m.y - size / 2 - 14;
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(bx, by, 100, 8);
          ctx.fillStyle = '#ff6b6b';
          ctx.fillRect(bx, by, 100 * (m.hp / m.maxHp), 8);
        }
      }

      // Update + draw powerups
      for (const p of powerupsRef.current) {
        p.y += p.vy * dt;
      }
      powerupsRef.current = powerupsRef.current.filter(p => p.y < h - 60);
      for (const p of powerupsRef.current) {
        ctx.save();
        ctx.font = 'bold 42px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffd43b';
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      }

      // Effects
      const finished: number[] = [];
      for (const e of effectsRef.current) {
        e.age += 16;
        const t = e.age / e.life;
        if (e.kind === 'boom') {
          const r = 20 + t * 60;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.fillStyle = '#ffd43b';
          ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ff6b6b';
          ctx.globalAlpha = Math.max(0, 0.8 - t);
          ctx.beginPath(); ctx.arc(e.x, e.y, r * 0.6, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else if (e.kind === 'star') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.fillStyle = '#ffd43b';
          ctx.font = 'bold 28px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText('⭐', e.x, e.y - t * 60);
          ctx.restore();
        } else if (e.kind === 'beam') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.strokeStyle = heroTint;
          ctx.lineWidth = 8;
          ctx.shadowBlur = 20;
          ctx.shadowColor = heroTint;
          ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.bx!, e.by!); ctx.stroke();
          ctx.restore();
        } else if (e.kind === 'text') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.fillStyle = e.color ?? '#fff';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 4;
          ctx.font = 'bold 42px system-ui';
          ctx.textAlign = 'center';
          ctx.strokeText(e.text ?? '', e.x, e.y - t * 40);
          ctx.fillText(e.text ?? '', e.x, e.y - t * 40);
          ctx.restore();
        }
        if (e.age > e.life) finished.push(e.id);
      }
      if (finished.length) {
        effectsRef.current = effectsRef.current.filter(e => !finished.includes(e.id));
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const comboMultiplier = Math.min(5, 1 + Math.floor(combo / 3));

  return (
    <div className={styles.shell}>
      <div className={styles.shooterWrap}>
        <div className={styles.shooterHud}>
          <button className={styles.backBtn} onClick={onQuit}>← 離開</button>
          <div>⏱ {timeLeft}s · {sceneName}</div>
          <div>
            <span className={styles.shooterStar}>⭐ {stars}</span>
            <span style={{ marginLeft: 12 }}>{score}</span>
          </div>
        </div>
        <canvas ref={canvasRef} className={styles.shooterCanvas} />
        <div className={styles.shooterHud} style={{ padding: '8px 16px' }}>
          {combo >= 3 && <div style={{ color: '#ffd43b', fontWeight: 800 }}>🔥 Combo ×{combo} (分數 ×{comboMultiplier})</div>}
          {activeBuff && <div style={{ color: '#4dabf7', fontWeight: 800 }}>{POWERUPS[activeBuff].emoji} {POWERUPS[activeBuff].label}</div>}
        </div>
      </div>
    </div>
  );
}
