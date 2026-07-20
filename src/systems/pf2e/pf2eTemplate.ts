import { cloneDocument } from '../../utils/templateShared';
import { Subrace, Species } from '../../types/character-options/species';
import type { Archetype } from '../../types/character-options/archetypes';
import { CharacterClass } from '../../types/character-options/classes';
import { CharacterDocument } from '../../types/core/document';
import { Feature } from '../../types/core/character';
import {
  PF2E_ARCHETYPE_DEDICATION_GRANTS,
  Pf2eDataModel,
  Pf2eDedicationProficiencyGrant,
  Pf2eFeat,
  Pf2eProficiency,
  Pf2eProficiencyTier,
} from './data-model';
import { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';

const DEFAULT_ANCESTRY_HP = 8;
const DEFAULT_SIZE: Pf2eDataModel['size'] = 'medium';
const DEFAULT_SPEED = 25;

const PROFICIENCY_RANK: Record<Pf2eProficiencyTier, number> = {
  untrained: 0,
  trained: 1,
  expert: 2,
  master: 3,
  legendary: 4,
};

const PF2E_ANCESTRY_HP: Record<string, number> = {
  dwarf: 10,
  elf: 6,
  gnome: 8,
  goblin: 6,
  halfling: 6,
  human: 8,
  orc: 10,
};

const PF2E_ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

function abilityBoostValue(values: number[] | undefined, index: number): number {
  if (!values || values.length === 0) {
    return 2;
  }

  return values[index] ?? values[values.length - 1] ?? 2;
}

function sanitizeChoiceAbilitySelections(
  increases: Array<{ type: 'fixed' | 'choice'; choice?: { count: number; options: string[] } }>,
  rawSelections: string[] | undefined
): string[] {
  const sanitized: string[] = [];
  let offset = 0;

  increases.forEach((increase) => {
    if (increase.type !== 'choice' || !increase.choice) {
      return;
    }

    const used = new Set<string>();
    for (let index = 0; index < increase.choice.count; index += 1) {
      const candidate = rawSelections?.[offset + index] ?? '';
      if (candidate && increase.choice.options.includes(candidate) && !used.has(candidate)) {
        sanitized[offset + index] = candidate;
        used.add(candidate);
      } else {
        sanitized[offset + index] = '';
      }
    }

    offset += increase.choice.count;
  });

  return sanitized;
}

function collectChoiceAbilityAdjustments(
  increases: Array<{
    type: 'fixed' | 'choice';
    choice?: { count: number; options: string[] };
    values?: number[];
  }>,
  selections: string[] | undefined
): Record<string, number> {
  const adjustments: Record<string, number> = {};
  let offset = 0;

  increases.forEach((increase) => {
    if (increase.type !== 'choice' || !increase.choice) {
      return;
    }

    const used = new Set<string>();
    for (let index = 0; index < increase.choice.count; index += 1) {
      const ability = selections?.[offset + index];
      if (!ability || !increase.choice.options.includes(ability) || used.has(ability)) {
        continue;
      }

      used.add(ability);
      adjustments[ability] =
        (adjustments[ability] || 0) + abilityBoostValue(increase.values, index);
    }

    offset += increase.choice.count;
  });

  return adjustments;
}

function sanitizeBackgroundAbilityBoostSelections(
  background: Pf2eBackgroundDefinition | undefined,
  rawSelections: string[] | undefined
): string[] {
  if (!background) {
    return [];
  }

  const restricted = rawSelections?.[0] ?? '';
  const free = rawSelections?.[1] ?? '';
  const nextRestricted = background.abilityBoosts.options.includes(restricted) ? restricted : '';
  const nextFree =
    PF2E_ABILITY_IDS.includes(free as (typeof PF2E_ABILITY_IDS)[number]) && free !== nextRestricted
      ? free
      : '';

  return [nextRestricted, nextFree];
}

function collectBackgroundAbilityAdjustments(
  background: Pf2eBackgroundDefinition | undefined,
  selections: string[] | undefined
): Record<string, number> {
  const [restricted, free] = sanitizeBackgroundAbilityBoostSelections(background, selections);
  const adjustments: Record<string, number> = {};

  if (restricted) {
    adjustments[restricted] = (adjustments[restricted] || 0) + 2;
  }

  if (free) {
    adjustments[free] = (adjustments[free] || 0) + 2;
  }

  return adjustments;
}

function sanitizeOptionalTrainingSelection(
  training: string | Pf2eBackgroundDefinition['skillTraining'],
  rawSelection: string | undefined
): string | undefined {
  if (typeof training === 'string') {
    return training;
  }

  if (rawSelection && training.options.includes(rawSelection)) {
    return rawSelection;
  }

  return training.options.length === 1 ? training.options[0] : undefined;
}

function isPrimaryAbilitySelection(
  classData: CharacterClass,
  value: string | undefined
): value is CharacterClass['primaryAbility'][number] {
  return (
    typeof value === 'string' &&
    classData.primaryAbility.includes(value as CharacterClass['primaryAbility'][number])
  );
}

type Pf2eClassProfile = {
  perception: Pf2eProficiencyTier;
  saves: Record<'fortitude' | 'reflex' | 'will', Pf2eProficiencyTier>;
  armor: Record<string, Pf2eProficiencyTier>;
  weapons: Record<string, Pf2eProficiencyTier>;
  mandatorySkills?: string[];
};

const PF2E_CLASS_PROFILES: Record<string, Pf2eClassProfile> = {
  alchemist: {
    perception: 'trained',
    // CRB p.72 (Alchemist, Initial Proficiencies): expert in Fortitude AND
    // Reflex, trained in Will.
    saves: { fortitude: 'expert', reflex: 'expert', will: 'trained' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained' },
    weapons: { simple: 'trained', 'alchemical-bombs': 'trained', unarmed: 'trained' },
    mandatorySkills: ['crafting'],
  },
  barbarian: {
    // CRB p.83 (Barbarian, Initial Proficiencies): expert in Perception.
    perception: 'expert',
    saves: { fortitude: 'expert', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained' },
    weapons: { simple: 'trained', martial: 'trained', unarmed: 'trained' },
    mandatorySkills: ['athletics'],
  },
  bard: {
    perception: 'expert',
    saves: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained', light: 'trained' },
    weapons: {
      simple: 'trained',
      longsword: 'trained',
      rapier: 'trained',
      sap: 'trained',
      shortbow: 'trained',
      shortsword: 'trained',
      whip: 'trained',
      unarmed: 'trained',
    },
    mandatorySkills: ['occultism', 'performance'],
  },
  champion: {
    perception: 'trained',
    saves: { fortitude: 'expert', reflex: 'trained', will: 'expert' },
    armor: {
      unarmored: 'trained',
      light: 'trained',
      medium: 'trained',
      heavy: 'trained',
      shields: 'trained',
    },
    weapons: { simple: 'trained', martial: 'trained', unarmed: 'trained' },
    mandatorySkills: ['religion'],
  },
  cleric: {
    perception: 'trained',
    saves: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained' },
    weapons: { simple: 'trained', 'deity-favored': 'trained', unarmed: 'trained' },
    mandatorySkills: ['religion'],
  },
  druid: {
    perception: 'trained',
    saves: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained' },
    weapons: { simple: 'trained', unarmed: 'trained' },
    mandatorySkills: ['nature'],
  },
  fighter: {
    perception: 'expert',
    saves: { fortitude: 'expert', reflex: 'expert', will: 'trained' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained', heavy: 'trained' },
    weapons: {
      simple: 'expert',
      martial: 'expert',
      advanced: 'trained',
      unarmed: 'expert',
    },
  },
  monk: {
    // CRB p.155 (Monk, Initial Proficiencies): trained in Perception at level 1
    // (expert arrives later via class features).
    perception: 'trained',
    saves: { fortitude: 'expert', reflex: 'expert', will: 'expert' },
    armor: { unarmored: 'expert' },
    weapons: { simple: 'trained', monk: 'trained', unarmed: 'trained' },
  },
  ranger: {
    perception: 'expert',
    saves: { fortitude: 'expert', reflex: 'expert', will: 'trained' },
    armor: { unarmored: 'trained', light: 'trained', medium: 'trained' },
    weapons: { simple: 'trained', martial: 'trained', unarmed: 'trained' },
    mandatorySkills: ['nature', 'survival'],
  },
  rogue: {
    perception: 'expert',
    saves: { fortitude: 'trained', reflex: 'expert', will: 'expert' },
    armor: { unarmored: 'trained', light: 'trained' },
    weapons: {
      simple: 'trained',
      rapier: 'trained',
      sap: 'trained',
      shortbow: 'trained',
      shortsword: 'trained',
      unarmed: 'trained',
    },
    mandatorySkills: ['stealth'],
  },
  sorcerer: {
    perception: 'trained',
    saves: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained' },
    weapons: { simple: 'trained', unarmed: 'trained' },
  },
  wizard: {
    perception: 'trained',
    saves: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
    armor: { unarmored: 'trained' },
    weapons: {
      club: 'trained',
      crossbow: 'trained',
      dagger: 'trained',
      'heavy-crossbow': 'trained',
      staff: 'trained',
      unarmed: 'trained',
    },
    mandatorySkills: ['arcana'],
  },
};

function createProficiency(tier: Pf2eProficiencyTier, source?: string[]): Pf2eProficiency {
  return source && source.length > 0 ? { tier, total: 0, source } : { tier, total: 0 };
}

function strongerTier(left: Pf2eProficiencyTier, right: Pf2eProficiencyTier): Pf2eProficiencyTier {
  return PROFICIENCY_RANK[left] >= PROFICIENCY_RANK[right] ? left : right;
}

function mergeProficiencySource(
  proficiencies: Record<string, Pf2eProficiency>,
  id: string,
  source: string,
  tier: Pf2eProficiencyTier = 'trained'
): void {
  const existing = proficiencies[id];
  if (!existing) {
    proficiencies[id] = createProficiency(tier, [source]);
    return;
  }

  proficiencies[id] = {
    ...existing,
    tier: strongerTier(existing.tier, tier),
    source: [...new Set([...(existing.source || []), source])],
  };
}

function removeProficiencySource(
  proficiencies: Record<string, Pf2eProficiency>,
  id: string,
  source: string
): void {
  const existing = proficiencies[id];
  // Only act when the named source actually granted this entry. Proficiencies
  // trained by hand (no `source`, or a 'manual' source recorded by the sheet's
  // cycle buttons) must survive template removal — deleting every entry whose
  // source list does not mention the template destroyed user data on class
  // change (see regression test "preserves manually trained skills").
  if (!existing || !existing.source?.includes(source)) {
    return;
  }

  const remainingSources = (existing.source || []).filter((entry) => entry !== source);
  if (remainingSources.length === 0) {
    delete proficiencies[id];
    return;
  }

  proficiencies[id] = {
    ...existing,
    source: remainingSources,
  };
}

function featureSignature(feature: Pick<Feature, 'id' | 'source'>): string {
  return `${feature.id}::${feature.source}`;
}

function featSignature(feat: Pick<Pf2eFeat, 'id' | 'source'>): string {
  return `${feat.id}::${feat.source}`;
}

function collectClassFeatureSignatures(
  classData: CharacterClass,
  predicate: (level: number) => boolean
): Set<string> {
  const signatures = new Set<string>();

  classData.features.forEach((featureGroup) => {
    if (!predicate(featureGroup.level)) {
      return;
    }

    featureGroup.features.forEach((feature) => {
      signatures.add(featureSignature({ id: feature.id, source: feature.source }));
    });
  });

  return signatures;
}

function collectFixedAbilityAdjustments(
  increases: Array<{ type: 'fixed' | 'choice'; attributes?: Record<string, number> }>
): Record<string, number> {
  return increases.reduce<Record<string, number>>((adjustments, increase) => {
    if (increase.type !== 'fixed' || !increase.attributes) {
      return adjustments;
    }

    Object.entries(increase.attributes).forEach(([ability, value]) => {
      adjustments[ability] = (adjustments[ability] || 0) + value;
    });

    return adjustments;
  }, {});
}

function applyAbilityAdjustments(
  attributes: Record<string, number>,
  adjustments: Record<string, number>,
  multiplier: 1 | -1
): void {
  Object.entries(adjustments).forEach(([ability, value]) => {
    attributes[ability] = (attributes[ability] || 10) + value * multiplier;
  });
}

function ancestryFeatures(ancestry?: Species, heritage?: Subrace): Feature[] {
  const ancestryTraits = ancestry?.traits || [];
  const heritageTraits = heritage?.traits || [];
  return [...ancestryTraits, ...heritageTraits].map((trait) => ({
    id: trait.id,
    name: trait.name,
    source: trait.source,
    description: trait.description,
  }));
}

function backgroundFeat(background: Pf2eBackgroundDefinition): Pf2eFeat {
  return {
    id: background.feat.id,
    name: background.feat.name,
    description: background.feat.description,
    level: 1,
    type: background.feat.type,
    source: background.name,
  };
}

function inferTradition(
  spellListId: string
): NonNullable<Pf2eDataModel['spellcasting']>['tradition'] {
  if (spellListId.includes('divine')) return 'divine';
  if (spellListId.includes('occult')) return 'occult';
  if (spellListId.includes('primal')) return 'primal';
  return 'arcane';
}

function inferCastingType(
  preparedCasterFormula?: string,
  spellsKnown?: number[]
): NonNullable<Pf2eDataModel['spellcasting']>['type'] {
  if (preparedCasterFormula) return 'prepared';
  if (Array.isArray(spellsKnown) && spellsKnown.length > 0) return 'spontaneous';
  return 'prepared';
}

function parseFixedPositiveInt(formula?: string): number | null {
  if (!formula) {
    return null;
  }

  const parsed = Number.parseInt(formula.trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function baseArmorProficiencies(
  classData: CharacterClass,
  profile: Pf2eClassProfile,
  source: string
): Pf2eDataModel['armorProficiencies'] {
  const proficiencies: Pf2eDataModel['armorProficiencies'] = {
    unarmored: createProficiency(profile.armor.unarmored || 'trained', [source]),
    light: createProficiency('untrained', [source]),
    medium: createProficiency('untrained', [source]),
    heavy: createProficiency('untrained', [source]),
  };

  classData.armorProficiencies.forEach((armorType) => {
    proficiencies[armorType] = createProficiency(profile.armor[armorType] || 'trained', [source]);
  });

  Object.entries(profile.armor).forEach(([armorType, tier]) => {
    proficiencies[armorType] = createProficiency(tier, [source]);
  });

  return proficiencies;
}

function baseWeaponProficiencies(
  classData: CharacterClass,
  profile: Pf2eClassProfile,
  source: string
): Pf2eDataModel['weaponProficiencies'] {
  const proficiencies: Pf2eDataModel['weaponProficiencies'] = {
    simple: createProficiency('untrained', [source]),
    martial: createProficiency('untrained', [source]),
    advanced: createProficiency('untrained', [source]),
    unarmed: createProficiency('trained', [source]),
  };

  classData.weaponProficiencies.forEach((weaponType) => {
    proficiencies[weaponType] = createProficiency(profile.weapons[weaponType] || 'trained', [
      source,
    ]);
  });

  Object.entries(profile.weapons).forEach(([weaponType, tier]) => {
    proficiencies[weaponType] = createProficiency(tier, [source]);
  });

  return proficiencies;
}

function removeFeaturesBySignatures(features: Feature[], signatures: Set<string>): Feature[] {
  return features.filter((feature) => !signatures.has(featureSignature(feature)));
}

function archetypeSource(archetype: Archetype): string {
  return `Archetype: ${archetype.name}`;
}

function dedicationProficiencyGrants(archetype: Archetype): Pf2eDedicationProficiencyGrant[] {
  return PF2E_ARCHETYPE_DEDICATION_GRANTS[archetype.id] ?? [];
}

/**
 * The proficiency map a dedication grant aggregates into. Both maps start empty
 * on a fresh sheet, so mergeProficiencySource / removeProficiencySource — the
 * same source-scoped machinery class and background templates use — add and
 * later revert a dedication's entries without touching manually trained data or
 * the always-present base armor/weapon slots.
 */
function dedicationProficiencyMap(
  sys: Pf2eDataModel,
  category: Pf2eDedicationProficiencyGrant['category']
): Record<string, Pf2eProficiency> {
  return category === 'lore' ? sys.loreProficiencies : sys.skillProficiencies;
}

function archetypeTemplateFeatures(archetype: Archetype, maxLevel?: number): Feature[] {
  const source = archetypeSource(archetype);
  return archetype.features
    .filter((feature) => maxLevel == null || feature.level <= maxLevel)
    .map((feature) => ({
      id: `${archetype.id}:${feature.level}:${feature.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: feature.name,
      source,
      description: feature.description,
    }));
}

export function applyPf2eClassTemplate(
  document: CharacterDocument<Pf2eDataModel>,
  classData?: CharacterClass,
  level: number = document.system.level,
  previousClass?: CharacterClass
): CharacterDocument<Pf2eDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const oldClassId = sys.classId;
  const isClassChange = oldClassId !== classData?.id;

  if (previousClass && (isClassChange || !classData)) {
    const previousFeatureSignatures = collectClassFeatureSignatures(previousClass, () => true);
    sys.features = removeFeaturesBySignatures(sys.features || [], previousFeatureSignatures);

    Object.keys(sys.skillProficiencies).forEach((skillId) => {
      removeProficiencySource(sys.skillProficiencies, skillId, previousClass.name);
    });
  }

  sys.level = level;

  if (!classData) {
    sys.classId = undefined;
    sys.keyAbility = undefined;
    sys.spellcasting = undefined;
    return nextDocument;
  }

  const profile = PF2E_CLASS_PROFILES[classData.id];
  sys.classId = classData.id;

  const existingKeyAbility = isPrimaryAbilitySelection(classData, sys.keyAbility)
    ? sys.keyAbility
    : undefined;
  sys.keyAbility = existingKeyAbility || classData.primaryAbility[0];

  const shouldResetBaseProficiencies = isClassChange || oldClassId == null || !profile;
  if (profile && shouldResetBaseProficiencies) {
    sys.saveProficiencies = {
      fortitude: createProficiency(profile.saves.fortitude, [classData.name]),
      reflex: createProficiency(profile.saves.reflex, [classData.name]),
      will: createProficiency(profile.saves.will, [classData.name]),
    };
    sys.perceptionProficiency = createProficiency(profile.perception, [classData.name]);
    // Every CRB class starts trained in its class DC (higher tiers arrive via
    // class features and are cycled by hand on the sheet).
    sys.classDcProficiency = createProficiency('trained', [classData.name]);
    sys.armorProficiencies = baseArmorProficiencies(classData, profile, classData.name);
    sys.weaponProficiencies = baseWeaponProficiencies(classData, profile, classData.name);
  }

  profile?.mandatorySkills?.forEach((skillId) => {
    mergeProficiencySource(sys.skillProficiencies, skillId, classData.name);
  });

  const allClassFeatureSignatures = collectClassFeatureSignatures(classData, () => true);
  const allowedClassFeatureSignatures = collectClassFeatureSignatures(
    classData,
    (featureLevel) => featureLevel <= level
  );

  sys.features = (sys.features || []).filter((feature) => {
    const signature = featureSignature(feature);
    return (
      !allClassFeatureSignatures.has(signature) || allowedClassFeatureSignatures.has(signature)
    );
  });

  const existingFeatureSignatures = new Set((sys.features || []).map(featureSignature));
  classData.features.forEach((featureGroup) => {
    if (featureGroup.level > level) {
      return;
    }

    featureGroup.features.forEach((feature) => {
      const signature = featureSignature(feature);
      if (existingFeatureSignatures.has(signature)) {
        return;
      }

      existingFeatureSignatures.add(signature);
      sys.features.push({
        id: feature.id,
        name: feature.name,
        source: feature.source,
        description: feature.description,
      });
    });
  });

  if (classData.spellcasting) {
    const focusResource = classData.classResources?.find(
      (resource) => resource.id === 'focus-points'
    );
    const focusMax = parseFixedPositiveInt(focusResource?.maxFormula) ?? 0;
    const existingSpellcasting = !isClassChange ? sys.spellcasting : undefined;
    const proficiencyTier = existingSpellcasting?.proficiency.tier || 'trained';
    const castingType = inferCastingType(
      classData.spellcasting.preparedCasterFormula,
      classData.spellcasting.spellsKnown
    );

    sys.spellcasting = {
      tradition: inferTradition(classData.spellcasting.spellListId),
      type: castingType,
      proficiency: createProficiency(proficiencyTier, [classData.name]),
      spellSlots: existingSpellcasting?.spellSlots || {},
      spellsKnown: existingSpellcasting?.spellsKnown || [],
      alwaysPreparedSpellIds: existingSpellcasting?.alwaysPreparedSpellIds || [],
      focusSpells: existingSpellcasting?.focusSpells || [],
      ...(castingType === 'prepared'
        ? {
            preparedSpellsByRank: existingSpellcasting?.preparedSpellsByRank || {},
          }
        : {}),
      focusPoints: {
        current: Math.min(existingSpellcasting?.focusPoints.current ?? focusMax, focusMax),
        max: Math.max(existingSpellcasting?.focusPoints.max ?? 0, focusMax),
      },
    };
  } else if (isClassChange) {
    sys.spellcasting = undefined;
  }

  return nextDocument;
}

export function applyPf2eAncestryTemplate(
  document: CharacterDocument<Pf2eDataModel>,
  ancestry?: Species,
  heritage?: Subrace,
  previous?: { ancestry?: Species; heritage?: Subrace },
  nextAbilityBoostSelections?: string[]
): CharacterDocument<Pf2eDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const currentAncestryId = sys.ancestryId;
  const currentAbilityBoostSelections = sys.ancestryAbilityBoostSelections || [];

  if (previous?.heritage) {
    applyAbilityAdjustments(
      sys.baseAttributes,
      collectFixedAbilityAdjustments(previous.heritage.abilityScoreIncrease),
      -1
    );
  }

  if (previous?.ancestry) {
    applyAbilityAdjustments(
      sys.baseAttributes,
      collectFixedAbilityAdjustments(previous.ancestry.abilityScoreIncrease),
      -1
    );
    applyAbilityAdjustments(
      sys.baseAttributes,
      collectChoiceAbilityAdjustments(
        previous.ancestry.abilityScoreIncrease,
        currentAbilityBoostSelections
      ),
      -1
    );
    const oldLanguages = new Set(previous.ancestry.languages.automatic || []);
    sys.languages = (sys.languages || []).filter((language) => !oldLanguages.has(language));

    const oldFeatureSignatures = new Set(
      ancestryFeatures(previous.ancestry, previous.heritage).map(featureSignature)
    );
    sys.features = removeFeaturesBySignatures(sys.features || [], oldFeatureSignatures);
  }

  sys.ancestryId = ancestry?.id;
  sys.heritageId = heritage?.id;

  if (!ancestry) {
    sys.ancestryAbilityBoostSelections = [];
    sys.ancestryHP = DEFAULT_ANCESTRY_HP;
    sys.size = DEFAULT_SIZE;
    sys.speed = DEFAULT_SPEED;
    return nextDocument;
  }

  const shouldPreserveAbilitySelections =
    ancestry.id === previous?.ancestry?.id || ancestry.id === currentAncestryId;
  sys.ancestryAbilityBoostSelections = sanitizeChoiceAbilitySelections(
    ancestry.abilityScoreIncrease,
    nextAbilityBoostSelections ??
      (shouldPreserveAbilitySelections ? currentAbilityBoostSelections : undefined)
  );

  sys.ancestryHP = PF2E_ANCESTRY_HP[ancestry.id] ?? DEFAULT_ANCESTRY_HP;
  sys.size = ancestry.size;
  sys.speed = ancestry.speed;

  applyAbilityAdjustments(
    sys.baseAttributes,
    collectFixedAbilityAdjustments(ancestry.abilityScoreIncrease),
    1
  );
  applyAbilityAdjustments(
    sys.baseAttributes,
    collectChoiceAbilityAdjustments(
      ancestry.abilityScoreIncrease,
      sys.ancestryAbilityBoostSelections
    ),
    1
  );

  if (heritage) {
    applyAbilityAdjustments(
      sys.baseAttributes,
      collectFixedAbilityAdjustments(heritage.abilityScoreIncrease),
      1
    );
  }

  sys.languages = [...new Set([...(sys.languages || []), ...(ancestry.languages.automatic || [])])];

  const existingFeatureSignatures = new Set((sys.features || []).map(featureSignature));
  ancestryFeatures(ancestry, heritage).forEach((feature) => {
    const signature = featureSignature(feature);
    if (existingFeatureSignatures.has(signature)) {
      return;
    }

    existingFeatureSignatures.add(signature);
    sys.features.push(feature);
  });

  return nextDocument;
}

export function applyPf2eBackgroundTemplate(
  document: CharacterDocument<Pf2eDataModel>,
  background?: Pf2eBackgroundDefinition,
  previousBackground?: Pf2eBackgroundDefinition,
  selections?: {
    abilityBoostSelections?: string[];
    skillTrainingSelection?: string;
    loreTrainingSelection?: string;
  }
): CharacterDocument<Pf2eDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const currentBackgroundId = sys.backgroundId;
  const currentAbilityBoostSelections = sys.backgroundAbilityBoostSelections || [];
  const currentSkillTrainingSelection = sys.backgroundSkillTrainingSelection;
  const currentLoreTrainingSelection = sys.backgroundLoreTrainingSelection;

  if (previousBackground) {
    const previousSkillTraining = sanitizeOptionalTrainingSelection(
      previousBackground.skillTraining,
      currentSkillTrainingSelection
    );
    if (previousSkillTraining) {
      removeProficiencySource(
        sys.skillProficiencies,
        previousSkillTraining,
        previousBackground.name
      );
    }

    const previousLoreTraining = sanitizeOptionalTrainingSelection(
      previousBackground.loreTraining,
      currentLoreTrainingSelection
    );
    if (previousLoreTraining) {
      removeProficiencySource(sys.loreProficiencies, previousLoreTraining, previousBackground.name);
    }

    applyAbilityAdjustments(
      sys.baseAttributes,
      collectBackgroundAbilityAdjustments(previousBackground, currentAbilityBoostSelections),
      -1
    );

    const previousFeat = backgroundFeat(previousBackground);
    const previousSignature = featSignature(previousFeat);
    sys.feats = (sys.feats || []).filter((feat) => featSignature(feat) !== previousSignature);
  }

  sys.backgroundId = background?.id;
  sys.backgroundAbilityBoostSelections = [];
  sys.backgroundSkillTrainingSelection = undefined;
  sys.backgroundLoreTrainingSelection = undefined;

  if (!background) {
    return nextDocument;
  }

  const shouldPreserveSelections =
    background.id === previousBackground?.id || background.id === currentBackgroundId;
  sys.backgroundAbilityBoostSelections = sanitizeBackgroundAbilityBoostSelections(
    background,
    selections?.abilityBoostSelections ??
      (shouldPreserveSelections ? currentAbilityBoostSelections : undefined)
  );
  sys.backgroundSkillTrainingSelection = sanitizeOptionalTrainingSelection(
    background.skillTraining,
    selections?.skillTrainingSelection ??
      (shouldPreserveSelections ? currentSkillTrainingSelection : undefined)
  );
  sys.backgroundLoreTrainingSelection = sanitizeOptionalTrainingSelection(
    background.loreTraining,
    selections?.loreTrainingSelection ??
      (shouldPreserveSelections ? currentLoreTrainingSelection : undefined)
  );

  applyAbilityAdjustments(
    sys.baseAttributes,
    collectBackgroundAbilityAdjustments(background, sys.backgroundAbilityBoostSelections),
    1
  );

  if (sys.backgroundSkillTrainingSelection) {
    mergeProficiencySource(
      sys.skillProficiencies,
      sys.backgroundSkillTrainingSelection,
      background.name
    );
  }

  if (sys.backgroundLoreTrainingSelection) {
    mergeProficiencySource(
      sys.loreProficiencies,
      sys.backgroundLoreTrainingSelection,
      background.name
    );
  }

  const nextFeat = backgroundFeat(background);
  const featSignatures = new Set((sys.feats || []).map(featSignature));
  if (!featSignatures.has(featSignature(nextFeat))) {
    sys.feats = [...(sys.feats || []), nextFeat];
  }

  return nextDocument;
}

export function applyPf2eArchetypeTemplate(
  document: CharacterDocument<Pf2eDataModel>,
  archetype: Archetype
): CharacterDocument<Pf2eDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const currentSelections = sys.selectedArchetypeIds || [];

  if (currentSelections.includes(archetype.id)) {
    return nextDocument;
  }

  sys.selectedArchetypeIds = [...currentSelections, archetype.id];

  const existingFeatureSignatures = new Set((sys.features || []).map(featureSignature));
  // Grant only the features the character has reached: an archetype's
  // higher-level feats stay listed in the browser but aren't added to a
  // level-1 sheet (mirrors the class template's level gating). Removal stays
  // unfiltered so features granted at a higher level are still cleaned up
  // after leveling down.
  archetypeTemplateFeatures(archetype, sys.level).forEach((feature) => {
    const signature = featureSignature(feature);
    if (existingFeatureSignatures.has(signature)) {
      return;
    }

    existingFeatureSignatures.add(signature);
    sys.features.push(feature);
  });

  // Aggregate the dedication's proficiency progression the same way class and
  // background templates do: source-scoped so a stronger existing tier wins and
  // removal reverts cleanly. Runs only on first selection (the early return
  // above keeps a re-selected archetype idempotent), so grants never stack.
  const dedicationSource = archetypeSource(archetype);
  dedicationProficiencyGrants(archetype).forEach((grant) => {
    mergeProficiencySource(
      dedicationProficiencyMap(sys, grant.category),
      grant.id,
      dedicationSource,
      grant.tier
    );
  });

  return nextDocument;
}

export function removePf2eArchetypeTemplate(
  document: CharacterDocument<Pf2eDataModel>,
  archetype: Archetype
): CharacterDocument<Pf2eDataModel> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;

  sys.selectedArchetypeIds = (sys.selectedArchetypeIds || []).filter(
    (entry) => entry !== archetype.id
  );

  const signatures = new Set(archetypeTemplateFeatures(archetype).map(featureSignature));
  sys.features = removeFeaturesBySignatures(sys.features || [], signatures);

  // Revert the dedication's proficiency grants. removeProficiencySource is
  // source-scoped: it only strips this archetype's provenance, so a skill the
  // class/background also trained (or the player trained by hand) survives.
  const dedicationSource = archetypeSource(archetype);
  dedicationProficiencyGrants(archetype).forEach((grant) => {
    removeProficiencySource(
      dedicationProficiencyMap(sys, grant.category),
      grant.id,
      dedicationSource
    );
  });

  return nextDocument;
}
