import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  Backpack,
  BookOpen,
  Crosshair,
  Heart,
  Plus,
  Shield,
  Skull,
  Sparkles,
  StickyNote,
  Target,
  User,
  X,
} from 'lucide-react';
import { AbilityScoreGrid, CombatStatCard, SheetHeader } from '../../../components/sheet';
import { ConditionPicker } from '../../../components/ConditionPicker';
import { DamageHealControl } from '../../../components/DamageHealControl';
import { DeathSavesTracker } from '../../../components/DeathSavesTracker';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { FeaturesSection } from '../../../components/FeaturesSection';
import { HitDiceTracker } from '../../../components/HitDiceTracker';
import { ProficiencyListSection } from '../../../components/ProficiencyListSection';
import { RestControls } from '../../../components/RestControls';
import { SpellSlotTracker } from '../../../components/SpellSlotTracker';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { systemRegistry } from '../../../registry';
import { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../data-model';
import { DND5E_CONDITION_NAMES } from '../conditions';
import { Background } from '../../../types/character-options/backgrounds';
import { CharacterClass } from '../../../types/character-options/classes';
import { FeatDefinition } from '../../../types/character-options/feats';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../../../types/character-options/feature-options';
import { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { EquippedItem, Feat, SpellSlots } from '../../../types/core/character';
import { Monster } from '../../../types/creatures/monsters';
import { Armor, Item, Shield as ShieldItem } from '../../../types/equipment/items';
import { Spell } from '../../../types/magic/spells';
import { Species } from '../../../types/character-options/species';
import { GameSystemId } from '../../../types/game-systems';
import { applyDnd5eBackgroundTemplate } from '../../../utils/backgroundTemplate';
import {
  applyDnd5eClassTemplate,
  applyDnd5eSubclassTemplate,
  removeDnd5eClassTemplate,
} from '../../../utils/classTemplate';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadEquipmentForSystem,
  loadFeatsForSystem,
  loadFeatureOptionsForSystem,
  loadMonstersForSystem,
  loadSpeciesForSystem,
  loadSpellsForSystem,
} from '../../../utils/dataLoader';
import { applyDnd5eLongRest, applyDnd5eShortRest } from '../../../utils/dnd5eRest';
import { formatCastingTime, formatDuration, formatRange } from '../../../utils/formatters';
import {
  applyDnd5eFeatTemplate,
  createDefaultDnd5eFeatSelections,
  getCurrentDnd5eFeatSelections,
  getDnd5eFeatAutomationRequirements,
  removeDnd5eFeatTemplate,
} from '../../../utils/featTemplate';
import type { Dnd5eFeatChoiceRequirement, Dnd5eFeatSelections } from '../../../utils/featTemplate';
import {
  applyDnd5eFeatureOptionSelection,
  getDnd5eFeatureOptionGroupLabel,
  getEligibleDnd5eFeatureOptions,
  removeDnd5eFeatureOptionSelection,
} from '../../../utils/dnd5eFeatureOptions';
import { abilityMod, formatMod, parseNum } from '../../../utils/math';
import { applyDnd5eSpeciesTemplate } from '../../../utils/speciesTemplate';

const CurrencyEditor = lazy(() =>
  import('../../../components/CurrencyEditor').then((module) => ({
    default: module.CurrencyEditor,
  }))
);
const EquippedItemsSection = lazy(() =>
  import('../../../components/EquippedItemsSection').then((module) => ({
    default: module.EquippedItemsSection,
  }))
);
const EquipmentBrowser = lazy(() =>
  import('../../../components/EquipmentBrowser').then((module) => ({
    default: module.EquipmentBrowser,
  }))
);
const FeatBrowser = lazy(() =>
  import('../../../components/FeatBrowser').then((module) => ({
    default: module.FeatBrowser,
  }))
);
const FeatureOptionBrowser = lazy(() =>
  import('../../../components/FeatureOptionBrowser').then((module) => ({
    default: module.FeatureOptionBrowser,
  }))
);
const MonsterBrowser = lazy(() =>
  import('../../../components/MonsterBrowser').then((module) => ({
    default: module.MonsterBrowser,
  }))
);
const InventoryManager = lazy(() =>
  import('../../../components/InventoryManager').then((module) => ({
    default: module.InventoryManager,
  }))
);
const SpellBrowser = lazy(() =>
  import('../../../components/SpellBrowser').then((module) => ({
    default: module.SpellBrowser,
  }))
);

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

interface Props<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
  enableWeaponMasteries?: boolean;
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const SKILLS: Array<{ id: string; name: string; ability: string }> = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animal-handling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
];

const WEAPON_MASTERY_OPTIONS = [
  'Cleave',
  'Graze',
  'Nick',
  'Push',
  'Sap',
  'Slow',
  'Topple',
  'Vex',
] as const;

function resolveEquipmentSlot(item: Item): EquippedItem['slot'] | null {
  switch (item.type) {
    case 'armor':
      return 'chest';
    case 'shield':
      return 'offHand';
    case 'weapon':
      return 'mainHand';
    default:
      return null;
  }
}

function toEquippedItem(item: Item): EquippedItem | null {
  const slot = resolveEquipmentSlot(item);
  if (!slot) {
    return null;
  }

  const equippedItem: EquippedItem = {
    itemId: item.id,
    slot,
    attuned: item.requiresAttunement,
    customName: item.name,
  };

  if (item.type === 'armor') {
    const armor = item as Armor;
    equippedItem.armorClass = armor.armorClass;
    equippedItem.armorType = armor.armorType;
    equippedItem.dexBonusMax = armor.dexBonusMax;
  }

  if (item.type === 'shield') {
    equippedItem.shieldBonus = (item as ShieldItem).armorClassBonus;
  }

  return equippedItem;
}

function spellSlotCount(slots?: SpellSlots): number {
  if (!slots) {
    return 0;
  }

  return Object.values(slots).reduce((total, slot) => total + slot.max, 0);
}

function canSelectSubclass(classData: CharacterClass, level: number): boolean {
  return level >= classData.subclassLevel || classData.subclassSelection?.timing === 'creation';
}

function countSelections(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function resolveFeatSelections(
  featDefinition: FeatDefinition,
  feat: Feat,
  baseAttributes: Record<string, number>
): Dnd5eFeatSelections {
  const currentSelections = getCurrentDnd5eFeatSelections(featDefinition, feat);
  const defaultSelections = createDefaultDnd5eFeatSelections(featDefinition, baseAttributes);
  const requirements = getDnd5eFeatAutomationRequirements(featDefinition);

  return Object.fromEntries(
    requirements.map((requirement) => {
      const currentValues = currentSelections[requirement.id] || [];
      return [
        requirement.id,
        currentValues.length === requirement.count
          ? currentValues
          : defaultSelections[requirement.id] || [],
      ];
    })
  ) as Dnd5eFeatSelections;
}

function optionDisabledForRequirement(
  requirement: Dnd5eFeatChoiceRequirement,
  selections: string[],
  selectionIndex: number,
  optionId: string
): boolean {
  const currentValue = selections[selectionIndex];
  if (currentValue === optionId) {
    return false;
  }

  return (countSelections(selections)[optionId] || 0) >= requirement.maxPerOption;
}

function featureOptionSelectionKey(
  selection: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>
): string {
  return `${selection.group}:${selection.id}`;
}

export function Dnd5eSheetBase<T extends Dnd5eLikeDataModel>({
  document,
  onUpdate,
  enableWeaponMasteries = false,
}: Props<T>) {
  const d = document.system;
  const systemId = document.systemId as GameSystemId;
  const profBonus = Math.ceil(d.level / 4) + 1;
  const showFeatBrowser = systemId !== 'dnd-5e-2014';
  const showFeatureOptionBrowser = systemId === 'dnd-5e-2014';

  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);

  const [spells, setSpells] = useState<Spell[]>([]);
  const [spellsLoaded, setSpellsLoaded] = useState(false);
  const [equipmentItems, setEquipmentItems] = useState<Item[]>([]);
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);
  const [featDefs, setFeatDefs] = useState<FeatDefinition[]>([]);
  const [featsLoaded, setFeatsLoaded] = useState(false);
  const [featureOptions, setFeatureOptions] = useState<Dnd5eFeatureOptionDefinition[]>([]);
  const [featureOptionsLoaded, setFeatureOptionsLoaded] = useState(false);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [monstersLoaded, setMonstersLoaded] = useState(false);
  const [pendingClassId, setPendingClassId] = useState('');
  const [pendingClassLevel, setPendingClassLevel] = useState('1');
  const [classTemplateError, setClassTemplateError] = useState<string | null>(null);
  const [featTemplateError, setFeatTemplateError] = useState<string | null>(null);
  const [featureOptionError, setFeatureOptionError] = useState<string | null>(null);

  const selectedBackground = backgrounds.find((entry) => entry.id === d.backgroundId);
  const equippedNames = new Map(equipmentItems.map((item) => [item.id, item.name]));
  const spellNames = new Map(spells.map((spell) => [spell.id, spell.name]));
  const preparedSpellIds = new Set(d.spellcasting?.spellsPrepared || []);
  const featDefinitionsById = new Map(featDefs.map((feat) => [feat.id, feat]));
  const featureOptionSelections = d.featureOptionSelections || [];
  const featureOptionsBySelectionKey = new Map(
    featureOptions.map((option) => [featureOptionSelectionKey(option), option])
  );
  const selectedFeatureOptions = featureOptionSelections.flatMap((selection) => {
    const option = featureOptionsBySelectionKey.get(featureOptionSelectionKey(selection));
    return option ? [option] : [];
  });
  const eligibleFeatureOptions = getEligibleDnd5eFeatureOptions(featureOptions, d.classLevels);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      loadClassesForSystem(systemId),
      loadSpeciesForSystem(systemId),
      loadBackgroundsForSystem(systemId),
    ])
      .then(([loadedClasses, loadedSpecies, loadedBackgrounds]) => {
        if (cancelled) {
          return;
        }

        setClasses(loadedClasses);
        setSpecies(loadedSpecies);
        setBackgrounds(loadedBackgrounds);
      })
      .catch(() => {
        // Ignore teardown-time loader cancellation in tests.
      });

    return () => {
      cancelled = true;
    };
  }, [systemId]);

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<T>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...nextDocument,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const replaceSystem = useCallback(
    (nextSystem: T) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...document,
        system: nextSystem,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [document, onUpdate]
  );

  const update = useCallback(
    (patch: Partial<T>) => {
      replaceSystem({ ...d, ...patch } as T);
    },
    [d, replaceSystem]
  );

  const loadSpells = useCallback(async () => {
    if (spellsLoaded) {
      return;
    }

    const loadedSpells = await loadSpellsForSystem(systemId);
    setSpells(loadedSpells);
    setSpellsLoaded(true);
  }, [spellsLoaded, systemId]);

  const loadEquipment = useCallback(async () => {
    if (equipmentLoaded) {
      return;
    }

    const loadedEquipment = await loadEquipmentForSystem(systemId);
    setEquipmentItems(loadedEquipment);
    setEquipmentLoaded(true);
  }, [equipmentLoaded, systemId]);

  const loadFeatDefs = useCallback(async () => {
    if (featsLoaded) {
      return;
    }

    const loadedFeats = await loadFeatsForSystem(systemId);
    setFeatDefs(loadedFeats);
    setFeatsLoaded(true);
  }, [featsLoaded, systemId]);

  const loadFeatureOptions = useCallback(async () => {
    if (!showFeatureOptionBrowser || featureOptionsLoaded) {
      return;
    }

    const loadedOptions = await loadFeatureOptionsForSystem(systemId);
    setFeatureOptions(loadedOptions);
    setFeatureOptionsLoaded(true);
  }, [featureOptionsLoaded, showFeatureOptionBrowser, systemId]);

  useEffect(() => {
    if (!showFeatBrowser || featsLoaded || d.feats.length === 0) {
      return;
    }

    void loadFeatDefs().catch(() => {
      // Ignore teardown-time loader cancellation in tests.
    });
  }, [d.feats.length, featsLoaded, loadFeatDefs, showFeatBrowser]);

  useEffect(() => {
    if (!showFeatureOptionBrowser || featureOptionsLoaded) {
      return;
    }

    void loadFeatureOptions().catch(() => {
      // Ignore teardown-time loader cancellation in tests.
    });
  }, [featureOptionsLoaded, loadFeatureOptions, showFeatureOptionBrowser]);

  const loadMonsters = useCallback(async () => {
    if (monstersLoaded) {
      return;
    }

    const loadedMonsters = await loadMonstersForSystem(systemId);
    setMonsters(loadedMonsters);
    setMonstersLoaded(true);
  }, [monstersLoaded, systemId]);

  const runClassTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<T>) => {
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

  const runFeatTemplateUpdate = useCallback(
    (updater: () => CharacterDocument<T>) => {
      try {
        setFeatTemplateError(null);
        replaceDocument(updater());
      } catch (error) {
        setFeatTemplateError(
          error instanceof Error ? error.message : 'Unable to update feat automation.'
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

      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, level, {
          mode: 'replace',
          targetClassId,
        })
      );
    },
    [classes, document, runClassTemplateUpdate]
  );

  const handleClassLevelChange = useCallback(
    (classId: string, value: string) => {
      const classData = classes.find((entry) => entry.id === classId);
      if (!classData) {
        return;
      }

      runClassTemplateUpdate(() =>
        applyDnd5eClassTemplate(document, classData, parseNum(value, 1), {
          mode: 'replace',
          targetClassId: classId,
        })
      );
    },
    [classes, document, runClassTemplateUpdate]
  );

  const handleSubclassChange = useCallback(
    (classId: string, value: string) => {
      runClassTemplateUpdate(() =>
        applyDnd5eSubclassTemplate(document, classId, value || undefined)
      );
    },
    [document, runClassTemplateUpdate]
  );

  const handleAddClass = useCallback(() => {
    if (!pendingClassId) {
      return;
    }

    const classData = classes.find((entry) => entry.id === pendingClassId);
    if (!classData) {
      return;
    }

    runClassTemplateUpdate(() =>
      applyDnd5eClassTemplate(document, classData, parseNum(pendingClassLevel, 1), {
        mode: 'add',
      })
    );
  }, [classes, document, pendingClassId, pendingClassLevel, runClassTemplateUpdate]);

  const handleRemoveClass = useCallback(
    (classId: string) => {
      runClassTemplateUpdate(() => removeDnd5eClassTemplate(document, classId));
    },
    [document, runClassTemplateUpdate]
  );

  const handleSpeciesChange = (speciesId: string) => {
    if (!speciesId) {
      update({ speciesId: undefined } as Partial<T>);
      return;
    }

    const speciesData = species.find((entry) => entry.id === speciesId);
    if (!speciesData) {
      update({ speciesId } as Partial<T>);
      return;
    }

    const previousSpecies = species.find((entry) => entry.id === d.speciesId);
    replaceDocument(applyDnd5eSpeciesTemplate(document, speciesData, previousSpecies));
  };

  const handleBackgroundChange = (backgroundId: string) => {
    if (!backgroundId) {
      update({ backgroundId: undefined } as Partial<T>);
      return;
    }

    const background = backgrounds.find((entry) => entry.id === backgroundId);
    if (!background) {
      update({ backgroundId } as Partial<T>);
      return;
    }

    replaceDocument(applyDnd5eBackgroundTemplate(document, background, selectedBackground));
  };

  const toggleSkillProficiency = (skillId: string) => {
    const current = d.skillProficiencies[skillId]?.level || 'none';
    let next: 'none' | 'proficient' | 'expertise' = 'none';
    if (current === 'none') next = 'proficient';
    else if (current === 'proficient') next = 'expertise';

    const nextProficiencies = { ...d.skillProficiencies };
    if (next === 'none') {
      delete nextProficiencies[skillId];
    } else {
      nextProficiencies[skillId] = { level: next, source: ['manual'] };
    }

    update({ skillProficiencies: nextProficiencies } as Partial<T>);
  };

  const toggleSaveProficiency = (abilityId: string) => {
    const hasProficiency = d.savingThrowProficiencies.includes(abilityId);
    update({
      savingThrowProficiencies: hasProficiency
        ? d.savingThrowProficiencies.filter((entry) => entry !== abilityId)
        : [...d.savingThrowProficiencies, abilityId],
    } as Partial<T>);
  };

  const handleFeatureUse = (featureId: string, delta: number) => {
    update({
      features: d.features.map((feature) => {
        if (!feature.uses || feature.id !== featureId) {
          return feature;
        }

        return {
          ...feature,
          uses: {
            ...feature.uses,
            current: Math.max(0, Math.min(feature.uses.max, feature.uses.current + delta)),
          },
        };
      }),
    } as Partial<T>);
  };

  const handleHitDiceChange = (index: number, delta: number) => {
    update({
      hitDice: d.hitDice.map((pool, poolIndex) =>
        poolIndex === index
          ? {
              ...pool,
              remaining: Math.max(0, Math.min(pool.total, pool.remaining + delta)),
            }
          : pool
      ),
    } as Partial<T>);
  };

  const handleSpellSlotChange = (level: number, delta: number) => {
    if (!d.spellcasting) {
      return;
    }

    const slot = d.spellcasting.spellSlots[level as keyof SpellSlots];
    const nextUsed = Math.max(0, Math.min(slot.max, slot.used + delta));

    update({
      spellcasting: {
        ...d.spellcasting,
        spellSlots: {
          ...d.spellcasting.spellSlots,
          [level]: { ...slot, used: nextUsed },
        },
      },
    } as Partial<T>);
  };

  const handleDamageHeal = (amount: number, type: 'damage' | 'heal') => {
    const systemDef = systemRegistry.get(document.systemId);
    if (!systemDef || !onUpdate) {
      return;
    }

    const nextDocument = systemDef.engine.applyDamage(
      document as CharacterDocument<SystemDataModel>,
      type === 'damage' ? amount : -amount,
      type === 'damage' ? 'damage' : 'healing'
    );
    onUpdate({ ...nextDocument, updatedAt: new Date() });
  };

  const handleEquipmentSelect = (item: Item) => {
    const existingInventoryIndex = d.inventory.findIndex((entry) => entry.itemId === item.id);
    const nextInventory =
      existingInventoryIndex >= 0
        ? d.inventory.map((entry, index) =>
            index === existingInventoryIndex ? { ...entry, quantity: entry.quantity + 1 } : entry
          )
        : [...d.inventory, { itemId: item.id, quantity: 1, customName: item.name }];

    const equippedItem = toEquippedItem(item);
    const nextEquipment = equippedItem
      ? [...d.equipment.filter((entry) => entry.slot !== equippedItem.slot), equippedItem]
      : d.equipment;

    update({
      inventory: nextInventory,
      equipment: nextEquipment,
    } as Partial<T>);
  };

  const handleSpellSelect = (spell: Spell) => {
    if (!d.spellcasting || d.spellcasting.spellsKnown.includes(spell.id)) {
      return;
    }

    update({
      spellcasting: {
        ...d.spellcasting,
        spellsKnown: [...d.spellcasting.spellsKnown, spell.id],
      },
    } as Partial<T>);
  };

  const handleFeatSelect = useCallback(
    (feat: FeatDefinition) => {
      runFeatTemplateUpdate(() => applyDnd5eFeatTemplate(document, feat));
    },
    [document, runFeatTemplateUpdate]
  );

  const handleFeatRemove = useCallback(
    (featId: string) => {
      runFeatTemplateUpdate(() => removeDnd5eFeatTemplate(document, featId));
    },
    [document, runFeatTemplateUpdate]
  );

  const handleFeatSelectionChange = useCallback(
    (
      featDefinition: FeatDefinition,
      featId: string,
      requirementId: string,
      selectionIndex: number,
      value: string
    ) => {
      const feat = d.feats.find((entry) => entry.id === featId);
      if (!feat) {
        return;
      }

      runFeatTemplateUpdate(() => {
        const baseDocument = removeDnd5eFeatTemplate(document, featId);
        const requirements = getDnd5eFeatAutomationRequirements(featDefinition);
        const requirement = requirements.find((entry) => entry.id === requirementId);
        if (!requirement) {
          return document;
        }

        const resolvedSelections = resolveFeatSelections(
          featDefinition,
          feat,
          baseDocument.system.baseAttributes
        );
        const nextRequirementSelections = [...(resolvedSelections[requirementId] || [])];

        while (nextRequirementSelections.length < requirement.count) {
          nextRequirementSelections.push('');
        }

        nextRequirementSelections[selectionIndex] = value;

        return applyDnd5eFeatTemplate(baseDocument, featDefinition, {
          ...resolvedSelections,
          [requirementId]: nextRequirementSelections.filter(Boolean),
        });
      });
    },
    [d.feats, document, runFeatTemplateUpdate]
  );

  const handleFeatureOptionSelect = useCallback(
    (option: Dnd5eFeatureOptionDefinition) => {
      setFeatureOptionError(null);
      replaceSystem(applyDnd5eFeatureOptionSelection(d, option) as T);
    },
    [d, replaceSystem]
  );

  const handleFeatureOptionRemove = useCallback(
    (selection: Dnd5eFeatureOptionSelection) => {
      setFeatureOptionError(null);
      replaceSystem(removeDnd5eFeatureOptionSelection(d, selection) as T);
    },
    [d, replaceSystem]
  );

  const toggleWeaponMastery = (mastery: string) => {
    if (!enableWeaponMasteries) {
      return;
    }

    const currentMasteries = (d as Dnd5e2024DataModel).weaponMasteries || [];
    const normalized = mastery.toLowerCase();
    const nextMasteries = currentMasteries.includes(normalized)
      ? currentMasteries.filter((entry) => entry !== normalized)
      : [...currentMasteries, normalized];

    update({ weaponMasteries: nextMasteries } as Partial<T>);
  };

  const systemDef = systemRegistry.get(document.systemId);
  const tabsListClassName = enableWeaponMasteries
    ? 'w-full grid grid-cols-3 gap-1 md:grid-cols-5 xl:grid-cols-10'
    : 'w-full grid grid-cols-3 gap-1 md:grid-cols-5 xl:grid-cols-9';
  const totalClassLevels = d.classLevels.reduce((total, classLevel) => total + classLevel.level, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <SheetHeader
        name={document.name}
        onNameChange={
          onUpdate ? (name) => onUpdate({ ...document, name, updatedAt: new Date() }) : undefined
        }
        rightContent={
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Proficiency Bonus</div>
            <div className="text-3xl font-bold text-primary tabular-nums">+{profBonus}</div>
          </div>
        }
      >
        <span>Total Level</span>
        <span className="font-bold text-foreground tabular-nums">{d.level}</span>
        <select
          value={d.speciesId || ''}
          onChange={(event) => handleSpeciesChange(event.target.value)}
          className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
          title="Species"
          disabled={!onUpdate}
        >
          <option value="">Species...</option>
          {species.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
        <select
          value={d.backgroundId || ''}
          onChange={(event) => handleBackgroundChange(event.target.value)}
          className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
          title="Background"
          disabled={!onUpdate}
        >
          <option value="">Background...</option>
          {backgrounds.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
        <span>XP</span>
        <input
          type="number"
          value={d.experiencePoints}
          onChange={(event) =>
            update({ experiencePoints: parseNum(event.target.value, 0) } as Partial<T>)
          }
          className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
          min={0}
          title="Experience points"
          disabled={!onUpdate}
        />
      </SheetHeader>

      <section className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Classes</h2>
            <p className="text-xs text-muted-foreground">
              Starting class stays first. Additional rows use multiclass progression rules.
            </p>
          </div>
          <Badge variant="secondary">Total Level {d.level}</Badge>
        </div>

        {d.classLevels.length > 0 ? (
          <div className="space-y-2">
            {d.classLevels.map((classLevel, index) => {
              const otherLevels = totalClassLevels - classLevel.level;
              const maxLevel = Math.max(1, 20 - otherLevels);
              const classData = classes.find((entry) => entry.id === classLevel.classId);
              const usedClassIds = new Set(
                d.classLevels
                  .filter((entry) => entry.classId !== classLevel.classId)
                  .map((entry) => entry.classId)
              );
              const subclassSelectionUnlocked = classData
                ? canSelectSubclass(classData, classLevel.level)
                : false;
              const subclassCanChange = classData?.subclassSelection?.canChange ?? true;
              const subclassLockedAfterChoice = Boolean(
                classLevel.subclassId && !subclassCanChange
              );
              const subclassHelperText = classData
                ? subclassSelectionUnlocked
                  ? classData.subclassSelection?.flavorText || 'Choose a subclass when available.'
                  : `Subclass unlocks at level ${classData.subclassLevel}.`
                : 'Choose a class to load subclass options.';
              const showSubclassPicker = (classData?.subclasses.length || 0) > 0;

              return (
                <div
                  key={classLevel.classId}
                  className="grid gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {index === 0 ? 'Starting Class' : `Class ${index + 1}`}
                      </span>
                    </div>
                    <select
                      value={classLevel.classId}
                      onChange={(event) =>
                        handleClassRowChange(
                          classLevel.classId,
                          event.target.value,
                          classLevel.level
                        )
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                      title={`Class ${index + 1}`}
                      disabled={!onUpdate}
                    >
                      <option value="">Class...</option>
                      {classes
                        .filter(
                          (entry) => entry.id === classLevel.classId || !usedClassIds.has(entry.id)
                        )
                        .map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            {entry.name}
                          </option>
                        ))}
                    </select>
                    {showSubclassPicker && (
                      <label className="space-y-1 text-sm">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Subclass
                        </span>
                        <select
                          value={classLevel.subclassId || ''}
                          onChange={(event) =>
                            handleSubclassChange(classLevel.classId, event.target.value)
                          }
                          className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                          title={`${classLevel.classId} subclass`}
                          disabled={
                            !onUpdate || !subclassSelectionUnlocked || subclassLockedAfterChoice
                          }
                        >
                          <option value="">
                            {subclassSelectionUnlocked
                              ? 'Choose subclass...'
                              : `Choose at level ${classData?.subclassLevel ?? 1}`}
                          </option>
                          {classData?.subclasses.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-muted-foreground">{subclassHelperText}</p>
                      </label>
                    )}
                  </div>
                  <label className="space-y-1 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Level
                    </span>
                    <input
                      type="number"
                      value={classLevel.level}
                      onChange={(event) =>
                        handleClassLevelChange(classLevel.classId, event.target.value)
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                      min={1}
                      max={maxLevel}
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
                      disabled={!onUpdate || d.classLevels.length <= 1}
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
                onChange={(event) => setPendingClassId(event.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                title="Add class"
                disabled={totalClassLevels >= 20}
              >
                <option value="">Choose class...</option>
                {classes
                  .filter(
                    (entry) => !d.classLevels.some((classLevel) => classLevel.classId === entry.id)
                  )
                  .map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Level
              </span>
              <input
                type="number"
                value={pendingClassLevel}
                onChange={(event) => setPendingClassLevel(event.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                min={1}
                max={Math.max(1, 20 - totalClassLevels)}
                title="New class level"
                disabled={totalClassLevels >= 20}
              />
            </label>
            <div className="flex items-end md:justify-end">
              <Button
                type="button"
                onClick={handleAddClass}
                disabled={!pendingClassId || totalClassLevels >= 20}
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

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <CombatStatCard icon={Shield} title="Armor Class" value={d.armorClass} />
        <CombatStatCard
          icon={Heart}
          title="Hit Points"
          value={`${d.hitPoints.current}/${d.hitPoints.max}`}
        >
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                value={d.hitPoints.current}
                onChange={(event) =>
                  update({
                    hitPoints: {
                      ...d.hitPoints,
                      current: parseNum(event.target.value, 0),
                    },
                  } as Partial<T>)
                }
                className="w-16 text-center text-3xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title="Current hit points"
                disabled={!onUpdate}
              />
              <span className="text-muted-foreground">/</span>
              <input
                type="number"
                value={d.hitPoints.max}
                onChange={(event) =>
                  update({
                    hitPoints: {
                      ...d.hitPoints,
                      max: parseNum(event.target.value, 1),
                    },
                  } as Partial<T>)
                }
                className="w-16 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title="Maximum hit points"
                disabled={!onUpdate}
              />
            </div>
            {d.hitPoints.temp > 0 && (
              <div className="text-xs text-blue-500 tabular-nums">+{d.hitPoints.temp} temp</div>
            )}
            {onUpdate && <DamageHealControl onApply={handleDamageHeal} />}
          </div>
        </CombatStatCard>
        <CombatStatCard icon={Target} title="Initiative" value={formatMod(d.initiative)} />
        <CombatStatCard icon={Sparkles} title="Speed" value={`${d.speed} ft`} />
        <CombatStatCard
          icon={BookOpen}
          title="Spell Slots"
          value={spellSlotCount(d.spellcasting?.spellSlots)}
          subtitle={
            d.spellcasting
              ? `${d.spellcasting.classes.length} casting class(es)`
              : 'No spellcasting'
          }
        />
      </div>

      <RestControls
        exhaustionLevel={d.exhaustionLevel}
        onExhaustionChange={
          onUpdate ? (exhaustionLevel) => update({ exhaustionLevel } as Partial<T>) : undefined
        }
        onShortRest={onUpdate ? () => replaceSystem(applyDnd5eShortRest(d) as T) : undefined}
        onLongRest={onUpdate ? () => replaceSystem(applyDnd5eLongRest(d) as T) : undefined}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DeathSavesTracker
          currentHP={d.hitPoints.current}
          deathSaves={d.deathSaves}
          onChange={onUpdate ? (deathSaves) => update({ deathSaves } as Partial<T>) : undefined}
        />
        <HitDiceTracker
          hitDice={d.hitDice}
          onSpend={onUpdate ? (index) => handleHitDiceChange(index, -1) : undefined}
          onRecover={onUpdate ? (index) => handleHitDiceChange(index, 1) : undefined}
          onLongRest={onUpdate ? () => replaceSystem(applyDnd5eLongRest(d) as T) : undefined}
        />
        {d.spellcasting && (
          <SpellSlotTracker
            slots={d.spellcasting.spellSlots}
            onUseSlot={onUpdate ? (level) => handleSpellSlotChange(level, 1) : undefined}
            onRecoverSlot={onUpdate ? (level) => handleSpellSlotChange(level, -1) : undefined}
            onRecoverAll={
              onUpdate
                ? () => {
                    const refreshedSlots = Object.fromEntries(
                      Object.entries(d.spellcasting!.spellSlots).map(([level, slot]) => [
                        level,
                        { ...slot, used: 0 },
                      ])
                    ) as SpellSlots;
                    update({
                      spellcasting: { ...d.spellcasting!, spellSlots: refreshedSlots },
                    } as Partial<T>);
                  }
                : undefined
            }
          />
        )}
      </div>

      <Tabs defaultValue="abilities">
        <TabsList className={tabsListClassName}>
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="saves" className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Saves
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Features
          </TabsTrigger>
          <TabsTrigger value="spells" className="flex items-center gap-1.5" onClick={loadSpells}>
            <BookOpen className="w-4 h-4" /> Spells
          </TabsTrigger>
          {showFeatBrowser && (
            <TabsTrigger value="feats" className="flex items-center gap-1.5" onClick={loadFeatDefs}>
              <BookOpen className="w-4 h-4" /> Feats
            </TabsTrigger>
          )}
          <TabsTrigger
            value="equipment"
            className="flex items-center gap-1.5"
            onClick={loadEquipment}
          >
            <Backpack className="w-4 h-4" /> Equipment
          </TabsTrigger>
          <TabsTrigger
            value="monsters"
            className="flex items-center gap-1.5"
            onClick={loadMonsters}
          >
            <Skull className="w-4 h-4" /> Monsters
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
          {enableWeaponMasteries && (
            <TabsTrigger value="masteries" className="flex items-center gap-1.5">
              <Crosshair className="w-4 h-4" /> Masteries
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="abilities">
          <AbilityScoreGrid
            attributes={d.baseAttributes}
            names={ABILITY_NAMES}
            planner="dnd5e"
            onUpdate={
              onUpdate
                ? (attributes) => update({ baseAttributes: attributes } as Partial<T>)
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="saves">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" /> Saving Throws
            </h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(ABILITY_NAMES).map(([abilityId, label]) => {
                const modifier =
                  abilityMod(d.baseAttributes[abilityId] ?? 10) +
                  (d.savingThrowProficiencies.includes(abilityId) ? profBonus : 0);

                return (
                  <div
                    key={abilityId}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSaveProficiency(abilityId)}
                        disabled={!onUpdate}
                        className="flex h-5 w-5 items-center justify-center rounded border"
                        title={`Toggle ${label} save proficiency`}
                      >
                        {d.savingThrowProficiencies.includes(abilityId) && (
                          <div className="h-3 w-3 rounded-sm bg-primary" />
                        )}
                      </button>
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground uppercase">{abilityId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold tabular-nums">{formatMod(modifier)}</span>
                      {systemDef && (
                        <DiceRollButton
                          label={`${label} Save`}
                          onRoll={() => systemDef.engine.rollCheck(document, `save-${abilityId}`)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="skills">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" /> Skills
            </h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {SKILLS.map((skill) => {
                const proficiency = d.skillProficiencies[skill.id];
                const isProficient =
                  proficiency?.level === 'proficient' || proficiency?.level === 'expertise';
                const isExpertise =
                  proficiency?.level === 'expertise' || proficiency?.level === 'double';
                const proficiencyMultiplier = isExpertise
                  ? 2
                  : isProficient
                    ? 1
                    : proficiency?.level === 'half'
                      ? 0.5
                      : 0;
                const total =
                  abilityMod(d.baseAttributes[skill.ability] ?? 10) +
                  Math.floor(profBonus * proficiencyMultiplier);

                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSkillProficiency(skill.id)}
                        disabled={!onUpdate}
                        className="flex h-5 w-5 items-center justify-center rounded border text-[10px]"
                        title={`Toggle ${skill.name} proficiency`}
                      >
                        {isExpertise ? 'E' : isProficient ? 'P' : ''}
                      </button>
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-xs uppercase text-muted-foreground">
                          {skill.ability}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold tabular-nums">{formatMod(total)}</span>
                      {systemDef && (
                        <DiceRollButton
                          label={`${skill.name} Check`}
                          onRoll={() => systemDef.engine.rollCheck(document, skill.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <FeaturesSection
              features={d.features}
              onUseFeature={onUpdate ? (featureId) => handleFeatureUse(featureId, -1) : undefined}
              onRecoverFeature={
                onUpdate ? (featureId) => handleFeatureUse(featureId, 1) : undefined
              }
            />
            <ProficiencyListSection
              armor={d.armorProficiencies}
              weapons={d.weaponProficiencies}
              tools={d.toolProficiencies}
              languages={d.languageProficiencies}
            />
          </div>

          {selectedBackground && (
            <section className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{selectedBackground.name}</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Background
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedBackground.feature.name}
              </p>
              {selectedBackground.languageProficiencies && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Language choice remains manual: {selectedBackground.languageProficiencies.label}
                </p>
              )}
            </section>
          )}

          {d.feats.length > 0 && (
            <section className="rounded-lg border bg-card p-4 space-y-2">
              <h3 className="text-lg font-semibold">Selected Feats</h3>
              <p className="text-xs text-muted-foreground">
                Ability score increases and proficiency grants are applied automatically. Other feat
                riders remain manual.
              </p>
              {featTemplateError && (
                <p className="text-sm text-destructive" role="alert">
                  {featTemplateError}
                </p>
              )}
              {d.feats.map((feat) => (
                <div key={feat.id} className="rounded border bg-muted/30 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{feat.name}</div>
                      <div className="text-xs text-muted-foreground">{feat.source}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{feat.description}</p>
                    </div>
                    {onUpdate && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => handleFeatRemove(feat.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {(() => {
                    const featDefinition = featDefinitionsById.get(feat.id);
                    if (!featDefinition) {
                      return null;
                    }

                    const requirements = getDnd5eFeatAutomationRequirements(featDefinition);
                    if (requirements.length === 0) {
                      return null;
                    }

                    const resolvedSelections = resolveFeatSelections(
                      featDefinition,
                      feat,
                      d.baseAttributes
                    );

                    return (
                      <div className="mt-3 space-y-3 rounded border border-dashed bg-background/70 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Automation Choices
                        </div>
                        {requirements.map((requirement) => {
                          const selections = resolvedSelections[requirement.id] || [];

                          return (
                            <div key={`${feat.id}-${requirement.id}`} className="space-y-1.5">
                              <div className="text-sm font-medium">{requirement.label}</div>
                              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: requirement.count }, (_, selectionIndex) => (
                                  <select
                                    key={`${requirement.id}-${selectionIndex}`}
                                    value={selections[selectionIndex] || ''}
                                    onChange={(event) =>
                                      handleFeatSelectionChange(
                                        featDefinition,
                                        feat.id,
                                        requirement.id,
                                        selectionIndex,
                                        event.target.value
                                      )
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    title={`${feat.id} ${requirement.id} selection ${selectionIndex + 1}`}
                                    disabled={!onUpdate}
                                  >
                                    {requirement.options.map((option) => (
                                      <option
                                        key={option.id}
                                        value={option.id}
                                        disabled={optionDisabledForRequirement(
                                          requirement,
                                          selections,
                                          selectionIndex,
                                          option.id
                                        )}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </section>
          )}

          {showFeatureOptionBrowser && (
            <>
              <section className="rounded-lg border bg-card p-4 space-y-2">
                <h3 className="text-lg font-semibold">Selected Feature Options</h3>
                <p className="text-xs text-muted-foreground">
                  These entries are stored separately from class and feat automation and are
                  mirrored into your feature list with explicit provenance.
                </p>
                {featureOptionError && (
                  <p className="text-sm text-destructive" role="alert">
                    {featureOptionError}
                  </p>
                )}
                {selectedFeatureOptions.length > 0 ? (
                  selectedFeatureOptions.map((option) => (
                    <div
                      key={featureOptionSelectionKey(option)}
                      className="rounded border bg-muted/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {getDnd5eFeatureOptionGroupLabel(option.group)} • {option.source}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                            {option.description}
                          </p>
                          {option.prerequisites && option.prerequisites.length > 0 && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Prerequisites: {option.prerequisites.join(', ')}
                            </p>
                          )}
                        </div>
                        {onUpdate && (
                          <button
                            type="button"
                            className="text-xs text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              handleFeatureOptionRemove({ id: option.id, group: option.group })
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No 5e-2014 feature options selected yet.
                  </p>
                )}
              </section>

              {featureOptionsLoaded ? (
                eligibleFeatureOptions.length > 0 ? (
                  <Suspense
                    fallback={
                      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        Loading feature option browser...
                      </div>
                    }
                  >
                    <FeatureOptionBrowser
                      options={eligibleFeatureOptions}
                      selectedOptions={featureOptionSelections}
                      onSelectOption={onUpdate ? handleFeatureOptionSelect : undefined}
                    />
                  </Suspense>
                ) : (
                  <section className="rounded-lg border border-dashed border-input bg-card p-4 text-sm text-muted-foreground">
                    Apply a compatible class or subclass template to browse the matching 5e-2014
                    feature-option catalogs.
                  </section>
                )
              ) : (
                <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                  Loading feature options...
                </section>
              )}
            </>
          )}

          <ConditionPicker
            conditions={d.conditions}
            availableConditions={DND5E_CONDITION_NAMES}
            onChange={onUpdate ? (conditions) => update({ conditions } as Partial<T>) : undefined}
          />
        </TabsContent>

        <TabsContent value="spells" className="space-y-4">
          {d.spellcasting ? (
            <>
              <section className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Known Spells</h3>
                  <Badge variant="secondary">{d.spellcasting.spellsKnown.length}</Badge>
                </div>
                {d.spellcasting.spellsKnown.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No spells selected yet. Use the browser below to add spells.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {d.spellcasting.spellsKnown.map((spellId) => (
                      <button
                        key={spellId}
                        type="button"
                        className={`rounded-full border px-2 py-1 text-xs ${
                          preparedSpellIds.has(spellId)
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-input'
                        }`}
                        onClick={() => {
                          if (!onUpdate || !d.spellcasting) {
                            return;
                          }

                          const nextPrepared = preparedSpellIds.has(spellId)
                            ? d.spellcasting.spellsPrepared.filter((entry) => entry !== spellId)
                            : [...d.spellcasting.spellsPrepared, spellId];
                          update({
                            spellcasting: {
                              ...d.spellcasting,
                              spellsPrepared: nextPrepared,
                            },
                          } as Partial<T>);
                        }}
                        title="Toggle prepared"
                      >
                        {spellNames.get(spellId) || spellId}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {!spellsLoaded ? (
                <div className="py-8 text-center text-muted-foreground">
                  Open the Spells tab to load spell data.
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading spell browser...
                    </div>
                  }
                >
                  <SpellBrowser
                    spells={spells.map((spell) => ({
                      id: spell.id,
                      name: spell.name,
                      level: spell.level,
                      school: spell.school,
                      castingTime: formatCastingTime(spell.castingTime),
                      range: formatRange(spell.range),
                      duration: formatDuration(spell.duration),
                      description: spell.description,
                      classes: spell.classes || [],
                    }))}
                    onSelectSpell={
                      onUpdate
                        ? (spell) => {
                            const selectedSpell = spells.find((entry) => entry.id === spell.id);
                            if (selectedSpell) {
                              handleSpellSelect(selectedSpell);
                            }
                          }
                        : undefined
                    }
                  />
                </Suspense>
              )}
            </>
          ) : (
            <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
              Select a spellcasting class to unlock spell slots and spell browsing.
            </div>
          )}
        </TabsContent>

        {showFeatBrowser && (
          <TabsContent value="feats" className="space-y-4">
            <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              Feat automation applies ability score increases and proficiencies. Other feat riders
              still require manual tracking.
            </div>
            {featTemplateError && (
              <p className="text-sm text-destructive" role="alert">
                {featTemplateError}
              </p>
            )}
            {!featsLoaded ? (
              <div className="py-8 text-center text-muted-foreground">
                Open the Feats tab to load feat data.
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading feat browser...
                  </div>
                }
              >
                <FeatBrowser
                  feats={featDefs.map((feat) => ({
                    id: feat.id,
                    name: feat.name,
                    system: document.systemId,
                    source: feat.source,
                    description: feat.description,
                    benefits: feat.benefits,
                    prerequisites: feat.prerequisites?.map((entry) => ({
                      type: entry.type,
                      description: entry.description || entry.type,
                    })),
                  }))}
                  onSelectFeat={
                    onUpdate
                      ? (feat) => {
                          const selectedFeat = featDefs.find((entry) => entry.id === feat.id);
                          if (selectedFeat) {
                            handleFeatSelect(selectedFeat);
                          }
                        }
                      : undefined
                  }
                />
              </Suspense>
            )}
          </TabsContent>
        )}

        <TabsContent value="equipment" className="space-y-4">
          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading equipment tools...
              </div>
            }
          >
            <CurrencyEditor
              currency={d.currency as unknown as Record<string, number>}
              onChange={
                onUpdate
                  ? (currency) =>
                      update({
                        currency: currency as unknown as typeof d.currency,
                      } as unknown as Partial<T>)
                  : undefined
              }
            />
            <EquippedItemsSection
              equipment={d.equipment}
              onUnequip={
                onUpdate
                  ? (itemId) =>
                      update({
                        equipment: d.equipment.filter((entry) => entry.itemId !== itemId),
                      } as Partial<T>)
                  : undefined
              }
              onToggleAttune={
                onUpdate
                  ? (itemId) =>
                      update({
                        equipment: d.equipment.map((entry) =>
                          entry.itemId === itemId ? { ...entry, attuned: !entry.attuned } : entry
                        ),
                      } as Partial<T>)
                  : undefined
              }
            />
            <InventoryManager
              items={d.inventory.map((entry) => ({
                id: entry.itemId,
                name: entry.customName || equippedNames.get(entry.itemId) || entry.itemId,
                quantity: entry.quantity,
                weight: equipmentItems.find((item) => item.id === entry.itemId)?.weight || 0,
                value: (() => {
                  const matchedItem = equipmentItems.find((item) => item.id === entry.itemId);
                  return matchedItem
                    ? `${matchedItem.cost.amount} ${matchedItem.cost.currency}`
                    : '0 gp';
                })(),
                description: entry.notes,
              }))}
              onAddItem={
                onUpdate
                  ? (item) =>
                      update({
                        inventory: [
                          ...d.inventory,
                          {
                            itemId: item.id,
                            quantity: item.quantity,
                            customName: item.name,
                            notes: item.description,
                          },
                        ],
                      } as Partial<T>)
                  : undefined
              }
              onRemoveItem={
                onUpdate
                  ? (itemId) =>
                      update({
                        inventory: d.inventory.filter((entry) => entry.itemId !== itemId),
                      } as Partial<T>)
                  : undefined
              }
            />
            {!equipmentLoaded ? (
              <div className="py-8 text-center text-muted-foreground">
                Open the Equipment tab to load equipment data.
              </div>
            ) : (
              <EquipmentBrowser
                equipment={equipmentItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  type: item.type,
                  rarity: item.rarity,
                  cost: `${item.cost.amount} ${item.cost.currency}`,
                  weight: item.weight,
                  description: item.description,
                  properties:
                    'properties' in item && Array.isArray(item.properties)
                      ? item.properties.map((property) =>
                          typeof property === 'string' ? property : String(property)
                        )
                      : undefined,
                }))}
                onSelectEquipment={
                  onUpdate
                    ? (item) => {
                        const selectedItem = equipmentItems.find((entry) => entry.id === item.id);
                        if (selectedItem) {
                          handleEquipmentSelect(selectedItem);
                        }
                      }
                    : undefined
                }
              />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="monsters" className="space-y-4">
          {!monstersLoaded ? (
            <div className="py-8 text-center text-muted-foreground">
              Open the Monsters tab to load monster data.
            </div>
          ) : monsters.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No monster dataset is currently available for this system.
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Loading monster browser...
                </div>
              }
            >
              <MonsterBrowser monsters={monsters} />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h3 className="text-lg font-semibold">Identity</h3>
              <div>
                <label className="mb-1 block text-sm font-medium">Appearance</label>
                <textarea
                  value={d.personality?.appearance || ''}
                  onChange={(event) =>
                    update({
                      personality: {
                        ...d.personality,
                        appearance: event.target.value,
                      },
                    } as Partial<T>)
                  }
                  className="min-h-[90px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Physical appearance..."
                  disabled={!onUpdate}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Backstory</label>
                <textarea
                  value={d.personality?.backstory || ''}
                  onChange={(event) =>
                    update({
                      personality: {
                        ...d.personality,
                        backstory: event.target.value,
                      },
                    } as Partial<T>)
                  }
                  className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Character backstory..."
                  disabled={!onUpdate}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h3 className="text-lg font-semibold">Personality</h3>
              {(['traits', 'ideals', 'bonds', 'flaws'] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
                  <textarea
                    value={d.personality?.[field] || ''}
                    onChange={(event) =>
                      update({
                        personality: {
                          ...d.personality,
                          [field]: event.target.value,
                        },
                      } as Partial<T>)
                    }
                    className="min-h-[70px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder={`${field}...`}
                    disabled={!onUpdate}
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  value={d.notes || ''}
                  onChange={(event) => update({ notes: event.target.value } as Partial<T>)}
                  className="min-h-[110px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Additional notes..."
                  disabled={!onUpdate}
                />
              </div>
            </div>
          </section>
        </TabsContent>

        {enableWeaponMasteries && (
          <TabsContent value="masteries">
            <section className="rounded-lg border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Weapon Masteries</h3>
                <Badge variant="secondary">
                  {((d as Dnd5e2024DataModel).weaponMasteries || []).length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {WEAPON_MASTERY_OPTIONS.map((mastery) => {
                  const active = ((d as Dnd5e2024DataModel).weaponMasteries || []).includes(
                    mastery.toLowerCase()
                  );
                  return (
                    <button
                      key={mastery}
                      type="button"
                      onClick={() => toggleWeaponMastery(mastery)}
                      disabled={!onUpdate}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-input hover:border-primary/40'
                      }`}
                    >
                      {mastery}
                    </button>
                  );
                })}
              </div>
            </section>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
