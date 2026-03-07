/**
 * Daggerheart Engine
 *
 * Implements the SystemEngine interface for Daggerheart.
 * Daggerheart uses 2d12 (Hope die + Fear die) for action rolls.
 */

import { CharacterDocument } from '../../types/core/document';
import { SystemEngine, RollResult } from '../../registry/types';
import { DaggerheartDataModel } from './data-model';

export class DaggerheartEngine implements SystemEngine<DaggerheartDataModel> {
  prepareData(
    document: CharacterDocument<DaggerheartDataModel>
  ): CharacterDocument<DaggerheartDataModel> {
    const d = { ...document, system: { ...document.system } };
    const attrs = d.system.attributes;

    // Evasion = base + Agility modifier (simplified)
    d.system.evasion = 10 + attrs.agility;

    // HP scales with level (base 6 + 2 per level after 1st)
    const baseHp = 6 + (d.system.level - 1) * 2 + Math.max(0, attrs.strength);
    if (d.system.hitPoints.max !== baseHp) {
      d.system.hitPoints = { ...d.system.hitPoints, max: baseHp };
    }

    // Stress max = 6 + Presence modifier
    const baseStress = 6 + Math.max(0, attrs.presence);
    if (d.system.stress.max !== baseStress) {
      d.system.stress = { ...d.system.stress, max: baseStress };
    }

    return d;
  }

  async rollCheck(
    document: CharacterDocument<DaggerheartDataModel>,
    checkId: string
  ): Promise<RollResult> {
    const attrs = document.system.attributes;
    const mod = (attrs as Record<string, number>)[checkId] ?? 0;

    // Daggerheart uses 2d12 — Hope die and Fear die
    const hopeDie = Math.floor(Math.random() * 12) + 1;
    const fearDie = Math.floor(Math.random() * 12) + 1;
    const total = hopeDie + fearDie + mod;

    const isHopeResult = hopeDie > fearDie;
    const isCritSuccess = hopeDie === fearDie && hopeDie >= 10;
    const isCritFail = hopeDie === fearDie && hopeDie <= 3;

    return {
      total,
      formula: `2d12 + ${mod} (${checkId})`,
      terms: [hopeDie, fearDie],
      isCritical: isCritSuccess,
      isFumble: isCritFail,
      flavor: isHopeResult
        ? `Hope (${hopeDie}) vs Fear (${fearDie}) — with Hope!`
        : hopeDie === fearDie
          ? `Hope (${hopeDie}) = Fear (${fearDie}) — Critical!`
          : `Hope (${hopeDie}) vs Fear (${fearDie}) — with Fear`,
    };
  }

  applyDamage(
    document: CharacterDocument<DaggerheartDataModel>,
    amount: number,
    type: string
  ): CharacterDocument<DaggerheartDataModel> {
    const d = { ...document, system: { ...document.system } };
    const hp = { ...d.system.hitPoints };

    if (type === 'heal') {
      hp.current = Math.min(hp.max, hp.current + amount);
    } else {
      // Armor absorbs damage first
      let remaining = amount;
      if (d.system.armor.current > 0 && type !== 'stress') {
        const absorbed = Math.min(d.system.armor.current, remaining);
        d.system.armor = { ...d.system.armor, current: d.system.armor.current - absorbed };
        remaining -= absorbed;
      }

      if (type === 'stress') {
        const stress = { ...d.system.stress };
        stress.current = Math.min(stress.max, stress.current + amount);
        d.system.stress = stress;
      } else {
        hp.current = Math.max(0, hp.current - remaining);
      }
    }

    d.system.hitPoints = hp;
    return d;
  }
}
