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
  DAGGERHEART_MAX_HOPE,
  getDaggerheartDerivedStats,
  getDaggerheartDualityOutcome,
  getDaggerheartEffectiveAttribute,
  getDaggerheartHpMarked,
  getDaggerheartHpMarkedAfterArmor,
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

    d.system.hitPoints.current = Math.max(
      0,
      Math.min(d.system.hitPoints.current, d.system.hitPoints.max)
    );
    d.system.stress.current = Math.max(0, Math.min(d.system.stress.current, d.system.stress.max));
    d.system.armor.current = Math.max(0, Math.min(d.system.armor.current, d.system.armor.max));
    // Hope is capped at 6 (Daggerheart SRD: Hope) and can never go negative.
    d.system.hope = Math.max(0, Math.min(DAGGERHEART_MAX_HOPE, d.system.hope));

    return d;
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

    // Any matched Duality Dice is a critical success regardless of the value
    // rolled; Daggerheart has no fumble result (Daggerheart SRD: Duality Dice).
    const outcome = getDaggerheartDualityOutcome(hopeDie, fearDie);

    return {
      total,
      formula: `2d12 + ${mod} (${checkId})`,
      terms: [hopeDie, fearDie],
      isCritical: outcome === 'critical',
      isFumble: false,
      flavor:
        outcome === 'hope'
          ? `Hope (${hopeDie}) vs Fear (${fearDie}) — with Hope!`
          : outcome === 'critical'
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
    } else if (type === 'stress') {
      const stress = { ...d.system.stress };
      stress.current = Math.min(stress.max, stress.current + amount);
      d.system.stress = stress;
    } else {
      // Daggerheart damage is not an HP pool: an incoming hit marks 1/2/3 HP
      // by the Major/Severe thresholds, and marking an Armor Slot reduces the
      // HP marked by one (Daggerheart SRD: Damage & Hit Points, Reducing
      // Incoming Damage).
      const armorScore = Math.max(0, d.system.armorScore || d.system.armor.max);
      const baseHpMarked = getDaggerheartHpMarked(
        amount,
        d.system.majorThreshold,
        d.system.severeThreshold
      );
      const armorSlotsMarked =
        baseHpMarked > 0 && armorScore > 0 && d.system.armor.current > 0 ? 1 : 0;
      const hpMarked = getDaggerheartHpMarkedAfterArmor(baseHpMarked, armorSlotsMarked, armorScore);

      if (armorSlotsMarked > 0) {
        d.system.armor = {
          ...d.system.armor,
          current: d.system.armor.current - armorSlotsMarked,
        };
      }
      hp.current = Math.max(0, hp.current - hpMarked);
    }

    d.system.hitPoints = hp;
    return d;
  }
}
