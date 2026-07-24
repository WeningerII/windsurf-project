import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';
import type {
  DaggerheartPassiveBonuses,
  DaggerheartPassiveDerivedBonus,
} from '../../types/daggerheart';
import type { CharacterDocument } from '../../types/core/document';
import { getDaggerheartInventoryDefinition } from '../../rules/daggerheartInventory';
import {
  getDaggerheartActivePassiveDomainCards,
  getDaggerheartEffectiveAttribute,
  getDaggerheartProficiency,
  getDaggerheartTier,
  getEquippedDaggerheartArmor,
  getEquippedDaggerheartWeapon,
} from '../../rules/daggerheartDerived';
import { makeEffectId, resolveEffects, toContributionLedger } from '../../rules';
import type { EffectInstance } from '../../rules';
import type { DaggerheartDataModel } from './data-model';

/**
 * Non-persisted contribution ledger for Daggerheart.
 *
 * Re-backing status (W4 seam). Daggerheart's derived stats split into two
 * populations, and this builder treats each HONESTLY rather than forcing
 * uniformity:
 *
 *   1. ADDITIVE, typed-bonus-shaped contributions — the flat passive bonuses off
 *      weapons/armor/domain-cards/inventory (evasion, armorScore, the two damage
 *      thresholds, spellcast, per-trait attribute bumps) AND the two additive
 *      DERIVED terms whose MAGNITUDE is computed from character state but whose
 *      CONTRIBUTION is a plain `add` (`evasion-half-trait`, `severe-threshold-
 *      proficiency`). These are compiled to `EffectInstance[]` (`operation:'add'`,
 *      `stackPolicy:'sum'`) and run through the SHARED resolver
 *      (`resolveEffects` + `toContributionLedger`) — the same primitives the
 *      `resolveCharacterLedger` convenience wrapper is itself built from — so
 *      resolution and provenance become ONE computation, never two parallel ones.
 *
 *   2. NON-ADDITIVE overrides — `unarmored-defense-by-tier`, which SETS the whole
 *      unarmored armor-score/threshold block from a per-tier lookup table. This is
 *      not an additive typed bonus: its value is an OBJECT
 *      (`{armorScore, majorThreshold, severeThreshold}`), a shape the resolver IR's
 *      `EffectValue` (`number | string | number[] | null`) provably cannot carry.
 *      Routing it through the resolver would mean faking it, so it stays an
 *      EXPLICIT, clearly annotated ledger entry (`operation:'set'`) with full
 *      provenance instead.
 *
 * Why not the `resolveCharacterLedger` wrapper directly? That wrapper feeds its
 * inputs through the equipment/feat/feature compilers, whose target namespace is
 * the d20 family (`attack`/`damage`/`ac`/`save`/`skill`). Daggerheart's targets
 * (`evasion`, thresholds, per-trait attributes, `spellcast`) are not in that
 * namespace, so Daggerheart adapts its additive passives into the IR directly and
 * resolves them with the same underlying primitives — genuinely resolver-projected
 * without pretending its bonuses are d20-shaped equipment.
 *
 * These rows are EXPLANATION only — never stored on the document. Additive by
 * construction: a Daggerheart character with no bonus-bearing gear/cards yields no
 * additive rows (and no override row unless an unarmored-defense card is active).
 */
export function buildDaggerheartContributionLedger(
  document: CharacterDocument<DaggerheartDataModel>
): ContributionLedgerResult {
  const system = document.system;
  const sources = getDaggerheartPassiveSources(system);

  // Each source contributes an ordered mix of additive effects (resolver-backed)
  // and non-additive override entries (kept explicit). Order is preserved so the
  // ledger reads source-by-source exactly as it did when hand-built.
  const parts = sources.flatMap((source) => [
    ...buildAdditivePassiveEffects(source),
    ...buildDerivedContributions(system, source),
  ]);

  // Resolver-back the additive slice: `resolveEffects` keeps every applied effect
  // in input order (none are dropped — they carry no gating condition), and
  // `toContributionLedger` projects them 1:1 into ledger entries.
  const additiveEffects = parts.flatMap((part) => (part.kind === 'effect' ? [part.effect] : []));
  const projected = toContributionLedger(resolveEffects(additiveEffects).ledger).entries;

  // Stitch back together, restoring original ordering and interleaving the
  // explicit override entries at their source positions.
  let projectedCursor = 0;
  const entries = parts.map((part) =>
    part.kind === 'effect' ? projected[projectedCursor++] : part.entry
  );

  return { entries };
}

type PassiveSource = {
  kind: ContributionSourceKind;
  id: string;
  label: string;
  path: string;
  note?: string;
  bonuses?: DaggerheartPassiveBonuses;
  derivedBonuses?: DaggerheartPassiveDerivedBonus[];
  multiplier?: number;
};

/**
 * A single contribution: either an additive resolver effect or an explicit
 * non-additive override entry. The two are stitched back into one ordered ledger.
 */
type LedgerPart =
  | { kind: 'effect'; effect: EffectInstance }
  | { kind: 'entry'; entry: ContributionLedgerEntry };

function getDaggerheartPassiveSources(system: DaggerheartDataModel): PassiveSource[] {
  const sources: PassiveSource[] = [];
  const primaryWeapon = getEquippedDaggerheartWeapon(system, 'primary');
  const secondaryWeapon = getEquippedDaggerheartWeapon(system, 'secondary');
  const armor = getEquippedDaggerheartArmor(system);

  if (primaryWeapon?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: primaryWeapon.id,
      label: primaryWeapon.name,
      path: 'system.weapons.primaryId',
      bonuses: primaryWeapon.passiveBonuses,
    });
  }

  if (secondaryWeapon?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: secondaryWeapon.id,
      label: secondaryWeapon.name,
      path: 'system.weapons.secondaryId',
      bonuses: secondaryWeapon.passiveBonuses,
    });
  }

  if (armor?.passiveBonuses) {
    sources.push({
      kind: 'item',
      id: armor.id,
      label: armor.name,
      path: 'system.armorId',
      bonuses: armor.passiveBonuses,
    });
  }

  // Active passive cards come from the same helper the derived stats use
  // (utils/daggerheartDerived), so the ledger can never diverge from them.
  getDaggerheartActivePassiveDomainCards(system).forEach((card) => {
    sources.push({
      kind: 'domain-card',
      id: card.id,
      label: card.name,
      path: 'system.domainCards',
      note: card.automationNote,
      bonuses: card.passiveBonuses,
      derivedBonuses: card.passiveDerivedBonuses,
    });
  });

  system.inventory.forEach((entry, index) => {
    const definition = getDaggerheartInventoryDefinition(entry.itemId);
    if (!definition?.passiveBonuses) {
      return;
    }

    sources.push({
      kind: 'item',
      id: definition.id,
      label: definition.name,
      path: `system.inventory.${index}`,
      bonuses: definition.passiveBonuses,
      multiplier: Math.max(1, entry.quantity || 1),
    });
  });

  return sources;
}

/** Flat, typed passive bonuses → additive resolver effects (`add` / `sum`). */
function buildAdditivePassiveEffects(source: PassiveSource): LedgerPart[] {
  const bonuses = source.bonuses;
  const multiplier = source.multiplier ?? 1;

  if (!bonuses) {
    return [];
  }

  return [
    ...numericEffect(source, 'evasion', bonuses.evasion, 'defense', multiplier),
    ...numericEffect(source, 'armorScore', bonuses.armorScore, 'defense', multiplier),
    ...numericEffect(source, 'majorThreshold', bonuses.majorThreshold, 'defense', multiplier),
    ...numericEffect(source, 'severeThreshold', bonuses.severeThreshold, 'defense', multiplier),
    ...numericEffect(source, 'spellcast', bonuses.spellcast, 'ability', multiplier),
    ...Object.entries(bonuses.attributes ?? {}).flatMap(([trait, amount]) =>
      numericEffect(source, `attributes.${trait}`, amount, 'ability', multiplier, trait)
    ),
  ];
}

/**
 * Derived passive bonuses. The two additive kinds become resolver effects; the
 * `unarmored-defense-by-tier` override stays an explicit annotated entry because
 * its object-shaped `set` value cannot be represented in the resolver IR.
 */
function buildDerivedContributions(
  system: DaggerheartDataModel,
  source: PassiveSource
): LedgerPart[] {
  return (source.derivedBonuses ?? []).flatMap((bonus): LedgerPart[] => {
    if (bonus.kind === 'evasion-half-trait') {
      const value = Math.max(
        0,
        Math.floor(getDaggerheartEffectiveAttribute(system, bonus.trait) / 2)
      );

      return [
        {
          kind: 'effect',
          effect: additiveEffect({
            source,
            target: 'evasion',
            label: 'Derived Evasion passive bonus',
            value,
            category: 'defense',
            details: { derivedKind: bonus.kind, trait: bonus.trait },
          }),
        },
      ];
    }

    if (bonus.kind === 'severe-threshold-proficiency') {
      const value = getDaggerheartProficiency(system.level);

      return [
        {
          kind: 'effect',
          effect: additiveEffect({
            source,
            target: 'severeThreshold',
            label: 'Derived Severe threshold passive bonus',
            value,
            category: 'defense',
            details: { derivedKind: bonus.kind },
          }),
        },
      ];
    }

    // unarmored-defense-by-tier: a non-additive OVERRIDE. Only active while
    // unarmored, and only for a tier the card actually tabulates.
    if (system.armorId) {
      return [];
    }

    const thresholds = bonus.thresholdsByTier[getDaggerheartTier(system.level)];
    if (!thresholds) {
      return [];
    }

    return [
      {
        kind: 'entry',
        entry: overrideEntry({
          source,
          target: 'unarmoredDefense',
          label: 'Derived unarmored defense passive bonus',
          value: {
            armorScore:
              bonus.armorScoreBase + getDaggerheartEffectiveAttribute(system, bonus.trait),
            majorThreshold: thresholds.major,
            severeThreshold: thresholds.severe,
          },
          category: 'defense',
          details: { derivedKind: bonus.kind, trait: bonus.trait },
        }),
      },
    ];
  });
}

/** Build one additive passive effect, or nothing when the amount is zero. */
function numericEffect(
  source: PassiveSource,
  target: string,
  value: number | undefined,
  category: ContributionCategory,
  multiplier: number,
  trait?: string
): LedgerPart[] {
  if (!value) {
    return [];
  }

  return [
    {
      kind: 'effect',
      effect: additiveEffect({
        source,
        target,
        label: 'Passive bonus',
        value: value * multiplier,
        category,
        details: trait ? { trait, multiplier } : { multiplier },
      }),
    },
  ];
}

/**
 * An additive contribution as a resolver `EffectInstance`. Projected through
 * `toContributionLedger`, it yields exactly the ledger entry Daggerheart used to
 * hand-build — same id, target, source, value, category, provenance.
 */
function additiveEffect(params: {
  source: PassiveSource;
  target: string;
  label: string;
  value: number;
  category: ContributionCategory;
  details?: Record<string, unknown>;
}): EffectInstance {
  return {
    id: makeEffectId(
      'daggerheart',
      params.category,
      params.target,
      params.source.id,
      params.label,
      params.value
    ),
    systemId: 'daggerheart',
    target: params.target,
    operation: 'add',
    value: params.value,
    stackPolicy: 'sum',
    source: {
      kind: params.source.kind,
      id: params.source.id,
      label: params.source.label,
      path: params.source.path,
    },
    label: params.label,
    category: params.category,
    manualBoundary: params.source.note ? { kind: 'partial', note: params.source.note } : undefined,
    details: params.details,
  };
}

/**
 * A non-additive override as an explicit ledger entry. Kept hand-built (NOT
 * resolver-projected) because its `set` value is an object the resolver IR cannot
 * represent; the annotation makes that boundary visible in the ledger.
 */
function overrideEntry(params: {
  source: PassiveSource;
  target: string;
  label: string;
  value: ContributionLedgerEntry['value'];
  category: ContributionCategory;
  details?: Record<string, unknown>;
}): ContributionLedgerEntry {
  return {
    id: makeEffectId(
      'daggerheart',
      params.category,
      params.target,
      params.source.id,
      params.label,
      String(params.value)
    ),
    systemId: 'daggerheart',
    target: params.target,
    source: {
      kind: params.source.kind,
      id: params.source.id,
      label: params.source.label,
      path: params.source.path,
    },
    label: params.label,
    operation: 'set',
    value: params.value,
    category: params.category,
    manualBoundary: params.source.note ? { kind: 'partial', note: params.source.note } : undefined,
    details: params.details,
  };
}
