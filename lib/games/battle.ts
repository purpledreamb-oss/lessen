import { Fighter, Skill, advantage, ElementType } from './data';

export type BattleUnit = {
  fighter: Fighter;
  hp: number;
  mp: number;
  atkMod: number; // multiplier
  defMod: number;
};

export type DamageResult = {
  damage: number;
  effective: 'super' | 'normal' | 'weak';
  crit: boolean;
  skillName: string;
  log: string;
};

export function makeUnit(f: Fighter): BattleUnit {
  return { fighter: f, hp: f.maxHp, mp: f.maxMp, atkMod: 1, defMod: 1 };
}

export function computeDamage(
  attacker: BattleUnit,
  defender: BattleUnit,
  skill: Skill
): DamageResult {
  if (skill.power === 0) {
    // utility skill (e.g. buff)
    return {
      damage: 0,
      effective: 'normal',
      crit: false,
      skillName: skill.name,
      log: `${attacker.fighter.name} 使用了 ${skill.name}！`,
    };
  }
  const adv = advantage(skill.element, defender.fighter.type);
  const base = skill.power + attacker.fighter.atk * attacker.atkMod - defender.fighter.def * defender.defMod * 0.5;
  const crit = Math.random() < 0.12;
  const critMult = crit ? 1.5 : 1;
  const raw = Math.max(4, base) * adv * critMult;
  const damage = Math.round(raw + Math.random() * 4);
  const effective: DamageResult['effective'] = adv > 1 ? 'super' : adv < 1 ? 'weak' : 'normal';
  let log = `${attacker.fighter.name} 使用 ${skill.name}！`;
  if (effective === 'super') log += ' 效果絕佳！';
  else if (effective === 'weak') log += ' 效果不太好…';
  if (crit) log += ' ✨ 致命一擊！';
  log += ` 對 ${defender.fighter.name} 造成 ${damage} 傷害。`;
  return { damage, effective, crit, skillName: skill.name, log };
}

export function aiPickSkill(enemy: BattleUnit, target: BattleUnit): Skill {
  // Prefer type-advantaged high-power skill if MP allows; else basic attack.
  const affordable = enemy.fighter.skills.filter(s => s.mpCost <= enemy.mp);
  const targetType: ElementType = target.fighter.type;
  const scored = affordable.map(s => {
    const adv = advantage(s.element, targetType);
    return { s, score: s.power * adv + (s.mpCost === 0 ? -2 : 5) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.s ?? enemy.fighter.skills[0];
}

export function applyDamage(unit: BattleUnit, dmg: number) {
  unit.hp = Math.max(0, unit.hp - dmg);
}

export function spendMp(unit: BattleUnit, cost: number) {
  unit.mp = Math.max(0, unit.mp - cost);
}

export function regenMp(unit: BattleUnit, amount: number = 3) {
  unit.mp = Math.min(unit.fighter.maxMp, unit.mp + amount);
}

export function isDefeated(unit: BattleUnit) {
  return unit.hp <= 0;
}
