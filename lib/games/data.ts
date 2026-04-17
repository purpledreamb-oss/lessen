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
};

// Heroes (光屬性)
const HEROES: Fighter[] = [
  {
    id: 'hero-red',
    name: '紅光戰士',
    type: 'light',
    sprite: '/games/assets/heroes/hero-red.svg',
    maxHp: 120, maxMp: 40, atk: 22, def: 14,
    flavor: '從 M78 星雲來的光之巨人，必殺光線會讓怪獸 AUA~',
    skills: [
      { name: '普通攻擊', power: 18, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '閃光斬', power: 28, mpCost: 8, element: 'light', description: '快速的光之斬擊' },
      { name: '終極光線', power: 55, mpCost: 25, element: 'light', description: '蓄滿能量的必殺技！' },
    ],
  },
  {
    id: 'hero-blue',
    name: '藍光戰士',
    type: 'light',
    sprite: '/games/assets/heroes/hero-blue.svg',
    maxHp: 110, maxMp: 50, atk: 20, def: 12,
    flavor: '速度最快的光之戰士，招式又快又準。',
    skills: [
      { name: '普通攻擊', power: 16, mpCost: 0, element: 'light', description: '揮拳！' },
      { name: '疾風踢', power: 25, mpCost: 7, element: 'light', description: '閃電般的連踢' },
      { name: '銀河光束', power: 50, mpCost: 22, element: 'light', description: '劃過銀河的光線' },
    ],
  },
  {
    id: 'hero-purple',
    name: '紫光戰士',
    type: 'light',
    sprite: '/games/assets/heroes/hero-purple.svg',
    maxHp: 140, maxMp: 35, atk: 26, def: 18,
    flavor: '最強壯的光之戰士，一拳就能打飛怪獸！',
    skills: [
      { name: '普通攻擊', power: 22, mpCost: 0, element: 'light', description: '揮重拳！' },
      { name: '鋼鐵護盾', power: 10, mpCost: 6, element: 'light', description: '反彈對手的攻擊' },
      { name: '毀滅拳', power: 60, mpCost: 28, element: 'light', description: '充滿能量的一擊！' },
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
  },
];

export const ALL_FIGHTERS: Fighter[] = [...HEROES, ...BEASTS, ...ANCIENTS];

export function getFighter(id: string): Fighter {
  const f = ALL_FIGHTERS.find(x => x.id === id);
  if (!f) throw new Error(`Fighter not found: ${id}`);
  return f;
}

// Starter team: 1 from each type
export const STARTER_TEAM = ['hero-red', 'pikachu', 'trex'];

// Level definitions
export type LevelDef = {
  id: number;
  name: string;
  boss: string; // fighter id
  minions?: string[]; // extra enemies before boss
  reward?: string; // fighter id unlocked
};

export const LEVELS: LevelDef[] = [
  { id: 1, name: '第一關：森林入口', boss: 'velociraptor', reward: 'eevee' },
  { id: 2, name: '第二關：閃電草原', boss: 'charizard', reward: 'stegosaurus' },
  { id: 3, name: '第三關：水晶洞穴', boss: 'stegosaurus', reward: 'hero-blue' },
  { id: 4, name: '第四關：火山山腳', boss: 'charizard', reward: 'pterodactyl' },
  { id: 5, name: '第五關：天空之城', boss: 'pterodactyl', reward: 'blastoise' },
  { id: 6, name: '第六關：古代遺跡', boss: 'triceratops', reward: 'gengar' },
  { id: 7, name: '第七關：深海神殿', boss: 'blastoise', reward: 'hero-purple' },
  { id: 8, name: '第八關：幽暗森林', boss: 'gengar', reward: 'brachiosaurus' },
  { id: 9, name: '第九關：巨人平原', boss: 'brachiosaurus', reward: 'dragonite' },
  { id: 10, name: '第十關：恐龍之王', boss: 'trex', reward: undefined },
  { id: 11, name: '第十一關：龍之山', boss: 'dragonite', reward: undefined },
  { id: 12, name: '最終關：最強魔王', boss: 'trex', reward: undefined },
];
