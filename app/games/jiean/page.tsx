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
  { id: 'red', name: '紅光戰士', sprite: '/games/assets/heroes/hero-red.svg', needStars: 0, tint: '#ff6b6b' },
  { id: 'blue', name: '藍光戰士', sprite: '/games/assets/heroes/hero-blue.svg', needStars: 50, tint: '#4dabf7' },
  { id: 'purple', name: '紫光戰士', sprite: '/games/assets/heroes/hero-purple.svg', needStars: 150, tint: '#cc5de8' },
];

type MonsterKind = {
  id: string;
  name: string;
  sprite: string;
  score: number;
  speedMul: number;
};

const MONSTERS: MonsterKind[] = [
  { id: 'trex', name: '暴龍', sprite: '/games/assets/dinos/trex.svg', score: 10, speedMul: 1 },
  { id: 'tri', name: '三角龍', sprite: '/games/assets/dinos/triceratops.svg', score: 8, speedMul: 0.9 },
  { id: 'stego', name: '劍龍', sprite: '/games/assets/dinos/stegosaurus.svg', score: 8, speedMul: 0.9 },
  { id: 'ptero', name: '翼龍', sprite: '/games/assets/dinos/pterodactyl.svg', score: 12, speedMul: 1.3 },
  { id: 'velo', name: '迅猛龍', sprite: '/games/assets/dinos/velociraptor.svg', score: 15, speedMul: 1.5 },
  { id: 'brachio', name: '長頸龍', sprite: '/games/assets/dinos/brachiosaurus.svg', score: 6, speedMul: 0.7 },
];

type Monster = {
  id: number;
  kind: MonsterKind;
  x: number;
  y: number;
  vx: number;
  img: HTMLImageElement;
  scale: number;
};

type Effect = {
  id: number;
  x: number;
  y: number;
  age: number;
  life: number;
  kind: 'boom' | 'star' | 'beam';
  bx?: number;
  by?: number;
};

function defaultSave(): Save {
  return { playerName: '', highScore: 0, totalStars: 0, selectedHero: 'red', unlocked: ['red'] };
}

export default function JieanGame() {
  const [save, setSave] = useState<Save>(defaultSave);
  const [view, setView] = useState<'name' | 'home' | 'play' | 'result' | 'hero-select'>('name');
  const [nameInput, setNameInput] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalStars, setFinalStars] = useState(0);

  useEffect(() => {
    // Hydrate from localStorage after mount (SSR-safe)
    const loaded = loadSave<Save>(GAME_KEY, defaultSave());
    const name = loaded.playerName || getPlayerName();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating client-only state from localStorage
    setSave(loaded);
    if (name) {
       
      setNameInput(name);
       
      setView('home');
    }
     
    setLeaderboard(getLeaderboard(GAME_KEY));
  }, []);

  useEffect(() => {
    if (view !== 'name') saveSave(GAME_KEY, save);
  }, [save, view]);

  function confirmName() {
    const n = nameInput.trim();
    if (!n) return;
    setPlayerName(n);
    setSave(s => ({ ...s, playerName: n }));
    setView('home');
  }

  function onGameOver(score: number, stars: number) {
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
        <div style={{ fontWeight: 700 }}>{save.playerName}</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: '1rem', color: '#9fb3d6' }}>最高分</div>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffd43b' }}>{save.highScore}</div>
        <div style={{ fontSize: '1rem' }}>⭐ 總星星 {save.totalStars}</div>
      </div>

      <div style={{ textAlign: 'center', margin: '28px 0' }}>
        <button className={`${styles.bigBtn} ${styles.warm}`} onClick={() => setView('play')} style={{ fontSize: '1.3rem', padding: '18px 40px' }}>
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
  const scoreRef = useRef(0);
  const starsRef = useRef(0);
  const monstersRef = useRef<Monster[]>([]);
  const effectsRef = useRef<Effect[]>([]);
  const nextIdRef = useRef(1);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const monsterImgs = useRef<Map<string, HTMLImageElement>>(new Map());
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    // Preload images
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

    // Handle HiDPI
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
    scoreRef.current = 0;
    starsRef.current = 0;
    lastSpawnRef.current = 0;
    setScore(0);
    setStars(0);
    setTimeLeft(GAME_DURATION);

    const handleTap = (cx: number, cy: number) => {
      if (!runningRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = cx - rect.left;
      const y = cy - rect.top;
      // Find the nearest monster within hit radius
      let best: Monster | null = null;
      let bestD = Infinity;
      for (const m of monstersRef.current) {
        const dx = m.x - x;
        const dy = m.y - y;
        const d = dx * dx + dy * dy;
        const radius = 45 * m.scale;
        if (d < radius * radius && d < bestD) {
          best = m;
          bestD = d;
        }
      }
      if (best) {
        // Kill monster, add score/stars, add effects
        effectsRef.current.push({
          id: nextIdRef.current++,
          x: best.x,
          y: best.y,
          age: 0,
          life: 400,
          kind: 'boom',
        });
        // Beam from hero
        const rectW = canvas.getBoundingClientRect().width;
        const rectH = canvas.getBoundingClientRect().height;
        effectsRef.current.push({
          id: nextIdRef.current++,
          x: rectW / 2,
          y: rectH - 90,
          bx: best.x,
          by: best.y,
          age: 0,
          life: 180,
          kind: 'beam',
        });
        effectsRef.current.push({
          id: nextIdRef.current++,
          x: best.x,
          y: best.y - 20,
          age: 0,
          life: 600,
          kind: 'star',
        });
        scoreRef.current += best.kind.score;
        starsRef.current += 1;
        setScore(scoreRef.current);
        setStars(starsRef.current);
        monstersRef.current = monstersRef.current.filter(m => m.id !== best!.id);
      }
    };

    const onPointer = (ev: PointerEvent) => {
      ev.preventDefault();
      handleTap(ev.clientX, ev.clientY);
    };
    canvas.addEventListener('pointerdown', onPointer);

    const loop = (now: number) => {
      if (!runningRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const elapsed = (now - startTimeRef.current) / 1000;
      const timeLeftSec = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(Math.ceil(timeLeftSec));

      if (timeLeftSec <= 0) {
        runningRef.current = false;
        canvas.removeEventListener('pointerdown', onPointer);
        onGameOver(scoreRef.current, starsRef.current);
        return;
      }

      // Difficulty ramps over time
      const difficulty = 1 + elapsed / 20; // starts 1, doubles around 20s
      const spawnInterval = Math.max(350, 1200 - elapsed * 15);

      // Spawn
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const kind = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        const fromLeft = Math.random() < 0.5;
        const img = monsterImgs.current.get(kind.id)!;
        const scale = 0.8 + Math.random() * 0.3;
        const y = h * 0.25 + Math.random() * (h * 0.45);
        const baseSpeed = 40 + Math.random() * 20;
        const speed = baseSpeed * kind.speedMul * difficulty;
        monstersRef.current.push({
          id: nextIdRef.current++,
          kind,
          x: fromLeft ? -60 : w + 60,
          y,
          vx: fromLeft ? speed : -speed,
          img,
          scale,
        });
      }

      // Clear
      ctx.fillStyle = '#0d1e3a';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      for (let i = 0; i < 30; i++) {
        const sx = (i * 97 + (elapsed * 10)) % w;
        const sy = (i * 53) % h;
        ctx.fillStyle = `rgba(255,255,255,${0.15 + (i % 3) * 0.1})`;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Ground
      ctx.fillStyle = '#1e3a66';
      ctx.fillRect(0, h - 50, w, 50);

      // Hero
      const hero = heroImgRef.current;
      if (hero && hero.complete) {
        ctx.save();
        ctx.filter = `drop-shadow(0 0 14px ${heroTint}) brightness(1.5)`;
        const heroSize = 110;
        ctx.drawImage(hero, w / 2 - heroSize / 2, h - heroSize - 20, heroSize, heroSize);
        ctx.restore();
      }

      // Update monsters
      const dt = 1 / 60;
      for (const m of monstersRef.current) {
        m.x += m.vx * dt;
      }
      // Check for monsters reaching hero zone → damage (lose time)
      const heroZone = { xMin: w / 2 - 60, xMax: w / 2 + 60, yMin: h - 130 };
      for (const m of [...monstersRef.current]) {
        if (m.x > heroZone.xMin && m.x < heroZone.xMax && m.y > heroZone.yMin) {
          // hit hero: shake + lose 3 seconds
          startTimeRef.current -= 3000;
          effectsRef.current.push({
            id: nextIdRef.current++, x: w / 2, y: h - 90, age: 0, life: 300, kind: 'boom'
          });
          monstersRef.current = monstersRef.current.filter(x => x.id !== m.id);
        }
      }
      // Remove way out of bounds
      monstersRef.current = monstersRef.current.filter(m => m.x > -120 && m.x < w + 120);

      // Draw monsters
      for (const m of monstersRef.current) {
        if (!m.img.complete) continue;
        ctx.save();
        const size = 80 * m.scale;
        ctx.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.4)) brightness(1.3)';
        // flip if moving right (came from left)
        if (m.vx > 0) {
          ctx.translate(m.x + size / 2, m.y);
          ctx.scale(-1, 1);
          ctx.drawImage(m.img, 0, -size / 2, size, size);
        } else {
          ctx.drawImage(m.img, m.x - size / 2, m.y - size / 2, size, size);
        }
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
          ctx.beginPath();
          ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ff6b6b';
          ctx.globalAlpha = Math.max(0, 0.8 - t);
          ctx.beginPath();
          ctx.arc(e.x, e.y, r * 0.6, 0, Math.PI * 2);
          ctx.fill();
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
          const alpha = Math.max(0, 1 - t);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = heroTint;
          ctx.lineWidth = 8;
          ctx.shadowBlur = 20;
          ctx.shadowColor = heroTint;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.bx!, e.by!);
          ctx.stroke();
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

  return (
    <div className={styles.shell}>
      <div className={styles.shooterWrap}>
        <div className={styles.shooterHud}>
          <button className={styles.backBtn} onClick={onQuit}>← 離開</button>
          <div>⏱ {timeLeft}s</div>
          <div>
            <span className={styles.shooterStar}>⭐ {stars}</span>
            <span style={{ marginLeft: 12 }}>{score} 分</span>
          </div>
        </div>
        <canvas ref={canvasRef} className={styles.shooterCanvas} />
      </div>
    </div>
  );
}
