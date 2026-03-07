import { Feature, ProficiencyLevel } from '../types/core/character';
import { CharacterDocument } from '../types/core/document';
import { Species } from '../types/character-options/species';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

const PROFICIENCY_PRIORITY: Record<ProficiencyLevel, number> = {
  none: 0,
  half: 1,
  proficient: 2,
  expertise: 3,
  double: 3,
};

function cloneDocument<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

function mergeSkillProficiency(
  sys: Dnd5eLikeDataModel,
  skillId: string,
  speciesName: string
): void {
  const existing = sys.skillProficiencies[skillId];

  if (!existing) {
    sys.skillProficiencies[skillId] = {
      level: 'proficient',
      source: [speciesName],
    };
    return;
  }

  const nextLevel =
    PROFICIENCY_PRIORITY[existing.level] >= PROFICIENCY_PRIORITY.proficient
      ? existing.level
      : 'proficient';

  sys.skillProficiencies[skillId] = {
    ...existing,
    level: nextLevel,
    source: [...new Set([...(existing.source || []), speciesName])],
  };
}

function removeSkillProficiencySource(
  sys: Dnd5eLikeDataModel,
  skillId: string,
  sourceName: string
): void {
  const existing = sys.skillProficiencies[skillId];
  if (!existing) {
    return;
  }

  const remainingSources = (existing.source || []).filter((source) => source !== sourceName);
  if (remainingSources.length === 0) {
    delete sys.skillProficiencies[skillId];
    return;
  }

  sys.skillProficiencies[skillId] = {
    ...existing,
    source: remainingSources,
  };
}

/**
 * Data-driven trait-to-mechanic mapping (B8).
 * Maps trait IDs to the mechanical effects they grant.
 */
const TRAIT_MECHANICS: Record<string, (sys: Dnd5eLikeDataModel, speciesName: string) => void> = {
  'keen-senses': (sys, speciesName) => {
    mergeSkillProficiency(sys, 'perception', speciesName);
  },
  menacing: (sys, speciesName) => {
    mergeSkillProficiency(sys, 'intimidation', speciesName);
  },
  'skill-versatility': (sys, speciesName) => {
    // Half-elves get two skill proficiencies of choice — cannot auto-apply,
    // but we note the source so the UI can prompt.
    void sys;
    void speciesName;
  },
  stonecunning: () => {
    // Narrative trait — no mechanical stat change
  },
  trance: () => {
    // Narrative trait — no mechanical stat change
  },
};

/**
 * Extract fixed ASI bonuses from a Species definition.
 * Returns a Record<attr, bonus> for all fixed ASIs.
 */
function extractFixedASIs(speciesData: Species): Record<string, number> {
  const bonuses: Record<string, number> = {};
  if (speciesData.abilityScoreIncrease) {
    for (const asi of speciesData.abilityScoreIncrease) {
      if (asi.type === 'fixed' && asi.attributes) {
        for (const [attr, bonus] of Object.entries(asi.attributes)) {
          if (typeof bonus === 'number') {
            bonuses[attr] = (bonuses[attr] || 0) + bonus;
          }
        }
      }
    }
  }
  return bonuses;
}

/**
 * Applies a species template to a D&D 5e character document.
 * Handles ASI subtraction on species change, feature pruning, and
 * data-driven trait mechanics.
 */
export function applyDnd5eSpeciesTemplate<T extends Dnd5eDataModel | Dnd5e2024DataModel>(
  document: CharacterDocument<T>,
  speciesData: Species,
  previousSpecies?: Species
): CharacterDocument<T> {
  const newDoc = cloneDocument(document);
  const sys = newDoc.system;

  const oldSpeciesId = sys.speciesId;
  const isSpeciesChange = oldSpeciesId != null && oldSpeciesId !== speciesData.id;

  // 1. B6: Subtract old species ASIs before applying new ones
  if (isSpeciesChange && previousSpecies) {
    const oldBonuses = extractFixedASIs(previousSpecies);
    for (const [attr, bonus] of Object.entries(oldBonuses)) {
      if (sys.baseAttributes[attr] != null) {
        sys.baseAttributes[attr] -= bonus;
      }
    }

    // Remove old species languages (only the ones that came from the old species)
    if (previousSpecies.languages?.automatic) {
      const oldLangs = new Set(previousSpecies.languages.automatic);
      sys.languageProficiencies = (sys.languageProficiencies || []).filter(
        (lang: string) => !oldLangs.has(lang)
      );
    }

    // Remove old species skill proficiencies that were sourced from old species
    for (const [skillId, proficiency] of Object.entries(sys.skillProficiencies)) {
      if (proficiency.source?.includes(previousSpecies.name)) {
        removeSkillProficiencySource(sys, skillId, previousSpecies.name);
      }
    }
  }

  // 2. Set Species ID
  sys.speciesId = speciesData.id;

  // 3. Set Speed
  sys.speed = speciesData.speed;

  // 4. Apply fixed ASIs
  const newBonuses = extractFixedASIs(speciesData);
  for (const [attr, bonus] of Object.entries(newBonuses)) {
    sys.baseAttributes[attr] = (sys.baseAttributes[attr] || 10) + bonus;
  }

  // 5. Set Languages
  if (speciesData.languages?.automatic) {
    sys.languageProficiencies = [
      ...new Set([...(sys.languageProficiencies || []), ...speciesData.languages.automatic]),
    ];
  }

  // 6. Gather Traits as Features
  const speciesFeatures: Feature[] = speciesData.traits.map((trait) => ({
    id: trait.id,
    name: trait.name,
    source: trait.source || speciesData.name,
    description: trait.description,
  }));

  // 7. B8: Apply trait mechanics via data-driven lookup
  speciesData.traits.forEach((trait) => {
    const mechanic = TRAIT_MECHANICS[trait.id];
    if (mechanic) {
      mechanic(sys, speciesData.name);
    }
  });

  // 8. B7: On species change, remove features sourced from the old species
  if (isSpeciesChange && previousSpecies) {
    sys.features = (sys.features || []).filter((f: Feature) => f.source !== previousSpecies.name);
  }

  // Merge new species features (dedup by ID)
  const existingFeatureIds = new Set(sys.features?.map((f: Feature) => f.id) || []);
  const newFeatures = speciesFeatures.filter((f: Feature) => !existingFeatureIds.has(f.id));
  sys.features = [...(sys.features || []), ...newFeatures];

  return newDoc;
}
