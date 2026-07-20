/**
 * Daggerheart Engine
 *
 * Implements the SystemEngine interface for Daggerheart.
 * Daggerheart uses 2d12 (Hope die + Fear die) for action rolls.
 */

import { CharacterDocument } from '../../types/core/document';
import { rollDuality } from '../../rules/dice';
import { SystemEngine, RollResult } from '../../registry/types';
import { applyDerivedQuantities } from '../../rules/derivation';
import { clampCount } from '../../utils/resourcePool';
import { createDefaultDaggerheartData, DaggerheartDataModel } from './data-model';
import { DAGGERHEART_DERIVED_QUANTITIES } from './derivedQuantities';
import {
  DAGGERHEART_MAX_HOPE,
  getDaggerheartDerivedStats,
  getDaggerheartDualityOutcome,
  getDaggerheartEffectiveAttribute,
  getDaggerheartHpMarked,
  getDaggerheartHpMarkedAfterArmor,
} from '../../rules/daggerheartDerived';
import {
  clampDaggerheartInventoryQuantity,
  normalizeDaggerheartCurrency,
} from '../../rules/daggerheartInventory';
import { normalizeDaggerheartDocument } from './daggerheartNormalization';
import { collectDaggerheartConditionEffects } from '../../rules/conditions/daggerheartConditions';
import type { DaggerheartTrait } from '../../types/daggerheart';

/**
 * Read any self-condition ids a document carries. Daggerheart's data model has no
 * conditions field of its own, so this narrows defensively — an absent/malformed
 * field yields no conditions and no provenance.
 */
function readDaggerheartSelfConditionIds(system: DaggerheartDataModel): string[] {
  const raw = (system as { conditions?: unknown }).conditions;
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === 'string');
}

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
    d.system.stress.current = clampCount(d.system.stress.current, d.system.stress.max);
    d.system.armor.current = clampCount(d.system.armor.current, d.system.armor.max);
    // Hope is capped at 6 (Daggerheart SRD: Hope) and can never go negative.
    d.system.hope = clampCount(d.system.hope, DAGGERHEART_MAX_HOPE);

    // Declarative standing derived quantities (Tier, Proficiency, damage
    // thresholds, …). One call computes every spec in derivedQuantities.ts; the
    // sheet reads system.derived and the compute register's mutation gate
    // verifies each. Runs after the derived-stats block so the thresholds it
    // reads are already prepared.
    d.system.derived = applyDerivedQuantities(d.system, DAGGERHEART_DERIVED_QUANTITIES);

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

    // Daggerheart uses 2d12 — Hope die and Fear die (shared, seedable roller).
    const { hope: hopeDie, fear: fearDie } = rollDuality();
    const total = hopeDie + fearDie + mod;

    // Any matched Duality Dice is a critical success regardless of the value
    // rolled; Daggerheart has no fumble result (Daggerheart SRD: Duality Dice).
    const outcome = getDaggerheartDualityOutcome(hopeDie, fearDie);

    // RAW: the roller's OWN conditions (Vulnerable/Restrained/Hidden) change
    // INCOMING rolls and movement — never their own duality roll. Collect them
    // purely as note-only provenance; they NEVER fold into total/terms/outcome.
    // When absent (the common case, and every existing roll) flavor is unchanged.
    const conditionNotes = collectDaggerheartConditionEffects(
      readDaggerheartSelfConditionIds(document.system)
    );
    const baseFlavor =
      outcome === 'hope'
        ? `Hope (${hopeDie}) vs Fear (${fearDie}) — with Hope!`
        : outcome === 'critical'
          ? `Hope (${hopeDie}) = Fear (${fearDie}) — Critical!`
          : `Hope (${hopeDie}) vs Fear (${fearDie}) — with Fear`;

    return {
      total,
      formula: `2d12 + ${mod} (${checkId})`,
      terms: [hopeDie, fearDie],
      isCritical: outcome === 'critical',
      isFumble: false,
      // Daggerheart vocabulary, not the d20 "NAT 20!" default.
      outcomeLabel: outcome === 'critical' ? 'Critical!' : undefined,
      flavor: conditionNotes.length
        ? `${baseFlavor} [${conditionNotes.map((effect) => effect.source.label).join(', ')}]`
        : baseFlavor,
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
