'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '../games.module.css';
import {
  ALL_FIGHTERS,
  Fighter,
  ITEMS,
  Item,
  LEVELS,
  STARTER_TEAM,
  TYPE_COLOR,
  TYPE_LABEL,
  getFighter,
  xpForNext,
} from '@/lib/games/data';
import {
  BattleUnit,
  aiPickSkill,
  applyDamage,
  computeDamage,
  healHp,
  isDefeated,
  makeUnit,
  regenMp,
  spendMp,
} from '@/lib/games/battle';
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

const GAME_KEY = 'muzhe';

type Save = {
  playerName: string;
  owned: string[]; // fighter ids
  team: string[]; // fighter ids (up to 3)
  cleared: number[]; // level ids
  stars: Record<number, number>; // per-level stars 0-3
  totalStars: number;
  levels: Record<string, { lv: number; xp: number }>;
  items: Record<string, number>;
};

type View = 'name' | 'home' | 'team' | 'dex' | 'level-select' | 'story' | 'battle' | 'items';

type BattlePhase = 'idle' | 'player' | 'enemy' | 'victory' | 'defeat';

type DamageNum = { id: number; value: string; kind: 'normal' | 'super' | 'weak' | 'crit' | 'heal'; target: 'ally' | 'enemy' };
type AnimFlag = { attack?: 'ally' | 'enemy'; hit?: 'ally' | 'enemy'; crit?: boolean };
type PendingTeamTarget = { item: Item } | null;

function defaultSave(): Save {
  const levels: Record<string, { lv: number; xp: number }> = {};
  for (const id of STARTER_TEAM) levels[id] = { lv: 1, xp: 0 };
  return {
    playerName: '',
    owned: [...STARTER_TEAM],
    team: [...STARTER_TEAM],
    cleared: [],
    stars: {},
    totalStars: 0,
    levels,
    items: { potion: 2, ether: 1 },
  };
}

function getLevel(save: Save, id: string): number {
  return save.levels[id]?.lv ?? 1;
}

function isSvg(path: string) {
  return path.endsWith('.svg');
}

function Portrait({ fighter, size = 56 }: { fighter: Fighter; size?: number }) {
  return (
    <div
      className={`${styles.fighterPortrait} ${isSvg(fighter.sprite) ? styles.svgTint : ''}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fighter.sprite} alt={fighter.name} />
    </div>
  );
}

function TypeChip({ type }: { type: Fighter['type'] }) {
  return (
    <span className={styles.typeChip} style={{ background: TYPE_COLOR[type] }}>
      {TYPE_LABEL[type]}
    </span>
  );
}

function FighterBars({ unit }: { unit: BattleUnit }) {
  const hpPct = (unit.hp / unit.fighter.maxHp) * 100;
  const mpPct = (unit.mp / unit.fighter.maxMp) * 100;
  return (
    <>
      <div className={styles.barLabel}>HP {unit.hp}/{unit.fighter.maxHp}</div>
      <div className={`${styles.bar} ${styles.hpBar}`}>
        <div className={styles.barFill} style={{ width: `${hpPct}%` }} />
      </div>
      <div className={styles.barLabel}>MP {unit.mp}/{unit.fighter.maxMp}</div>
      <div className={`${styles.bar} ${styles.mpBar}`}>
        <div className={styles.barFill} style={{ width: `${mpPct}%` }} />
      </div>
    </>
  );
}

export default function MuzheGame() {
  const [save, setSave] = useState<Save>(defaultSave);
  const [view, setView] = useState<View>('name');
  const [nameInput, setNameInput] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Battle state
  const [levelId, setLevelId] = useState<number | null>(null);
  const [ally, setAlly] = useState<BattleUnit[]>([]);
  const [enemy, setEnemy] = useState<BattleUnit | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>('idle');
  const [log, setLog] = useState<{ text: string; kind?: string }[]>([]);
  const [muted, setMutedState] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [anim, setAnim] = useState<AnimFlag>({});
  const [dmgNums, setDmgNums] = useState<DamageNum[]>([]);
  const [bossWarning, setBossWarning] = useState<string | null>(null);
  const [pendingItem, setPendingItem] = useState<PendingTeamTarget>(null);
  const [levelUpMsg, setLevelUpMsg] = useState<string | null>(null);
  const dmgIdRef = useRef(0);

  // Load save on mount
  useEffect(() => {
    loadMuted();
    const loaded = loadSave<Save>(GAME_KEY, defaultSave());
    const playerName = loaded.playerName || getPlayerName();

    setSave(loaded);
     
    setMutedState(isMuted());
    if (playerName) {

      setNameInput(playerName);

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

  // Persist save whenever it changes (after initial load)
  useEffect(() => {
    if (view !== 'name') saveSave(GAME_KEY, save);
  }, [save, view]);

  function confirmName() {
    const name = nameInput.trim();
    if (!name) return;
    unlockAudio();
    play('select');
    setPlayerName(name);
    setSave(s => ({ ...s, playerName: name }));
    setView('home');
  }

  function openStory(lid: number) {
    setLevelId(lid);
    setView('story');
    play('select');
  }

  function startBattle() {
    const lid = levelId;
    if (lid == null) return;
    const lvl = LEVELS.find(l => l.id === lid);
    if (!lvl) return;
    const allies = save.team.map(id => makeUnit(getFighter(id), getLevel(save, id)));
    const bossLv = Math.max(1, Math.floor(lid * 0.8));
    const enemyUnit = makeUnit(getFighter(lvl.boss), bossLv);
    enemyUnit.atkMod = 1 + lid * 0.02;
    setAlly(allies);
    setEnemy(enemyUnit);
    setActiveIdx(allies.findIndex(u => u.hp > 0));
    setLog([{ text: `⚔️ ${lvl.name} 開始！` }]);
    setPhase('player');
    setTurnCount(0);
    setAnim({});
    setDmgNums([]);
    setBossWarning(null);
    setPendingItem(null);
    setView('battle');
    play('startGame');
  }

  function flashDamage(target: 'ally' | 'enemy', value: string, kind: DamageNum['kind']) {
    const id = ++dmgIdRef.current;
    setDmgNums(prev => [...prev, { id, value, kind, target }]);
    setTimeout(() => setDmgNums(prev => prev.filter(d => d.id !== id)), 1200);
  }

  function flashAnim(flag: AnimFlag, ms = 600) {
    setAnim(flag);
    setTimeout(() => setAnim({}), ms);
  }

  function pushLog(text: string, kind?: string) {
    setLog(l => [...l.slice(-8), { text, kind }]);
  }

  function playerAttack(skillIdx: number) {
    if (phase !== 'player' || !enemy) return;
    const me = ally[activeIdx];
    if (!me || isDefeated(me)) return;
    const skill = me.fighter.skills[skillIdx];
    if (me.mp < skill.mpCost) {
      pushLog(`MP 不夠！`, 'weak');
      return;
    }
    spendMp(me, skill.mpCost);
    const res = computeDamage(me, enemy, skill);
    applyDamage(enemy, res.damage);
    // Consume damageMul buff if applied (mutation OK — we re-set state via setAlly below)
    // eslint-disable-next-line react-hooks/immutability
    if (me.damageMul !== 1) me.damageMul = 1;
    pushLog(res.log, res.effective === 'super' ? 'super' : res.effective === 'weak' ? 'weak' : res.crit ? 'crit' : undefined);
    if (res.crit) play('crit');
    else if (res.effective === 'super') play('super');
    else if (res.effective === 'weak') play('weak');
    else play('hit');
    flashAnim({ attack: 'ally', hit: 'enemy', crit: res.crit });
    flashDamage('enemy', String(res.damage), res.crit ? 'crit' : res.effective);
    setAlly([...ally]);
    setEnemy({ ...enemy });
    if (isDefeated(enemy)) {
      setTimeout(() => endBattle(true), 700);
      setPhase('idle');
      return;
    }
    setPhase('enemy');
    setTimeout(enemyTurn, 900);
  }

  function enemyTurn() {
    if (!enemy) return;
    const aliveAllies = ally.filter(u => !isDefeated(u));
    if (aliveAllies.length === 0) {
      endBattle(false);
      return;
    }
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    // Boss special: warn one turn before, cast on the turn
    const bs = enemy.fighter.bossSpecial;
    const willUseSpecial = !!bs && newTurn % bs.interval === 0;
    const willWarn = !!bs && newTurn % bs.interval === bs.interval - 1;

    if (willWarn && bs) {
      setBossWarning(bs.warning);
      setTimeout(() => setBossWarning(null), 1500);
      pushLog(`⚠️ ${bs.warning}`, 'crit');
    }

    // eslint-disable-next-line react-hooks/purity -- intentional randomness for enemy AI
    const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
    const skill = willUseSpecial && bs ? bs.skill : aiPickSkill(enemy, target);
    if (!willUseSpecial) spendMp(enemy, skill.mpCost);
    const res = computeDamage(enemy, target, skill);
    applyDamage(target, res.damage);
    pushLog(res.log, res.effective === 'super' ? 'super' : res.effective === 'weak' ? 'weak' : willUseSpecial ? 'crit' : undefined);
    play('hurt');
    flashAnim({ attack: 'enemy', hit: 'ally', crit: willUseSpecial || res.crit });
    flashDamage('ally', String(res.damage), willUseSpecial ? 'crit' : res.effective);
    // regen some MP for all
    ally.forEach(a => regenMp(a, 2));
    regenMp(enemy, 2);
    setAlly([...ally]);
    setEnemy({ ...enemy });
    const stillAlive = ally.filter(u => !isDefeated(u));
    if (stillAlive.length === 0) {
      setTimeout(() => endBattle(false), 700);
      setPhase('idle');
      return;
    }
    // Auto-switch if active is dead
    if (isDefeated(ally[activeIdx])) {
      const nextIdx = ally.findIndex(u => !isDefeated(u));
      setActiveIdx(nextIdx);
      pushLog(`${ally[nextIdx].fighter.name} 上場！`);
    }
    setPhase('player');
  }

  // ---- Items ----
  function beginUseItem(item: Item) {
    if (phase !== 'player') return;
    if ((save.items[item.id] ?? 0) <= 0) return;
    setPendingItem({ item });
  }

  function cancelItem() { setPendingItem(null); }

  function applyItemTo(targetIdx: number) {
    if (!pendingItem) return;
    const { item } = pendingItem;
    const target = ally[targetIdx];
    if (!target) return;
    let used = false;
    let logText = '';
    if (item.kind === 'heal' && !isDefeated(target)) {
      healHp(target, item.amount);
      flashDamage('ally', `+${item.amount}`, 'heal');
      used = true;
      logText = `${target.fighter.name} 喝下藥水，HP +${item.amount}`;
    } else if (item.kind === 'mp' && !isDefeated(target)) {
      // eslint-disable-next-line react-hooks/immutability
      target.mp = Math.min(target.maxMp, target.mp + item.amount);
      flashDamage('ally', `+${item.amount}MP`, 'heal');
      used = true;
      logText = `${target.fighter.name} 補充能量，MP +${item.amount}`;
    } else if (item.kind === 'revive' && isDefeated(target)) {
      target.hp = Math.round(target.maxHp * (item.amount / 100));
      flashDamage('ally', `REVIVE`, 'heal');
      used = true;
      logText = `${target.fighter.name} 復活了！HP ${target.hp}`;
    } else if (item.kind === 'attack-buff') {
      ally.forEach(a => { if (!isDefeated(a)) a.damageMul = item.amount; });
      flashDamage('ally', `ATK×${item.amount}`, 'heal');
      used = true;
      logText = `全隊進入狂暴狀態！下一次攻擊傷害 ×${item.amount}`;
    } else {
      pushLog('對這個對象無效', 'weak');
      setPendingItem(null);
      return;
    }
    if (used) {
      setSave(s => ({ ...s, items: { ...s.items, [item.id]: Math.max(0, (s.items[item.id] ?? 0) - 1) } }));
      pushLog(logText);
      play('star');
      setAlly([...ally]);
    }
    setPendingItem(null);
    // Item use consumes the turn
    if (enemy && !isDefeated(enemy)) {
      setPhase('enemy');
      setTimeout(enemyTurn, 700);
    }
  }

  function switchActive(idx: number) {
    if (phase !== 'player') return;
    if (idx === activeIdx) return;
    if (isDefeated(ally[idx])) return;
    setActiveIdx(idx);
    pushLog(`${ally[idx].fighter.name} 換人上場！`);
    // switching costs a turn
    setPhase('enemy');
    setTimeout(enemyTurn, 700);
  }

  function endBattle(won: boolean) {
    if (levelId == null) return;
    const lvl = LEVELS.find(l => l.id === levelId);
    if (!lvl) return;

    if (won) {
      const aliveAllies = ally.filter(u => !isDefeated(u)).length;
      const stars = aliveAllies >= 3 ? 3 : aliveAllies >= 2 ? 2 : 1;
      const wasCleared = save.cleared.includes(levelId);
      const prevStars = save.stars[levelId] ?? 0;
      const newStars = Math.max(prevStars, stars);
      const delta = newStars - prevStars;

      // XP: each participating ally earns xp = levelId * 12 + survive bonus
      const xpEarned = levelId * 12 + aliveAllies * 5;
      const leveledUp: string[] = [];

      setSave(s => {
        const owned = [...s.owned];
        if (lvl.reward && !owned.includes(lvl.reward)) owned.push(lvl.reward);

        const newLevels = { ...s.levels };
        for (const u of ally) {
          const id = u.fighter.id;
          const prev = newLevels[id] ?? { lv: 1, xp: 0 };
          let lv = prev.lv;
          let xp = prev.xp + xpEarned;
          while (xp >= xpForNext(lv) && lv < 15) {
            xp -= xpForNext(lv);
            lv++;
            leveledUp.push(u.fighter.name);
          }
          newLevels[id] = { lv, xp };
        }

        const newItems = { ...s.items };
        // Initialize level for any newly-owned reward
        if (lvl.reward && !newLevels[lvl.reward]) newLevels[lvl.reward] = { lv: 1, xp: 0 };
        if (lvl.itemReward) {
          newItems[lvl.itemReward] = (newItems[lvl.itemReward] ?? 0) + 1;
        }

        return {
          ...s,
          owned,
          cleared: wasCleared ? s.cleared : [...s.cleared, levelId],
          stars: { ...s.stars, [levelId]: newStars },
          totalStars: s.totalStars + delta,
          levels: newLevels,
          items: newItems,
        };
      });

      if (leveledUp.length) {
        const unique = Array.from(new Set(leveledUp));
        setLevelUpMsg(`🎉 升級了！${unique.join('、')}`);
      }

      // Submit leaderboard score: total stars * 100 + level cleared * 10
      const newScore = (save.totalStars + delta) * 100 + (save.cleared.length + (wasCleared ? 0 : 1)) * 10;
      submitScore(GAME_KEY, {
        name: save.playerName || '玩家',
        score: newScore,
        meta: { level: levelId, stars: newStars },
      });
      setLeaderboard(getLeaderboard(GAME_KEY));
    }
    setPhase(won ? 'victory' : 'defeat');
    play(won ? 'victory' : 'defeat');
  }

  function closeBattle() {
    setPhase('idle');
    setView('home');
    setLevelId(null);
    setEnemy(null);
    setAlly([]);
  }

  function setTeam(ids: string[]) {
    if (ids.length === 0 || ids.length > 3) return;
    setSave(s => ({ ...s, team: ids }));
  }

  const levelData = levelId ? LEVELS.find(l => l.id === levelId) : null;
  const rewardFighter = levelData?.reward ? getFighter(levelData.reward) : null;

  // ---- RENDER ----

  if (view === 'name') {
    return (
      <div className={styles.shell}>
        <div className={styles.namePrompt}>
          <h2>歡迎！你叫什麼名字？</h2>
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
            開始冒險 →
          </button>
          <div style={{ marginTop: 16 }}>
            <Link href="/games" style={{ color: '#9fb3d6', fontSize: '0.85rem' }}>← 回大廳</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link href="/games" className={styles.backBtn}>← 大廳</Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className={styles.backBtn} onClick={toggleMute} aria-label={muted ? '開聲音' : '關聲音'}>
            {muted ? '🔇' : '🔊'}
          </button>
          <div style={{ fontWeight: 700 }}>
            {save.playerName} · ⭐ {save.totalStars}
          </div>
        </div>
      </div>

      {view !== 'battle' && (
        <div className={styles.tabBar}>
          <button className={`${styles.tab} ${view === 'home' ? styles.active : ''}`} onClick={() => setView('home')}>🏠 主頁</button>
          <button className={`${styles.tab} ${view === 'team' ? styles.active : ''}`} onClick={() => setView('team')}>👥 隊伍</button>
          <button className={`${styles.tab} ${view === 'level-select' ? styles.active : ''}`} onClick={() => setView('level-select')}>⚔️ 關卡</button>
          <button className={`${styles.tab} ${view === 'dex' ? styles.active : ''}`} onClick={() => setView('dex')}>📖 圖鑑</button>
        </div>
      )}

      {view === 'home' && (
        <div>
          <h2 className={styles.sectionTitle}>你的隊伍</h2>
          <div className={styles.teamTray}>
            {save.team.map(id => {
              const f = getFighter(id);
              return (
                <div key={id} className={styles.teamSlot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.sprite} alt={f.name} style={isSvg(f.sprite) ? { filter: 'brightness(1.4)' } : {}} />
                  <div className={styles.miniName}>{f.name}</div>
                </div>
              );
            })}
          </div>
          <p style={{ marginTop: 12, color: '#9fb3d6', fontSize: '0.9rem' }}>
            屬性相剋：<TypeChip type="light" /> 打 <TypeChip type="ancient" /> 強，<TypeChip type="ancient" /> 打 <TypeChip type="beast" /> 強，<TypeChip type="beast" /> 打 <TypeChip type="light" /> 強
          </p>

          <h2 className={styles.sectionTitle}>排行榜</h2>
          <div className={styles.leaderBoard}>
            {leaderboard.length === 0 ? (
              <p style={{ color: '#9fb3d6', fontSize: '0.9rem' }}>還沒有人打過。你可以當第一名！</p>
            ) : (
              leaderboard.slice(0, 5).map((e, i) => (
                <div key={i} className={styles.leaderRow}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <span className={styles.name}>{e.name}</span>
                  <span className={styles.score}>{e.score} 分</span>
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className={`${styles.bigBtn} ${styles.danger}`} onClick={() => setView('level-select')}>
              開始戰鬥 →
            </button>
          </div>
        </div>
      )}

      {view === 'team' && (
        <div>
          <h2 className={styles.sectionTitle}>組隊（點選最多 3 隻）</h2>
          <p style={{ color: '#9fb3d6', fontSize: '0.9rem', marginBottom: 8 }}>
            已選 {save.team.length}/3 — 點擊切換
          </p>
          <div className={styles.dexGrid}>
            {save.owned.map(id => {
              const f = getFighter(id);
              const inTeam = save.team.includes(id);
              return (
                <div
                  key={id}
                  className={styles.dexCard}
                  style={{ borderColor: inTeam ? '#ffd43b' : undefined, cursor: 'pointer' }}
                  onClick={() => {
                    if (inTeam) {
                      if (save.team.length <= 1) return;
                      setTeam(save.team.filter(x => x !== id));
                    } else {
                      if (save.team.length >= 3) return;
                      setTeam([...save.team, id]);
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.sprite} alt={f.name} style={isSvg(f.sprite) ? { filter: 'brightness(1.4)' } : {}} />
                  <div className={styles.dexName}>{f.name}</div>
                  <div style={{ marginTop: 4 }}><TypeChip type={f.type} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'level-select' && (
        <div>
          <h2 className={styles.sectionTitle}>選關卡</h2>
          <div className={styles.levelGrid}>
            {LEVELS.map(lvl => {
              const unlocked = lvl.id === 1 || save.cleared.includes(lvl.id - 1);
              const cleared = save.cleared.includes(lvl.id);
              const stars = save.stars[lvl.id] ?? 0;
              return (
                <div
                  key={lvl.id}
                  className={`${styles.levelCard} ${!unlocked ? styles.locked : ''} ${cleared ? styles.cleared : ''}`}
                  onClick={() => unlocked && openStory(lvl.id)}
                >
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>
                    {!unlocked && '🔒 '}{lvl.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9fb3d6' }}>
                    Boss: {getFighter(lvl.boss).name}
                  </div>
                  {cleared && (
                    <div style={{ marginTop: 6, color: '#ffd43b' }}>
                      {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'dex' && (
        <div>
          <h2 className={styles.sectionTitle}>圖鑑（{save.owned.length}/{ALL_FIGHTERS.length}）</h2>
          <div className={styles.dexGrid}>
            {ALL_FIGHTERS.map(f => {
              const owned = save.owned.includes(f.id);
              return (
                <div key={f.id} className={`${styles.dexCard} ${!owned ? styles.locked : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.sprite} alt={f.name} style={isSvg(f.sprite) ? { filter: 'brightness(1.4)' } : {}} />
                  <div className={styles.dexName}>{owned ? f.name : '???'}</div>
                  {owned && <div style={{ marginTop: 4 }}><TypeChip type={f.type} /></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'story' && levelData && (
        <div className={styles.storyBox}>
          <h3>{levelData.name}</h3>
          <div className={styles.bossShowcase}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getFighter(levelData.boss).sprite} alt={getFighter(levelData.boss).name} />
            <div>
              <div style={{ fontSize: '0.8rem', color: '#ffd43b' }}>BOSS</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                {getFighter(levelData.boss).name}
                <TypeChip type={getFighter(levelData.boss).type} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9fb3d6' }}>Lv.{Math.max(1, Math.floor(levelData.id * 0.8))}</div>
            </div>
          </div>
          {levelData.story && <p>{levelData.story}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <button className={`${styles.bigBtn} ${styles.danger}`} onClick={startBattle}>⚔️ 出發！</button>
            <button className={styles.bigBtn} onClick={() => setView('level-select')}>← 回關卡</button>
          </div>
        </div>
      )}

      {view === 'battle' && enemy && (
        <div className={`${styles.battleStage} ${anim.crit ? styles.critShake : ''}`}>
          <div className={styles.battleField}>
            <div className={`${styles.battleRow} ${styles.enemy}`}>
              <div
                className={`${styles.fighterCard} ${anim.attack === 'enemy' ? styles.attackEnemy : ''} ${anim.hit === 'enemy' ? styles.hitEnemy : ''}`}
                style={{ position: 'relative' }}
              >
                <Portrait fighter={enemy.fighter} />
                <div className={styles.fighterInfo}>
                  <div className={styles.fighterName}>
                    {enemy.fighter.name}
                    <TypeChip type={enemy.fighter.type} />
                    <span className={styles.levelBadge}>Lv{enemy.level}</span>
                  </div>
                  <FighterBars unit={enemy} />
                </div>
                {dmgNums.filter(d => d.target === 'enemy').map(d => (
                  <span key={d.id} className={`${styles.damageNumber} ${styles[d.kind] ?? ''}`} style={{ left: '50%', top: '30%' }}>
                    {d.value}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.logBox}>
              {log.slice(-4).map((l, i) => (
                <div key={i} className={`${styles.logLine} ${l.kind ? styles[l.kind] : ''}`}>{l.text}</div>
              ))}
            </div>

            <div className={`${styles.battleRow} ${styles.ally}`}>
              {ally[activeIdx] && (
                <div
                  className={`${styles.fighterCard} ${anim.attack === 'ally' ? styles.attackAlly : ''} ${anim.hit === 'ally' ? styles.hitAlly : ''}`}
                  style={{ position: 'relative' }}
                >
                  <Portrait fighter={ally[activeIdx].fighter} />
                  <div className={styles.fighterInfo}>
                    <div className={styles.fighterName}>
                      {ally[activeIdx].fighter.name}
                      <TypeChip type={ally[activeIdx].fighter.type} />
                      <span className={styles.levelBadge}>Lv{ally[activeIdx].level}</span>
                    </div>
                    <FighterBars unit={ally[activeIdx]} />
                  </div>
                  {dmgNums.filter(d => d.target === 'ally').map(d => (
                    <span key={d.id} className={`${styles.damageNumber} ${styles[d.kind] ?? ''}`} style={{ left: '50%', top: '30%' }}>
                      {d.value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {bossWarning && <div className={styles.bossWarning}>⚠️ {bossWarning}</div>}

            {(phase === 'victory' || phase === 'defeat') && (
              <div className={styles.victoryOverlay}>
                <div className={`${styles.victoryTitle} ${phase === 'victory' ? styles.win : styles.lose}`}>
                  {phase === 'victory' ? '🎉 勝利！' : '💀 戰敗'}
                </div>
                {phase === 'victory' && rewardFighter && !save.owned.includes(rewardFighter.id) && (
                  <div style={{ marginBottom: 16 }}>
                    <div>獲得新夥伴！</div>
                    <div style={{ margin: '10px auto' }}>
                      <Portrait fighter={rewardFighter} size={80} />
                    </div>
                    <div style={{ fontWeight: 700 }}>{rewardFighter.name}</div>
                  </div>
                )}
                {phase === 'victory' && levelData?.itemReward && (
                  <div style={{ marginBottom: 12 }}>
                    獲得道具 {ITEMS[levelData.itemReward].emoji} {ITEMS[levelData.itemReward].name}！
                  </div>
                )}
                {phase === 'victory' && (
                  <div style={{ marginBottom: 12, color: '#ffd43b', fontSize: '1.4rem' }}>
                    {'⭐'.repeat(ally.filter(u => !isDefeated(u)).length >= 3 ? 3 : ally.filter(u => !isDefeated(u)).length >= 2 ? 2 : 1)}
                  </div>
                )}
                {phase === 'victory' && levelUpMsg && (
                  <div style={{ marginBottom: 12, color: '#c084fc' }}>{levelUpMsg}</div>
                )}
                <button className={styles.bigBtn} onClick={() => { setLevelUpMsg(null); closeBattle(); }}>回主頁</button>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div style={{ marginTop: 14 }}>
            {pendingItem ? (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>
                  選擇對象使用 {pendingItem.item.emoji} {pendingItem.item.name}
                  <button className={styles.backBtn} style={{ marginLeft: 8 }} onClick={cancelItem}>取消</button>
                </div>
                <div className={styles.teamTray}>
                  {ally.map((u, i) => (
                    <div
                      key={i}
                      className={`${styles.teamSlot} ${isDefeated(u) ? styles.dead : ''}`}
                      onClick={() => applyItemTo(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.fighter.sprite} alt={u.fighter.name} style={isSvg(u.fighter.sprite) ? { filter: 'brightness(1.4)' } : {}} />
                      <div className={styles.miniName}>
                        {u.fighter.name}
                        <div style={{ fontSize: '0.65rem', color: '#9fb3d6' }}>
                          {u.hp}/{u.maxHp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className={styles.skillGrid}>
                  {ally[activeIdx]?.fighter.skills.map((s, i) => (
                    <button
                      key={i}
                      className={styles.skillBtn}
                      disabled={phase !== 'player' || (ally[activeIdx]?.mp ?? 0) < s.mpCost}
                      onClick={() => playerAttack(i)}
                    >
                      <div className={styles.skillName}>{s.name}</div>
                      <div className={styles.skillMeta}>
                        威力 {s.power} · MP {s.mpCost}
                      </div>
                    </button>
                  ))}
                </div>

                <div className={styles.itemBar}>
                  {Object.values(ITEMS).map(item => {
                    const count = save.items[item.id] ?? 0;
                    return (
                      <button
                        key={item.id}
                        className={styles.itemBtn}
                        disabled={phase !== 'player' || count <= 0}
                        onClick={() => beginUseItem(item)}
                        title={item.description}
                      >
                        {item.emoji} {item.name}<span className={styles.itemCount}>×{count}</span>
                      </button>
                    );
                  })}
                </div>

                {ally.length > 1 && (
                  <>
                    <div style={{ marginTop: 14, fontSize: '0.9rem', color: '#9fb3d6' }}>隊伍（點擊換人，會讓對手攻擊一次）</div>
                    <div className={styles.teamTray}>
                      {ally.map((u, i) => (
                        <div
                          key={i}
                          className={`${styles.teamSlot} ${i === activeIdx ? styles.active : ''} ${isDefeated(u) ? styles.dead : ''}`}
                          onClick={() => switchActive(i)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u.fighter.sprite} alt={u.fighter.name} style={isSvg(u.fighter.sprite) ? { filter: 'brightness(1.4)' } : {}} />
                          <div className={styles.miniName}>
                            {u.fighter.name}
                            <div style={{ fontSize: '0.65rem', color: '#9fb3d6' }}>
                              {u.hp}/{u.maxHp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
