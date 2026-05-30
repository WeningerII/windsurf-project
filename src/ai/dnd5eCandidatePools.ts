import type { CharacterClass } from '../types/character-options/classes';
import type { Background } from '../types/character-options/backgrounds';
import type { FeatDefinition } from '../types/character-options/feats';
import type { Species } from '../types/character-options/species';
import type { GameSystemId } from '../types/game-systems';
import type { Spell } from '../types/magic/spells';
import type { Item } from '../types/equipment/items';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../utils/dataLoader';
import { extractSourceAttribution } from '../utils/openContentPolicy';
import type { AiCandidate, AiCandidateCategory, AiCandidatePool } from './gatewayContracts';

export type Dnd5eAiCharacterSystemId = Extract<GameSystemId, 'dnd-5e-2014' | 'dnd-5e-2024'>;

export interface Dnd5eCharacterCandidatePoolOptions {
  generatedAt?: string;
  includeSpells?: boolean;
  includeEquipment?: boolean;
  maxSpells?: number;
  maxEquipment?: number;
}

const DEFAULT_MAX_STEP_CANDIDATES = 80;

export async function buildDnd5eCharacterCreationCandidatePool(
  systemId: Dnd5eAiCharacterSystemId,
  options: Dnd5eCharacterCandidatePoolOptions = {}
): Promise<AiCandidatePool> {
  const [classes, species, backgrounds, feats, spells, equipment] = await Promise.all([
    loadClassesForSystem(systemId),
    loadSpeciesForSystem(systemId),
    loadBackgroundsForSystem(systemId),
    loadFeatsForSystem(systemId),
    options.includeSpells ? loadSpellsForSystem(systemId) : Promise.resolve<Spell[]>([]),
    options.includeEquipment ? loadEquipmentForSystem(systemId) : Promise.resolve<Item[]>([]),
  ]);

  const constraints = [
    'Candidate ids are loader-backed and source-filtered before AI use.',
    'AI output must choose from these ids and pass deterministic validation before application.',
  ];

  const categories: AiCandidateCategory[] = [
    {
      id: 'class',
      label: 'Classes',
      candidates: classes.map(classToCandidate),
    },
    {
      id: 'species',
      label: 'Species',
      candidates: species.map(speciesToCandidate),
    },
    {
      id: 'background',
      label: 'Backgrounds',
      candidates: backgrounds.map(backgroundToCandidate),
    },
    {
      id: 'feat',
      label: 'Feats',
      candidates: feats.map(featToCandidate),
    },
  ];

  if (options.includeSpells) {
    const maxSpells = options.maxSpells ?? DEFAULT_MAX_STEP_CANDIDATES;
    categories.push({
      id: 'spell',
      label: 'Spells',
      candidates: limitCandidates(spells.map(spellToCandidate), maxSpells),
    });
    appendTruncationConstraint(constraints, 'Spell', spells.length, maxSpells);
  } else {
    constraints.push('Spell candidates are omitted until a spell-selection step requests them.');
  }

  if (options.includeEquipment) {
    const maxEquipment = options.maxEquipment ?? DEFAULT_MAX_STEP_CANDIDATES;
    categories.push({
      id: 'equipment',
      label: 'Equipment',
      candidates: limitCandidates(equipment.map(equipmentToCandidate), maxEquipment),
    });
    appendTruncationConstraint(constraints, 'Equipment', equipment.length, maxEquipment);
  } else {
    constraints.push(
      'Equipment candidates are omitted until an equipment-selection step requests them.'
    );
  }

  return {
    systemId,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    categories,
    constraints,
  };
}

function classToCandidate(characterClass: CharacterClass): AiCandidate {
  const metadata = characterClass.displayMetadata;
  return {
    id: characterClass.id,
    label: characterClass.name,
    source: extractSourceAttribution(characterClass) ?? characterClass.source,
    summary: summarizeText(metadata?.shortDescription ?? characterClass.description),
    tags: compactTags([
      `hit-die:${characterClass.hitDie}`,
      metadata?.role ? `role:${metadata.role}` : undefined,
      metadata?.complexity ? `complexity:${metadata.complexity}` : undefined,
      metadata?.casterType ? `caster:${metadata.casterType}` : undefined,
      ...(metadata?.tags ?? []),
    ]),
  };
}

function speciesToCandidate(species: Species): AiCandidate {
  return {
    id: species.id,
    label: species.name,
    source: extractSourceAttribution(species) ?? species.source,
    summary: summarizeText(species.description),
    tags: compactTags([`size:${species.size}`, `speed:${species.speed}`]),
  };
}

function backgroundToCandidate(background: Background): AiCandidate {
  return {
    id: background.id,
    label: background.name,
    source: extractSourceAttribution(background) ?? background.source,
    summary: summarizeText(background.description),
    tags: compactTags(['background']),
  };
}

function featToCandidate(feat: FeatDefinition): AiCandidate {
  return {
    id: feat.id,
    label: feat.name,
    source: extractSourceAttribution(feat) ?? feat.source,
    summary: summarizeText(feat.description),
    tags: compactTags(['feat']),
    prerequisites: feat.prerequisites?.map((prerequisite) => {
      if (prerequisite.description) {
        return prerequisite.description;
      }
      return [prerequisite.type, prerequisite.id, prerequisite.ability, prerequisite.value]
        .filter(Boolean)
        .join(':');
    }),
  };
}

function spellToCandidate(spell: Spell): AiCandidate {
  return {
    id: spell.id,
    label: spell.name,
    source: extractSourceAttribution(spell) ?? spell.source,
    summary: summarizeText(spell.description),
    tags: compactTags([
      `level:${spell.level}`,
      `school:${spell.school}`,
      spell.concentration ? 'concentration' : undefined,
      spell.ritual ? 'ritual' : undefined,
      ...spell.classes.map((classId) => `class:${classId}`),
    ]),
  };
}

function equipmentToCandidate(item: Item): AiCandidate {
  return {
    id: item.id,
    label: item.name,
    source: extractSourceAttribution(item) ?? undefined,
    summary: summarizeText(item.description),
    tags: compactTags([`type:${item.type}`, `rarity:${item.rarity}`]),
  };
}

function appendTruncationConstraint(
  constraints: string[],
  label: string,
  rawCount: number,
  maxCount: number
): void {
  if (rawCount > maxCount) {
    constraints.push(
      `${label} candidates are truncated to ${maxCount} of ${rawCount}; build a narrower step pool before applying choices.`
    );
  }
}

function limitCandidates(candidates: AiCandidate[], maxCount: number): AiCandidate[] {
  if (maxCount < 1) {
    return [];
  }
  return candidates.slice(0, maxCount);
}

function summarizeText(text: string | undefined, maxLength = 220): string | undefined {
  const normalized = text?.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

function compactTags(tags: Array<string | undefined>): string[] {
  return tags.filter((tag): tag is string => Boolean(tag && tag.trim().length > 0));
}
