/**
 * Daggerheart Engine
 *
 * Implements the SystemEngine interface for Daggerheart.
 * Daggerheart uses 2d12 (Hope die + Fear die) for action rolls.
 */

import { CharacterDocument } from '../../types/core/document';
import { SystemEngine, RollResult } from '../../registry/types';
import { createDefaultDaggerheartData, DaggerheartDataModel } from './data-model';
import {
  getDaggerheartDerivedStats,
  getDaggerheartEffectiveAttribute,
} from '../../utils/daggerheartDerived';
import {
  clampDaggerheartInventoryQuantity,
  normalizeDaggerheartCurrency,
} from '../../utils/daggerheartInventory';
import { normalizeDaggerheartDocument } from '../../utils/daggerheartNormalization';
import type { DaggerheartTrait } from '../../types/daggerheart';

export class DaggerheartEngine implements SystemEngine<DaggerheartDataModel> {
  prepareData(
    document: CharacterDocument<DaggerheartDataModel>
  ): CharacterDocument<DaggerheartDataModel> {
    const normalizedDocument = normalizeDaggerheartDocument(document);
    const defaults = createDefaultDaggerheartData();
    const d = structuredClone({
      ...normalizedDocument,
      system: {
        ...defaults,
        ...normalizedDocument.system,
        currency: normalizeDaggerheartCurrency({
          ...defaults.currency,
          ...normalizedDocument.system.currency,
        }),
        armor: {
          ...defaults.armor,
          ...normalizedDocument.system.armor,
        },
        hitPoints: {
          ...defaults.hitPoints,
          ...normalizedDocument.system.hitPoints,
        },
        stress: {
          ...defaults.stress,
          ...normalizedDocument.system.stress,
        },
        weapons: {
          ...defaults.weapons,
          ...normalizedDocument.system.weapons,
        },
        inventory: (normalizedDocument.system.inventory || defaults.inventory).map((entry) => ({
          ...entry,
          quantity: clampDaggerheartInventoryQuantity(entry.itemId, entry.quantity),
        })),
      },
    });
    const derived = getDaggerheartDerivedStats(d.system);

    d.system.evasion = derived.evasion;
    d.system.armorScore = derived.armorScore;
    d.system.majorThreshold = derived.majorThreshold;
    d.system.severeThreshold = derived.severeThreshold;
    d.system.armor.max = derived.armorMax;

    d.system.hitPoints.current = Math.min(d.system.hitPoints.current, d.system.hitPoints.max);
    d.system.stress.current = Math.min(d.system.stress.current, d.system.stress.max);
    d.system.armor.current = Math.min(d.system.armor.current, d.system.armor.max);

    return d;
  }

  /** Sheet modifier for a trait check (mirrors rollCheck, no dice). */
  checkModifier(
    document: CharacterDocument<DaggerheartDataModel>,
    checkId: string
  ): number | undefined {
    const attrs = document.system.attributes;
    if (checkId in attrs) {
      return getDaggerheartEffectiveAttribute(document.system, checkId as DaggerheartTrait);
    }
    return undefined;
  }

  async rollCheck(
    document: CharacterDocument<DaggerheartDataModel>,
    checkId: string
  ): Promise<RollResult> {
    const attrs = document.system.attributes;
    const mod =
      checkId in attrs
        ? getDaggerheartEffectiveAttribute(document.system, checkId as DaggerheartTrait)
        : ((attrs as Record<string, number>)[checkId] ?? 0);

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
