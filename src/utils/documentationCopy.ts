export const SYSTEM_SUPPORT_NOTES = {
  'dnd-3.5e':
    'Deterministic RAW auto-resolution: base and full core SRD prestige classes, spells per day including casting-ability, cleric domain, wizard specialist, and prestige (Dragon Disciple) bonus slots, synergy/encumbrance skills, and equipped-armor AC',
  pf1e: 'Deterministic RAW auto-resolution: base and vetted CRB prestige classes, spells per day including casting-ability, cleric domain, wizard specialist, and prestige (Dragon Disciple) bonus slots, class-skill and encumbrance skills, and equipped-armor AC',
  daggerheart:
    'Deterministic RAW auto-resolution: SRD-backed selectors, starter templates, browse tabs, equipment loadouts, gold tracking, and loot libraries; deterministic passive card bonuses are auto-applied where represented, while triggered, timing-based, choice-based, and narrative card effects are GM-adjudicated by design — an accepted manual boundary',
} as const;

export const D20_LEGACY_MANUAL_NOTES = [
  'Cleric domain, wizard specialist, and Dragon Disciple bonus slots are counted automatically in the spell-slot totals.',
  'Which domain or specialty-school spell fills a prepared slot is your choice (Vancian preparation).',
  'Spontaneous cure/inflict conversion happens at cast time; the reference list above shows the eligible spells.',
] as const;

export const DND5E_SPELLS_COPY = {
  knownSpellCasting:
    'Your current spellcasting classes use known-spell casting. Preparation does not apply.',
  multiclassPreparedPrefix:
    'Multiple prepared casting classes are active. Track per-class prepared allocation manually:',
  alwaysPreparedSupport:
    'Structured class and subclass grants stay available automatically. Choice-based or unsupported preparation riders remain manual.',
  trackedSpellsSupport:
    'Add spells you know or keep in your spellbook here, then mark your daily prepared list below.',
} as const;

export const DND5E_FEAT_COPY = {
  selectedSupport:
    'Ability score increases and proficiency grants are applied automatically. Other feat riders remain manual.',
  browserSupport:
    'Feat automation applies ability score increases and proficiencies. Other feat riders still require manual tracking.',
} as const;

export const DND5E_FEATURE_OPTION_COPY = {
  provenanceSupport:
    'These entries are stored separately from class and feat automation and are mirrored into your feature list with explicit provenance.',
  emptyState:
    'Apply a compatible class or subclass template to browse the matching 5e-2014 feature-option catalogs.',
} as const;

export const PF2E_SPELLS_COPY = {
  alwaysPreparedSupport:
    'Structured class grants stay available and do not consume daily prepared slots.',
  preparedSlotsSupport:
    'Assign tracked spells to each available spell rank. Cantrips and focus spells remain manual.',
  spontaneousSupport:
    'This caster uses a spell repertoire. Slot-by-slot preparation is intentionally not shown.',
  innateSupport: 'Innate spellcasting does not use daily prepared slots.',
} as const;

export const MAM3E_ARCHETYPE_COPY = {
  referenceOnly:
    'Pinned archetypes are reference-only. Review them while building the character manually.',
} as const;
