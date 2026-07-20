import type {
  ContributionCategory,
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import { resolveCharacterEffects, toContributionLedger } from '../../rules';
import { abilityMod } from '../../utils/math';
import { baseSave, classBAB } from '../shared/d20-helpers';
import { dnd35eSynergyBonus } from '../../utils/derivedCombatMath';
import type { D20LegacyData } from './d20LegacySheetShared';

/**
 * Non-persisted contribution ledger for the d20-legacy systems (D&D 3.5e and
 * Pathfinder 1e). Mirrors `buildDnd5eContributionLedger`: it explains where the
 * engine's derived Base Attack Bonus, saving-throw totals, and (3.5e-only) skill
 * synergy bonuses come from, plus the magic-item/feat/feature AC and attack
 * provenance projected straight from the shared rules resolver (RFC 003).
 *
 * These rows are EXPLANATION only — they are never stored on the document and
 * must not be treated as an alternate state source. Every value is derived with
 * the exact pure helpers the engine uses (`classBAB`, `baseSave`, `abilityMod`,
 * `dnd35eSynergyBonus`) over the same inputs, so a row (or the sum of the rows
 * for a target) equals the engine-computed value by construction — regardless of
 * whether `document` has been run through `prepareData`.
 *
 * Unlike the 5e builder, none of the surfaced d20-legacy values need async class
 * data (BAB/saves/synergy read fields already on the model), so this builder is
 * synchronous — matching the Daggerheart ledger.
 */
export type D20LegacySystemId = 'dnd-3.5e' | 'pf1e';

/** The subset of a d20-legacy class level the ledger reads (shared by 3.5e / PF1e). */
interface D20LegacyClassLevelView {
  classId: string;
  level: number;
  bab: 'full' | 'three-quarter' | 'half';
  fortSave: 'good' | 'poor';
  refSave: 'good' | 'poor';
  willSave: 'good' | 'poor';
}

type SaveKey = 'fortitude' | 'reflex' | 'will';
type SaveQualityKey = 'fortSave' | 'refSave' | 'willSave';

interface SaveConfig {
  key: SaveKey;
  qualityKey: SaveQualityKey;
  ability: string;
  target: string;
  label: string;
}

/**
 * The three save tracks and how each is composed: a per-class good/poor base
 * progression, the governing ability modifier (Fort→CON, Ref→DEX, Will→WIS),
 * and a persisted miscellaneous modifier — exactly the sum the engine writes to
 * `data.saves.<save>.total`.
 */
const SAVE_CONFIG: readonly SaveConfig[] = [
  {
    key: 'fortitude',
    qualityKey: 'fortSave',
    ability: 'con',
    target: 'saves.fortitude',
    label: 'Fortitude',
  },
  { key: 'reflex', qualityKey: 'refSave', ability: 'dex', target: 'saves.reflex', label: 'Reflex' },
  { key: 'will', qualityKey: 'willSave', ability: 'wis', target: 'saves.will', label: 'Will' },
];

/**
 * D&D 3.5e skill-synergy grants, keyed by the SOURCE skill (5+ ranks grant +2 to
 * each listed target). This is the inverse of the engine's private
 * `DND35E_SYNERGY_SOURCES` table (target → sources) in
 * `utils/derivedCombatMath`; it is used only to attribute provenance. The +2
 * value itself is taken from the shared `dnd35eSynergyBonus` helper, and the
 * builder's rows are cross-checked against `dnd35eSkillSynergyTotal` in the
 * tests so this inverse table cannot silently drift from the engine's forward
 * table. PF1e has no skill-synergy subsystem, so these rows are 3.5e-only.
 */
const DND35E_SYNERGY_TARGETS_BY_SOURCE: Record<string, readonly string[]> = {
  tumble: ['balance', 'jump'],
  jump: ['tumble'],
  bluff: ['diplomacy', 'intimidate', 'sleight-of-hand'],
  'sense-motive': ['diplomacy'],
  'handle-animal': ['ride'],
};

type AddEntryInput = {
  systemId: D20LegacySystemId;
  target: string;
  sourceKind: ContributionSourceKind;
  sourceLabel: string;
  label: string;
  operation: ContributionOperation;
  value: ContributionLedgerEntry['value'];
  category: ContributionCategory;
  sourceId?: string;
  sourcePath?: string;
  details?: Record<string, unknown>;
};

export function buildD20LegacyContributionLedger(
  document: CharacterDocument<D20LegacyData>,
  systemId: D20LegacySystemId
): ContributionLedgerResult {
  const system = document.system;

  // The resolver is fed the SAME equipped-items + feat/feature inputs the engine
  // uses for its derived AC and attack values (RFC 003), and its applied-effect
  // ledger is projected straight into contribution rows so magic-item / feat AC
  // and attack terms get first-class provenance instead of being re-derived
  // (and drifting) here. Additive: a character with no bonus-bearing gear or
  // modifiers contributes no resolver rows.
  const resolved = resolveCharacterEffects(systemId, {
    equipment: system.equipment.filter((item) => item.equipped),
    feats: system.feats,
    features: system.features,
  });

  const entries: ContributionLedgerEntry[] = [
    ...buildBaseAttackBonusEntries(systemId, system),
    ...buildSaveEntries(systemId, system),
    ...toContributionLedger(resolved.result.ledger).entries,
    // Skill synergy is a 3.5e-only subsystem; PF1e has no synergy bonuses, so no
    // rows are emitted for it (do not invent a PF1e synergy).
    ...(systemId === 'dnd-3.5e' ? buildSkillSynergyEntries(systemId, system) : []),
  ];

  return { entries };
}

/**
 * One `add` row per class level: `classBAB(level, progression)`. The rows sum to
 * `data.baseAttackBonus` — the engine computes that total the same way
 * (Σ classBAB across the multiclass).
 */
function buildBaseAttackBonusEntries(
  systemId: D20LegacySystemId,
  system: D20LegacyData
): ContributionLedgerEntry[] {
  const classLevels: readonly D20LegacyClassLevelView[] = system.classLevels;

  return classLevels.map((classLevel, index) =>
    createEntry({
      systemId,
      target: 'baseAttackBonus',
      sourceKind: 'class',
      sourceId: classLevel.classId,
      sourceLabel: classLevel.classId,
      label: `Base attack bonus (${classLevel.bab} progression)`,
      operation: 'add',
      value: classBAB(classLevel.level, classLevel.bab),
      category: 'other',
      sourcePath: `system.classLevels.${index}`,
      details: { classLevel: classLevel.level, progression: classLevel.bab },
    })
  );
}

/**
 * For each save: a per-class base-progression `add` row, the governing ability
 * modifier row, and a persisted misc row. Zero-value components are skipped
 * (they contribute nothing), so the emitted rows still sum to
 * `data.saves.<save>.total` = Σ baseSave + abilityMod + misc.
 */
function buildSaveEntries(
  systemId: D20LegacySystemId,
  system: D20LegacyData
): ContributionLedgerEntry[] {
  const classLevels: readonly D20LegacyClassLevelView[] = system.classLevels;
  const entries: ContributionLedgerEntry[] = [];

  for (const config of SAVE_CONFIG) {
    classLevels.forEach((classLevel, index) => {
      const quality = classLevel[config.qualityKey];
      const base = baseSave(classLevel.level, quality);
      if (base === 0) {
        return;
      }
      entries.push(
        createEntry({
          systemId,
          target: config.target,
          sourceKind: 'class',
          sourceId: classLevel.classId,
          sourceLabel: classLevel.classId,
          label: `${config.label} base save (${quality})`,
          operation: 'add',
          value: base,
          category: 'defense',
          sourcePath: `system.classLevels.${index}`,
          details: { classLevel: classLevel.level, quality },
        })
      );
    });

    const abilityScore = system.baseAttributes[config.ability] ?? 10;
    const abilityModifier = abilityMod(abilityScore);
    if (abilityModifier !== 0) {
      entries.push(
        createEntry({
          systemId,
          target: config.target,
          sourceKind: 'system',
          sourceId: `${config.ability}-modifier`,
          sourceLabel: `${config.ability.toUpperCase()} modifier`,
          label: `${config.label} ability modifier`,
          operation: 'add',
          value: abilityModifier,
          category: 'defense',
          sourcePath: `system.baseAttributes.${config.ability}`,
          details: { abilityScore, ability: config.ability },
        })
      );
    }

    const misc = system.saves[config.key].misc ?? 0;
    if (misc !== 0) {
      entries.push(
        createEntry({
          systemId,
          target: config.target,
          sourceKind: 'system',
          sourceId: `${config.key}-misc`,
          sourceLabel: 'Miscellaneous save modifier',
          label: `${config.label} miscellaneous modifier`,
          operation: 'add',
          value: misc,
          category: 'defense',
          sourcePath: `system.saves.${config.key}.misc`,
        })
      );
    }
  }

  return entries;
}

/**
 * 3.5e-only skill synergy: a source skill with 5+ ranks grants +2 to each of its
 * related skills (SRD Synergy). One `add` row per (source, target) pair; the +2
 * comes from `dnd35eSynergyBonus`, so the rows targeting a skill sum to
 * `dnd35eSkillSynergyTotal(skill, skillRanks)`.
 */
function buildSkillSynergyEntries(
  systemId: D20LegacySystemId,
  system: D20LegacyData
): ContributionLedgerEntry[] {
  const skillRanks = system.skillRanks;
  const entries: ContributionLedgerEntry[] = [];

  for (const [sourceSkill, targets] of Object.entries(DND35E_SYNERGY_TARGETS_BY_SOURCE)) {
    const sourceRanks = skillRanks[sourceSkill] ?? 0;
    const bonus = dnd35eSynergyBonus(sourceRanks);
    if (bonus === 0) {
      continue;
    }
    for (const targetSkill of targets) {
      entries.push(
        createEntry({
          systemId,
          target: `skills.${targetSkill}`,
          sourceKind: 'system',
          sourceId: `skill-synergy:${sourceSkill}`,
          sourceLabel: `${sourceSkill} (5+ ranks)`,
          label: 'Skill synergy bonus',
          operation: 'add',
          value: bonus,
          category: 'other',
          sourcePath: `system.skillRanks.${sourceSkill}`,
          details: { sourceSkill, sourceRanks, targetSkill },
        })
      );
    }
  }

  return entries;
}

function createEntry(params: AddEntryInput): ContributionLedgerEntry {
  return {
    id: ledgerId(
      params.systemId,
      params.category,
      params.target,
      params.sourceLabel,
      params.label,
      String(params.value)
    ),
    systemId: params.systemId,
    target: params.target,
    source: {
      kind: params.sourceKind,
      label: params.sourceLabel,
      id: params.sourceId,
      path: params.sourcePath,
    },
    label: params.label,
    operation: params.operation,
    value: params.value,
    category: params.category,
    details: params.details,
  };
}

function ledgerId(...parts: string[]): string {
  return parts
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9:.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
