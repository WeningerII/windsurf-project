import { describe, expect, it, vi } from 'vitest';
import { CharacterDocument } from '../../types/core/document';
import {
  daggerheartDomainCardsById,
  daggerheartDomainCards,
} from '../../data/daggerheart/1.0/domain-cards';
import {
  getDaggerheartDerivedStats,
  getDaggerheartEffectiveAttribute,
} from '../../utils/daggerheartDerived';
import { exportDocuments, importDocuments } from '../../utils/documentStorage';
import {
  DaggerheartDataModel,
  createDefaultDaggerheartData,
} from '../../systems/daggerheart/data-model';
import { DaggerheartEngine } from '../../systems/daggerheart/engine';
import type { DaggerheartDomainCard } from '../../types/daggerheart';

type DaggerheartDomainCardEntry = DaggerheartDataModel['domainCards'][number];

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

function makeDomainCardEntry(
  cardId: string,
  location: NonNullable<DaggerheartDomainCardEntry['location']> = 'loadout'
): DaggerheartDomainCardEntry {
  const card = daggerheartDomainCardsById[cardId];
  if (!card) {
    throw new Error(`Expected Daggerheart domain card fixture for ${cardId}`);
  }

  return {
    id: `${card.id}:${location}`,
    cardId: card.id,
    name: card.name,
    domain: card.domain,
    level: card.level,
    type: card.type,
    recallCost: card.recallCost,
    location,
    description: card.description,
  };
}

const daggerheartPassiveAuditAttributes = {
  agility: 4,
  strength: 2,
  finesse: 0,
  instinct: 0,
  presence: 0,
  knowledge: 0,
};

function hasPassivePayload(card: DaggerheartDomainCard): boolean {
  const passiveBonuses = card.passiveBonuses;
  const hasFlatBonuses = Boolean(
    passiveBonuses &&
    ((passiveBonuses.evasion ?? 0) !== 0 ||
      (passiveBonuses.armorScore ?? 0) !== 0 ||
      (passiveBonuses.majorThreshold ?? 0) !== 0 ||
      (passiveBonuses.severeThreshold ?? 0) !== 0 ||
      (passiveBonuses.spellcast ?? 0) !== 0 ||
      Object.keys(passiveBonuses.attributes ?? {}).length > 0)
  );

  return hasFlatBonuses || (card.passiveDerivedBonuses?.length ?? 0) > 0;
}

function makePassiveAuditSystem(
  card: DaggerheartDomainCard,
  location: NonNullable<DaggerheartDomainCardEntry['location']>
): Partial<DaggerheartDataModel> {
  const condition = card.passiveCondition;
  const domainFillers =
    condition?.kind === 'loadout-domain-count-at-least'
      ? daggerheartDomainCards
          .filter(
            (candidate) =>
              candidate.id !== card.id &&
              candidate.domain === condition.domain &&
              candidate.automationMode !== 'passive'
          )
          .slice(0, location === 'loadout' ? condition.count - 1 : condition.count)
          .map((candidate) => makeDomainCardEntry(candidate.id, 'loadout'))
      : [];

  return {
    level: 7,
    class: 'Guardian',
    heritage: 'Human',
    attributes: daggerheartPassiveAuditAttributes,
    armorId: condition?.kind === 'while-armored' ? 'daggerheart-armor-chainmail-armor-tier-1' : '',
    armor:
      condition?.kind === 'while-armored'
        ? { current: 4, max: 4 }
        : createDefaultDaggerheartData().armor,
    domainCards: [makeDomainCardEntry(card.id, location), ...domainFillers],
  };
}

function passiveAuditSignature(system: DaggerheartDataModel) {
  const derived = getDaggerheartDerivedStats(system);

  return {
    evasion: derived.evasion,
    armorScore: derived.armorScore,
    majorThreshold: derived.majorThreshold,
    severeThreshold: derived.severeThreshold,
    passiveBonuses: derived.passiveBonuses,
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
  const strictPassiveDescriptionPattern = /^(You gain|You have|Your [A-Z][a-z]+|While\b)/;
  const strictPassiveBlockers = [
    /Spend a Hope/i,
    /Spend a Stress/i,
    /once per/i,
    /you can choose/i,
    /your next/i,
  ];
  const strictPassiveAuditRejections: Record<string, string> = {
    'midnight-pick-and-pull':
      'requires a situational advantage metadata kind that passiveBonuses/passiveCondition/passiveDerivedBonuses do not support',
  };

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

    it('keeps strict deterministic-passive audit rejections explicit', () => {
      const strictCandidates = daggerheartDomainCards
        .filter((card) => card.automationMode !== 'passive')
        .filter((card) => strictPassiveDescriptionPattern.test(card.description.trim()))
        .filter((card) => !strictPassiveBlockers.some((blocker) => blocker.test(card.description)))
        .map((card) => card.id)
        .sort();

      expect(strictCandidates).toEqual(Object.keys(strictPassiveAuditRejections).sort());
      strictCandidates.forEach((cardId) => {
        expect(daggerheartDomainCardsById[cardId]?.automationMode).toBe('triggered-manual');
        expect(strictPassiveAuditRejections[cardId]).toContain('metadata kind');
      });
    });

    it('keeps passive automation bounded to supported payloads and active loadout cards', () => {
      const passiveCards = daggerheartDomainCards.filter(
        (card) => card.automationMode === 'passive'
      );

      expect(passiveCards.map((card) => card.id).sort()).toEqual([
        'arcana-arcana-touched',
        'arcana-telekinesis',
        'blade-blade-touched',
        'blade-fortified-armor',
        'bone-bone-touched',
        'bone-i-see-it-coming',
        'bone-untouchable',
        'splendor-splendor-touched',
        'valor-armorer',
        'valor-bare-bones',
        'valor-rise-up',
        'valor-valor-touched',
      ]);

      passiveCards.forEach((card) => {
        expect(hasPassivePayload(card), `${card.id} has supported passive metadata`).toBe(true);

        const loadout = engine.prepareData(makeDoc(makePassiveAuditSystem(card, 'loadout')));
        const vault = engine.prepareData(makeDoc(makePassiveAuditSystem(card, 'vault')));

        expect(passiveAuditSignature(loadout.system), `${card.id} active from loadout`).not.toEqual(
          passiveAuditSignature(vault.system)
        );
      });
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

    it('scales carried inventory passive bonuses by quantity for spellcast and trait math', () => {
      const result = engine.prepareData(
        makeDoc({
          attributes: {
            ...createDefaultDaggerheartData().attributes,
            agility: 1,
          },
          inventory: [
            {
              itemId: 'daggerheart-loot-arcane-prism',
              name: 'Arcane Prism',
              quantity: 2,
              description: '',
            },
            {
              itemId: 'daggerheart-loot-stride-relic',
              name: 'Stride Relic',
              quantity: 3,
              description: '',
            },
          ],
        })
      );
      const derivedStats = getDaggerheartDerivedStats(result.system);

      expect(derivedStats.passiveBonuses.spellcast).toBe(2);
      expect(derivedStats.passiveBonuses.attributes?.agility).toBe(3);
      expect(getDaggerheartEffectiveAttribute(result.system, 'agility')).toBe(4);
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

    it('keeps a legitimate 6/6 HP on a non-starter Bard instead of snapping back to class base', () => {
      // Regression for the ungated HP hydration: a Bard (class base 5 HP)
      // whose max was raised to 6 (import/manual edit/advancement) must keep
      // 6/6 on every prepare. The inventory entry marks the sheet as a real,
      // non-starter document.
      const doc = makeDoc({
        class: 'Bard',
        heritage: 'Human',
        hitPoints: { current: 6, max: 6 },
        inventory: [
          {
            itemId: 'daggerheart-consumable-minor-health-potion',
            name: 'Minor Health Potion',
            quantity: 1,
            description: '',
          },
        ],
      });

      const prepared = engine.prepareData(doc);
      expect(prepared.system.hitPoints).toEqual({ current: 6, max: 6 });

      // Stable across repeated prepares (prepareData runs on every update).
      const reprepared = engine.prepareData(prepared);
      expect(reprepared.system.hitPoints).toEqual({ current: 6, max: 6 });
    });

    it('spills loadout cards beyond the 5-card limit into the vault in stable order', () => {
      const cardIds = [
        'bone-untouchable',
        'bone-cruel-precision',
        'bone-breaking-blow',
        'bone-wrangle',
        'bone-ferocity',
        'valor-rise-up',
        'valor-armorer',
        'blade-fortified-armor',
      ];
      // Location-less entries (legacy import shape) all default toward the
      // loadout; normalization must cap the loadout at LOADOUT_LIMIT.
      const result = engine.prepareData(
        makeDoc({
          level: 8,
          domainCards: cardIds.map((cardId) => {
            const { location: _location, ...entry } = makeDomainCardEntry(cardId, 'loadout');
            return entry;
          }),
        })
      );

      expect(result.system.domainCards.map((entry) => entry.cardId)).toEqual(cardIds);
      expect(result.system.domainCards.map((entry) => entry.location)).toEqual([
        'loadout',
        'loadout',
        'loadout',
        'loadout',
        'loadout',
        'vault',
        'vault',
        'vault',
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

    it('does not apply a passive domain card while the card is only in the vault', () => {
      const baseline = engine.prepareData(
        makeDoc({
          level: 7,
          class: 'Guardian',
          heritage: 'Human',
          attributes: {
            agility: 4,
            strength: 0,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
          },
          domainCards: [],
        })
      );

      const result = engine.prepareData(
        makeDoc({
          level: 7,
          class: 'Guardian',
          heritage: 'Human',
          attributes: {
            agility: 4,
            strength: 0,
            finesse: 0,
            instinct: 0,
            presence: 0,
            knowledge: 0,
          },
          domainCards: [
            {
              id: 'bone-untouchable:1',
              cardId: 'bone-untouchable',
              name: 'Untouchable',
              domain: 'bone',
              level: 1,
              type: 'ability',
              recallCost: 1,
              location: 'vault',
              description: '',
            },
          ],
        })
      );

      expect(result.system.evasion).toBe(baseline.system.evasion);
      expect(getDaggerheartDerivedStats(result.system).passiveBonuses.evasion ?? 0).toBe(0);
    });

    it('updates passive aggregation when a card moves between loadout and vault', () => {
      const baseSystem = {
        level: 7,
        class: 'Guardian',
        heritage: 'Human',
        attributes: {
          agility: 4,
          strength: 0,
          finesse: 0,
          instinct: 0,
          presence: 0,
          knowledge: 0,
        },
      } satisfies Partial<DaggerheartDataModel>;
      const loadout = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [makeDomainCardEntry('bone-untouchable', 'loadout')],
        })
      );
      const vault = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [makeDomainCardEntry('bone-untouchable', 'vault')],
        })
      );

      expect(getDaggerheartDerivedStats(loadout.system).passiveBonuses.evasion ?? 0).toBe(2);
      expect(loadout.system.evasion).toBe(vault.system.evasion + 2);
      expect(getDaggerheartDerivedStats(vault.system).passiveBonuses.evasion ?? 0).toBe(0);
    });

    it('fires and unfires Blade-touched from loadout domain counts', () => {
      const threeBladeCards = [
        makeDomainCardEntry('blade-blade-touched', 'loadout'),
        makeDomainCardEntry('blade-get-back-up', 'loadout'),
        makeDomainCardEntry('blade-not-good-enough', 'loadout'),
      ];
      const fourBladeCards = [
        ...threeBladeCards,
        makeDomainCardEntry('blade-fortified-armor', 'loadout'),
      ];
      const oneMovedToVault = [
        ...threeBladeCards,
        makeDomainCardEntry('blade-fortified-armor', 'vault'),
      ];

      const belowThreshold = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: threeBladeCards,
        })
      );
      const atThreshold = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: fourBladeCards,
        })
      );
      const afterVaultMove = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: oneMovedToVault,
        })
      );

      expect(getDaggerheartDerivedStats(belowThreshold.system).passiveBonuses.severeThreshold).toBe(
        0
      );
      expect(getDaggerheartDerivedStats(atThreshold.system).passiveBonuses.severeThreshold).toBe(4);
      expect(getDaggerheartDerivedStats(afterVaultMove.system).passiveBonuses.severeThreshold).toBe(
        0
      );
    });

    it('fires and unfires Arcana Telekinesis spellcast from Arcana loadout counts', () => {
      const threeArcanaCards = [
        makeDomainCardEntry('arcana-telekinesis', 'loadout'),
        makeDomainCardEntry('arcana-rune-ward', 'loadout'),
        makeDomainCardEntry('arcana-unleash-chaos', 'loadout'),
      ];
      const fourArcanaCards = [
        ...threeArcanaCards,
        makeDomainCardEntry('arcana-wall-walk', 'loadout'),
      ];
      const oneMovedToVault = [
        ...threeArcanaCards,
        makeDomainCardEntry('arcana-wall-walk', 'vault'),
      ];

      const belowThreshold = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: threeArcanaCards,
        })
      );
      const atThreshold = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: fourArcanaCards,
        })
      );
      const afterVaultMove = engine.prepareData(
        makeDoc({
          level: 7,
          domainCards: oneMovedToVault,
        })
      );

      expect(getDaggerheartDerivedStats(belowThreshold.system).passiveBonuses.spellcast ?? 0).toBe(
        0
      );
      expect(getDaggerheartDerivedStats(atThreshold.system).passiveBonuses.spellcast).toBe(1);
      expect(getDaggerheartDerivedStats(afterVaultMove.system).passiveBonuses.spellcast ?? 0).toBe(
        0
      );
    });

    it('round-trips loadout and vault passive cards through document export/import', () => {
      const doc = makeDoc({
        level: 7,
        class: 'Guardian',
        heritage: 'Human',
        attributes: {
          agility: 4,
          strength: 0,
          finesse: 0,
          instinct: 0,
          presence: 0,
          knowledge: 0,
        },
        domainCards: [
          makeDomainCardEntry('bone-untouchable', 'loadout'),
          makeDomainCardEntry('valor-rise-up', 'loadout'),
          makeDomainCardEntry('blade-blade-touched', 'vault'),
          makeDomainCardEntry('valor-bare-bones', 'vault'),
        ],
      });

      const imported = importDocuments(exportDocuments([doc]));
      const importedDaggerheart = imported[0] as CharacterDocument<DaggerheartDataModel>;
      const importedLocations = Object.fromEntries(
        importedDaggerheart.system.domainCards.map((entry) => [entry.cardId, entry.location])
      );
      const importedStats = getDaggerheartDerivedStats(importedDaggerheart.system);

      expect(importedLocations).toMatchObject({
        'bone-untouchable': 'loadout',
        'valor-rise-up': 'loadout',
        'blade-blade-touched': 'vault',
        'valor-bare-bones': 'vault',
      });
      expect(importedStats.passiveBonuses.evasion).toBe(2);
      expect(importedStats.passiveBonuses.severeThreshold).toBe(3);
      expect(importedStats.passiveBonuses.armorScore ?? 0).toBe(0);
      expect(importedStats.armorScore).toBe(0);
      expect(importedStats.majorThreshold).toBe(7);
    });

    it('applies I See It Coming as half-Agility evasion only from loadout', () => {
      const baseSystem = {
        level: 7,
        class: 'Guardian',
        heritage: 'Human',
        attributes: {
          agility: 5,
          strength: 0,
          finesse: 0,
          instinct: 0,
          presence: 0,
          knowledge: 0,
        },
      } satisfies Partial<DaggerheartDataModel>;
      const baseline = engine.prepareData(makeDoc(baseSystem));
      const loadout = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [makeDomainCardEntry('bone-i-see-it-coming', 'loadout')],
        })
      );
      const vault = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [makeDomainCardEntry('bone-i-see-it-coming', 'vault')],
        })
      );

      expect(getDaggerheartDerivedStats(loadout.system).passiveBonuses.evasion).toBe(2);
      expect(loadout.system.evasion).toBe(baseline.system.evasion + 2);
      expect(vault.system.evasion).toBe(baseline.system.evasion);
      expect(getDaggerheartDerivedStats(vault.system).passiveBonuses.evasion ?? 0).toBe(0);
    });

    it('applies deterministic passive formula cards for evasion and proficiency-scaled thresholds', () => {
      // Both builds keep a legal 5-card-max loadout (LOADOUT_LIMIT); the
      // result swaps Wrangle for Untouchable (still 4 Bone cards so
      // Bone-touched stays active) and adds Rise Up.
      const baseSystem = {
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
      } satisfies Partial<DaggerheartDataModel>;
      const baseline = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [
            makeDomainCardEntry('bone-bone-touched', 'loadout'),
            makeDomainCardEntry('bone-cruel-precision', 'loadout'),
            makeDomainCardEntry('bone-breaking-blow', 'loadout'),
            makeDomainCardEntry('bone-wrangle', 'loadout'),
          ],
        })
      );

      const result = engine.prepareData(
        makeDoc({
          ...baseSystem,
          domainCards: [
            makeDomainCardEntry('bone-bone-touched', 'loadout'),
            makeDomainCardEntry('bone-cruel-precision', 'loadout'),
            makeDomainCardEntry('bone-breaking-blow', 'loadout'),
            makeDomainCardEntry('bone-untouchable', 'loadout'),
            makeDomainCardEntry('valor-rise-up', 'loadout'),
          ],
        })
      );

      // Untouchable: evasion + floor(effective Agility 4 / 2) = +2.
      expect(result.system.evasion).toBe(baseline.system.evasion + 2);
      // Rise Up: severe threshold + Proficiency (3 at level 7).
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

    it('falls back to a +0 modifier for an unrecognised check id', async () => {
      // The six traits resolve by name; any other check id (a derived/meta roll)
      // contributes no modifier rather than throwing.
      const randomSpy = vi
        .spyOn(Math, 'random')
        .mockReturnValueOnce(0.75)
        .mockReturnValueOnce(0.25);

      const result = await engine.rollCheck(makeDoc(), 'reputation');

      expect(result.formula).toBe('2d12 + 0 (reputation)');
      expect(result.total).toBe(14);

      randomSpy.mockRestore();
    });

    it('flags ANY matched duality dice as a critical success and never as a fumble', async () => {
      // Daggerheart SRD (Duality Dice): rolling matching values on the Hope
      // and Fear dice is a critical success — at any value. The system has no
      // fumble result, so matched 1s are still a crit, not a "NAT 1".
      const highSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.75).mockReturnValueOnce(0.75);
      const critSuccess = await engine.rollCheck(makeDoc(), 'presence');
      expect(critSuccess.isCritical).toBe(true);
      expect(critSuccess.isFumble).toBe(false);
      expect(critSuccess.flavor).toContain('Critical');
      // The badge speaks Daggerheart, not d20 ("NAT 20!").
      expect(critSuccess.outcomeLabel).toBe('Critical!');
      highSpy.mockRestore();

      // Matched mid dice (7,7) — previously dropped because only 10+ crit.
      const midSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.5);
      const midCrit = await engine.rollCheck(makeDoc(), 'presence');
      expect(midCrit.isCritical).toBe(true);
      expect(midCrit.isFumble).toBe(false);
      expect(midCrit.flavor).toContain('Critical');
      midSpy.mockRestore();

      // Matched 1s — previously mis-reported as a fumble.
      const lowSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0);
      const lowCrit = await engine.rollCheck(makeDoc(), 'presence');
      expect(lowCrit.isCritical).toBe(true);
      expect(lowCrit.isFumble).toBe(false);
      expect(lowCrit.flavor).toContain('Critical');
      lowSpy.mockRestore();
    });

    it('never reports a fumble on lopsided with-Fear rolls either', async () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9);
      const result = await engine.rollCheck(makeDoc(), 'presence');
      expect(result.isCritical).toBe(false);
      expect(result.isFumble).toBe(false);
      expect(result.flavor).toContain('with Fear');
      randomSpy.mockRestore();
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
    // Daggerheart SRD (Damage & Hit Points): incoming damage marks 1 HP below
    // the Major threshold, 2 at/above Major, 3 at/above Severe; marking an
    // Armor Slot reduces the HP marked by one. Damage is never subtracted from
    // an HP pool point-for-point.
    it('marks 2 HP for a Major hit and spends one armor slot to reduce it to 1', () => {
      const result = engine.applyDamage(
        makeDoc({
          armor: { current: 3, max: 3 },
          hitPoints: { current: 6, max: 6 },
          majorThreshold: 5,
          severeThreshold: 11,
        }),
        5,
        'physical'
      );

      expect(result.system.armor.current).toBe(2);
      expect(result.system.hitPoints.current).toBe(5);
    });

    it('marks at most 3 HP on a Severe hit even when raw damage exceeds remaining HP', () => {
      const result = engine.applyDamage(
        makeDoc({
          armor: { current: 0, max: 0 },
          hitPoints: { current: 6, max: 6 },
          majorThreshold: 1,
          severeThreshold: 2,
        }),
        7,
        'physical'
      );

      // A 7-damage hit against a 6-HP level-1 PC marks 3 HP — it is not an
      // outright kill under the threshold model.
      expect(result.system.hitPoints.current).toBe(3);
    });

    it('does not consume armor slots when no HP would be marked', () => {
      const result = engine.applyDamage(
        makeDoc({
          armor: { current: 2, max: 2 },
          hitPoints: { current: 6, max: 6 },
          majorThreshold: 5,
          severeThreshold: 11,
        }),
        0,
        'physical'
      );

      expect(result.system.armor.current).toBe(2);
      expect(result.system.hitPoints.current).toBe(6);
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
