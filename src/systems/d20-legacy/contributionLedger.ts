import type {
  ContributionCategory,
  ContributionSourceKind,
  ContributionLedgerResult,
} from '../../types/core/contributionLedger';
import type { CharacterDocument } from '../../types/core/document';
import type { EffectInstance, EffectOperation, EffectValue } from '../../rules';
import { resolveCharacterEffects, resolveEffects, toContributionLedger } from '../../rules';
import { abilityMod } from '../../utils/math';
import { baseSave, classBAB } from '../shared/d20-helpers';
import { dnd35eSynergyBonus } from '../../utils/derivedCombatMath';
import type { D20LegacyData } from './d20LegacySheetShared';

/**
 * Non-persisted contribution ledger for the d20-legacy systems (D&D 3.5e and
 * Pathfinder 1e). It explains where the engine's derived Base Attack Bonus,
 * saving-throw totals, and (3.5e-only) skill synergy bonuses come from, plus the
 * magic-item/feat/feature AC and attack provenance.
 *
 * W4 re-backing (RFC 003 Phase 3): EVERY row is now the projection of a single
 * resolver fold. The BAB / save / synergy terms are compiled into the shared
 * `EffectInstance` primitive (like every other contribution), concatenated with
 * the equipment/feat/feature effects the resolver already produced, folded ONCE
 * through `resolveEffects`, and projected with `toContributionLedger`. The
 * builder no longer carries its own `ContributionLedgerEntry` factory — a third
 * parallel implementation of the entry shape, free to drift from
 * `effectToLedgerEntry`. Same rows, same order, same ids: the compiled effects
 * carry no gating condition, so the fold keeps them all in input order, and the
 * equipment/feat effects were already resolved under the same (empty) context.
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

type AddEffectInput = {
  systemId: D20LegacySystemId;
  target: string;
  sourceKind: ContributionSourceKind;
  sourceLabel: string;
  label: string;
  operation: EffectOperation;
  value: EffectValue;
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
  // modifiers contributes no resolver rows. Its `result.ledger` is already an
  // EffectInstance[], so it concatenates straight into the single fold below.
  const resolved = resolveCharacterEffects(systemId, {
    equipment: system.equipment.filter((item) => item.equipped),
    feats: system.feats,
    features: system.features,
  });

  const effects: EffectInstance[] = [
    ...buildBaseAttackBonusEffects(systemId, system),
    ...buildSaveEffects(systemId, system),
    ...resolved.result.ledger,
    // Skill synergy is a 3.5e-only subsystem; PF1e has no synergy bonuses, so no
    // rows are emitted for it (do not invent a PF1e synergy).
    ...(systemId === 'dnd-3.5e' ? buildSkillSynergyEffects(systemId, system) : []),
  ];

  // ONE fold, ONE projection. `resolveEffects` keeps every applied effect in
  // input order, so the ledger reads exactly as it did when hand-assembled.
  return toContributionLedger(resolveEffects(effects).ledger);
}

/**
 * One `add` row per class level: `classBAB(level, progression)`. The rows sum to
 * `data.baseAttackBonus` — the engine computes that total the same way
 * (Σ classBAB across the multiclass).
 */
function buildBaseAttackBonusEffects(
  systemId: D20LegacySystemId,
  system: D20LegacyData
): EffectInstance[] {
  const classLevels: readonly D20LegacyClassLevelView[] = system.classLevels;

  return classLevels.map((classLevel, index) =>
    createEffect({
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
function buildSaveEffects(systemId: D20LegacySystemId, system: D20LegacyData): EffectInstance[] {
  const classLevels: readonly D20LegacyClassLevelView[] = system.classLevels;
  const effects: EffectInstance[] = [];

  for (const config of SAVE_CONFIG) {
    classLevels.forEach((classLevel, index) => {
      const quality = classLevel[config.qualityKey];
      const base = baseSave(classLevel.level, quality);
      if (base === 0) {
        return;
      }
      effects.push(
        createEffect({
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
      effects.push(
        createEffect({
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
      effects.push(
        createEffect({
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

  return effects;
}

/**
 * 3.5e-only skill synergy: a source skill with 5+ ranks grants +2 to each of its
 * related skills (SRD Synergy). One `add` row per (source, target) pair; the +2
 * comes from `dnd35eSynergyBonus`, so the rows targeting a skill sum to
 * `dnd35eSkillSynergyTotal(skill, skillRanks)`.
 */
function buildSkillSynergyEffects(
  systemId: D20LegacySystemId,
  system: D20LegacyData
): EffectInstance[] {
  const skillRanks = system.skillRanks;
  const effects: EffectInstance[] = [];

  for (const [sourceSkill, targets] of Object.entries(DND35E_SYNERGY_TARGETS_BY_SOURCE)) {
    const sourceRanks = skillRanks[sourceSkill] ?? 0;
    const bonus = dnd35eSynergyBonus(sourceRanks);
    if (bonus === 0) {
      continue;
    }
    for (const targetSkill of targets) {
      effects.push(
        createEffect({
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

  return effects;
}

/**
 * One contribution as the shared IR primitive. Projected through
 * `toContributionLedger` it yields exactly the ledger entry this builder used to
 * hand-assemble — same id, target, source, operation, value, category. The
 * stacking is `'sum'`: every d20-legacy term here (per-class BAB, per-class base
 * save, ability modifier, misc, synergy) accumulates by SRD.
 */
function createEffect(params: AddEffectInput): EffectInstance {
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
    operation: params.operation,
    value: params.value,
    stackPolicy: 'sum',
    source: {
      kind: params.sourceKind,
      label: params.sourceLabel,
      id: params.sourceId,
      path: params.sourcePath,
    },
    label: params.label,
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
