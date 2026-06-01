/**
 * System-agnostic feat/feature `Modifier` → effect IR compiler.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), Phase 1.
 *
 * Feats and features in the shared character model carry `modifiers?: Modifier[]`
 * (`src/types/core/common.ts`). Until now no engine read them. This compiler maps
 * each `Modifier` onto an `EffectInstance`, making feat/feature bonuses resolve
 * through the same shared resolver as equipment — identically across systems.
 *
 * The existing `Modifier.type` field is overloaded: some members name a *target*
 * (`attack`, `armor-class`, `damage`, `saving-throw`, `skill`) while others name
 * a *stacking bonus type* (`enhancement`, `circumstance`, `racial`, ...). We map
 * the target-like members to a concrete `target` with a sound stack policy, and
 * we DO NOT invent a target for the stacking-only members — those become honest
 * `manualBoundary` annotations rather than faked automation.
 */

import type { GameSystemId } from '../../types/game-systems';
import type { BonusType, Modifier } from '../../types/core/common';
import { makeEffectId, type EffectInstance, type StackPolicy } from '../ir/types';
import type { ContributionCategory } from '../../types/core/contributionLedger';

/** A feat or feature that may carry modifiers. */
export interface ModifierSource {
  id: string;
  name: string;
  kind: 'feat' | 'feature';
  modifiers?: Modifier[];
}

interface TargetMapping {
  target: string;
  category: ContributionCategory;
}

/**
 * Map an overloaded `Modifier.type` to a resolver target when it names one.
 * Returns `undefined` for members that name only a stacking bonus type (no
 * inherent target) — those cannot be auto-targeted and stay manual.
 */
function targetForModifierType(type: BonusType): TargetMapping | undefined {
  switch (type) {
    case 'attack':
      return { target: 'attack', category: 'other' };
    case 'damage':
      return { target: 'damage', category: 'other' };
    case 'armor-class':
      return { target: 'ac', category: 'defense' };
    case 'saving-throw':
      return { target: 'save', category: 'defense' };
    case 'skill':
      return { target: 'skill', category: 'proficiency' };
    // Stacking-type-only members: no inherent target.
    case 'enhancement':
    case 'circumstance':
    case 'racial':
    case 'insight':
    case 'luck':
    case 'proficiency':
    case 'alchemical':
    case 'divine':
    case 'ability-score':
    case 'untyped':
      return undefined;
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

/**
 * Stack policy for a feat/feature modifier. d20/PF treat a modifier's named type
 * as its stacking type; 5e/Daggerheart/M&M sum. When the modifier's `type` is a
 * target-like member (e.g. `attack`), there is no named bonus type, so it sums.
 */
function modifierStackPolicy(systemId: GameSystemId, type: BonusType): StackPolicy {
  const TYPED: ReadonlySet<GameSystemId> = new Set<GameSystemId>(['dnd-3.5e', 'pf1e']);
  if (TYPED.has(systemId) && isNamedBonusType(type)) {
    return { bonusType: type };
  }
  return 'sum';
}

function isNamedBonusType(type: BonusType): boolean {
  return (
    type === 'enhancement' ||
    type === 'circumstance' ||
    type === 'racial' ||
    type === 'insight' ||
    type === 'luck' ||
    type === 'alchemical' ||
    type === 'divine' ||
    type === 'untyped'
  );
}

/** Compile the modifiers of a single feat/feature source into effect instances. */
export function compileModifierSource(
  systemId: GameSystemId,
  src: ModifierSource
): EffectInstance[] {
  if (!src.modifiers || src.modifiers.length === 0) {
    return [];
  }

  return src.modifiers.map((modifier, index) => {
    const mapping = targetForModifierType(modifier.type);
    const baseSource = {
      kind: src.kind,
      id: src.id,
      label: src.name,
      path: `${src.kind}.${src.id}.modifiers.${index}`,
    };

    if (!mapping) {
      // Honest manual boundary: a typed bonus with no inherent target. We record
      // it (so it is visible/explainable) but contribute nothing numerically.
      return {
        id: makeEffectId(systemId, 'modifier', src.id, modifier.type, index),
        systemId,
        target: `modifier.${modifier.type}`,
        operation: 'note',
        value: modifier.value,
        stackPolicy: 'sum',
        source: baseSource,
        label: `${src.name}: ${modifier.type} ${formatSigned(modifier.value)}`,
        category: 'other',
        manualBoundary: {
          kind: 'manual',
          note: `Modifier type '${modifier.type}' names a bonus type but no target; apply manually.`,
        },
      } satisfies EffectInstance;
    }

    return {
      id: makeEffectId(systemId, mapping.target, src.id, modifier.type, index),
      systemId,
      target: mapping.target,
      operation: 'add',
      value: modifier.value,
      stackPolicy: modifierStackPolicy(systemId, modifier.type),
      source: baseSource,
      label: `${src.name}: ${formatSigned(modifier.value)} ${mapping.target}`,
      category: mapping.category,
    } satisfies EffectInstance;
  });
}

/** Compile every feat/feature source into a flat list of effect instances. */
export function compileModifierEffects(
  systemId: GameSystemId,
  sources: readonly ModifierSource[]
): EffectInstance[] {
  return sources.flatMap((src) => compileModifierSource(systemId, src));
}

function formatSigned(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}
