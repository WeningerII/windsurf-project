import { describe, it, expect } from 'vitest';

import {
  compileModifierEffects,
  compileModifierSource,
  resolveCharacterEffects,
  type MagicBonusItem,
  type ModifierSource,
} from '../../rules';
import type { Modifier } from '../../types/core/common';
import type { Feat, Feature } from '../../types/core/character';

/**
 * The character-effect compile pipeline (feats/features/equipment → resolver
 * targets), central to every system engine but previously only covered
 * transitively. Locks the target mapping, the honest manual-boundary handling of
 * stacking-type-only modifiers, and the additive sum through the shared resolver.
 */

const mod = (type: Modifier['type'], value: number): Modifier => ({ type, value, source: 'test' });
const featSource = (modifiers: Modifier[]): ModifierSource => ({
  id: 'f1',
  name: 'Feat One',
  kind: 'feat',
  modifiers,
});

describe('compileModifierSource', () => {
  it('maps a target-like modifier to an additive effect', () => {
    const [eff] = compileModifierSource('dnd-5e-2024', featSource([mod('attack', 1)]));
    expect(eff).toMatchObject({ target: 'attack', operation: 'add', value: 1, stackPolicy: 'sum' });
  });

  it('maps skill / AC / save to their resolver targets', () => {
    const at = (t: Modifier['type']) =>
      compileModifierSource('dnd-5e-2024', featSource([mod(t, 1)]))[0];
    expect(at('skill')).toMatchObject({ target: 'skill', category: 'proficiency' });
    expect(at('armor-class')).toMatchObject({ target: 'ac', category: 'defense' });
    expect(at('saving-throw')).toMatchObject({ target: 'save', category: 'defense' });
  });

  it('keeps a stacking-type-only modifier as an honest manual boundary (no faked target)', () => {
    const [eff] = compileModifierSource('dnd-3.5e', featSource([mod('enhancement', 2)]));
    expect(eff).toMatchObject({ operation: 'note', target: 'modifier.enhancement' });
    expect(eff.manualBoundary).toBeDefined();
  });

  it('returns nothing for a source with no modifiers', () => {
    expect(compileModifierSource('dnd-5e-2024', { id: 'x', name: 'x', kind: 'feature' })).toEqual(
      []
    );
  });

  it('compileModifierEffects flattens every source', () => {
    const effects = compileModifierEffects('dnd-5e-2024', [
      featSource([mod('attack', 1), mod('damage', 1)]),
      { id: 'f2', name: 'Feat Two', kind: 'feat', modifiers: [mod('skill', 1)] },
    ]);
    expect(effects).toHaveLength(3);
  });
});

describe('resolveCharacterEffects', () => {
  const feat = (id: string, modifiers: Modifier[]): Feat => ({
    id,
    name: id,
    description: '',
    source: 'test',
    modifiers,
  });
  const feature = (id: string, modifiers: Modifier[]): Feature => ({
    id,
    name: id,
    source: 'test',
    description: '',
    modifiers,
  });

  it('sums feat + feature + equipment bonuses per target', () => {
    const item: MagicBonusItem = { itemId: 'sword', attackBonus: 1, damageBonus: 1 };
    const { bonus } = resolveCharacterEffects('dnd-5e-2024', {
      equipment: [item],
      feats: [feat('archery', [mod('attack', 2)])],
      features: [feature('focus', [mod('attack', 1)])],
    });
    expect(bonus('attack')).toBe(4); // +1 item, +2 feat, +1 feature
    expect(bonus('damage')).toBe(1); // item only
  });

  it('is additive zero for an empty character', () => {
    const { bonus } = resolveCharacterEffects('dnd-5e-2024', {});
    expect(bonus('attack')).toBe(0);
    expect(bonus('anything')).toBe(0);
  });
});
