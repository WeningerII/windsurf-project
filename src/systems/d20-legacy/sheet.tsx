import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import {
  Shield,
  Swords,
  Heart,
  Footprints,
  Target,
  AlertTriangle,
  Plus,
  X,
  User,
  BookOpen,
  Backpack,
  StickyNote,
  Sparkles,
  Sword,
} from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../utils/math';
import { Dnd35eDataModel } from '../dnd35e/data-model';
import { Pf1eDataModel } from '../pf1e/data-model';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { InventoryManager } from '../../components/InventoryManager';
import { DiceRollButton } from '../../components/DiceRollButton';
import { DamageHealControl } from '../../components/DamageHealControl';
import { CurrencyEditor } from '../../components/CurrencyEditor';
import { FeaturesSection } from '../../components/FeaturesSection';
import { RestControls } from '../../components/RestControls';
const FeatBrowser = lazy(() =>
  import('../../components/FeatBrowser').then((m) => ({ default: m.FeatBrowser }))
);
const SpellBrowser = lazy(() =>
  import('../../components/SpellBrowser').then((m) => ({ default: m.SpellBrowser }))
);
const EquipmentBrowser = lazy(() =>
  import('../../components/EquipmentBrowser').then((m) => ({ default: m.EquipmentBrowser }))
);
import {
  loadFeatsForSystem,
  loadSpellsForSystem,
  loadEquipmentForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadTraitsForSystem,
} from '../../utils/dataLoader';
import { formatCastingTime, formatRange, formatDuration } from '../../utils/formatters';
import { systemRegistry } from '../../registry';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Spell } from '../../types/magic/spells';
import type { Item } from '../../types/equipment/items';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { GameSystemId } from '../../types/game-systems';
import type { Pf1eTrait } from '../pf1e/data-model';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
  removeD20LegacyClassTemplate,
} from '../../utils/d20LegacyTemplate';

type D20LegacyData = Dnd35eDataModel | Pf1eDataModel;

function resetD20SpellSlots(spellsPerDay?: Record<number, { total: number; used: number }>) {
  if (!spellsPerDay) return spellsPerDay;
  const next: Record<number, { total: number; used: number }> = {};
  for (const [level, slots] of Object.entries(spellsPerDay)) {
    const numericLevel = Number(level);
    next[numericLevel] = { ...slots, used: 0 };
  }
  return next;
}

function getIterativeAttackBonuses(baseAttackBonus: number): number[] {
  const attacks = [baseAttackBonus];
  for (let penalty = 5; attacks.length < 4; penalty += 5) {
    const bonus = baseAttackBonus - penalty;
    if (bonus < 1) break;
    attacks.push(bonus);
  }
  return attacks;
}

/**
 * Native sheet for d20 3.x-family systems (D&D 3.5e and Pathfinder 1e).
 *
 * These systems share: BAB, 3 saves (Fort/Ref/Will), skill ranks,
 * touch/flat-footed AC, size modifiers, and grapple/CMB+CMD.
 */

interface Props {
  document: CharacterDocument<SystemDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

const PF1E_PRESTIGE_CLASS_IDS = new Set([
  'arcane-archer',
  'assassin',
  'dragon-disciple',
  'duelist',
  'lore-master',
  'mystic-theurge',
  'shadowdancer',
]);

const PF1E_MANUAL_SPELLCASTING_PRESTIGE_LABELS: Record<string, string> = {
  'arcane-archer': 'Arcane Archer',
  assassin: 'Assassin',
  'dragon-disciple': 'Dragon Disciple',
  'lore-master': 'Loremaster',
  'mystic-theurge': 'Mystic Theurge',
};

function isPf1ePrestigeClassId(classId: string): boolean {
  return PF1E_PRESTIGE_CLASS_IDS.has(classId);
}

function renderClassOptions(classOptions: CharacterClass[], isPf1e: boolean) {
  if (!isPf1e) {
    return classOptions.map((entry) => (
      <option key={entry.id} value={entry.id}>
        {entry.name}
      </option>
    ));
  }

  const baseClasses = classOptions.filter((entry) => !isPf1ePrestigeClassId(entry.id));
  const prestigeClasses = classOptions.filter((entry) => isPf1ePrestigeClassId(entry.id));

  return (
    <>
      {baseClasses.length > 0 && (
        <optgroup label="Base Classes">
          {baseClasses.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </optgroup>
      )}
      {prestigeClasses.length > 0 && (
        <optgroup label="Prestige Classes">
          {prestigeClasses.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </optgroup>
      )}
    </>
  );
}

function joinLabels(labels: string[]): string {
  if (labels.length <= 1) {
    return labels[0] || '';
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

export const D20LegacySheet: React.FC<Props> = ({ document, onUpdate }) => {
  const sys = document.system as D20LegacyData;
  const isPf1e = document.systemId === 'pf1e';
  const pf1Data = isPf1e ? (sys as Pf1eDataModel) : null;

  const {
    baseAttributes,
    hitPoints,
    baseAttackBonus: bab,
    armorClass: ac,
    initiative,
    speed,
    saves,
    skillRanks,
    features,
    feats,
    inventory,
  } = sys;

  // System-specific fields (narrowed by systemId check in JSX)
  const grapple = isPf1e ? undefined : (sys as Dnd35eDataModel).grapple;
  const cmb = isPf1e ? (sys as Pf1eDataModel).cmb : undefined;
  const cmd = isPf1e ? (sys as Pf1eDataModel).cmd : undefined;
  const iterativeAttackBonuses = getIterativeAttackBonuses(bab);
  const spellSlots = sys.spellsPerDay ?? {};
  const spellSlotLevels = Object.keys(spellSlots)
    .map((level) => Number(level))
    .filter((level) => Number.isFinite(level))
    .sort((a, b) => a - b);

  const trainedSkillCount = Object.keys(skillRanks).filter((k) => skillRanks[k] > 0).length;

  const [featDefs, setFeatDefs] = useState<FeatDefinition[]>([]);
  const [featsLoaded, setFeatsLoaded] = useState(false);
  const loadFeatDefs = useCallback(async () => {
    if (featsLoaded) return;
    const loaded = await loadFeatsForSystem(document.systemId as GameSystemId);
    setFeatDefs(loaded);
    setFeatsLoaded(true);
  }, [featsLoaded, document.systemId]);

  const [spells, setSpells] = useState<Spell[]>([]);
  const [spellsLoaded, setSpellsLoaded] = useState(false);
  const loadSpells = useCallback(async () => {
    if (spellsLoaded) return;
    const loaded = await loadSpellsForSystem(document.systemId as GameSystemId);
    setSpells(loaded);
    setSpellsLoaded(true);
  }, [spellsLoaded, document.systemId]);

  const [equipmentItems, setEquipmentItems] = useState<Item[]>([]);
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);
  const loadEquipment = useCallback(async () => {
    if (equipmentLoaded) return;
    const loaded = await loadEquipmentForSystem(document.systemId as GameSystemId);
    setEquipmentItems(loaded);
    setEquipmentLoaded(true);
  }, [equipmentLoaded, document.systemId]);

  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [traitOptions, setTraitOptions] = useState<Pf1eTrait[]>([]);
  const [traitsLoaded, setTraitsLoaded] = useState(false);
  const [selectedTraitId, setSelectedTraitId] = useState<string>('');
  const [pendingClassId, setPendingClassId] = useState('');
  const [pendingClassLevel, setPendingClassLevel] = useState('1');
  const [classTemplateError, setClassTemplateError] = useState<string | null>(null);
  const loadTraitOptions = useCallback(async () => {
    if (!isPf1e || traitsLoaded) return;
    const loaded = await loadTraitsForSystem(document.systemId as GameSystemId);
    setTraitOptions(loaded);
    setTraitsLoaded(true);
  }, [document.systemId, isPf1e, traitsLoaded]);
  const loadOptions = useCallback(async () => {
    if (classes.length === 0) {
      const [c, s] = await Promise.all([
        loadClassesForSystem(document.systemId as GameSystemId),
        loadSpeciesForSystem(document.systemId as GameSystemId),
      ]);
      setClasses(c);
      setSpecies(s);
    }
  }, [classes.length, document.systemId]);

  useEffect(() => {
    if (!isPf1e) {
      return;
    }

    void loadTraitOptions();
  }, [isPf1e, loadTraitOptions]);

  const update = useCallback(
    (patch: Partial<D20LegacyData>) => {
      if (!onUpdate) return;
      onUpdate({
        ...document,
        system: { ...sys, ...patch } as SystemDataModel,
        updatedAt: new Date(),
      });
    },
    [document, sys, onUpdate]
  );

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<D20LegacyData>) => {
      if (!onUpdate) return;
      onUpdate({ ...nextDocument, updatedAt: new Date() } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const selectedSpecies = species.find((entry) => entry.id === sys.speciesId);
  const selectedPf1eManualSpellcastingPrestigeClasses = isPf1e
    ? Array.from(
        new Set(
          sys.classLevels
            .map((classLevel) => PF1E_MANUAL_SPELLCASTING_PRESTIGE_LABELS[classLevel.classId])
            .filter((label): label is string => typeof label === 'string')
        )
      )
    : [];

  const runClassTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<D20LegacyData>) => {
      try {
        setClassTemplateError(null);
        replaceDocument(updater());
        setPendingClassId('');
        setPendingClassLevel('1');
      } catch (error) {
        setClassTemplateError(
          error instanceof Error ? error.message : 'Unable to update class composition.'
        );
      }
    },
    [replaceDocument]
  );

  const handleClassRowChange = useCallback(
    (targetClassId: string, nextClassId: string, level: number) => {
      if (!nextClassId) {
        return;
      }

      const classData = classes.find((entry) => entry.id === nextClassId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return applyD20LegacyClassTemplate(
            document as CharacterDocument<Pf1eDataModel>,
            classData,
            level,
            {
              mode: 'replace',
              targetClassId,
            }
          ) as CharacterDocument<D20LegacyData>;
        }

        return applyD20LegacyClassTemplate(
          document as CharacterDocument<Dnd35eDataModel>,
          classData,
          level,
          {
            mode: 'replace',
            targetClassId,
          }
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [classes, document, isPf1e, runClassTemplateUpdate]
  );

  const handleClassLevelChange = useCallback(
    (classId: string, value: string) => {
      const classData = classes.find((entry) => entry.id === classId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return applyD20LegacyClassTemplate(
            document as CharacterDocument<Pf1eDataModel>,
            classData,
            parseNum(value, 1),
            {
              mode: 'replace',
              targetClassId: classId,
            }
          ) as CharacterDocument<D20LegacyData>;
        }

        return applyD20LegacyClassTemplate(
          document as CharacterDocument<Dnd35eDataModel>,
          classData,
          parseNum(value, 1),
          {
            mode: 'replace',
            targetClassId: classId,
          }
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [classes, document, isPf1e, runClassTemplateUpdate]
  );

  const handleAddClass = useCallback(() => {
    if (!pendingClassId) {
      return;
    }

    const classData = classes.find((entry) => entry.id === pendingClassId);
    if (!classData) {
      return;
    }

    runClassTemplateUpdate(() => {
      if (isPf1e) {
        return applyD20LegacyClassTemplate(
          document as CharacterDocument<Pf1eDataModel>,
          classData,
          parseNum(pendingClassLevel, 1),
          { mode: 'add' }
        ) as CharacterDocument<D20LegacyData>;
      }

      return applyD20LegacyClassTemplate(
        document as CharacterDocument<Dnd35eDataModel>,
        classData,
        parseNum(pendingClassLevel, 1),
        { mode: 'add' }
      ) as CharacterDocument<D20LegacyData>;
    });
  }, [classes, document, isPf1e, pendingClassId, pendingClassLevel, runClassTemplateUpdate]);

  const handleRemoveClass = useCallback(
    (classId: string) => {
      runClassTemplateUpdate(() => {
        if (isPf1e) {
          return removeD20LegacyClassTemplate(
            document as CharacterDocument<Pf1eDataModel>,
            classId
          ) as CharacterDocument<D20LegacyData>;
        }

        return removeD20LegacyClassTemplate(
          document as CharacterDocument<Dnd35eDataModel>,
          classId
        ) as CharacterDocument<D20LegacyData>;
      });
    },
    [document, isPf1e, runClassTemplateUpdate]
  );

  const applyRaceTemplate = useCallback(
    (speciesData: Species, previousSpecies?: Species) => {
      if (isPf1e) {
        replaceDocument(
          applyD20LegacyRaceTemplate(
            document as CharacterDocument<Pf1eDataModel>,
            speciesData,
            previousSpecies
          ) as CharacterDocument<D20LegacyData>
        );
        return;
      }

      replaceDocument(
        applyD20LegacyRaceTemplate(
          document as CharacterDocument<Dnd35eDataModel>,
          speciesData,
          previousSpecies
        ) as CharacterDocument<D20LegacyData>
      );
    },
    [document, isPf1e, replaceDocument]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
        <input
          value={document.name}
          onChange={(e) => onUpdate?.({ ...document, name: e.target.value, updatedAt: new Date() })}
          className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
          disabled={!onUpdate}
          title="Character name"
          placeholder="Character name"
        />
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <Badge variant="secondary">{isPf1e ? 'Pathfinder 1e' : 'D&D 3.5e'}</Badge>
          <Badge variant="info">Level {(sys.level as number) ?? 1}</Badge>
          {isPf1e && (pf1Data?.favoredClassSkillBonus ?? 0) > 0 && (
            <Badge variant="secondary" title="Favored class skill-point selections">
              Skill FCB +{pf1Data?.favoredClassSkillBonus ?? 0}
            </Badge>
          )}
          <span>Total Level</span>
          <span className="font-bold text-foreground tabular-nums">
            {(sys.level as number) ?? 1}
          </span>
          <select
            value={sys.speciesId || ''}
            onChange={(e) => {
              const speciesData = species.find((entry) => entry.id === e.target.value);
              if (!speciesData) return;

              applyRaceTemplate(speciesData, selectedSpecies);
            }}
            onFocus={loadOptions}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!onUpdate}
            title={isPf1e ? 'Race' : 'Race'}
          >
            <option value="">{isPf1e ? 'Race...' : 'Race...'}</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={sys.sizeCategory || 'medium'}
            onChange={(e) => update({ sizeCategory: e.target.value } as Partial<D20LegacyData>)}
            className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
            disabled={!onUpdate}
            title="Size Category"
          >
            <option value="fine">Fine</option>
            <option value="diminutive">Diminutive</option>
            <option value="tiny">Tiny</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
            <option value="gargantuan">Gargantuan</option>
            <option value="colossal">Colossal</option>
          </select>
          <span>XP</span>
          <input
            type="number"
            value={sys.experiencePoints ?? 0}
            onChange={(e) =>
              update({ experiencePoints: parseNum(e.target.value, 0) } as Partial<D20LegacyData>)
            }
            className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
            min={0}
            disabled={!onUpdate}
            title="Experience Points"
          />
        </div>
      </div>

      <section className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Classes</h2>
            <p className="text-xs text-muted-foreground">
              Each class row tracks its own BAB, saves, hit dice, and feature progression.
            </p>
          </div>
          <Badge variant="secondary">Total Level {sys.level as number}</Badge>
        </div>

        {selectedPf1eManualSpellcastingPrestigeClasses.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Spell progression for {joinLabels(selectedPf1eManualSpellcastingPrestigeClasses)} is
                not automated yet. Adjust spell slots manually in the Spells tab.
              </p>
            </div>
          </div>
        )}

        {sys.classLevels.length > 0 ? (
          <div className="space-y-2">
            {sys.classLevels.map((classLevel, index) => {
              const usedClassIds = new Set(
                sys.classLevels
                  .filter((entry) => entry.classId !== classLevel.classId)
                  .map((entry) => entry.classId)
              );

              return (
                <div
                  key={classLevel.classId}
                  className="grid gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-center"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {index === 0 ? 'Starting Class' : `Class ${index + 1}`}
                    </span>
                    <select
                      value={classLevel.classId}
                      onChange={(e) =>
                        handleClassRowChange(classLevel.classId, e.target.value, classLevel.level)
                      }
                      onFocus={loadOptions}
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                      disabled={!onUpdate}
                      title={`Class ${index + 1}`}
                    >
                      <option value="">Class...</option>
                      {renderClassOptions(
                        classes.filter(
                          (entry) => entry.id === classLevel.classId || !usedClassIds.has(entry.id)
                        ),
                        isPf1e
                      )}
                    </select>
                  </div>
                  <label className="space-y-1 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Level
                    </span>
                    <input
                      type="number"
                      value={classLevel.level}
                      onChange={(e) => handleClassLevelChange(classLevel.classId, e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                      min={1}
                      title={`${classLevel.classId} level`}
                      disabled={!onUpdate}
                    />
                  </label>
                  <div className="flex items-end md:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveClass(classLevel.classId)}
                      disabled={!onUpdate || sys.classLevels.length <= 1}
                      title={`Remove ${classLevel.classId}`}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-input px-3 py-4 text-sm text-muted-foreground">
            No class template applied yet.
          </div>
        )}

        {onUpdate && (
          <div className="grid gap-2 rounded-lg border border-dashed border-input p-3 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-end">
            <label className="space-y-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Add Class
              </span>
              <select
                value={pendingClassId}
                onChange={(e) => setPendingClassId(e.target.value)}
                onFocus={loadOptions}
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                disabled={!onUpdate}
                title="Add class"
              >
                <option value="">Choose class...</option>
                {renderClassOptions(
                  classes.filter(
                    (entry) =>
                      !sys.classLevels.some((classLevel) => classLevel.classId === entry.id)
                  ),
                  isPf1e
                )}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Level
              </span>
              <input
                type="number"
                value={pendingClassLevel}
                onChange={(e) => setPendingClassLevel(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                min={1}
                title="New class level"
                disabled={!onUpdate}
              />
            </label>
            <div className="flex items-end md:justify-end">
              <Button
                type="button"
                onClick={handleAddClass}
                disabled={!pendingClassId}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </div>
          </div>
        )}

        {classTemplateError && (
          <p className="text-sm text-destructive" role="alert">
            {classTemplateError}
          </p>
        )}
      </section>

      {/* Combat Stats — always visible */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> AC
          </div>
          <div className="text-3xl font-bold tabular-nums">{ac.total}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Touch</div>
          <div className="text-2xl font-bold tabular-nums">{ac.touch}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Flat-Footed</div>
          <div className="text-2xl font-bold tabular-nums">{ac.flatFooted}</div>
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" /> HP
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={hitPoints.current}
              onChange={(e) =>
                update({ hitPoints: { ...hitPoints, current: parseNum(e.target.value, 0) } })
              }
              className="w-12 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!onUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-lg tabular-nums">{hitPoints.max}</span>
          </div>
          {onUpdate && (
            <DamageHealControl
              onApply={(amount, type) => {
                const newCurrent =
                  type === 'damage'
                    ? Math.max(0, hitPoints.current - amount)
                    : Math.min(hitPoints.max, hitPoints.current + amount);
                update({ hitPoints: { ...hitPoints, current: newCurrent } });
              }}
            />
          )}
        </div>
        <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Swords className="w-3 h-3" /> BAB
          </div>
          <div className="text-2xl font-bold tabular-nums">{formatMod(bab)}</div>
          {iterativeAttackBonuses.length > 1 && (
            <div className="text-[10px] text-muted-foreground mt-1">
              {iterativeAttackBonuses.map(formatMod).join(' / ')}
            </div>
          )}
        </div>
        {isPf1e ? (
          <>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">CMB</div>
              <div className="text-2xl font-bold tabular-nums">{formatMod(cmb ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">CMD</div>
              <div className="text-2xl font-bold tabular-nums">{cmd ?? 10}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Grapple</div>
              <div className="text-2xl font-bold tabular-nums">{formatMod(grapple ?? 0)}</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                <Footprints className="w-3 h-3" /> Speed
              </div>
              <div className="text-2xl font-bold tabular-nums">{speed} ft</div>
            </div>
          </>
        )}
      </div>

      {/* Initiative + Speed (PF1e row) */}
      {isPf1e && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Initiative
            </div>
            <div className="text-2xl font-bold tabular-nums">{formatMod(initiative)}</div>
          </div>
          <div className="bg-card border rounded-lg p-3 text-center transition-shadow hover:shadow-sm">
            <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
              <Footprints className="w-3 h-3" /> Speed
            </div>
            <div className="text-2xl font-bold tabular-nums">{speed} ft</div>
          </div>
        </div>
      )}

      <section className="bg-card p-3 rounded-lg border">
        <h3 className="text-sm font-semibold mb-2">Quick Rolls</h3>
        <div className="flex flex-wrap items-center gap-2">
          <DiceRollButton
            label="Attack Roll"
            onRoll={() =>
              systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'attack')
            }
          />
          {isPf1e ? (
            <DiceRollButton
              label="Combat Maneuver"
              onRoll={() =>
                systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'cmb')
              }
            />
          ) : (
            <DiceRollButton
              label="Grapple Check"
              onRoll={() =>
                systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'grapple')
              }
            />
          )}
        </div>
      </section>

      <RestControls
        showExhaustion={false}
        onShortRest={
          onUpdate
            ? () => {
                const level = (sys.level as number) ?? 1;
                const recovered = Math.max(1, Math.floor(level / 2));
                update({
                  hitPoints: {
                    ...hitPoints,
                    current: Math.min(hitPoints.max, hitPoints.current + recovered),
                  },
                });
              }
            : undefined
        }
        onLongRest={
          onUpdate
            ? () => {
                update({
                  hitPoints: { ...hitPoints, current: hitPoints.max, temp: 0 },
                  spellsPerDay: resetD20SpellSlots(sys.spellsPerDay),
                } as Partial<D20LegacyData>);
              }
            : undefined
        }
      />

      {/* Tabbed Sections */}
      <Tabs defaultValue="abilities">
        <TabsList className="w-full grid grid-cols-9">
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="saves" className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Saves
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Skills
            {trainedSkillCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {trainedSkillCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="feats" className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Feats
            {feats.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {feats.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="feat-browser"
            className="flex items-center gap-1.5"
            onClick={loadFeatDefs}
          >
            <BookOpen className="w-4 h-4" /> Browse
          </TabsTrigger>
          <TabsTrigger value="spells" className="flex items-center gap-1.5" onClick={loadSpells}>
            <Sparkles className="w-4 h-4" /> Spells
          </TabsTrigger>
          <TabsTrigger
            value="equipment-browser"
            className="flex items-center gap-1.5"
            onClick={loadEquipment}
          >
            <Sword className="w-4 h-4" /> Equipment
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1.5">
            <Backpack className="w-4 h-4" /> Inventory
            {inventory.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {inventory.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abilities">
          <section>
            <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(ABILITY_NAMES).map(([key, label]) => {
                const score = baseAttributes[key] ?? 10;
                const mod = abilityMod(score);
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      value={score}
                      onChange={(e) =>
                        update({
                          baseAttributes: {
                            ...baseAttributes,
                            [key]: parseNum(e.target.value, 10),
                          },
                        })
                      }
                      className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                      disabled={!onUpdate}
                      title={`${label} score`}
                    />
                    <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="saves">
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Saving Throws
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['fortitude', 'reflex', 'will'] as const).map((saveId) => {
                const save = saves[saveId];
                return (
                  <div
                    key={saveId}
                    className="bg-card border rounded-lg p-3 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold capitalize">{saveId}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold tabular-nums">
                          {formatMod(save.total)}
                        </span>
                        <DiceRollButton
                          label={`${saveId} Save`}
                          onRoll={() => {
                            const saveRollId =
                              saveId === 'fortitude'
                                ? 'save-fort'
                                : saveId === 'reflex'
                                  ? 'save-ref'
                                  : 'save-will';
                            return systemRegistry
                              .get(document.systemId)!
                              .engine.rollCheck(document, saveRollId);
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                      <div className="text-center">
                        <div>Base</div>
                        <div className="font-medium text-foreground tabular-nums">
                          {formatMod(save.base)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>Ability</div>
                        <div className="font-medium text-foreground tabular-nums">
                          {formatMod(save.ability)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>Misc</div>
                        <input
                          type="number"
                          value={save.misc}
                          onChange={(e) =>
                            update({
                              saves: {
                                ...saves,
                                [saveId]: { ...save, misc: parseNum(e.target.value, 0) },
                              },
                            })
                          }
                          className="w-full text-center font-medium text-foreground bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                          disabled={!onUpdate}
                          title={`${saveId} misc modifier`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="skills">
          <section>
            <h3 className="text-lg font-semibold mb-3">Skills ({trainedSkillCount} trained)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {(systemRegistry.get(document.systemId)?.skills ?? []).map(
                (skill: { id: string; name: string; attribute: string }) => {
                  const ranks = skillRanks[skill.id] ?? 0;
                  const isClassSkill = sys.classSkills?.includes(skill.id);
                  const abilMod = abilityMod(baseAttributes[skill.attribute] ?? 10);
                  const classBonus = isPf1e && isClassSkill && ranks > 0 ? 3 : 0;
                  const total = ranks + abilMod + classBonus;
                  return (
                    <div
                      key={skill.id}
                      className={`flex items-center justify-between p-1.5 bg-card border rounded text-sm transition-colors hover:bg-muted/50 ${ranks > 0 ? '' : 'opacity-60'}`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isClassSkill && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                            title="Class skill"
                          />
                        )}
                        <span className="font-medium truncate text-xs">{skill.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {skill.attribute}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-xs font-bold tabular-nums w-6 text-right"
                          title="Total"
                        >
                          {total >= 0 ? '+' : ''}
                          {total}
                        </span>
                        <input
                          type="number"
                          value={ranks}
                          onChange={(e) =>
                            update({
                              skillRanks: {
                                ...skillRanks,
                                [skill.id]: parseNum(e.target.value, 0),
                              },
                            })
                          }
                          className="w-10 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums text-xs"
                          min={0}
                          disabled={!onUpdate}
                          title={`${skill.name} ranks`}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="feats">
          <div className="space-y-4">
            <FeaturesSection features={features} />
            <section className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Feats</h3>
              <div className="space-y-2">
                {feats.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No feats selected.</p>
                ) : (
                  feats.map((feat) => (
                    <div
                      key={feat.id}
                      className="flex items-start justify-between p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <span className="font-medium">{feat.name}</span>
                        {feat.description && (
                          <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>
                        )}
                      </div>
                      {onUpdate && (
                        <button
                          onClick={() => update({ feats: feats.filter((f) => f.id !== feat.id) })}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                          title="Remove feat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
                {onUpdate && (
                  <button
                    onClick={() =>
                      update({
                        feats: [
                          ...feats,
                          {
                            id: `feat-${Date.now()}`,
                            name: 'New Feat',
                            description: '',
                            source: 'Custom',
                          },
                        ],
                      })
                    }
                    className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Feat
                  </button>
                )}
              </div>
              {isPf1e && pf1Data && (
                <div className="mt-5 pt-4 border-t space-y-2">
                  <h4 className="font-semibold">Traits</h4>
                  {pf1Data.traits.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No traits selected.</p>
                  ) : (
                    pf1Data.traits.map((trait) => (
                      <div
                        key={trait.id}
                        className="flex items-start justify-between p-2 bg-muted/20 rounded border"
                      >
                        <div>
                          <span className="font-medium">{trait.name}</span>
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px] px-1.5 py-0 capitalize"
                          >
                            {trait.type}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{trait.description}</p>
                        </div>
                        {onUpdate && (
                          <button
                            onClick={() =>
                              update({
                                traits: pf1Data.traits.filter((t) => t.id !== trait.id),
                              } as Partial<D20LegacyData>)
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                            title="Remove trait"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                  {onUpdate && (
                    <div className="flex gap-2">
                      <select
                        value={selectedTraitId}
                        onChange={(event) => setSelectedTraitId(event.target.value)}
                        className="flex-1 px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                        title="Add trait"
                        onFocus={() => {
                          void loadTraitOptions();
                        }}
                      >
                        <option value="">
                          {traitsLoaded ? 'Select trait...' : 'Loading traits...'}
                        </option>
                        {traitOptions
                          .filter(
                            (trait) => !pf1Data.traits.some((current) => current.id === trait.id)
                          )
                          .map((trait) => (
                            <option key={trait.id} value={trait.id}>
                              {trait.name}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const trait = traitOptions.find((entry) => entry.id === selectedTraitId);
                          if (!trait) return;
                          update({
                            traits: [...pf1Data.traits, trait],
                          } as Partial<D20LegacyData>);
                          setSelectedTraitId('');
                        }}
                        className="px-3 py-1.5 rounded border text-sm hover:border-primary hover:text-primary disabled:opacity-50"
                        disabled={!selectedTraitId || !traitsLoaded}
                      >
                        Add Trait
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="feat-browser">
          {!featsLoaded ? (
            <div className="text-center py-8 text-muted-foreground">
              Click to load feat database...
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Loading Feat Browser...
                </div>
              }
            >
              <FeatBrowser
                feats={featDefs.map((f) => ({
                  id: f.id,
                  name: f.name,
                  system: document.systemId,
                  description: f.description,
                  prerequisites: f.prerequisites?.map((p) => ({
                    type: p.type,
                    description: p.description || p.type,
                  })),
                  benefits: f.benefits,
                  source: f.source,
                }))}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="spells">
          <section className="bg-card p-4 rounded-lg border mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Spell Slots</h3>
              {onUpdate && (
                <button
                  type="button"
                  onClick={() => {
                    const nextLevel =
                      spellSlotLevels.length > 0 ? Math.max(...spellSlotLevels) + 1 : 0;
                    update({
                      spellsPerDay: {
                        ...spellSlots,
                        [nextLevel]: { total: 1, used: 0 },
                      },
                    } as Partial<D20LegacyData>);
                  }}
                  className="px-2 py-1 text-xs border border-dashed border-input rounded hover:border-primary hover:text-primary"
                >
                  Add Level
                </button>
              )}
            </div>
            {spellSlotLevels.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No spell slots configured.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {spellSlotLevels.map((level) => {
                  const slot = spellSlots[level];
                  if (!slot) return null;
                  const remaining = Math.max(0, slot.total - slot.used);
                  return (
                    <div key={level} className="p-2 border rounded bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Level {level}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {remaining}/{slot.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="w-6 h-6 rounded border text-sm hover:border-primary disabled:opacity-50"
                          onClick={() =>
                            update({
                              spellsPerDay: {
                                ...spellSlots,
                                [level]: { ...slot, used: Math.min(slot.total, slot.used + 1) },
                              },
                            } as Partial<D20LegacyData>)
                          }
                          disabled={!onUpdate || remaining === 0}
                          title={`Use level ${level} slot`}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-6 h-6 rounded border text-sm hover:border-primary disabled:opacity-50"
                          onClick={() =>
                            update({
                              spellsPerDay: {
                                ...spellSlots,
                                [level]: { ...slot, used: Math.max(0, slot.used - 1) },
                              },
                            } as Partial<D20LegacyData>)
                          }
                          disabled={!onUpdate || slot.used === 0}
                          title={`Recover level ${level} slot`}
                        >
                          +
                        </button>
                        {onUpdate && (
                          <input
                            type="number"
                            min={0}
                            value={slot.total}
                            onChange={(event) => {
                              const total = Math.max(0, parseNum(event.target.value, slot.total));
                              update({
                                spellsPerDay: {
                                  ...spellSlots,
                                  [level]: {
                                    total,
                                    used: Math.min(slot.used, total),
                                  },
                                },
                              } as Partial<D20LegacyData>);
                            }}
                            className="w-14 text-xs text-center border border-input rounded bg-transparent px-1 py-0.5 tabular-nums"
                            title={`Total level ${level} slots`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {!spellsLoaded ? (
            <div className="text-center py-8 text-muted-foreground">Click to load spells...</div>
          ) : (
            <Suspense
              fallback={
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Loading Spell Browser...
                </div>
              }
            >
              <SpellBrowser
                spells={spells.map((s) => ({
                  id: s.id,
                  name: s.name,
                  level: s.level,
                  school: s.school,
                  castingTime: formatCastingTime(s.castingTime),
                  range: formatRange(s.range),
                  duration: formatDuration(s.duration),
                  description: s.description,
                  classes: s.classes || [],
                }))}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="equipment-browser">
          {!equipmentLoaded ? (
            <div className="text-center py-8 text-muted-foreground">Click to load equipment...</div>
          ) : (
            <Suspense
              fallback={
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Loading Equipment Browser...
                </div>
              }
            >
              <EquipmentBrowser
                equipment={equipmentItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  type: item.type || 'gear',
                  rarity: item.rarity || 'common',
                  cost: item.cost ? `${item.cost.amount} ${item.cost.currency}` : '0 gp',
                  weight: item.weight ?? 0,
                  description: item.description,
                }))}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <CurrencyEditor
            currency={sys.currency as unknown as Record<string, number>}
            onChange={
              onUpdate
                ? (currency) =>
                    update({
                      currency: currency as unknown as typeof sys.currency,
                    } as Partial<D20LegacyData>)
                : undefined
            }
          />
          <div className="mt-4" />
          <InventoryManager
            items={inventory.map((item) => ({
              id: item.itemId,
              name: item.name,
              quantity: item.quantity,
              weight: item.weight,
              value: '0 gp',
            }))}
            onAddItem={
              onUpdate
                ? (item) => {
                    update({
                      inventory: [
                        ...inventory,
                        {
                          itemId: item.id,
                          name: item.name,
                          quantity: item.quantity,
                          weight: item.weight,
                        },
                      ],
                    });
                  }
                : undefined
            }
            onRemoveItem={
              onUpdate
                ? (itemId) => {
                    update({ inventory: inventory.filter((i) => i.itemId !== itemId) });
                  }
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="notes">
          <section className="bg-card p-4 rounded-lg border space-y-4">
            <h3 className="text-lg font-semibold">Character Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={sys.personality?.description || ''}
                  onChange={(e) =>
                    update({ personality: { ...sys.personality, description: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
                  placeholder="Physical description..."
                  disabled={!onUpdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Backstory</label>
                <textarea
                  value={sys.personality?.backstory || ''}
                  onChange={(e) =>
                    update({ personality: { ...sys.personality, backstory: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
                  placeholder="Character backstory..."
                  disabled={!onUpdate}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={sys.notes || ''}
                onChange={(e) => update({ notes: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[120px]"
                placeholder="Additional notes..."
                disabled={!onUpdate}
              />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};
