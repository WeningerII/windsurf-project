import { describe, it, expect } from 'vitest';

import {
  collectD20LegacyConditionEffects,
  collectSceneConditionEffects,
  mam3eBruisePenalty,
} from '../../rules';
import { resolveSceneAttack, type SceneCombatStats } from '../../rules/combat/sceneCombat';
import {
  createSceneDocument,
  resolveSceneAction,
  appendSceneEvent,
  foldSceneEvents,
} from '../../scene/runtime';
import { makeEffectId } from '../../rules';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

describe('collectSceneConditionEffects: per-system condition vocabularies', () => {
  it('defaults to the 5e vocabulary (poisoned -> disadvantage)', () => {
    const effects = collectSceneConditionEffects(undefined, ['poisoned']);
    expect(effects.some((e) => e.operation === 'disadvantage' && e.target === 'attack')).toBe(true);
  });

  it('PF1e/3.5e compile flat OGL penalties (shaken -2, sickened -2 attack and damage)', () => {
    for (const systemId of ['pf1e', 'dnd-3.5e'] as const) {
      const effects = collectSceneConditionEffects(systemId, ['shaken', 'sickened']);
      const attackPenalties = effects.filter(
        (e) => e.target === 'attack' && e.operation === 'subtract'
      );
      expect(attackPenalties.map((e) => e.value).sort()).toEqual([2, 2]);
      expect(
        effects.some((e) => e.target === 'damage' && e.operation === 'subtract' && e.value === 2)
      ).toBe(true);
      expect(effects.every((e) => e.systemId === systemId)).toBe(true);
    }
  });

  it('PF2e takes the single worst all-checks status penalty (no stacking)', () => {
    const effects = collectSceneConditionEffects('pf2e', ['frightened-2', 'sickened-1']);
    expect(effects).toHaveLength(1);
    expect(effects[0].operation).toBe('subtract');
    expect(effects[0].value).toBe(2);
    // Ability-scoped conditions (clumsy) do not hit the attack roll here.
    expect(collectSceneConditionEffects('pf2e', ['clumsy-3'])).toHaveLength(0);
  });

  it('Daggerheart conditions are note-only (they modify incoming rolls)', () => {
    const effects = collectSceneConditionEffects('daggerheart', ['vulnerable', 'restrained']);
    expect(effects).toHaveLength(2);
    expect(effects.every((e) => e.operation === 'note')).toBe(true);
  });

  it('unknown ids contribute nothing in every vocabulary', () => {
    for (const systemId of [undefined, 'pf1e', 'pf2e', 'daggerheart', 'mam3e']) {
      expect(collectSceneConditionEffects(systemId, ['totally-made-up'])).toHaveLength(0);
    }
  });
});

describe('d20 legacy catalog honesty boundaries', () => {
  it('blinded and stunned are notes, prone carries its melee-only boundary', () => {
    const effects = collectD20LegacyConditionEffects('pf1e', ['blinded', 'stunned', 'prone']);
    const byCondition = (id: string) => effects.filter((e) => e.source.id === id);
    expect(byCondition('blinded')[0].operation).toBe('note');
    expect(byCondition('stunned')[0].operation).toBe('note');
    const prone = byCondition('prone')[0];
    expect(prone.operation).toBe('subtract');
    expect(prone.value).toBe(4);
    expect(prone.manualBoundary?.kind).toBe('partial');
  });
});

describe('M&M bruise track penalizes Toughness saves in scenes', () => {
  it('mam3eBruisePenalty reads the cumulative bruised-N condition', () => {
    expect(mam3eBruisePenalty([])).toBe(0);
    expect(mam3eBruisePenalty(['dazed', 'bruised-3'])).toBe(3);
  });

  it('a bruised target saves at -N in resolveSceneAttack', () => {
    const tokens: SceneToken[] = [
      {
        id: 'hero',
        name: 'Hero',
        kind: 'character',
        position: { x: 0, y: 0 },
        size: 1,
        hp: { current: 1, max: 1, temp: 0 },
      },
      {
        id: 'thug',
        name: 'Thug',
        kind: 'monster',
        position: { x: 1, y: 0 },
        size: 1,
        hp: { current: 1, max: 1, temp: 0 },
        conditions: ['bruised-2'],
      },
    ];
    let scene: SceneDocument = createSceneDocument({
      id: 'mm',
      name: 'MM',
      systemId: 'mam3e',
      seed: 'mam-bruise-track',
    });
    for (const token of tokens) {
      const r = resolveSceneAction(
        scene,
        { type: 'place-token', token },
        { eventId: `p-${token.id}` }
      );
      scene = appendSceneEvent(scene, r.event!);
    }
    // +20 to hit guarantees the attack lands; the comparison is about the save.
    const stats = (): SceneCombatStats => ({
      armorClass: 10,
      attackEffects: [
        {
          id: makeEffectId('mam3e', 'attack', 'test'),
          systemId: 'mam3e',
          target: 'attack',
          operation: 'add',
          value: 20,
          stackPolicy: 'sum',
          source: { kind: 'system', label: 'test' },
          label: 'test attack',
        },
      ],
      damageEffects: [],
      reach: 1,
      critOn: 20,
      mam3e: { parry: 10, toughness: 6, effectRank: 5, ranged: false },
    });
    const state = foldSceneEvents(scene).state;

    const withBruises = resolveSceneAttack({
      state,
      attackerId: 'hero',
      targetId: 'thug',
      resolveStats: stats,
      seed: 'mam-bruise-track',
    });
    const stateNoBruise = {
      ...state,
      tokens: {
        ...state.tokens,
        thug: { ...state.tokens.thug, conditions: [] },
      },
    };
    const withoutBruises = resolveSceneAttack({
      state: stateNoBruise,
      attackerId: 'hero',
      targetId: 'thug',
      resolveStats: stats,
      seed: 'mam-bruise-track',
    });
    // Same seed, same rolls: the only difference is the -2 bruise penalty on
    // the Toughness save total in the log.
    expect(withBruises.hit).toBe(true);
    expect(withoutBruises.hit).toBe(true);
    const saveTotal = (log: string) => Number(/Toughness (-?\d+)/.exec(log)?.[1] ?? NaN);
    expect(saveTotal(withBruises.log)).toBe(saveTotal(withoutBruises.log) - 2);
  });
});

describe('legacy-d20 sheet conditions', () => {
  it('the fear track never stacks with itself, sickened stacks with fear', async () => {
    const { d20LegacyCheckPenalty, collectD20LegacyConditionEffects } =
      await import('../../rules/conditions/d20LegacyConditions');
    expect(d20LegacyCheckPenalty(['shaken'])).toBe(2);
    expect(d20LegacyCheckPenalty(['shaken', 'frightened'])).toBe(2);
    expect(d20LegacyCheckPenalty(['shaken', 'sickened'])).toBe(4);
    // The attack-effect collector applies the same worst-of-fear rule.
    const effects = collectD20LegacyConditionEffects('pf1e', ['shaken', 'frightened']);
    const attackPenalty = effects
      .filter((e) => e.target === 'attack' && e.operation === 'subtract')
      .reduce((total, e) => total + (typeof e.value === 'number' ? e.value : 0), 0);
    expect(attackPenalty).toBe(2);
  });

  it('a shaken PF1e character fights shaken in scenes', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const build = (conditions: Array<{ id: string; name: string }>) =>
      buildCharacterCombatant(
        {
          id: 'pf1e-shaken',
          name: 'Scared',
          systemId: 'pf1e',
          system: {
            level: 3,
            baseAttackBonus: 3,
            baseAttributes: { str: 14, dex: 10 },
            hitPoints: { current: 20, max: 20 },
            armorClass: { total: 15 },
            conditions,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { tokenId: 't', position: { x: 0, y: 0 } }
      );
    const shaken = build([{ id: 'shaken', name: 'Shaken' }]);
    const calm = build([]);
    expect(shaken.supported && calm.supported).toBe(true);
    if (!shaken.supported || !calm.supported) return;
    const subtractTotal = (
      effects: ReadonlyArray<{ target: string; operation: string; value: unknown }>
    ) =>
      effects
        .filter((e) => e.target === 'attack' && e.operation === 'subtract')
        .reduce((total, e) => total + (typeof e.value === 'number' ? e.value : 0), 0);
    expect(subtractTotal(shaken.combatant.attackEffects)).toBe(2);
    expect(subtractTotal(calm.combatant.attackEffects)).toBe(0);
  });

  it('engine checks roll at -2 while sickened (PF1e and 3.5e)', async () => {
    const { Pf1eEngine } = await import('../../systems/pf1e/engine');
    const { Dnd35eEngine } = await import('../../systems/dnd35e/engine');
    const { createDefaultPf1eData } = await import('../../systems/pf1e/data-model');
    const { createDefaultDnd35eData } = await import('../../systems/dnd35e/data-model');
    const cases = [
      { engine: new Pf1eEngine(), systemId: 'pf1e', data: createDefaultPf1eData() },
      { engine: new Dnd35eEngine(), systemId: 'dnd-3.5e', data: createDefaultDnd35eData() },
    ] as const;
    for (const { engine, systemId, data } of cases) {
      const doc = (conditions: Array<{ id: string; name: string }>) => ({
        id: 'c',
        name: 'C',
        systemId,
        system: { ...data, conditions },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const modifierOf = (formula: string) => Number(/1d20 \+ (-?\d+)/.exec(formula)?.[1]);
      const sick = await engine.rollCheck(
        doc([{ id: 'sickened', name: 'Sickened' }]) as never,
        'save-fort'
      );
      const well = await engine.rollCheck(doc([]) as never, 'save-fort');
      expect(modifierOf(sick.formula)).toBe(modifierOf(well.formula) - 2);
    }
  });
});
