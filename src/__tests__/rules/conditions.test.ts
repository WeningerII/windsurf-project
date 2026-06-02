import { describe, it, expect } from 'vitest';

import {
  cannotAct,
  collapseRollMode,
  executeTacticalTurn,
  runCombatRound,
  statusAdvantage,
  makeEffectId,
  type EffectInstance,
  type RoundCombatant,
  type TacticalActor,
  type TacticalTarget,
} from '../../rules';

/**
 * 5e conditions fold into advantage/disadvantage on attacks (and cancel when
 * both are present). Other systems track the same conditions but don't get this
 * mapping.
 */

describe('statusAdvantage', () => {
  it('a restrained/stunned/etc. target grants advantage to attackers', () => {
    expect(statusAdvantage([], ['restrained'])).toEqual({ advantage: true, disadvantage: false });
    expect(statusAdvantage([], ['unconscious'])).toEqual({ advantage: true, disadvantage: false });
  });

  it('an impaired attacker (poisoned/frightened/blinded) has disadvantage', () => {
    expect(statusAdvantage(['poisoned'], [])).toEqual({ advantage: false, disadvantage: true });
  });

  it('invisibility cuts both ways', () => {
    expect(statusAdvantage(['invisible'], []).advantage).toBe(true); // unseen attacker
    expect(statusAdvantage([], ['invisible']).disadvantage).toBe(true); // unseen target
  });

  it('reports both sources when present (the caller cancels them)', () => {
    expect(statusAdvantage(['poisoned'], ['restrained'])).toEqual({
      advantage: true,
      disadvantage: true,
    });
  });
});

describe('collapseRollMode', () => {
  it('advantage and disadvantage cancel to normal', () => {
    expect(collapseRollMode(true, true)).toBe('normal');
    expect(collapseRollMode(true, false)).toBe('advantage');
    expect(collapseRollMode(false, true)).toBe('disadvantage');
    expect(collapseRollMode(false, false)).toBe('normal');
  });
});

describe('the executor applies condition-derived advantage (5e only)', () => {
  const atk = (bonus: number): EffectInstance => ({
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  });
  const actor = (statuses?: string[]): TacticalActor => ({
    tokenId: 'A',
    faction: 'party',
    position: { x: 0, y: 0 },
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 1,
    statuses,
  });
  const foe = (statuses?: string[]): TacticalTarget => ({
    tokenId: 'T',
    faction: 'monsters',
    position: { x: 1, y: 0 },
    armorClass: 14,
    hp: { current: 10, max: 10 },
    statuses,
  });

  it('rolls with advantage against a restrained foe', () => {
    const turn = executeTacticalTurn({
      actor: actor(),
      targets: [foe(['restrained'])],
      seed: 'c',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.resolution?.rollMode).toBe('advantage');
    expect(turn.resolution?.d20Terms).toHaveLength(2);
  });

  it('rolls with disadvantage when the attacker is poisoned', () => {
    const turn = executeTacticalTurn({
      actor: actor(['poisoned']),
      targets: [foe()],
      seed: 'c',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.resolution?.rollMode).toBe('disadvantage');
  });

  it('cancels to a normal roll when both apply', () => {
    const turn = executeTacticalTurn({
      actor: actor(['poisoned']),
      targets: [foe(['restrained'])],
      seed: 'c',
      systemId: 'dnd-5e-2014',
    });
    expect(turn.resolution?.rollMode).toBe('normal');
    expect(turn.resolution?.d20Terms).toHaveLength(1);
  });

  it('ignores conditions for non-5e systems (no advantage mapping)', () => {
    const turn = executeTacticalTurn({
      actor: actor(),
      targets: [foe(['restrained'])],
      seed: 'c',
      systemId: 'pf2e',
    });
    expect(turn.resolution?.rollMode).toBe('normal');
  });
});

describe('cannotAct', () => {
  it('is true for incapacitating conditions and false otherwise', () => {
    expect(cannotAct(['stunned'])).toBe(true);
    expect(cannotAct(['Unconscious'])).toBe(true); // case-insensitive
    expect(cannotAct(['paralyzed', 'prone'])).toBe(true);
    expect(cannotAct(['poisoned'])).toBe(false); // poisoned still acts
    expect(cannotAct([])).toBe(false);
    expect(cannotAct(undefined)).toBe(false);
  });
});

describe('the auto-round skips an incapacitated combatant', () => {
  const atk = (bonus: number): EffectInstance => ({
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  });
  const combatant = (id: string, faction: string, statuses?: string[]): RoundCombatant => ({
    tokenId: id,
    faction,
    position: { x: id === 'foe' ? 1 : 0, y: 0 },
    armorClass: 12,
    hp: { current: 20, max: 20 },
    attackEffects: [atk(5)],
    damageEffects: [],
    reach: 1,
    statuses,
  });

  it('a stunned combatant takes no turn', () => {
    const result = runCombatRound({
      order: [combatant('hero', 'party', ['stunned']), combatant('foe', 'monsters')],
      seed: 'stun',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    const heroTurn = result.turns.find((t) => t.tokenId === 'hero')!;
    expect(heroTurn.skipped).toBe(true);
    expect(heroTurn.turn.rationale).toMatch(/incapacitated/i);
    // The unaffected foe still acts.
    expect(result.turns.find((t) => t.tokenId === 'foe')!.skipped).toBe(false);
  });
});
