import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DaggerheartDomainCard, DaggerheartTier } from '../../types/daggerheart';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';

/**
 * Targeted coverage for the `unarmored-defense-by-tier` passive in
 * getDaggerheartDerivedStats. The shipped Bare Bones card defines all four
 * tiers, so the "no thresholds for this tier" guard is unreachable with the real
 * catalog. We mock the domain-card resolver to inject a card whose
 * thresholdsByTier omits the character's tier and assert the override is skipped
 * (falling back to the level-based unarmored defaults), then a card that DOES
 * define the tier to show the override otherwise takes effect.
 */

// Mutable holder so each test controls what the resolver returns.
let mockedCard: DaggerheartDomainCard | undefined;

vi.mock('../../data/daggerheart/1.0/domain-cards', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../data/daggerheart/1.0/domain-cards')>();
  return {
    ...actual,
    getDaggerheartDomainCard: (id: string) =>
      id === 'mock-unarmored-card' ? mockedCard : actual.getDaggerheartDomainCard(id),
  };
});

// Imported AFTER the mock declaration; vitest hoists vi.mock above imports.
import { getDaggerheartDerivedStats } from '../../utils/daggerheartDerived';

function makeUnarmoredCard(
  thresholdsByTier: Partial<Record<DaggerheartTier, { major: number; severe: number }>>
): DaggerheartDomainCard {
  return {
    id: 'mock-unarmored-card',
    name: 'Mock Unarmored Defense',
    system: 'daggerheart',
    source: 'TEST',
    version: '1.0',
    lastUpdated: '2026-06-23',
    sourceBook: { name: 'Test', url: 'https://example.test' },
    domain: 'valor',
    level: 1,
    type: 'ability',
    recallCost: 0,
    description: 'Mock unarmored defense card.',
    automationMode: 'passive',
    passiveCondition: { kind: 'while-unarmored' },
    passiveDerivedBonuses: [
      {
        kind: 'unarmored-defense-by-tier',
        armorScoreBase: 3,
        trait: 'strength',
        thresholdsByTier: thresholdsByTier as Record<
          DaggerheartTier,
          { major: number; severe: number }
        >,
      },
    ],
    effectTags: ['defense'],
    automationNote: 'test',
  };
}

function unarmoredSystem(): DaggerheartDataModel {
  return {
    ...createDefaultDaggerheartData(),
    level: 1, // tier 1
    armorId: '', // unarmored → passive condition satisfied
    attributes: { ...createDefaultDaggerheartData().attributes, strength: 2 },
    domainCards: [
      {
        id: 'mock-unarmored-card',
        cardId: 'mock-unarmored-card',
        name: 'Mock Unarmored Defense',
        domain: 'valor',
        level: 1,
        location: 'loadout',
        description: '',
      },
    ],
  };
}

describe('getDaggerheartDerivedStats unarmored-defense-by-tier', () => {
  beforeEach(() => {
    mockedCard = undefined;
  });

  it('skips the override when the card has no thresholds for the current tier', () => {
    // Only tier 2 is defined; a level-1 (tier-1) character hits the guard.
    mockedCard = makeUnarmoredCard({ 2: { major: 11, severe: 24 } });

    const stats = getDaggerheartDerivedStats(unarmoredSystem());

    // No override → unarmored level defaults: armorScore 0, major = level (1),
    // severe = level * 2 (2). The card's armorScoreBase (3) is NOT applied.
    expect(stats.armorScore).toBe(0);
    expect(stats.majorThreshold).toBe(1);
    expect(stats.severeThreshold).toBe(2);
  });

  it('applies the override when the card defines thresholds for the current tier', () => {
    mockedCard = makeUnarmoredCard({ 1: { major: 9, severe: 19 } });

    const stats = getDaggerheartDerivedStats(unarmoredSystem());

    // armorScore = armorScoreBase (3) + effective strength (2) = 5 (capped at 12).
    expect(stats.armorScore).toBe(5);
    expect(stats.majorThreshold).toBe(9);
    expect(stats.severeThreshold).toBe(19);
  });
});
