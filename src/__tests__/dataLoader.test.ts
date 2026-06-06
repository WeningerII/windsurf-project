/**
 * Data Loader Integration Tests
 *
 * Ensures data loaders work correctly for all game systems
 */

import { describe, it, expect } from 'vitest';
import {
  loadBackgroundsForSystem,
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartArmorForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
  loadDaggerheartConsumablesForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadDaggerheartDomainsForSystem,
  loadDaggerheartLootForSystem,
  loadDaggerheartWeaponsForSystem,
  loadSpellsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadMonstersForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadArchetypesForSystem,
  loadComplicationsForSystem,
  loadFeatureOptionsForSystem,
  loadMam3eArchetypesForSystem,
  loadPf2eBackgroundsForSystem,
  loadPowerModifiersForSystem,
  loadTraitsForSystem,
  loadAdvantagesForSystem,
} from '../utils/dataLoader';

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, stableValue(entryValue)])
    );
  }

  return value;
}

describe('Data Loader Integration Tests', () => {
  describe('D&D 5e-2014 Loaders', () => {
    it('should load spells for dnd-5e-2014', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2014');
      expect(spells.length).toBe(313);
      expect(spells.every((s) => s.id && s.name && s.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load classes for dnd-5e-2014', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2014');
      expect(classes.length).toBe(12);
      expect(classes.every((c) => c.id && c.name && c.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load species for dnd-5e-2014', async () => {
      const species = await loadSpeciesForSystem('dnd-5e-2014');
      expect(species.length).toBe(9);
      expect(species.every((s) => s.id && s.name && s.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load backgrounds for dnd-5e-2014', async () => {
      const backgrounds = await loadBackgroundsForSystem('dnd-5e-2014');
      expect(backgrounds.length).toBe(6);
      expect(backgrounds.every((bg) => bg.id && bg.name && bg.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load monsters for dnd-5e-2014', async () => {
      const monsters = await loadMonstersForSystem('dnd-5e-2014');
      expect(monsters.length).toBeGreaterThan(30);
      expect(monsters.every((m) => m.id && m.name && m.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load equipment for dnd-5e-2014', async () => {
      const equipment = await loadEquipmentForSystem('dnd-5e-2014');
      expect(equipment.length).toBeGreaterThan(200);
      expect(equipment.every((e) => e.id && e.name && e.system === 'dnd-5e-2014')).toBe(true);
    });

    it('should load normalized feature options for dnd-5e-2014', async () => {
      const featureOptions = await loadFeatureOptionsForSystem('dnd-5e-2014');
      expect(featureOptions.length).toBe(106);
      expect(
        featureOptions.every(
          (option) => option.id && option.name && option.system === 'dnd-5e-2014'
        )
      ).toBe(true);
      expect(featureOptions.some((option) => option.group === 'invocations')).toBe(true);
      expect(featureOptions.some((option) => option.group === 'wild-shapes')).toBe(true);
    });
  });

  describe('D&D 5e-2024 Loaders', () => {
    it('should load spells for dnd-5e-2024', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2024');
      expect(spells.length).toBe(320);
      expect(spells.every((s) => s.id && s.name && s.system === 'dnd-5e-2024')).toBe(true);
    });

    it('should load classes for dnd-5e-2024', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2024');
      expect(Array.isArray(classes)).toBe(true);
    });

    it('should load species for dnd-5e-2024', async () => {
      const species = await loadSpeciesForSystem('dnd-5e-2024');
      expect(species.length).toBe(9);
      expect(species.every((s) => s.id && s.name && s.system === 'dnd-5e-2024')).toBe(true);
    });

    it('should load backgrounds for dnd-5e-2024', async () => {
      const backgrounds = await loadBackgroundsForSystem('dnd-5e-2024');
      expect(backgrounds.length).toBe(6);
      expect(backgrounds.every((bg) => bg.id && bg.name && bg.system === 'dnd-5e-2024')).toBe(true);
    });

    it('should load feats for dnd-5e-2024', async () => {
      const feats = await loadFeatsForSystem('dnd-5e-2024');
      expect(feats.length).toBe(87);
      expect(new Set(feats.map((f) => f.id)).size).toBe(feats.length);
    });

    it('should load equipment for dnd-5e-2024 without duplicates', async () => {
      const equipment = await loadEquipmentForSystem('dnd-5e-2024');
      expect(equipment.length).toBe(204);
      expect(new Set(equipment.map((e) => e.id)).size).toBe(equipment.length);
    });
  });

  describe('Pathfinder 2e Loaders', () => {
    it('should load spells for pf2e', async () => {
      const spells = await loadSpellsForSystem('pf2e');
      expect(spells.length).toBe(143);
      expect(spells.every((spell) => spell.traditions && spell.traditions.length > 0)).toBe(true);
      expect(
        spells
          .filter((spell) => spell.level === 0)
          .every((spell) => spell.heightening && spell.heightening.mode === 'cantrip')
      ).toBe(true);
      expect(
        spells.some((spell) => spell.id === 'teleport-pf2e' && spell.heightening?.mode === 'fixed')
      ).toBe(true);
      expect(
        spells.some((spell) => spell.id === 'time-stop-9-pf2e' && spell.heightening?.ranks?.[10])
      ).toBe(true);
      expect(
        spells.some((spell) => spell.id === 'wish-pf2e' && spell.heightening?.ranks?.[10])
      ).toBe(true);
      expect(spells.some((spell) => spell.id === 'teleport-7-pf2e')).toBe(false);
      expect(spells.some((spell) => spell.id === 'time-stop-pf2e')).toBe(false);
      expect(spells.some((spell) => spell.id === 'wish-9-pf2e')).toBe(false);
    });

    it('should load classes for pf2e', async () => {
      const classes = await loadClassesForSystem('pf2e');
      expect(Array.isArray(classes)).toBe(true);
    });

    it('should load backgrounds for pf2e through the shared loader path', async () => {
      const backgrounds = await loadPf2eBackgroundsForSystem('pf2e');
      expect(backgrounds.length).toBeGreaterThan(0);
      expect(backgrounds.every((bg) => bg.id && bg.name && bg.source)).toBe(true);
    });

    it('should load archetypes for pf2e through the shared loader path', async () => {
      const archetypes = await loadArchetypesForSystem('pf2e');
      expect(archetypes.length).toBeGreaterThan(0);
      expect(
        archetypes.every((archetype) => archetype.id && archetype.name && archetype.source)
      ).toBe(true);
    });
  });

  describe('D&D 3.5e Loaders', () => {
    it('should load the canonicalized 3.5e spell catalog without exact class-split duplicates', async () => {
      const spells = await loadSpellsForSystem('dnd-3.5e');
      expect(spells.length).toBe(554);
      const fingerprints = spells.map((spell) => {
        const {
          id: _id,
          classes: _classes,
          levelsByClass: _levelsByClass,
          description: _description,
          ...rest
        } = spell;
        return JSON.stringify(stableValue(rest));
      });
      expect(new Set(fingerprints).size).toBe(fingerprints.length);
    });

    it('should load the full normalized 3.5e core prestige catalog through the shared class loader', async () => {
      const classes = await loadClassesForSystem('dnd-3.5e');
      expect(classes.length).toBe(26);
      expect(classes.some((entry) => entry.id === 'arcane-archer-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'arcane-trickster-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'archmage-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'assassin-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'blackguard-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'dragon-disciple-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'duelist-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'eldritch-knight-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'hierophant-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'shadowdancer-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'horizon-walker-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'dwarven-defender-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'loremaster-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'mystic-theurge-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'thaumaturgist-35e')).toBe(true);
      expect(classes.some((entry) => entry.id === 'archmage')).toBe(false);
      expect(
        classes.every(
          (entry) =>
            entry.source === 'SRD 3.5' ||
            entry.source === 'PHB' ||
            entry.source === 'PHB 3.5' ||
            entry.source === "Player's Handbook 3.5"
        )
      ).toBe(true);
    });
  });

  describe('Pathfinder 1e Loaders', () => {
    it('should load spells with stored class-level mappings for pf1e', async () => {
      const spells = await loadSpellsForSystem('pf1e');
      expect(spells.length).toBe(134);
      expect(
        spells.every(
          (spell) =>
            spell.levelsByClass && Object.keys(spell.levelsByClass).length === spell.classes.length
        )
      ).toBe(true);
      expect(
        spells
          .filter((spell) =>
            /(ranged|melee)\s+touch attack|touch attack to hit|make a (ranged|melee) touch attack/i.test(
              spell.description
            )
          )
          .every((spell) => spell.attackRoll)
      ).toBe(true);
    });

    it('should load vetted PF1e prestige classes and exclude unresolved entries', async () => {
      const classes = await loadClassesForSystem('pf1e');
      expect(classes.length).toBe(18);
      expect(classes.some((entry) => entry.id === 'duelist')).toBe(true);
      expect(classes.some((entry) => entry.id === 'shadowdancer')).toBe(true);
      expect(classes.some((entry) => entry.id === 'archmage')).toBe(false);
      expect(
        classes.every((entry) => entry.source === 'Core Rulebook' || entry.source === 'CRB')
      ).toBe(true);
    });

    it('should load traits for pf1e through the shared loader path', async () => {
      const traits = await loadTraitsForSystem('pf1e');
      expect(traits.length).toBeGreaterThan(0);
      expect(traits.every((trait) => trait.id && trait.name && trait.source)).toBe(true);
    });
  });

  describe('Daggerheart Loaders', () => {
    it('should load SRD-backed Daggerheart classes through the dedicated loader path', async () => {
      const classes = await loadDaggerheartClassesForSystem('daggerheart');
      expect(classes.length).toBe(9);
      expect(classes.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(classes.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(classes.some((entry) => entry.name === 'Bard')).toBe(true);
      expect(classes.some((entry) => entry.name === 'Wizard')).toBe(true);
    });

    it('should load SRD-backed Daggerheart ancestries through the dedicated loader path', async () => {
      const ancestries = await loadDaggerheartAncestriesForSystem('daggerheart');
      expect(ancestries.length).toBe(19);
      expect(ancestries.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(ancestries.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(ancestries.some((entry) => entry.name === 'Human')).toBe(true);
      expect(ancestries.some((entry) => entry.name === 'Mixed Ancestry')).toBe(true);
    });

    it('should load SRD-backed Daggerheart communities through the dedicated loader path', async () => {
      const communities = await loadDaggerheartCommunitiesForSystem('daggerheart');
      expect(communities.length).toBe(9);
      expect(communities.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(communities.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(communities.some((entry) => entry.name === 'Highborne')).toBe(true);
      expect(communities.some((entry) => entry.name === 'Wildborne')).toBe(true);
    });

    it('should load SRD-backed Daggerheart domains through the dedicated loader path', async () => {
      const domains = await loadDaggerheartDomainsForSystem('daggerheart');
      expect(domains.length).toBe(9);
      expect(domains.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(domains.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(domains.some((entry) => entry.name === 'Arcana')).toBe(true);
      expect(domains.some((entry) => entry.name === 'Valor')).toBe(true);
    });

    it('should load SRD-backed Daggerheart domain cards through the dedicated loader path', async () => {
      const domainCards = await loadDaggerheartDomainCardsForSystem('daggerheart');
      expect(domainCards.length).toBe(189);
      expect(domainCards.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(domainCards.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(domainCards.some((entry) => entry.id === 'grace-inspirational-words')).toBe(true);
      expect(domainCards.some((entry) => entry.id === 'valor-unyielding-armor')).toBe(true);
    });

    it('should load SRD-backed Daggerheart weapons through the dedicated loader path', async () => {
      const weapons = await loadDaggerheartWeaponsForSystem('daggerheart');
      expect(weapons.length).toBe(204);
      expect(weapons.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(weapons.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(
        weapons.some((entry) => entry.id === 'daggerheart-weapon-primary-broadsword-tier-1')
      ).toBe(true);
      expect(
        weapons.some((entry) => entry.id === 'daggerheart-weapon-secondary-round-shield-tier-1')
      ).toBe(true);
      expect(
        weapons.some(
          (entry) => entry.id === 'daggerheart-weapon-primary-arcane-frame-wheelchair-tier-1'
        )
      ).toBe(true);
    });

    it('should load SRD-backed Daggerheart armor through the dedicated loader path', async () => {
      const armor = await loadDaggerheartArmorForSystem('daggerheart');
      expect(armor.length).toBe(34);
      expect(armor.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(armor.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(armor.some((entry) => entry.id === 'daggerheart-armor-gambeson-armor-tier-1')).toBe(
        true
      );
      expect(armor.some((entry) => entry.id === 'daggerheart-armor-savior-chainmail-tier-4')).toBe(
        true
      );
    });

    it('should load SRD-backed Daggerheart loot through the dedicated loader path', async () => {
      const loot = await loadDaggerheartLootForSystem('daggerheart');
      expect(loot.length).toBe(61);
      expect(loot.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(loot.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(loot.some((entry) => entry.id === 'daggerheart-loot-premium-bedroll')).toBe(true);
      expect(loot.some((entry) => entry.id === 'daggerheart-loot-stride-relic')).toBe(true);
      expect(
        loot.some((entry) => entry.id === 'daggerheart-loot-ring-of-unbreakable-resolve')
      ).toBe(true);
    });

    it('should load SRD-backed Daggerheart consumables through the dedicated loader path', async () => {
      const consumables = await loadDaggerheartConsumablesForSystem('daggerheart');
      expect(consumables.length).toBe(54);
      expect(consumables.every((entry) => entry.system === 'daggerheart')).toBe(true);
      expect(consumables.every((entry) => entry.source === 'Daggerheart SRD 1.0')).toBe(true);
      expect(
        consumables.some((entry) => entry.id === 'daggerheart-consumable-minor-health-potion')
      ).toBe(true);
      expect(
        consumables.some((entry) => entry.id === 'daggerheart-consumable-major-health-potion')
      ).toBe(true);
      expect(
        consumables.some((entry) => entry.id === 'daggerheart-consumable-dragonbloom-tea')
      ).toBe(true);
    });
  });

  describe('Strict Open-Content Filtering', () => {
    it('should exclude non-core PF1e feats', async () => {
      const feats = await loadFeatsForSystem('pf1e');
      expect(feats.length).toBeGreaterThan(0);
      expect(
        feats.some((feat) => feat.source === 'APG' || feat.source === "Advanced Player's Guide")
      ).toBe(false);
      expect(feats.every((feat) => feat.source === 'CRB' || feat.source === 'Core Rulebook')).toBe(
        true
      );
    });

    it('should exclude non-core PF2e species', async () => {
      const species = await loadSpeciesForSystem('pf2e');
      expect(species.length).toBeGreaterThan(0);
      expect(species.some((entry) => entry.id === 'orc')).toBe(false);
      expect(
        species.every((entry) => entry.source === 'Core Rulebook' || entry.source === 'CRB')
      ).toBe(true);
    });

    it('should dedupe M&M powers by ID', async () => {
      const powers = await loadSpellsForSystem('mam3e');
      expect(powers.length).toBeGreaterThan(0);
      expect(new Set(powers.map((power) => power.id)).size).toBe(powers.length);
    });
  });

  describe('Mutants & Masterminds 3e Loaders', () => {
    it('should load advantages through the shared loader path', async () => {
      const advantages = await loadAdvantagesForSystem('mam3e');
      expect(advantages.length).toBe(74);
      expect(
        advantages.every((advantage) => advantage.id && advantage.name && advantage.source)
      ).toBe(true);
    });

    it('should load archetypes through the M&M loader path', async () => {
      const archetypes = await loadMam3eArchetypesForSystem('mam3e');
      expect(archetypes.length).toBe(15);
      expect(
        archetypes.every((archetype) => archetype.id && archetype.name && archetype.source)
      ).toBe(true);
    });

    it('should load complications through the shared loader path', async () => {
      const complications = await loadComplicationsForSystem('mam3e');
      expect(complications.length).toBeGreaterThan(0);
      expect(
        complications.every(
          (complication) => complication.id && complication.name && complication.source
        )
      ).toBe(true);
    });

    it('should load power modifiers through the shared loader path', async () => {
      const modifiers = await loadPowerModifiersForSystem('mam3e');
      expect(modifiers.length).toBeGreaterThan(0);
      expect(modifiers.some((modifier) => modifier.type === 'extra')).toBe(true);
      expect(modifiers.some((modifier) => modifier.type === 'flaw')).toBe(true);
      expect(modifiers.every((modifier) => modifier.id && modifier.name && modifier.source)).toBe(
        true
      );
    });
  });

  describe('Error Handling', () => {
    it('should return empty array for unknown system', async () => {
      const spells = await loadSpellsForSystem('unknown-system' as any);
      expect(spells).toEqual([]);
    });

    it('should not throw errors on missing data', async () => {
      await expect(loadFeatsForSystem('mam3e')).resolves.toEqual([]);
      await expect(loadMam3eArchetypesForSystem('pf2e')).resolves.toEqual([]);
      await expect(loadComplicationsForSystem('pf2e')).resolves.toEqual([]);
      await expect(loadPowerModifiersForSystem('pf2e')).resolves.toEqual([]);
    });
  });

  describe('Data Validation', () => {
    it('should filter out invalid spell data', async () => {
      const spells = await loadSpellsForSystem('dnd-5e-2014');
      spells.forEach((spell) => {
        expect(spell.id).toBeTruthy();
        expect(spell.name).toBeTruthy();
        expect(spell.system).toBeTruthy();
      });
    });

    it('should filter out invalid class data', async () => {
      const classes = await loadClassesForSystem('dnd-5e-2024');
      classes.forEach((cls) => {
        expect(cls.id).toBeTruthy();
        expect(cls.name).toBeTruthy();
        expect(cls.system).toBeTruthy();
      });
    });
  });
});
