'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../games.module.css';
import {
  ALL_FIGHTERS,
  Fighter,
  LEVELS,
  STARTER_TEAM,
  TYPE_COLOR,
  TYPE_LABEL,
  getFighter,
} from '@/lib/games/data';
import {
  BattleUnit,
  aiPickSkill,
  applyDamage,
  computeDamage,
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

const GAME_KEY = 'muzhe';

type Save = {
  playerName: string;
  owned: string[]; // fighter ids
  team: string[]; // fighter ids (up to 3)
  cleared: number[]; // level ids
  stars: Record<number, number>; // per-level stars 0-3
  totalStars: number;
};

type View = 'name' | 'home' | 'team' | 'dex' | 'level-select' | 'battle';

type BattlePhase = 'idle' | 'player' | 'enemy' | 'victory' | 'defeat';

function defaultSave(): Save {
  return {
    playerName: '',
    owned: [...STARTER_TEAM],
    team: [...STARTER_TEAM],
    cleared: [],
    stars: {},
    totalStars: 0,
  };
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

  // Load save on mount
  useEffect(() => {
    const loaded = loadSave<Save>(GAME_KEY, defaultSave());
    const playerName = loaded.playerName || getPlayerName();
     
    setSave(loaded);
    if (playerName) {
       
      setNameInput(playerName);
       
      setView('home');
    }
     
    setLeaderboard(getLeaderboard(GAME_KEY));
  }, []);

  // Persist save whenever it changes (after initial load)
  useEffect(() => {
    if (view !== 'name') saveSave(GAME_KEY, save);
  }, [save, view]);

  function confirmName() {
    const name = nameInput.trim();
    if (!name) return;
    setPlayerName(name);
    setSave(s => ({ ...s, playerName: name }));
    setView('home');
  }

  function startBattle(lid: number) {
    const lvl = LEVELS.find(l => l.id === lid);
    if (!lvl) return;
    const allies = save.team.map(id => makeUnit(getFighter(id)));
    const enemyUnit = makeUnit(getFighter(lvl.boss));
    // Boss slight buff
    enemyUnit.hp = Math.round(enemyUnit.fighter.maxHp * (1 + lid * 0.05));
    enemyUnit.atkMod = 1 + lid * 0.03;
    setAlly(allies);
    setEnemy(enemyUnit);
    setActiveIdx(allies.findIndex(u => u.hp > 0));
    setLevelId(lid);
    setLog([{ text: `⚔️ ${lvl.name} 開始！` }]);
    setPhase('player');
    setView('battle');
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
    pushLog(res.log, res.effective === 'super' ? 'super' : res.effective === 'weak' ? 'weak' : res.crit ? 'crit' : undefined);
    setAlly([...ally]);
    setEnemy({ ...enemy });
    if (isDefeated(enemy)) {
      setTimeout(() => endBattle(true), 500);
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
    // eslint-disable-next-line react-hooks/purity -- intentional randomness for enemy AI, runs in timer callback
    const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
    const skill = aiPickSkill(enemy, target);
    spendMp(enemy, skill.mpCost);
    const res = computeDamage(enemy, target, skill);
    applyDamage(target, res.damage);
    pushLog(res.log, res.effective === 'super' ? 'super' : res.effective === 'weak' ? 'weak' : undefined);
    // regen some MP for all
    ally.forEach(a => regenMp(a, 2));
    regenMp(enemy, 2);
    setAlly([...ally]);
    setEnemy({ ...enemy });
    const stillAlive = ally.filter(u => !isDefeated(u));
    if (stillAlive.length === 0) {
      setTimeout(() => endBattle(false), 500);
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

      setSave(s => {
        const owned = [...s.owned];
        if (lvl.reward && !owned.includes(lvl.reward)) owned.push(lvl.reward);
        return {
          ...s,
          owned,
          cleared: wasCleared ? s.cleared : [...s.cleared, levelId],
          stars: { ...s.stars, [levelId]: newStars },
          totalStars: s.totalStars + delta,
        };
      });

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
        <div style={{ fontWeight: 700 }}>
          {save.playerName} · ⭐ {save.totalStars}
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
                  onClick={() => unlocked && startBattle(lvl.id)}
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

      {view === 'battle' && enemy && (
        <div className={styles.battleStage}>
          <div className={styles.battleField}>
            <div className={`${styles.battleRow} ${styles.enemy}`}>
              <div className={styles.fighterCard}>
                <Portrait fighter={enemy.fighter} />
                <div className={styles.fighterInfo}>
                  <div className={styles.fighterName}>
                    {enemy.fighter.name}
                    <TypeChip type={enemy.fighter.type} />
                  </div>
                  <FighterBars unit={enemy} />
                </div>
              </div>
            </div>

            <div className={styles.logBox}>
              {log.slice(-4).map((l, i) => (
                <div key={i} className={`${styles.logLine} ${l.kind ? styles[l.kind] : ''}`}>{l.text}</div>
              ))}
            </div>

            <div className={`${styles.battleRow} ${styles.ally}`}>
              {ally[activeIdx] && (
                <div className={styles.fighterCard}>
                  <Portrait fighter={ally[activeIdx].fighter} />
                  <div className={styles.fighterInfo}>
                    <div className={styles.fighterName}>
                      {ally[activeIdx].fighter.name}
                      <TypeChip type={ally[activeIdx].fighter.type} />
                    </div>
                    <FighterBars unit={ally[activeIdx]} />
                  </div>
                </div>
              )}
            </div>

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
                {phase === 'victory' && (
                  <div style={{ marginBottom: 12, color: '#ffd43b', fontSize: '1.4rem' }}>
                    {'⭐'.repeat(ally.filter(u => !isDefeated(u)).length >= 3 ? 3 : ally.filter(u => !isDefeated(u)).length >= 2 ? 2 : 1)}
                  </div>
                )}
                <button className={styles.bigBtn} onClick={closeBattle}>回主頁</button>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div style={{ marginTop: 14 }}>
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
                          {u.hp}/{u.fighter.maxHp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
