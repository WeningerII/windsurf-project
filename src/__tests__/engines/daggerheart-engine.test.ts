import { describe, expect, it, vi } from 'vitest';
import { CharacterDocument } from '../../types/core/document';
import {
  daggerheartDomainCardsById,
  daggerheartDomainCards,
} from '../../data/daggerheart/1.0/domain-cards';
import {
  DaggerheartDataModel,
  createDefaultDaggerheartData,
} from '../../systems/daggerheart/data-model';
import { DaggerheartEngine } from '../../systems/daggerheart/engine';

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {}
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-test',
    name: 'Hopebound',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-07T00:00:00.000Z'),
    updatedAt: new Date('2026-03-07T00:00:00.000Z'),
  };
}

describe('DaggerheartEngine', () => {
  const engine = new DaggerheartEngine();
  const allowedEffectTags = new Set([
    'attributes',
    'armor',
    'defense',
    'evasion',
    'thresholds',
    'spellcast',
    'loadout-synergy',
    'unarmored',
    'narrative',
    'social',
    'support',
    'offense',
    'control',
    'mobility',
    'summoning',
    'utility',
  ]);

  describe('domain card automation metadata', () => {
    it('keeps every shipped domain card classified with a supported automation mode, note, and tag set', () => {
      expect(daggerheartDomainCards.length).toBeGreaterThan(0);

      daggerheartDomainCards.forEach((card) => {
        expect(card.automationMode).toBeDefined();
        expect(card.automationNote).toBeTruthy();
        expect((card.effectTags?.length ?? 0) > 0).toBe(true);
        expect((card.effectTags ?? []).every((tag) => allowedEffectTags.has(tag))).toBe(true);
      });
    });

    it('infers stable effect tags across low, mid, and high-level cards that stay non-automated', () => {
      expect(daggerheartDomainCardsById['arcana-wall-walk']?.effectTags).toEqual(
        expect.arrayContaining(['mobility'])
      );
      expect(daggerheartDomainCardsById['splendor-healing-hands']?.effectTags).toEqual(
        expect.arrayContaining(['support'])
      );

      expect(daggerheartDomainCardsById['midnight-shadowhunter']?.automationMode).toBe(
        'triggered-manual'
      );
      expect(daggerheartDomainCardsById['midnight-shadowhunter']?.effectTags).toEqual(
        expect.arrayContaining(['defense', 'evasion'])
      );

      expect(daggerheartDomainCardsById['codex-codex-touched']?.automationMode).toBe(
        'triggered-manual'
      );
      expect(daggerheartDomainCardsById['codex-codex-touched']?.effectTags).toEqual(
        expect.arrayContaining(['loadout-synergy', 'spellcast'])
      );
    });
  });

  describe('prepareData', () => {
    it('returns a cloned document and derives combat stats from selected class, ancestry, and loadout', () => {
      const doc = makeDoc({
        level: 1,
        class: 'Guardian',
        heritage: 'Human',
        weapons: {
          primaryId: 'daggerheart-weapon-primary-broadsword-tier-1',
          secondaryId: 'daggerheart-weapon-secondary-round-shield-tier-1',
          inventoryIds: [],
        },
        armorId: 'daggerheart-armor-chainmail-armor-tier-1',
        armor: { current: 5, max: 5 },
      });
      const originalSystem = doc.system;
      const originalHitPoints = { ...doc.system.hitPoints };

      const result = engine.prepareData(doc);

      expect(result).not.toBe(doc);
      expect(result.system).not.toBe(originalSystem);
      expect(result.system.hitPoints).not.toBe(originalSystem.hitPoints);
      expect(doc.system.hitPoints).toEqual(originalHitPoints);
      expect(result.system.evasion).toBe(8);
      expect(result.system.armorScore).toBe(5);
      expect(result.system.majorThreshold).toBe(8);
      expect(result.system.severeThreshold).toBe(16);
      expect(result.system.armor.max).toBe(5);
    });

    it('clamps current pools to their derived maxima after equipment math is applied', () => {
      const doc = makeDoc({
        level: 1,
        class: 'Bard',
        heritage: 'Simiah',
        weapons: {
          primaryId: 'daggerheart-weapon-primary-greatsword-tier-1',
          secondaryId: '',
          inventoryIds: [],
        },
        armorId: 'daggerheart-armor-gambeson-armor-tier-1',
        attributes: {
          agility: 2,
          strength: 3,
          finesse: 0,
          instinct: 0,
          presence: 1,
          knowledge: 0,
        },
        hitPoints: { current: 9, max: 6 },
        stress: { current: 8, max: 7 },
        armor: { current: 9, max: 3 },
      });

      const result = engine.prepareData(doc);

      expect(result.system.evasion).toBe(11);
      expect(result.system.armorScore).toBe(3);
      expect(result.system.majorThreshold).toBe(6);
      expect(result.system.severeThreshold).toBe(12);
      expect(result.system.hitPoints).toEqual({ current: 6, max: 6 });
      expect(result.system.stress).toEqual({ current: 7, max: 7 });
      expect(result.system.armor).toEqual({ current: 3, max: 3 });
    });

    it('normalizes gold and clamps source-backed consumable quantities for persisted documents', () => {
      const doc = makeDoc({
        currency: {
          handfuls: 10,
          bags: 0,
          chests: 0,
        },
        inventory: [
          {
            itemId: 'daggerheart-consumable-minor-health-potion',
            name: 'Minor Health Potion',
            quantity: 9,
            description: '',
          },
        ],
      });

      const result = engine.prepareData(doc);

      expect(result.system.currency).toEqual({ handfuls: 0, bags: 1, chests: 0 });
      expect(result.system.inventory[0].quantity).toBe(5);
    });

    it('normalizes legacy identifiers and names onto canonical SRD-backed references', () => {
      const doc = makeDoc({
        class: 'daggerheart-bard',
        subclass: 'bard-troubadour',
        heritage: 'human',
        community: 'wanderborne',
        weapons: {
          primaryId: 'Broadsword',
          secondaryId: 'Round Shield',
          inventoryIds: ['Hand Crossbow', 'daggerheart-weapon-secondary-hand-crossbow-tier-1'],
        },
        armorId: 'Chainmail Armor',
        inventory: [
          {
            itemId: 'legacy-health-potion',
            name: 'Minor Health Potion',
            quantity: 3,
            description: 'old note',
          },
        ],
        domainCards: [
          {
            id: 'legacy-inspirational-words',
            name: 'Inspirational Words',
            domain: 'Grace',
            level: 1,
            description: '',
          },
        ],
      });

      const result = engine.prepareData(doc);

      expect(result.system.class).toBe('Bard');
      expect(result.system.subclass).toBe('Troubadour');
      expect(result.system.heritage).toBe('Human');
      expect(result.system.community).toBe('Wanderborne');
      expect(result.system.weapons.primaryId).toBe('daggerheart-weapon-primary-broadsword-tier-1');
      expect(result.system.weapons.secondaryId).toBe(
        'daggerheart-weapon-secondary-round-shield-tier-1'
      );
      expect(result.system.weapons.inventoryIds).toEqual([
        'daggerheart-weapon-secondary-hand-crossbow-tier-1',
      ]);
      expect(result.system.armorId).toBe('daggerheart-armor-chainmail-armor-tier-1');
      expect(result.system.inventory[0]).toMatchObject({
        itemId: 'daggerheart-consumable-minor-health-potion',
        name: 'Minor Health Potion',
        quantity: 3,
      });
      expect(result.system.domainCards[0]).toMatchObject({
        cardId: 'grace-inspirational-words',
        name: 'Inspirational Words',
        domain: 'grace',
        level: 1,
        location: 'loadout',
      });
    });

    it('hydrates blank legacy starter sheets from normalized Daggerheart selections', () => {
      const doc = makeDoc({
        class: 'daggerheart-bard',
        subclass: 'bard-troubadour',
        heritage: 'human',
        community: 'wanderborne',
      });

      const result = engine.prepareData(doc);

      expect(result.system.class).toBe('Bard');
      expect(result.system.subclass).toBe('Troubadour');
      expect(result.system.heritage).toBe('Human');
      expect(result.system.community).toBe('Wanderborne');
      expect(result.system.hitPoints).toEqual({ current: 5, max: 5 });
      expect(result.system.stress).toEqual({ current: 0, max: 7 });
      expect(result.system.inventory.map((item) => item.name)).toEqual([
        'A romance novel',
        'A letter never opened',
        'Nomadic Pack',
      ]);
    });

    it('resolves a known subclass onto its owning class when only the subclass survives import', () => {
      const result = engine.prepareData(
        makeDoc({
          class: '',
          subclass: 'Troubadour',
          heritage: 'Human',
          community: 'Wanderborne',
        })
      );

      expect(result.system.class).toBe('Bard');
      expect(result.system.subclass).toBe('Troubadour');
      expect(result.system.heritage).toBe('Human');
      expect(result.system.community).toBe('Wanderborne');
      expect(result.system.inventory.map((item) => item.name)).toContain('Nomadic Pack');
    });

    it('preserves unresolved legacy values as manual fallback entries', () => {
      const result = engine.prepareData(
        makeDoc({
          class: 'Custom Virtuoso',
          subclass: 'Mystery Path',
          heritage: 'Ashfolk',
          community: 'Sky Market',
          weapons: {
            primaryId: 'Homemade Blade',
            secondaryId: 'Signal Buckler',
            inventoryIds: ['Traveler Spear'],
          },
          armorId: 'Patchwork Coat',
          inventory: [
            {
              itemId: '',
              name: 'Homemade Ward',
              quantity: 2,
              description: 'A custom charm.',
            },
          ],
          domainCards: [
            {
              id: '',
              name: 'Improvised Heroics',
              domain: 'grace',
              level: 2,
              description: 'A custom move.',
            },
          ],
        })
      );

      expect(result.system.class).toBe('Custom Virtuoso');
      expect(result.system.subclass).toBe('Mystery Path');
      expect(result.system.heritage).toBe('Ashfolk');
      expect(result.system.community).toBe('Sky Market');
      expect(result.system.weapons.primaryId).toBe('Homemade Blade');
      expect(result.system.weapons.secondaryId).toBe('Signal Buckler');
      expect(result.system.weapons.inventoryIds).toEqual(['Traveler Spear']);
      expect(result.system.armorId).toBe('Patchwork Coat');
      expect(result.system.inventory[0]).toMatchObject({
        itemId: 'custom-item:legacy-0',
        name: 'Homemade Ward',
        quantity: 2,
        description: 'A custom charm.',
      });
      expect(result.system.domainCards[0]).toMatchObject({
        id: 'legacy-card:0',
        cardId: undefined,
        name: 'Improvised Heroics',
        domain: 'grace',
        level: 2,
        location: 'loadout',
        description: 'A custom move.',
      });
    });

    it('applies passive loadout card bonuses and ignores vault-only bonuses', () => {
      const baseline = engine.prepareData(
        makeDoc({
          level: 7,
          armorId: 'daggerheart-armor-chainmail-armor-tier-1',
          armor: { current: 4, max: 4 },
        })
      );

      const result = engine.prepareData(
        makeDoc({
          level: 7,
          armorId: 'daggerheart-armor-chainmail-armor-tier-1',
          armor: { current: 4, max: 4 },
          domainCards: [
            {
              id: 'valor-armorer:1',
              cardId: 'valor-armorer',
              name: 'Armorer',
              domain: 'valor',
              level: 5,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'valor-valor-touched:1',
              cardId: 'valor-valor-touched',
              name: 'Valor-touched',
              domain: 'valor',
              level: 7,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'valor-rousing-strike:1',
              cardId: 'valor-rousing-strike',
              name: 'Rousing Strike',
              domain: 'valor',
              level: 5,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'valor-inevitable:1',
              cardId: 'valor-inevitable',
              name: 'Inevitable',
              domain: 'valor',
              level: 6,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'splendor-splendor-touched:1',
              cardId: 'splendor-splendor-touched',
              name: 'Splendor-touched',
              domain: 'splendor',
              level: 7,
              type: 'ability',
              recallCost: 2,
              location: 'vault',
              description: '',
            },
          ],
        })
      );

      expect(result.system.armorScore).toBe(baseline.system.armorScore + 2);
      expect(result.system.armor.max).toBe(baseline.system.armor.max + 2);
      expect(result.system.severeThreshold).toBe(baseline.system.severeThreshold);
    });

    it('applies deterministic passive formula cards for evasion and proficiency-scaled thresholds', () => {
      const baseline = engine.prepareData(
        makeDoc({
          level: 7,
          class: 'Guardian',
          heritage: 'Human',
          armorId: 'daggerheart-armor-chainmail-armor-tier-1',
          attributes: {
            agility: 3,
            strength: 2,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
          },
          domainCards: [
            {
              id: 'bone-bone-touched:1',
              cardId: 'bone-bone-touched',
              name: 'Bone-touched',
              domain: 'bone',
              level: 7,
              type: 'ability',
              recallCost: 2,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-cruel-precision:1',
              cardId: 'bone-cruel-precision',
              name: 'Cruel Precision',
              domain: 'bone',
              level: 7,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-breaking-blow:1',
              cardId: 'bone-breaking-blow',
              name: 'Breaking Blow',
              domain: 'bone',
              level: 8,
              type: 'ability',
              recallCost: 3,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-wrangle:1',
              cardId: 'bone-wrangle',
              name: 'Wrangle',
              domain: 'bone',
              level: 8,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
          ],
        })
      );

      const result = engine.prepareData(
        makeDoc({
          level: 7,
          class: 'Guardian',
          heritage: 'Human',
          armorId: 'daggerheart-armor-chainmail-armor-tier-1',
          attributes: {
            agility: 3,
            strength: 2,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
          },
          domainCards: [
            {
              id: 'bone-bone-touched:1',
              cardId: 'bone-bone-touched',
              name: 'Bone-touched',
              domain: 'bone',
              level: 7,
              type: 'ability',
              recallCost: 2,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-cruel-precision:1',
              cardId: 'bone-cruel-precision',
              name: 'Cruel Precision',
              domain: 'bone',
              level: 7,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-breaking-blow:1',
              cardId: 'bone-breaking-blow',
              name: 'Breaking Blow',
              domain: 'bone',
              level: 8,
              type: 'ability',
              recallCost: 3,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-wrangle:1',
              cardId: 'bone-wrangle',
              name: 'Wrangle',
              domain: 'bone',
              level: 8,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'bone-untouchable:1',
              cardId: 'bone-untouchable',
              name: 'Untouchable',
              domain: 'bone',
              level: 1,
              type: 'ability',
              recallCost: 1,
              location: 'loadout',
              description: '',
            },
            {
              id: 'valor-rise-up:1',
              cardId: 'valor-rise-up',
              name: 'Rise Up',
              domain: 'valor',
              level: 6,
              type: 'ability',
              recallCost: 2,
              location: 'loadout',
              description: '',
            },
          ],
        })
      );

      expect(result.system.evasion).toBe(baseline.system.evasion + 2);
      expect(result.system.severeThreshold).toBe(baseline.system.severeThreshold + 3);
    });

    it('applies Bare Bones only while unarmored and replaces the unarmored defense base by tier', () => {
      const result = engine.prepareData(
        makeDoc({
          level: 5,
          class: 'Guardian',
          heritage: 'Human',
          armorId: '',
          attributes: {
            agility: 0,
            strength: 2,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
          },
          domainCards: [
            {
              id: 'valor-bare-bones:1',
              cardId: 'valor-bare-bones',
              name: 'Bare Bones',
              domain: 'valor',
              level: 1,
              type: 'ability',
              recallCost: 0,
              location: 'loadout',
              description: '',
            },
          ],
        })
      );

      expect(result.system.armorScore).toBe(5);
      expect(result.system.armor.max).toBe(5);
      expect(result.system.majorThreshold).toBe(13);
      expect(result.system.severeThreshold).toBe(31);
    });
  });

  describe('rollCheck', () => {
    it('returns a with Hope result when the hope die beats the fear die', async () => {
      const randomSpy = vi
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.25);
      const doc = makeDoc({
        attributes: {
          ...createDefaultDaggerheartData().attributes,
          agility: 2,
        },
      });

      const result = await engine.rollCheck(doc, 'agility');

      expect(result.total).toBe(16);
      expect(result.formula).toBe('2d12 + 2 (agility)');
      expect(result.terms).toEqual([10, 4]);
      expect(result.isCritical).toBe(false);
      expect(result.isFumble).toBe(false);
      expect(result.flavor).toContain('with Hope');

      randomSpy.mockRestore();
    });

    it('flags critical success and fumble results for matching high and low dice', async () => {
      const highSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.75).mockReturnValueOnce(0.75);
      const critSuccess = await engine.rollCheck(makeDoc(), 'presence');
      expect(critSuccess.isCritical).toBe(true);
      expect(critSuccess.flavor).toContain('Critical');
      highSpy.mockRestore();

      const lowSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0);
      const critFail = await engine.rollCheck(makeDoc(), 'presence');
      expect(critFail.isFumble).toBe(true);
      expect(critFail.flavor).toContain('Critical');
      lowSpy.mockRestore();
    });

    it('includes carried relic bonuses in trait checks', async () => {
      const randomSpy = vi
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.25);
      const doc = makeDoc({
        attributes: {
          ...createDefaultDaggerheartData().attributes,
          agility: 2,
        },
        inventory: [
          {
            itemId: 'daggerheart-loot-stride-relic',
            name: 'Stride Relic',
            quantity: 1,
            description: '',
          },
        ],
      });

      const result = await engine.rollCheck(doc, 'agility');

      expect(result.total).toBe(17);
      expect(result.formula).toBe('2d12 + 3 (agility)');
      randomSpy.mockRestore();
    });

    it('includes passive loadout card bonuses in trait checks', async () => {
      const randomSpy = vi
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.25);
      const doc = makeDoc({
        level: 7,
        attributes: {
          ...createDefaultDaggerheartData().attributes,
          agility: 2,
        },
        domainCards: [
          {
            id: 'bone-bone-touched:1',
            cardId: 'bone-bone-touched',
            name: 'Bone-touched',
            domain: 'bone',
            level: 7,
            type: 'ability',
            recallCost: 2,
            location: 'loadout',
            description: '',
          },
          {
            id: 'bone-cruel-precision:1',
            cardId: 'bone-cruel-precision',
            name: 'Cruel Precision',
            domain: 'bone',
            level: 7,
            type: 'ability',
            recallCost: 1,
            location: 'loadout',
            description: '',
          },
          {
            id: 'bone-breaking-blow:1',
            cardId: 'bone-breaking-blow',
            name: 'Breaking Blow',
            domain: 'bone',
            level: 8,
            type: 'ability',
            recallCost: 3,
            location: 'loadout',
            description: '',
          },
          {
            id: 'bone-wrangle:1',
            cardId: 'bone-wrangle',
            name: 'Wrangle',
            domain: 'bone',
            level: 8,
            type: 'ability',
            recallCost: 1,
            location: 'loadout',
            description: '',
          },
        ],
      });

      const result = await engine.rollCheck(doc, 'agility');

      expect(result.total).toBe(17);
      expect(result.formula).toBe('2d12 + 3 (agility)');
      randomSpy.mockRestore();
    });
  });

  describe('applyDamage', () => {
    it('lets armor absorb normal damage before hit points', () => {
      const result = engine.applyDamage(
        makeDoc({
          armor: { current: 3, max: 3 },
          hitPoints: { current: 10, max: 10 },
        }),
        5,
        'physical'
      );

      expect(result.system.armor.current).toBe(0);
      expect(result.system.hitPoints.current).toBe(8);
    });

    it('tracks stress separately from normal damage and caps healing at max hp', () => {
      const stressed = engine.applyDamage(
        makeDoc({
          armor: { current: 2, max: 2 },
          stress: { current: 1, max: 6 },
          hitPoints: { current: 4, max: 6 },
        }),
        3,
        'stress'
      );
      expect(stressed.system.armor.current).toBe(2);
      expect(stressed.system.hitPoints.current).toBe(4);
      expect(stressed.system.stress.current).toBe(4);

      const healed = engine.applyDamage(stressed, 5, 'heal');
      expect(healed.system.hitPoints.current).toBe(6);
    });
  });
});
