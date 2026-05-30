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
