'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './rpg.module.css';

type ClassId = 'warrior' | 'mage' | 'rogue';
type Screen = 'intro' | 'town' | 'combat' | 'shop' | 'inn' | 'end';
type Zone = 'forest' | 'cave' | 'lair';

type Hero = {
  name: string;
  cls: ClassId;
  lv: number;
  xp: number;
  hp: number; maxHp: number;
  mp: number; maxMp: number;
  atk: number;
  def: number;
  gold: number;
  potions: number;
  ethers: number;
  weaponLv: number;
  armorLv: number;
  bossDown: boolean;
};

type Enemy = {
  key: string;
  name: string;
  icon: string;
  hp: number; maxHp: number;
  atk: number;
  def: number;
  xp: number;
  gold: number;
  isBoss?: boolean;
  zone: Zone;
};

type LogKind = 'line' | 'good' | 'bad' | 'magic' | 'gold' | 'boss' | 'sys';
type LogEntry = { text: string; kind: LogKind; id: number };

const CLASSES: Record<ClassId, {
  icon: string; name: string; desc: string;
  hp: number; mp: number; atk: number; def: number;
  skillName: string; skillCost: number; skillDmg: number; skillDesc: string;
}> = {
  warrior: {
    icon: '⚔️', name: '戰士', desc: '堅毅的前線戰士，擁有厚重鎧甲與重劍。',
    hp: 42, mp: 10, atk: 9, def: 6,
    skillName: '破甲斬', skillCost: 4, skillDmg: 16,
    skillDesc: '無視一半防禦的重擊',
  },
  mage: {
    icon: '🔮', name: '法師', desc: '操縱元素之力的學者，體弱但法力強大。',
    hp: 28, mp: 28, atk: 5, def: 3,
    skillName: '烈焰爆', skillCost: 6, skillDmg: 22,
    skillDesc: '高額魔法傷害，無視防禦',
  },
  rogue: {
    icon: '🗡️', name: '遊俠', desc: '身手敏捷的冒險者，擅長爆擊。',
    hp: 34, mp: 16, atk: 7, def: 4,
    skillName: '致命一擊', skillCost: 3, skillDmg: 12,
    skillDesc: '50% 機率觸發雙倍爆擊',
  },
};

const ENEMIES: Record<Zone, Omit<Enemy, 'hp'>[]> = {
  forest: [
    { key: 'slime', name: '史萊姆', icon: '🟢', maxHp: 14, atk: 4, def: 1, xp: 6, gold: 5, zone: 'forest' },
    { key: 'wolf', name: '森林狼', icon: '🐺', maxHp: 22, atk: 7, def: 2, xp: 10, gold: 8, zone: 'forest' },
    { key: 'goblin', name: '哥布林', icon: '👺', maxHp: 28, atk: 8, def: 3, xp: 14, gold: 12, zone: 'forest' },
  ],
  cave: [
    { key: 'bat', name: '吸血蝙蝠', icon: '🦇', maxHp: 26, atk: 9, def: 2, xp: 16, gold: 14, zone: 'cave' },
    { key: 'skeleton', name: '亡靈骷髏', icon: '💀', maxHp: 38, atk: 11, def: 5, xp: 22, gold: 20, zone: 'cave' },
    { key: 'troll', name: '洞穴食人魔', icon: '👹', maxHp: 55, atk: 14, def: 6, xp: 32, gold: 30, zone: 'cave' },
  ],
  lair: [
    { key: 'dragon', name: '灰燼龍·瓦格隆', icon: '🐉', maxHp: 140, atk: 20, def: 9, xp: 120, gold: 200, isBoss: true, zone: 'lair' },
  ],
};

const ZONE_INFO: Record<Zone, { title: string; icon: string; desc: string; minLv: number }> = {
  forest: {
    title: '翠綠森林',
    icon: '🌲',
    desc: '陽光穿透濃密枝葉，灑落在苔蘚上。遠處傳來不明生物的低吼。',
    minLv: 1,
  },
  cave: {
    title: '幽暗洞窟',
    icon: '🕳️',
    desc: '滴水聲在岩壁間迴盪。空氣中瀰漫著腐朽的氣息，深處閃爍著紅光。',
    minLv: 3,
  },
  lair: {
    title: '灰燼龍巢穴',
    icon: '🔥',
    desc: '灼熱的熔岩從地縫湧出。一雙巨大的黃眼在黑暗中睜開——傳說中的龍醒了。',
    minLv: 6,
  },
};

const SHOP = [
  { id: 'potion', name: '治療藥水', desc: '回復 25 HP', price: 20 },
  { id: 'ether', name: '魔力藥水', desc: '回復 15 MP', price: 25 },
  { id: 'weapon', name: '武器強化', desc: 'ATK +3', price: 60 },
  { id: 'armor', name: '防具強化', desc: 'DEF +2', price: 55 },
];

const xpToNext = (lv: number) => 20 + lv * 15;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const rand = (n: number) => Math.floor(Math.random() * n);
const SAVE_KEY = 'lessen-rpg-save-v1';

function freshHero(name: string, cls: ClassId): Hero {
  const c = CLASSES[cls];
  return {
    name, cls,
    lv: 1, xp: 0,
    hp: c.hp, maxHp: c.hp,
    mp: c.mp, maxMp: c.mp,
    atk: c.atk, def: c.def,
    gold: 15,
    potions: 2, ethers: 1,
    weaponLv: 0, armorLv: 0,
    bossDown: false,
  };
}

function spawn(zone: Zone): Enemy {
  const pool = ENEMIES[zone];
  const t = pool[rand(pool.length)];
  return { ...t, hp: t.maxHp };
}

export default function RPGGame() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [hero, setHero] = useState<Hero | null>(null);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [heroTurn, setHeroTurn] = useState(true);
  const [nameDraft, setNameDraft] = useState('');
  const [pickedCls, setPickedCls] = useState<ClassId | null>(null);
  const [ending, setEnding] = useState<'win' | 'lose' | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);
  const heroRef = useRef<Hero | null>(null);
  useEffect(() => { heroRef.current = hero; }, [hero]);

  // Load save on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { hero: Hero };
      if (data.hero && data.hero.name) {
        setHero(data.hero);
        setScreen(data.hero.bossDown ? 'end' : 'town');
        if (data.hero.bossDown) setEnding('win');
        pushLog(`歡迎回來，${data.hero.name}。`, 'sys');
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist hero
  useEffect(() => {
    if (!hero) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ hero }));
    } catch {}
  }, [hero]);

  // Auto-scroll log
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  function pushLog(text: string, kind: LogKind = 'line') {
    setLog((cur) => {
      const next = [...cur, { text, kind, id: ++logIdRef.current }];
      return next.slice(-80);
    });
  }

  function resetAll() {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    setHero(null);
    setEnemy(null);
    setLog([]);
    setEnding(null);
    setPickedCls(null);
    setNameDraft('');
    setScreen('intro');
  }

  function startGame() {
    const cls = pickedCls ?? 'warrior';
    const name = nameDraft.trim() || '無名旅人';
    const h = freshHero(name, cls);
    setHero(h);
    setLog([]);
    pushLog(`${name} 在清晨的霧氣中走進了新手村。`, 'sys');
    pushLog(`選擇職業：${CLASSES[cls].name}。旅途開始了。`, 'good');
    setScreen('town');
  }

  function applyHero(patch: Partial<Hero>) {
    setHero((h) => (h ? { ...h, ...patch } : h));
  }

  function gainXP(h: Hero, amount: number): Hero {
    let lv = h.lv, xp = h.xp + amount, maxHp = h.maxHp, maxMp = h.maxMp, atk = h.atk, def = h.def;
    let leveled = false;
    while (xp >= xpToNext(lv)) {
      xp -= xpToNext(lv);
      lv += 1;
      maxHp += 8;
      maxMp += 4;
      atk += 2;
      def += 1;
      leveled = true;
    }
    if (leveled) {
      pushLog(`✨ 升級了！現在 Lv.${lv}，能力全面提升。`, 'good');
    }
    return { ...h, lv, xp, maxHp, maxMp, atk, def, hp: leveled ? maxHp : h.hp, mp: leveled ? maxMp : h.mp };
  }

  function enterZone(z: Zone) {
    if (!hero) return;
    const info = ZONE_INFO[z];
    if (hero.lv < info.minLv) {
      pushLog(`你還不夠強壯前往${info.title}（需要 Lv.${info.minLv}）。`, 'bad');
      return;
    }
    pushLog(`你動身前往${info.title}。`, 'sys');
    const e = spawn(z);
    setEnemy(e);
    setHeroTurn(true);
    setScreen('combat');
    pushLog(`${e.icon} ${e.name} 出現了！`, e.isBoss ? 'boss' : 'line');
  }

  // --- Combat ---
  function playerAttack() {
    if (!hero || !enemy || !heroTurn) return;
    const dmg = Math.max(1, hero.atk - Math.floor(enemy.def / 2) + rand(3));
    const crit = hero.cls === 'rogue' && Math.random() < 0.2;
    const final = crit ? dmg * 2 : dmg;
    pushLog(`${hero.name} 攻擊 ${enemy.name}，造成 ${final} 傷害${crit ? '（爆擊！）' : ''}。`, crit ? 'good' : 'line');
    const nextEnemy = { ...enemy, hp: enemy.hp - final };
    setEnemy(nextEnemy);
    if (nextEnemy.hp <= 0) return onEnemyDown(nextEnemy, hero);
    setHeroTurn(false);
    setTimeout(() => enemyTurn(nextEnemy), 650);
  }

  function playerSkill() {
    if (!hero || !enemy || !heroTurn) return;
    const c = CLASSES[hero.cls];
    if (hero.mp < c.skillCost) {
      pushLog('MP 不足，無法施放技能。', 'bad');
      return;
    }
    let dmg = c.skillDmg + hero.lv * 2;
    let crit = false;
    if (hero.cls === 'warrior') {
      dmg = Math.max(1, dmg + hero.atk - Math.floor(enemy.def / 4));
      pushLog(`${hero.name} 揮出【${c.skillName}】，劈開護甲造成 ${dmg} 傷害。`, 'magic');
    } else if (hero.cls === 'mage') {
      pushLog(`${hero.name} 詠唱【${c.skillName}】，烈焰吞噬敵人造成 ${dmg} 傷害。`, 'magic');
    } else {
      crit = Math.random() < 0.5;
      dmg = Math.max(1, dmg + hero.atk);
      if (crit) dmg *= 2;
      pushLog(`${hero.name} 使出【${c.skillName}】，${crit ? '直取要害' : '刺中破綻'}，造成 ${dmg} 傷害${crit ? '！' : ''}`, 'magic');
    }
    const nextEnemy = { ...enemy, hp: enemy.hp - dmg };
    const nextHero: Hero = { ...hero, mp: hero.mp - c.skillCost };
    setEnemy(nextEnemy);
    setHero(nextHero);
    if (nextEnemy.hp <= 0) return onEnemyDown(nextEnemy, nextHero);
    setHeroTurn(false);
    setTimeout(() => enemyTurn(nextEnemy), 650);
  }

  function usePotion() {
    if (!hero) return;
    if (hero.potions <= 0) { pushLog('沒有治療藥水了。', 'bad'); return; }
    if (hero.hp >= hero.maxHp) { pushLog('HP 已滿。', 'sys'); return; }
    const heal = Math.min(25, hero.maxHp - hero.hp);
    applyHero({ hp: hero.hp + heal, potions: hero.potions - 1 });
    pushLog(`${hero.name} 喝下藥水，回復 ${heal} HP。`, 'good');
    if (screen === 'combat' && enemy) {
      setHeroTurn(false);
      setTimeout(() => enemyTurn(enemy), 600);
    }
  }

  function useEther() {
    if (!hero) return;
    if (hero.ethers <= 0) { pushLog('沒有魔力藥水了。', 'bad'); return; }
    if (hero.mp >= hero.maxMp) { pushLog('MP 已滿。', 'sys'); return; }
    const gain = Math.min(15, hero.maxMp - hero.mp);
    applyHero({ mp: hero.mp + gain, ethers: hero.ethers - 1 });
    pushLog(`${hero.name} 飲下魔力藥水，回復 ${gain} MP。`, 'magic');
    if (screen === 'combat' && enemy) {
      setHeroTurn(false);
      setTimeout(() => enemyTurn(enemy), 600);
    }
  }

  function flee() {
    if (!enemy || !hero) return;
    if (enemy.isBoss) { pushLog('巨龍擋住去路，無處可逃！', 'boss'); return; }
    if (Math.random() < 0.6) {
      pushLog(`${hero.name} 成功脫離了戰鬥。`, 'sys');
      setEnemy(null);
      setScreen('town');
    } else {
      pushLog(`${hero.name} 想逃但被攔住了！`, 'bad');
      setHeroTurn(false);
      setTimeout(() => enemyTurn(enemy), 600);
    }
  }

  function enemyTurn(currentEnemy: Enemy) {
    const h = heroRef.current;
    if (!h) return;
    const raw = currentEnemy.atk + rand(3);
    const dmg = Math.max(1, raw - h.def);
    pushLog(`${currentEnemy.name} 反擊，造成 ${dmg} 傷害。`, currentEnemy.isBoss ? 'boss' : 'bad');
    const newHp = h.hp - dmg;
    if (newHp <= 0) {
      setHero({ ...h, hp: 0 });
      pushLog(`${h.name} 倒下了……`, 'bad');
      setTimeout(() => {
        setEnding('lose');
        setEnemy(null);
        setScreen('end');
      }, 700);
      return;
    }
    setHero({ ...h, hp: newHp });
    setHeroTurn(true);
  }

  function onEnemyDown(defeatedEnemy: Enemy, currentHero: Hero) {
    pushLog(`${defeatedEnemy.name} 倒下了！`, 'good');
    pushLog(`+${defeatedEnemy.xp} XP、+${defeatedEnemy.gold} 金幣。`, 'gold');
    const after = gainXP({ ...currentHero, gold: currentHero.gold + defeatedEnemy.gold }, defeatedEnemy.xp);
    if (defeatedEnemy.isBoss) {
      setHero({ ...after, bossDown: true });
      setEnemy(null);
      setTimeout(() => { setEnding('win'); setScreen('end'); }, 600);
      return;
    }
    setHero(after);
    setEnemy(null);
    setTimeout(() => setScreen('town'), 600);
  }

  // --- Shop / Inn ---
  function buy(id: string) {
    if (!hero) return;
    const item = SHOP.find((s) => s.id === id);
    if (!item) return;
    if (hero.gold < item.price) { pushLog('金幣不夠。', 'bad'); return; }
    if (id === 'potion') applyHero({ gold: hero.gold - item.price, potions: hero.potions + 1 });
    if (id === 'ether') applyHero({ gold: hero.gold - item.price, ethers: hero.ethers + 1 });
    if (id === 'weapon') applyHero({ gold: hero.gold - item.price, atk: hero.atk + 3, weaponLv: hero.weaponLv + 1 });
    if (id === 'armor') applyHero({ gold: hero.gold - item.price, def: hero.def + 2, armorLv: hero.armorLv + 1 });
    pushLog(`購買了【${item.name}】。`, 'gold');
  }

  function rest() {
    if (!hero) return;
    const cost = 10 + hero.lv * 2;
    if (hero.gold < cost) { pushLog(`住宿需要 ${cost} 金幣。`, 'bad'); return; }
    applyHero({ gold: hero.gold - cost, hp: hero.maxHp, mp: hero.maxMp });
    pushLog(`一夜好眠，HP 與 MP 已全滿。（-${cost} 金幣）`, 'good');
  }

  // --- Derived ---
  const hpPct = hero ? (hero.hp / hero.maxHp) * 100 : 0;
  const mpPct = hero ? (hero.mp / hero.maxMp) * 100 : 0;
  const xpNeeded = hero ? xpToNext(hero.lv) : 0;
  const xpPct = hero ? (hero.xp / xpNeeded) * 100 : 0;

  const canCave = useMemo(() => (hero ? hero.lv >= ZONE_INFO.cave.minLv : false), [hero]);
  const canLair = useMemo(() => (hero ? hero.lv >= ZONE_INFO.lair.minLv : false), [hero]);

  // --- Render ---
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>翠嶺紀</h1>
            <div className={styles.subtitle}>A TINY RPG · 按鍵即戰鬥</div>
          </div>
          <a className={styles.back} href="/">← 回首頁</a>
        </div>

        <div className={styles.body}>
          {screen === 'intro' && (
            <div className={styles.intro}>
              <p className={styles.introLead}>
                霧氣籠罩的翠嶺之地，一頭灰燼龍甦醒了。<br />
                你是踏上旅途的新手冒險者——打敗森林、洞窟的魔物，<br />
                在新手村補給、升級，最後挑戰巢穴中的巨龍。
              </p>

              <div className={styles.nameRow}>
                <label className={styles.nameLabel}>取個名字</label>
                <input
                  className={styles.nameInput}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="無名旅人"
                  maxLength={12}
                />
              </div>

              <div className={styles.classGrid}>
                {(Object.keys(CLASSES) as ClassId[]).map((id) => {
                  const c = CLASSES[id];
                  const picked = pickedCls === id;
                  return (
                    <button
                      key={id}
                      className={styles.classCard}
                      onClick={() => setPickedCls(id)}
                      style={picked ? { borderColor: '#b8ccb5', boxShadow: '0 0 0 2px rgba(184,204,181,0.4)' } : undefined}
                    >
                      <div className={styles.classIcon}>{c.icon}</div>
                      <div className={styles.className}>{c.name}</div>
                      <div className={styles.classDesc}>{c.desc}</div>
                      <div className={styles.classStats}>
                        HP {c.hp} · MP {c.mp} · ATK {c.atk} · DEF {c.def}
                      </div>
                      <div className={styles.classStats} style={{ marginTop: 6, color: '#b8b3e0' }}>
                        【{c.skillName}】{c.skillDesc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.actions} style={{ marginTop: 20, maxWidth: 260, margin: '20px auto 0' }}>
                <button className={styles.btn} onClick={startGame} disabled={!pickedCls}>
                  ▶ 開始冒險
                </button>
              </div>
              <div className={styles.hint}>進度會自動儲存在你的瀏覽器。</div>
            </div>
          )}

          {hero && screen !== 'intro' && screen !== 'end' && (
            <>
              <div className={styles.statsTop}>
                <div className={styles.statBox}>
                  <div className={styles.statHead}>
                    <div className={styles.statName}>{hero.name}</div>
                    <div className={styles.statClass}>
                      Lv.{hero.lv} {CLASSES[hero.cls].icon}{CLASSES[hero.cls].name}
                    </div>
                  </div>
                  <div className={styles.bar}><div className={`${styles.barFill} ${styles.hpFill}`} style={{ width: `${hpPct}%` }} /></div>
                  <div className={styles.barLabel}><span>HP</span><span>{hero.hp} / {hero.maxHp}</span></div>
                  <div className={styles.bar}><div className={`${styles.barFill} ${styles.mpFill}`} style={{ width: `${mpPct}%` }} /></div>
                  <div className={styles.barLabel}><span>MP</span><span>{hero.mp} / {hero.maxMp}</span></div>
                  <div className={styles.bar}><div className={`${styles.barFill} ${styles.xpFill}`} style={{ width: `${xpPct}%` }} /></div>
                  <div className={styles.barLabel}><span>XP</span><span>{hero.xp} / {xpNeeded}</span></div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statHead}>
                    <div className={styles.statName}>能力</div>
                    <div className={styles.statClass}>🪙 {hero.gold}</div>
                  </div>
                  <div className={styles.statGrid}>
                    <span>ATK<b>{hero.atk}</b></span>
                    <span>DEF<b>{hero.def}</b></span>
                    <span>武器<b>+{hero.weaponLv}</b></span>
                    <span>防具<b>+{hero.armorLv}</b></span>
                  </div>
                  <div className={styles.statGrid} style={{ marginTop: 10 }}>
                    <span>🧪藥水<b>{hero.potions}</b></span>
                    <span>💧魔水<b>{hero.ethers}</b></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              {screen === 'combat' && enemy && (
                <div className={styles.enemyBox}>
                  <div className={styles.enemyHead}>
                    <div className={styles.enemyName}>
                      <span style={{ fontSize: '1.4rem' }}>{enemy.icon}</span>
                      {enemy.name}
                      {enemy.isBoss && <span className={`${styles.floatTag} ${styles.tagBoss}`}>BOSS</span>}
                    </div>
                    <div className={styles.enemyMeta}>ATK {enemy.atk} · DEF {enemy.def}</div>
                  </div>
                  <div className={styles.bar}>
                    <div className={`${styles.barFill} ${styles.hpFill}`} style={{ width: `${clamp((enemy.hp / enemy.maxHp) * 100, 0, 100)}%` }} />
                  </div>
                  <div className={styles.barLabel}>
                    <span>HP</span><span>{Math.max(0, enemy.hp)} / {enemy.maxHp}</span>
                  </div>
                </div>
              )}

              {screen !== 'combat' && (
                <div className={styles.scene}>
                  {screen === 'town' && (
                    <>
                      <div className={styles.sceneTitle}>🏘️ 新手村 · 翠嶺</div>
                      <div className={styles.sceneDesc}>
                        石砌的小屋沿著溪流錯落，商人在市集吆喝，旅店的爐火溫暖了整條街。
                        <br />這裡是你補給與休息的地方。
                      </div>
                    </>
                  )}
                  {screen === 'shop' && (
                    <>
                      <div className={styles.sceneTitle}>🛒 商店 · 老鐵匠鋪</div>
                      <div className={styles.sceneDesc}>老師傅擦著一柄劍：「來吧年輕人，看你需要什麼？」</div>
                    </>
                  )}
                  {screen === 'inn' && (
                    <>
                      <div className={styles.sceneTitle}>🛏️ 旅店 · 晚星之家</div>
                      <div className={styles.sceneDesc}>女主人遞上熱湯：「睡一覺吧，明天還有遠路要走。」</div>
                    </>
                  )}
                </div>
              )}

              <div className={styles.log} ref={logRef}>
                {log.length === 0 && <div className={`${styles.logLine} ${styles.logSys}`}>…</div>}
                {log.map((l) => (
                  <div key={l.id} className={`${styles.logLine} ${
                    l.kind === 'good' ? styles.logGood :
                    l.kind === 'bad' ? styles.logBad :
                    l.kind === 'magic' ? styles.logMagic :
                    l.kind === 'gold' ? styles.logGold :
                    l.kind === 'boss' ? styles.logBoss :
                    l.kind === 'sys' ? styles.logSys : ''
                  }`}>
                    {l.text}
                  </div>
                ))}
              </div>

              {screen === 'town' && (
                <div className={styles.actions}>
                  <button className={styles.btn} onClick={() => enterZone('forest')}>
                    🌲 進入森林
                  </button>
                  <button className={styles.btn} onClick={() => enterZone('cave')} disabled={!canCave}>
                    🕳️ 前往洞窟{!canCave && `（Lv.${ZONE_INFO.cave.minLv}）`}
                  </button>
                  <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => enterZone('lair')} disabled={!canLair}>
                    🐉 挑戰龍巢{!canLair && `（Lv.${ZONE_INFO.lair.minLv}）`}
                  </button>
                  <button className={styles.btn} onClick={() => setScreen('shop')}>🛒 商店</button>
                  <button className={styles.btn} onClick={() => setScreen('inn')}>🛏️ 旅店</button>
                </div>
              )}

              {screen === 'shop' && (
                <>
                  <div className={styles.shopList}>
                    {SHOP.map((s) => (
                      <div key={s.id} className={styles.shopRow}>
                        <div className={styles.shopInfo}>
                          <div className={styles.shopName}>{s.name}</div>
                          <div className={styles.shopDesc}>{s.desc}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className={styles.shopPrice}>{s.price} 🪙</span>
                          <button
                            className={styles.btn}
                            onClick={() => buy(s.id)}
                            disabled={hero.gold < s.price}
                            style={{ minWidth: 80 }}
                          >
                            購買
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.actions} style={{ marginTop: 14 }}>
                    <button className={styles.btn} onClick={() => setScreen('town')}>← 回村</button>
                  </div>
                </>
              )}

              {screen === 'inn' && (
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.btnGold}`} onClick={rest}>
                    💤 住宿（{10 + hero.lv * 2} 🪙）
                  </button>
                  <button className={styles.btn} onClick={() => setScreen('town')}>← 回村</button>
                </div>
              )}

              {screen === 'combat' && enemy && (
                <>
                  <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.btnAttack}`} onClick={playerAttack} disabled={!heroTurn}>
                      ⚔️ 攻擊
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnMagic}`}
                      onClick={playerSkill}
                      disabled={!heroTurn || hero.mp < CLASSES[hero.cls].skillCost}
                    >
                      ✨ {CLASSES[hero.cls].skillName}（-{CLASSES[hero.cls].skillCost} MP）
                    </button>
                    <button className={styles.btn} onClick={usePotion} disabled={!heroTurn || hero.potions <= 0}>
                      🧪 藥水（{hero.potions}）
                    </button>
                    <button className={styles.btn} onClick={useEther} disabled={!heroTurn || hero.ethers <= 0}>
                      💧 魔水（{hero.ethers}）
                    </button>
                    <button className={styles.btn} onClick={flee} disabled={!heroTurn}>
                      🏃 逃跑
                    </button>
                  </div>
                  {!heroTurn && <div className={styles.hint}>敵人行動中…</div>}
                </>
              )}
            </>
          )}

          {screen === 'end' && hero && (
            <div className={styles.endShell}>
              {ending === 'win' ? (
                <>
                  <div className={`${styles.endTitle} ${styles.endWin}`}>🏆 傳說終章</div>
                  <div className={styles.endBody}>
                    灰燼龍·瓦格隆倒下了。熔岩冷卻，翠嶺恢復寧靜。<br />
                    村民們傳唱著你的名字——<b>{hero.name}</b>，翠嶺的救星。
                  </div>
                </>
              ) : (
                <>
                  <div className={`${styles.endTitle} ${styles.endLose}`}>☠️ 此路到此</div>
                  <div className={styles.endBody}>
                    {hero.name} 在戰鬥中倒下了……<br />
                    但英雄故事從不在此結束。再來一次吧？
                  </div>
                </>
              )}
              <div className={styles.endStats}>
                職業：{CLASSES[hero.cls].name}　Lv.{hero.lv}<br />
                最終能力：ATK {hero.atk} · DEF {hero.def}<br />
                金幣：{hero.gold} 🪙<br />
                武器強化：+{hero.weaponLv}　防具強化：+{hero.armorLv}
              </div>
              <div className={styles.actions} style={{ maxWidth: 320, margin: '0 auto' }}>
                <button className={styles.btn} onClick={resetAll}>↺ 重新開始</button>
                {ending === 'win' && (
                  <button className={styles.btn} onClick={() => { setEnding(null); setScreen('town'); }}>
                    🌿 繼續探索
                  </button>
                )}
              </div>
            </div>
          )}

          {hero && screen !== 'intro' && screen !== 'end' && screen !== 'combat' && (
            <div className={styles.hint}>
              進度已自動儲存 · <button
                onClick={resetAll}
                style={{ background: 'none', border: 'none', color: '#9aaf95', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}
              >放棄這趟旅程</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
