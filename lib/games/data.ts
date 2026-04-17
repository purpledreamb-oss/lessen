// Character and level data for 沐哲's battle game.
// Three types with rock-paper-scissors style advantage:
// light  > ancient (光屬性壓制古生物)
// ancient > beast (古生物壓制神奇生物)
// beast  > light  (神奇生物壓制光屬性)

export type ElementType = 'light' | 'ancient' | 'beast';

export const TYPE_LABEL: Record<ElementType, string> = {
  light: '光',
  ancient: '古',
  beast: '獸',
};

export const TYPE_COLOR: Record<ElementType, string> = {
  light: '#f5b301',
  ancient: '#2ecc71',
  beast: '#3498db',
};

export function advantage(attacker: ElementType, defender: ElementType): number {
  if (attacker === 'light' && defender === 'ancient') return 2;
  if (attacker === 'ancient' && defender === 'beast') return 2;
  if (attacker === 'beast' && defender === 'light') return 2;
  if (attacker === defender) return 1;
  return 0.5;
}

export type Skill = {
  name: string;
  power: number;
  mpCost: number;
  element: ElementType;
  description: string;
};

export type BossSpecial = {
  skill: Skill;
  interval: number; // every N turns
  warning: string;  // shown one turn before
};

export type Fighter = {
  id: string;
  name: string;
  type: ElementType;
  sprite: string; // path to asset
  maxHp: number;
  maxMp: number;
  atk: number;
  def: number;
  skills: Skill[];
  flavor: string;
  bossSpecial?: BossSpecial;
};

// ---------- Items ----------
export type ItemKind = 'heal' | 'mp' | 'revive' | 'attack-buff';
export type Item = {
  id: string;
  name: string;
  emoji: string;
  kind: ItemKind;
  amount: number;
  description: string;
};

export const ITEMS: Record<string, Item> = {
  potion: {
    id: 'potion',
    name: '藥水',
    emoji: '🧪',
    kind: 'heal',
    amount: 50,
    description: '補 50 HP 給一位隊員',
  },
  ether: {
    id: 'ether',
    name: '能量水',
    emoji: '💧',
    kind: 'mp',
    amount: 20,
    description: '補 20 MP 給一位隊員',
  },
  revive: {
    id: 'revive',
    name: '復活石',
    emoji: '💎',
    kind: 'revive',
    amount: 50,
    description: '讓倒下的隊員復活，恢復 50% HP',
  },
  berserk: {
    id: 'berserk',
    name: '狂暴果',
    emoji: '🔥',
    kind: 'attack-buff',
    amount: 2,
    description: '讓全隊下一次攻擊傷害 ×2',
  },
};

// ---------- XP / Level ----------
export function xpForNext(level: number): number {
  return level * 30;
}

export function statMultiplier(level: number): number {
  return 1 + (level - 1) * 0.1;
}

// Heroes (光屬性) — Ultraman-inspired (家用不公開 · 自繪致敬版)
const HEROES: Fighter[] = [
  {
    id: 'ultra-1',
    name: '原光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra1.svg',
    maxHp: 120, maxMp: 40, atk: 22, def: 14,
    flavor: '從 M78 星雲來的光之巨人，胸前色彩時晶閃爍。',
    skills: [
      { name: '普通攻擊', power: 18, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '斯派修姆斬', power: 28, mpCost: 8, element: 'light', description: '快速的光之斬擊' },
      { name: '終極光線', power: 58, mpCost: 25, element: 'light', description: '交叉雙手的必殺光線！' },
    ],
  },
  {
    id: 'ultra-2',
    name: '賽光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra2.svg',
    maxHp: 115, maxMp: 45, atk: 24, def: 12,
    flavor: '頭頂有銳利頭刃的戰士，速度與智慧兼具。',
    skills: [
      { name: '普通攻擊', power: 18, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '頭刃飛斬', power: 30, mpCost: 9, element: 'light', description: '把頭頂的刃擲出！' },
      { name: '集光射線', power: 55, mpCost: 24, element: 'light', description: '手指凝聚的光之射線' },
    ],
  },
  {
    id: 'ultra-3',
    name: '泰光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra3.svg',
    maxHp: 130, maxMp: 38, atk: 25, def: 16,
    flavor: '頭上有金色雙角的戰士，充滿火之力量。',
    skills: [
      { name: '普通攻擊', power: 20, mpCost: 0, element: 'light', description: '揮重拳！' },
      { name: '太陽火花', power: 32, mpCost: 11, element: 'light', description: '燃燒的火之拳' },
      { name: '風暴光線', power: 60, mpCost: 26, element: 'light', description: '旋轉而出的風暴光柱！' },
    ],
  },
  {
    id: 'ultra-4',
    name: '迪光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra4.svg',
    maxHp: 110, maxMp: 50, atk: 23, def: 13,
    flavor: '紫色光芒的複合型戰士，能變換三種型態。',
    skills: [
      { name: '普通攻擊', power: 17, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '澤佩利昂', power: 33, mpCost: 12, element: 'light', description: 'L 字型的光之炮' },
      { name: '天地之光', power: 58, mpCost: 25, element: 'light', description: '融合三型態的終極光柱' },
    ],
  },
  {
    id: 'ultra-5',
    name: '高光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra5.svg',
    maxHp: 140, maxMp: 35, atk: 20, def: 20,
    flavor: '藍色溫柔的戰士，溫暖地守護著地球。',
    skills: [
      { name: '普通攻擊', power: 16, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '護月光線', power: 24, mpCost: 8, element: 'light', description: '溫柔但堅定的光' },
      { name: '月神光盾', power: 52, mpCost: 22, element: 'light', description: '守護的光之盾牌反擊！' },
    ],
  },
  {
    id: 'ultra-6',
    name: '傑光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra6.svg',
    maxHp: 125, maxMp: 42, atk: 26, def: 14,
    flavor: '頭戴王冠的年輕戰士，繼承傳奇血脈。',
    skills: [
      { name: '普通攻擊', power: 20, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '扭擊光波', power: 34, mpCost: 12, element: 'light', description: '螺旋光波' },
      { name: '皇室粉碎者', power: 62, mpCost: 27, element: 'light', description: '充滿王者氣息的光線！' },
    ],
  },
  {
    id: 'ultra-7',
    name: '歐光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra7.svg',
    maxHp: 118, maxMp: 48, atk: 24, def: 15,
    flavor: '頭頂有光環的融合戰士，可借用英雄之力。',
    skills: [
      { name: '普通攻擊', power: 18, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '融合連擊', power: 30, mpCost: 10, element: 'light', description: '召喚前輩的力量連擊' },
      { name: '起源光線', power: 60, mpCost: 26, element: 'light', description: '所有光之戰士之力匯集！' },
    ],
  },
  {
    id: 'ultra-8',
    name: '澤光戰士',
    type: 'light',
    sprite: '/games/assets/ultra/ultra8.svg',
    maxHp: 135, maxMp: 40, atk: 27, def: 17,
    flavor: '額頭有 Z 字徽章的戰士，最強的新世代之光。',
    skills: [
      { name: '普通攻擊', power: 21, mpCost: 0, element: 'light', description: '揮重拳！' },
      { name: 'Z 字斬', power: 36, mpCost: 13, element: 'light', description: 'Z 字軌跡的光之斬' },
      { name: '澤絲騰光線', power: 65, mpCost: 28, element: 'light', description: '最強的必殺光柱！' },
    ],
  },
];

// Pokemon (神奇生物 / beast)
const BEASTS: Fighter[] = [
  {
    id: 'pikachu',
    name: '皮卡丘',
    type: 'beast',
    sprite: '/games/assets/pokemon/pikachu.png',
    maxHp: 95, maxMp: 45, atk: 18, def: 10,
    flavor: '電力十足的黃色小老鼠！',
    skills: [
      { name: '電擊', power: 16, mpCost: 0, element: 'beast', description: '小小電擊' },
      { name: '十萬伏特', power: 32, mpCost: 10, element: 'beast', description: '強力電擊！' },
      { name: '雷電攻擊', power: 52, mpCost: 24, element: 'beast', description: '從天而降的雷！' },
    ],
  },
  {
    id: 'charizard',
    name: '噴火龍',
    type: 'beast',
    sprite: '/games/assets/pokemon/charizard.png',
    maxHp: 130, maxMp: 40, atk: 25, def: 14,
    flavor: '噴火的噴火的龍！',
    skills: [
      { name: '抓擊', power: 20, mpCost: 0, element: 'beast', description: '銳利的爪子' },
      { name: '火焰噴射', power: 35, mpCost: 12, element: 'beast', description: '熱熱的火焰！' },
      { name: '大字爆炎', power: 58, mpCost: 26, element: 'beast', description: '大字型的火焰爆炸' },
    ],
    bossSpecial: {
      interval: 3,
      warning: '噴火龍吸了一大口氣…',
      skill: { name: '地獄業火', power: 70, mpCost: 0, element: 'beast', description: '一輪地獄火焰！' },
    },
  },
  {
    id: 'blastoise',
    name: '水箭龜',
    type: 'beast',
    sprite: '/games/assets/pokemon/blastoise.png',
    maxHp: 140, maxMp: 38, atk: 20, def: 22,
    flavor: '背上兩管水砲的大海龜！',
    skills: [
      { name: '撞擊', power: 18, mpCost: 0, element: 'beast', description: '用硬殼撞擊' },
      { name: '水槍', power: 30, mpCost: 10, element: 'beast', description: '強力水柱' },
      { name: '水砲', power: 55, mpCost: 25, element: 'beast', description: '最強的水系攻擊！' },
    ],
    bossSpecial: {
      interval: 4,
      warning: '水箭龜準備雙管齊射…',
      skill: { name: '雙重水砲', power: 75, mpCost: 0, element: 'beast', description: '雙管水砲同時開火！' },
    },
  },
  {
    id: 'eevee',
    name: '伊布',
    type: 'beast',
    sprite: '/games/assets/pokemon/eevee.png',
    maxHp: 85, maxMp: 50, atk: 15, def: 12,
    flavor: '可以變成很多種樣子的神奇生物。',
    skills: [
      { name: '撞擊', power: 14, mpCost: 0, element: 'beast', description: '頭槌！' },
      { name: '搖尾巴', power: 8, mpCost: 4, element: 'beast', description: '讓對手降低防禦' },
      { name: '捨身衝撞', power: 45, mpCost: 18, element: 'beast', description: '不顧一切的衝撞' },
    ],
  },
  {
    id: 'gengar',
    name: '耿鬼',
    type: 'beast',
    sprite: '/games/assets/pokemon/gengar.png',
    maxHp: 100, maxMp: 55, atk: 24, def: 11,
    flavor: '暗影中悄悄出現的調皮鬼。',
    skills: [
      { name: '舔舔', power: 16, mpCost: 0, element: 'beast', description: '讓對手嚇一跳' },
      { name: '暗影球', power: 33, mpCost: 12, element: 'beast', description: '陰暗的能量球' },
      { name: '催眠術', power: 48, mpCost: 22, element: 'beast', description: '讓對手陷入夢境' },
    ],
    bossSpecial: {
      interval: 3,
      warning: '耿鬼的影子開始扭曲…',
      skill: { name: '暗黑惡夢', power: 65, mpCost: 0, element: 'beast', description: '把對手拉進惡夢' },
    },
  },
  {
    id: 'dragonite',
    name: '快龍',
    type: 'beast',
    sprite: '/games/assets/pokemon/dragonite.png',
    maxHp: 150, maxMp: 45, atk: 28, def: 18,
    flavor: '溫柔的巨型飛龍。',
    skills: [
      { name: '翅膀攻擊', power: 22, mpCost: 0, element: 'beast', description: '用大翅膀拍擊' },
      { name: '神龍之怒', power: 40, mpCost: 14, element: 'beast', description: '固定造成傷害' },
      { name: '逆鱗', power: 62, mpCost: 28, element: 'beast', description: '最強的龍系攻擊！' },
    ],
    bossSpecial: {
      interval: 3,
      warning: '快龍的逆鱗開始發亮…',
      skill: { name: '超級逆鱗', power: 80, mpCost: 0, element: 'beast', description: '失控的龍之憤怒！' },
    },
  },
];

// Dinosaurs (古生物 / ancient)
const ANCIENTS: Fighter[] = [
  {
    id: 'trex',
    name: '暴龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/trex.svg',
    maxHp: 150, maxMp: 30, atk: 30, def: 16,
    flavor: '白堊紀的恐龍之王！',
    skills: [
      { name: '咬擊', power: 24, mpCost: 0, element: 'ancient', description: '尖牙咬一口' },
      { name: '震地吼', power: 30, mpCost: 10, element: 'ancient', description: '震耳欲聾的吼叫' },
      { name: '王者一擊', power: 58, mpCost: 24, element: 'ancient', description: '霸王龍的最強攻擊' },
    ],
    bossSpecial: {
      interval: 3,
      warning: '暴龍張開血盆大口…',
      skill: { name: '霸王咬碎', power: 85, mpCost: 0, element: 'ancient', description: '一口咬碎一切！' },
    },
  },
  {
    id: 'triceratops',
    name: '三角龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/triceratops.svg',
    maxHp: 140, maxMp: 25, atk: 22, def: 24,
    flavor: '頭上三隻角，防禦力超強。',
    skills: [
      { name: '衝撞', power: 20, mpCost: 0, element: 'ancient', description: '用角撞擊' },
      { name: '鐵壁', power: 0, mpCost: 6, element: 'ancient', description: '大幅提升防禦' },
      { name: '三角突刺', power: 50, mpCost: 22, element: 'ancient', description: '三隻角一起刺過去！' },
    ],
    bossSpecial: {
      interval: 4,
      warning: '三角龍低頭蓄力…',
      skill: { name: '破壞衝鋒', power: 72, mpCost: 0, element: 'ancient', description: '以最快速度衝刺！' },
    },
  },
  {
    id: 'stegosaurus',
    name: '劍龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/stegosaurus.svg',
    maxHp: 125, maxMp: 28, atk: 21, def: 22,
    flavor: '背上有骨板、尾巴有尖刺的恐龍。',
    skills: [
      { name: '尾刺', power: 19, mpCost: 0, element: 'ancient', description: '尾巴尖刺攻擊' },
      { name: '骨板閃光', power: 25, mpCost: 8, element: 'ancient', description: '反射陽光讓對手眼花' },
      { name: '尾鞭旋風', power: 48, mpCost: 20, element: 'ancient', description: '瘋狂旋轉尾巴！' },
    ],
  },
  {
    id: 'pterodactyl',
    name: '翼龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/pterodactyl.svg',
    maxHp: 90, maxMp: 40, atk: 24, def: 10,
    flavor: '會飛的古代爬蟲。',
    skills: [
      { name: '俯衝', power: 20, mpCost: 0, element: 'ancient', description: '從天而降' },
      { name: '風切', power: 28, mpCost: 10, element: 'ancient', description: '翅膀掀起強風' },
      { name: '天降啄擊', power: 50, mpCost: 22, element: 'ancient', description: '從高空俯衝下來啄擊' },
    ],
  },
  {
    id: 'velociraptor',
    name: '迅猛龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/velociraptor.svg',
    maxHp: 100, maxMp: 35, atk: 26, def: 13,
    flavor: '非常聰明、跑超快的小型恐龍。',
    skills: [
      { name: '快擊', power: 18, mpCost: 0, element: 'ancient', description: '快速抓擊' },
      { name: '連續攻擊', power: 36, mpCost: 12, element: 'ancient', description: '連續三次抓擊' },
      { name: '群體獵殺', power: 52, mpCost: 24, element: 'ancient', description: '想像一整群同伴一起圍攻！' },
    ],
  },
  {
    id: 'brachiosaurus',
    name: '長頸龍',
    type: 'ancient',
    sprite: '/games/assets/dinos/brachiosaurus.svg',
    maxHp: 170, maxMp: 30, atk: 20, def: 20,
    flavor: '巨大又溫和的長脖子恐龍。',
    skills: [
      { name: '踩踏', power: 20, mpCost: 0, element: 'ancient', description: '巨大的腳踩下去' },
      { name: '重壓', power: 30, mpCost: 10, element: 'ancient', description: '用體重壓制對手' },
      { name: '地動山搖', power: 52, mpCost: 24, element: 'ancient', description: '重踩讓大地震動！' },
    ],
    bossSpecial: {
      interval: 4,
      warning: '長頸龍高高舉起腳…',
      skill: { name: '地震踏擊', power: 70, mpCost: 0, element: 'ancient', description: '讓整個戰場地動山搖' },
    },
  },
];

export const ALL_FIGHTERS: Fighter[] = [...HEROES, ...BEASTS, ...ANCIENTS];

export function getFighter(id: string): Fighter {
  const f = ALL_FIGHTERS.find(x => x.id === id);
  if (!f) throw new Error(`Fighter not found: ${id}`);
  return f;
}

// Starter team: 1 from each type
export const STARTER_TEAM = ['ultra-1', 'pikachu', 'velociraptor'];

// Level definitions
export type LevelDef = {
  id: number;
  name: string;
  boss: string; // fighter id
  minions?: string[]; // extra enemies before boss
  reward?: string; // fighter id unlocked
  itemReward?: string; // item id granted on clear
  story?: string;
};

export const LEVELS: LevelDef[] = [
  { id: 1, name: '第一關：森林入口', boss: 'velociraptor', reward: 'eevee', itemReward: 'potion', story: '森林入口傳來嘶吼聲。一隻迅猛龍擋在前面，準備發動奇襲！' },
  { id: 2, name: '第二關：閃電草原', boss: 'charizard', reward: 'ultra-2', itemReward: 'potion', story: '草原上雷電交加。噴火龍從雲端現身，準備用地獄業火燒毀一切！' },
  { id: 3, name: '第三關：水晶洞穴', boss: 'stegosaurus', reward: 'blastoise', itemReward: 'ether', story: '水晶洞穴中，一隻劍龍守著寶物。牠的骨板在光線中閃閃發亮。' },
  { id: 4, name: '第四關：火山山腳', boss: 'pterodactyl', reward: 'ultra-3', itemReward: 'potion', story: '火山下有翼龍盤旋。這次牠真的生氣了！' },
  { id: 5, name: '第五關：天空之城', boss: 'gengar', reward: 'brachiosaurus', itemReward: 'berserk', story: '在天空之城的高塔上，耿鬼的影子在飛舞，小心牠的惡夢！' },
  { id: 6, name: '第六關：古代遺跡', boss: 'triceratops', reward: 'ultra-4', itemReward: 'revive', story: '古代遺跡裡，三角龍揮舞著三隻利角，它的鐵壁連光線也擋得住！' },
  { id: 7, name: '第七關：深海神殿', boss: 'blastoise', reward: 'ultra-5', itemReward: 'ether', story: '深海神殿深處，水箭龜雙管水砲已經上膛。這是水之試煉！' },
  { id: 8, name: '第八關：幽暗森林', boss: 'brachiosaurus', reward: 'ultra-6', itemReward: 'berserk', story: '月黑風高的夜晚，長頸龍踩踏大地，震動聲在森林迴盪！' },
  { id: 9, name: '第九關：巨人平原', boss: 'dragonite', reward: 'ultra-7', itemReward: 'revive', story: '巨人平原上，快龍的逆鱗已經暴走。現在沒人能阻止牠！' },
  { id: 10, name: '第十關：恐龍之王', boss: 'trex', reward: 'gengar', itemReward: 'berserk', story: '傳說中的恐龍之王現身！牠一口就能咬碎山壁，一吼就能震碎天空。' },
  { id: 11, name: '第十一關：龍之山', boss: 'dragonite', reward: 'ultra-8', itemReward: 'revive', story: '龍之山頂，溫柔的快龍逆鱗被觸怒了。這是光之力量的最後試煉！' },
  { id: 12, name: '最終關：最強魔王', boss: 'trex', itemReward: 'berserk', story: '經過十一關的試煉，你遇到最強的暴龍王。光之戰士，發動最終之力吧！' },
];
