import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import {
  Pf2eDataModel,
  Pf2eProficiency,
  Pf2eProficiencyTier,
  Pf2eSpellcasting,
  tierBonus,
} from './data-model';
import {
  Shield,
  Heart,
  Star,
  Eye,
  Zap,
  Swords,
  X,
  User,
  BookOpen,
  Backpack,
  StickyNote,
  Sparkles,
  Sword,
} from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../utils/math';
import { SKILL_ABILITIES, SAVE_ABILITIES } from './constants';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { InventoryManager } from '../../components/InventoryManager';
import { DiceRollButton } from '../../components/DiceRollButton';
import { DamageHealControl } from '../../components/DamageHealControl';
import { CurrencyEditor } from '../../components/CurrencyEditor';
import { ConditionPicker } from '../../components/ConditionPicker';
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
  loadArchetypesForSystem,
  loadEquipmentForSystem,
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../../utils/dataLoader';
import { formatCastingTime, formatRange, formatDuration } from '../../utils/formatters';
import { systemRegistry } from '../../registry';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Spell } from '../../types/magic/spells';
import type { Item } from '../../types/equipment/items';
import type { Archetype } from '../../types/character-options/archetypes';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { GameSystemId } from '../../types/game-systems';
import type { Pf2eBackgroundDefinition } from '../../data/pathfinder/2e/backgrounds';
import {
  applyPf2eAncestryTemplate,
  applyPf2eArchetypeTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
  removePf2eArchetypeTemplate,
} from '../../utils/pf2eTemplate';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const PF2E_CONDITIONS: string[] = [
  'Blinded',
  'Broken',
  'Clumsy',
  'Concealed',
  'Confused',
  'Controlled',
  'Dazzled',
  'Deafened',
  'Doomed',
  'Drained',
  'Dying',
  'Encumbered',
  'Enfeebled',
  'Fascinated',
  'Fatigued',
  'Flat-Footed',
  'Fleeing',
  'Frightened',
  'Grabbed',
  'Hidden',
  'Immobilized',
  'Invisible',
  'Observed',
  'Paralyzed',
  'Persistent Damage',
  'Petrified',
  'Prone',
  'Quickened',
  'Restrained',
  'Sickened',
  'Slowed',
  'Stunned',
  'Stupefied',
  'Unconscious',
  'Undetected',
  'Wounded',
];

const PF2E_VALUED_CONDITIONS = new Set([
  'clumsy',
  'doomed',
  'drained',
  'dying',
  'enfeebled',
  'frightened',
  'sickened',
  'slowed',
  'stunned',
  'stupefied',
  'wounded',
]);

const TIER_LABELS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'U',
  trained: 'T',
  expert: 'E',
  master: 'M',
  legendary: 'L',
};

const TIER_COLORS: Record<Pf2eProficiencyTier, string> = {
  untrained: 'text-muted-foreground',
  trained: 'text-blue-500',
  expert: 'text-purple-500',
  master: 'text-amber-500',
  legendary: 'text-red-500',
};

const TIER_ORDER: Pf2eProficiencyTier[] = ['untrained', 'trained', 'expert', 'master', 'legendary'];

function nextTier(current: Pf2eProficiencyTier): Pf2eProficiencyTier {
  const idx = TIER_ORDER.indexOf(current);
  return TIER_ORDER[(idx + 1) % TIER_ORDER.length];
}

function shortRestSpellcasting(spellcasting?: Pf2eSpellcasting): Pf2eSpellcasting | undefined {
  if (!spellcasting) return spellcasting;
  return {
    ...spellcasting,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: Math.min(spellcasting.focusPoints.max, spellcasting.focusPoints.current + 1),
    },
  };
}

function longRestSpellcasting(spellcasting?: Pf2eSpellcasting): Pf2eSpellcasting | undefined {
  if (!spellcasting) return spellcasting;

  const slots: Record<number, { max: number; used: number }> = {};
  for (const [level, slot] of Object.entries(spellcasting.spellSlots)) {
    slots[Number(level)] = { ...slot, used: 0 };
  }

  return {
    ...spellcasting,
    spellSlots: slots,
    focusPoints: {
      ...spellcasting.focusPoints,
      current: spellcasting.focusPoints.max,
    },
  };
}

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const Pf2eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const d = document.system;

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<Pf2eDataModel>) => {
      if (!onUpdate) return;
      onUpdate({ ...nextDocument, updatedAt: new Date() });
    },
    [onUpdate]
  );

  const update = useCallback(
    (patch: Partial<Pf2eDataModel>) => {
      if (!onUpdate) return;
      onUpdate({ ...document, system: { ...d, ...patch }, updatedAt: new Date() });
    },
    [document, d, onUpdate]
  );

  const ProfBadge = ({ prof, onClick }: { prof: Pf2eProficiency; onClick?: () => void }) => (
    <button
      onClick={onClick}
      disabled={!onUpdate}
      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${TIER_COLORS[prof.tier]} ${onUpdate ? 'hover:bg-muted cursor-pointer' : ''}`}
      title={`${prof.tier} (${tierBonus(prof.tier) > 0 ? `+${prof.total}` : '0'}). Click to cycle.`}
    >
      {TIER_LABELS[prof.tier]}
    </button>
  );

  const cycleSkillTier = (skillId: string) => {
    const current = d.skillProficiencies[skillId] ?? {
      tier: 'untrained' as Pf2eProficiencyTier,
      total: 0,
    };
    update({
      skillProficiencies: {
        ...d.skillProficiencies,
        [skillId]: { ...current, tier: nextTier(current.tier) },
      },
    });
  };

  const cycleLoreTier = (loreId: string) => {
    const current = d.loreProficiencies[loreId] ?? {
      tier: 'untrained' as Pf2eProficiencyTier,
      total: 0,
    };
    update({
      loreProficiencies: {
        ...d.loreProficiencies,
        [loreId]: { ...current, tier: nextTier(current.tier) },
      },
    });
  };

  const cycleSaveTier = (saveId: keyof typeof d.saveProficiencies) => {
    const current = d.saveProficiencies[saveId];
    update({
      saveProficiencies: {
        ...d.saveProficiencies,
        [saveId]: { ...current, tier: nextTier(current.tier) },
      },
    });
  };

  const trainedSkillCount = Object.keys(d.skillProficiencies).filter((k) => {
    const p = d.skillProficiencies[k];
    return p && p.tier !== 'untrained';
  }).length;

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
  const [ancestries, setAncestries] = useState<Species[]>([]);
  const [backgrounds, setBackgrounds] = useState<Pf2eBackgroundDefinition[]>([]);
  const [backgroundsLoaded, setBackgroundsLoaded] = useState(false);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [archetypesLoaded, setArchetypesLoaded] = useState(false);
  const loadBackgrounds = useCallback(async () => {
    if (backgroundsLoaded) return;
    const loaded = await loadPf2eBackgroundsForSystem(document.systemId as GameSystemId);
    setBackgrounds(loaded);
    setBackgroundsLoaded(true);
  }, [backgroundsLoaded, document.systemId]);
  const loadArchetypes = useCallback(async () => {
    if (archetypesLoaded) return;
    const loaded = await loadArchetypesForSystem(document.systemId as GameSystemId);
    setArchetypes(loaded);
    setArchetypesLoaded(true);
  }, [archetypesLoaded, document.systemId]);
  const loadOptions = useCallback(async () => {
    if (classes.length === 0) {
      const [c, a] = await Promise.all([
        loadClassesForSystem(document.systemId as GameSystemId),
        loadSpeciesForSystem(document.systemId as GameSystemId),
      ]);
      setClasses(c);
      setAncestries(a);
    }
  }, [classes.length, document.systemId]);
  useEffect(() => {
    void loadBackgrounds();
  }, [loadBackgrounds]);
  const selectedArchetypeIds = d.selectedArchetypeIds || [];
  const selectedClass = classes.find((entry) => entry.id === d.classId);
  const selectedAncestry = ancestries.find((ancestry) => ancestry.id === d.ancestryId);
  const selectedHeritage = selectedAncestry?.subraces?.find(
    (heritage) => heritage.id === d.heritageId
  );
  const selectedBackground = backgrounds.find((background) => background.id === d.backgroundId);
  const selectedArchetypes = archetypes.filter((archetype) =>
    selectedArchetypeIds.includes(archetype.id)
  );
  const orderedArchetypes = [...archetypes].sort((left, right) => {
    const leftMatches = left.parentClassId === d.classId ? 1 : 0;
    const rightMatches = right.parentClassId === d.classId ? 1 : 0;
    if (leftMatches !== rightMatches) {
      return rightMatches - leftMatches;
    }
    return left.name.localeCompare(right.name);
  });
  const heritageOptions = selectedAncestry?.subraces ?? [];
  const loreIds = Object.keys(d.loreProficiencies || {});
  const classDcAbility =
    d.keyAbility && d.baseAttributes[d.keyAbility] != null ? d.keyAbility : null;
  const classDcScore =
    classDcAbility != null
      ? d.baseAttributes[classDcAbility]
      : Math.max(...Object.values(d.baseAttributes));

  const handleClassChange = (classId: string) => {
    const previousClass = selectedClass;
    if (!classId) {
      replaceDocument(applyPf2eClassTemplate(document, undefined, d.level, previousClass));
      return;
    }

    const classData = classes.find((entry) => entry.id === classId);
    if (!classData) {
      update({ classId });
      return;
    }

    replaceDocument(applyPf2eClassTemplate(document, classData, d.level, previousClass));
  };

  const handleLevelChange = (value: string) => {
    const nextLevel = parseNum(value, 1);
    if (!selectedClass) {
      update({ level: nextLevel });
      return;
    }

    replaceDocument(applyPf2eClassTemplate(document, selectedClass, nextLevel, selectedClass));
  };

  const handleAncestryChange = (ancestryId: string) => {
    const previousSelection = { ancestry: selectedAncestry, heritage: selectedHeritage };
    if (!ancestryId) {
      replaceDocument(applyPf2eAncestryTemplate(document, undefined, undefined, previousSelection));
      return;
    }

    const ancestry = ancestries.find((entry) => entry.id === ancestryId);
    if (!ancestry) {
      update({ ancestryId, heritageId: undefined });
      return;
    }

    replaceDocument(applyPf2eAncestryTemplate(document, ancestry, undefined, previousSelection));
  };

  const handleHeritageChange = (heritageId: string) => {
    if (!selectedAncestry) {
      update({ heritageId: heritageId || undefined });
      return;
    }

    const heritage = selectedAncestry.subraces?.find((entry) => entry.id === heritageId);
    replaceDocument(
      applyPf2eAncestryTemplate(document, selectedAncestry, heritage, {
        ancestry: selectedAncestry,
        heritage: selectedHeritage,
      })
    );
  };

  const handleBackgroundChange = (backgroundId: string) => {
    const background = backgrounds.find((entry) => entry.id === backgroundId);
    replaceDocument(applyPf2eBackgroundTemplate(document, background, selectedBackground));
  };

  const handleArchetypeToggle = (archetype: Archetype) => {
    replaceDocument(
      selectedArchetypeIds.includes(archetype.id)
        ? removePf2eArchetypeTemplate(document, archetype)
        : applyPf2eArchetypeTemplate(document, archetype)
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-1 flex-1">
          <input
            value={document.name}
            onChange={(e) =>
              onUpdate?.({ ...document, name: e.target.value, updatedAt: new Date() })
            }
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
            disabled={!onUpdate}
            title="Character name"
            placeholder="Character name"
          />
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <Badge variant="info">Level {d.level}</Badge>
            <input
              type="number"
              value={d.level}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary font-bold tabular-nums"
              min={1}
              max={20}
              disabled={!onUpdate}
              title="Character level"
            />
            <select
              value={d.classId || ''}
              onChange={(e) => handleClassChange(e.target.value)}
              onFocus={loadOptions}
              className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
              disabled={!onUpdate}
              title="Class"
            >
              <option value="">Class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={d.ancestryId || ''}
              onChange={(e) => handleAncestryChange(e.target.value)}
              onFocus={loadOptions}
              className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
              disabled={!onUpdate}
              title="Ancestry"
            >
              <option value="">Ancestry...</option>
              {ancestries.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <select
              value={d.heritageId || ''}
              onChange={(e) => handleHeritageChange(e.target.value)}
              className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
              disabled={!onUpdate || heritageOptions.length === 0}
              title="Heritage"
            >
              <option value="">
                {heritageOptions.length === 0 ? 'Heritage...' : 'Select heritage...'}
              </option>
              {heritageOptions.map((heritage) => (
                <option key={heritage.id} value={heritage.id}>
                  {heritage.name}
                </option>
              ))}
            </select>
            <select
              value={d.backgroundId || ''}
              onChange={(e) => handleBackgroundChange(e.target.value)}
              onFocus={loadBackgrounds}
              className="px-2 py-0.5 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
              disabled={!onUpdate}
              title="Background"
            >
              <option value="">
                {backgroundsLoaded ? 'Background...' : 'Loading backgrounds...'}
              </option>
              {backgrounds.map((background) => (
                <option key={background.id} value={background.id}>
                  {background.name}
                </option>
              ))}
            </select>
            <span>XP</span>
            <input
              type="number"
              value={d.experiencePoints}
              onChange={(e) => update({ experiencePoints: parseNum(e.target.value, 0) })}
              className="w-20 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              min={0}
              disabled={!onUpdate}
              title="Experience points"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Hero Points */}
          <div className="text-center">
            <div className="text-xs font-medium text-muted-foreground mb-1">Hero Points</div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => update({ heroPoints: i < d.heroPoints ? i : i + 1 })}
                  disabled={!onUpdate}
                  className={`w-7 h-7 rounded-full border-2 transition-colors ${
                    i < d.heroPoints
                      ? 'bg-amber-400 border-amber-500 text-amber-900'
                      : 'border-input hover:border-amber-400'
                  }`}
                  title={`${d.heroPoints}/3 Hero Points`}
                >
                  <Star className="w-3 h-3 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats — always visible */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">AC</div>
          <div className="text-3xl font-bold tabular-nums">{d.armorClass}</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" /> HP
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={d.hitPoints.current}
              onChange={(e) =>
                update({ hitPoints: { ...d.hitPoints, current: parseNum(e.target.value, 0) } })
              }
              className="w-14 text-center text-2xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!onUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <input
              type="number"
              value={d.hitPoints.max}
              onChange={(e) =>
                update({ hitPoints: { ...d.hitPoints, max: parseNum(e.target.value, 1) } })
              }
              className="w-14 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!onUpdate}
              title="Max HP"
            />
          </div>
          {d.hitPoints.temp > 0 && (
            <div className="text-xs text-blue-500 tabular-nums">+{d.hitPoints.temp} temp</div>
          )}
          {onUpdate && (
            <DamageHealControl
              onApply={(amount, type) => {
                const newCurrent =
                  type === 'damage'
                    ? Math.max(0, d.hitPoints.current - amount)
                    : Math.min(d.hitPoints.max, d.hitPoints.current + amount);
                update({ hitPoints: { ...d.hitPoints, current: newCurrent } });
              }}
            />
          )}
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Speed</div>
          <div className="text-2xl font-bold tabular-nums">{d.speed} ft</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" /> Perception
          </div>
          <div className="flex items-center justify-center gap-2">
            <ProfBadge
              prof={d.perceptionProficiency}
              onClick={() =>
                update({
                  perceptionProficiency: {
                    ...d.perceptionProficiency,
                    tier: nextTier(d.perceptionProficiency.tier),
                  },
                })
              }
            />
            <span className="text-xl font-bold tabular-nums">
              {formatMod(abilityMod(d.baseAttributes.wis ?? 10) + d.perceptionProficiency.total)}
            </span>
            <DiceRollButton
              label="Perception"
              onRoll={() =>
                systemRegistry.get(document.systemId)!.engine.rollCheck(document, 'perception')
              }
            />
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Swords className="w-3 h-3" /> Class DC
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {10 + d.level + 2 + abilityMod(classDcScore)}
          </div>
        </div>
      </div>

      <RestControls
        showExhaustion={false}
        onShortRest={
          onUpdate
            ? () => {
                const recovered = Math.max(1, Math.floor(d.level / 2));
                update({
                  hitPoints: {
                    ...d.hitPoints,
                    current: Math.min(d.hitPoints.max, d.hitPoints.current + recovered),
                  },
                  spellcasting: shortRestSpellcasting(d.spellcasting),
                });
              }
            : undefined
        }
        onLongRest={
          onUpdate
            ? () => {
                update({
                  hitPoints: {
                    ...d.hitPoints,
                    current: d.hitPoints.max,
                    temp: 0,
                  },
                  heroPoints: Math.max(1, d.heroPoints),
                  spellcasting: longRestSpellcasting(d.spellcasting),
                });
              }
            : undefined
        }
      />

      {/* Tabbed Sections */}
      <Tabs defaultValue="abilities">
        <TabsList className="w-full grid grid-cols-10">
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="saves" className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Saves
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Skills
            {trainedSkillCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {trainedSkillCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="feats-conditions" className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Feats
            {d.feats.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {d.feats.length}
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
          <TabsTrigger
            value="archetypes"
            className="flex items-center gap-1.5"
            onClick={loadArchetypes}
          >
            <Shield className="w-4 h-4" /> Archetypes
            {selectedArchetypeIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {selectedArchetypeIds.length}
              </Badge>
            )}
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
            {d.inventory.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {d.inventory.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abilities">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(ABILITY_NAMES).map(([key, name]) => {
                const score = d.baseAttributes[key] ?? 10;
                const mod = abilityMod(score);
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {key}
                    </span>
                    <input
                      type="number"
                      value={score}
                      onChange={(e) =>
                        update({
                          baseAttributes: {
                            ...d.baseAttributes,
                            [key]: parseNum(e.target.value, 10),
                          },
                        })
                      }
                      className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                      disabled={!onUpdate}
                      title={`${name} score`}
                    />
                    <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
                    <span className="text-xs text-muted-foreground">{name}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Ancestry Summary
                </div>
                <div className="text-sm">
                  <span className="font-medium">Size:</span> {d.size}
                </div>
                <div className="text-sm mt-2">
                  <span className="font-medium">Languages:</span>{' '}
                  {d.languages.length > 0 ? d.languages.join(', ') : 'None'}
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Automation Notes
                </div>
                <p className="text-sm text-muted-foreground">
                  Choice-based ancestry and background boosts still require manual assignment in
                  this sheet.
                </p>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="saves">
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Saving Throws
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(SAVE_ABILITIES).map(([saveId, attr]) => {
                const save = d.saveProficiencies[saveId as keyof typeof d.saveProficiencies];
                const mod = abilityMod(d.baseAttributes[attr] ?? 10);
                const total = mod + (save?.total ?? 0);
                return (
                  <div
                    key={saveId}
                    className="flex items-center justify-between p-3 bg-card border rounded-lg transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <ProfBadge
                        prof={save}
                        onClick={() => cycleSaveTier(saveId as keyof typeof d.saveProficiencies)}
                      />
                      <div>
                        <div className="font-medium capitalize">{saveId}</div>
                        <div className="text-xs text-muted-foreground uppercase">{attr}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold tabular-nums">{formatMod(total)}</span>
                      <DiceRollButton
                        label={`${saveId} Save`}
                        onRoll={() =>
                          systemRegistry.get(document.systemId)!.engine.rollCheck(document, saveId)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="skills">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(SKILL_ABILITIES).map(([skillId, attr]) => {
                const prof = d.skillProficiencies[skillId] ?? {
                  tier: 'untrained' as Pf2eProficiencyTier,
                  total: 0,
                };
                const mod = abilityMod(d.baseAttributes[attr] ?? 10);
                const total = mod + prof.total;
                return (
                  <div
                    key={skillId}
                    className="flex items-center justify-between p-2 bg-card border rounded transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <ProfBadge prof={prof} onClick={() => cycleSkillTier(skillId)} />
                      <div>
                        <span className="font-medium capitalize">{skillId.replace(/-/g, ' ')}</span>
                        <span className="text-xs text-muted-foreground ml-1 uppercase">
                          ({attr})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold min-w-[3rem] text-right tabular-nums">
                        {formatMod(total)}
                      </span>
                      <DiceRollButton
                        label={`${skillId} Check`}
                        onRoll={() =>
                          systemRegistry.get(document.systemId)!.engine.rollCheck(document, skillId)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {loreIds.length > 0 && (
              <div className="bg-card border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">Lore</h4>
                {loreIds.map((loreId) => {
                  const prof = d.loreProficiencies[loreId];
                  const total = abilityMod(d.baseAttributes.int ?? 10) + (prof?.total ?? 0);
                  return (
                    <div
                      key={loreId}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <ProfBadge prof={prof} onClick={() => cycleLoreTier(loreId)} />
                        <div className="font-medium capitalize">{loreId.replace(/-/g, ' ')}</div>
                      </div>
                      <span className="font-bold min-w-[3rem] text-right tabular-nums">
                        {formatMod(total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="feats-conditions">
          {/* Conditions */}
          <ConditionPicker
            conditions={d.conditions}
            availableConditions={PF2E_CONDITIONS}
            valuedConditions={PF2E_VALUED_CONDITIONS}
            onChange={onUpdate ? (conditions) => update({ conditions }) : undefined}
          />

          <section className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <div className="space-y-2">
              {d.features.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No ancestry, class, or archetype features yet.
                </p>
              ) : (
                d.features.map((feature) => (
                  <div
                    key={`${feature.id}-${feature.source}`}
                    className="p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                  >
                    <div className="font-medium">
                      {feature.name}
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                        {feature.source}
                      </Badge>
                    </div>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Feats */}
          <section className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Feats</h3>
            <div className="space-y-2">
              {d.feats.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No feats selected.</p>
              ) : (
                d.feats.map((feat) => (
                  <div
                    key={feat.id}
                    className="flex items-start justify-between p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">
                        {feat.name}{' '}
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                          Lv {feat.level}
                        </Badge>{' '}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {feat.type}
                        </Badge>
                      </div>
                      {feat.description && (
                        <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>
                      )}
                    </div>
                    {onUpdate && (
                      <button
                        onClick={() => update({ feats: d.feats.filter((f) => f.id !== feat.id) })}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                        title="Remove feat"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
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

        <TabsContent value="archetypes">
          {!archetypesLoaded ? (
            <div className="text-center py-8 text-muted-foreground">
              Click to load archetype options...
            </div>
          ) : (
            <div className="space-y-4">
              <section className="bg-card p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Selected Archetypes</h3>
                  <Badge variant="secondary">{selectedArchetypeIds.length}</Badge>
                </div>
                {selectedArchetypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No archetypes selected.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedArchetypes.map((archetype) => (
                      <div
                        key={archetype.id}
                        className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded border"
                      >
                        <div>
                          <div className="font-medium">
                            {archetype.name}
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                              {archetype.parentClassId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {archetype.description}
                          </p>
                        </div>
                        {onUpdate && (
                          <button
                            onClick={() => handleArchetypeToggle(archetype)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Remove archetype"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-card p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">Available Archetypes</h3>
                <div className="space-y-2">
                  {orderedArchetypes.map((archetype) => {
                    const isSelected = selectedArchetypeIds.includes(archetype.id);
                    const classMatch = archetype.parentClassId === d.classId;
                    return (
                      <div
                        key={archetype.id}
                        className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">
                            {archetype.name}
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                              {archetype.parentClassId}
                            </Badge>
                            {classMatch && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-2">
                                Matches class
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {archetype.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {archetype.features.map((feature) => (
                              <span
                                key={`${archetype.id}-${feature.level}-${feature.name}`}
                                className="rounded-full border border-dashed border-input px-2 py-1"
                              >
                                Level {feature.level}: {feature.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {onUpdate && (
                          <button
                            onClick={() => handleArchetypeToggle(archetype)}
                            className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                              isSelected
                                ? 'border-destructive/40 text-destructive hover:border-destructive'
                                : 'hover:border-primary hover:text-primary'
                            }`}
                          >
                            {isSelected ? 'Remove' : 'Add'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </TabsContent>

        <TabsContent value="spells">
          {/* Spellcasting Info */}
          {d.spellcasting &&
            (() => {
              const sc = d.spellcasting;
              return (
                <section className="bg-card p-4 rounded-lg border space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Spellcasting
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="capitalize">
                        {sc.tradition}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {sc.type}
                      </Badge>
                    </div>
                  </div>
                  {/* Focus Points */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">Focus Points</span>
                    <div className="flex gap-1">
                      {Array.from({ length: sc.focusPoints.max }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!onUpdate) return;
                            const fp = { ...sc.focusPoints };
                            if (i < fp.current) fp.current--;
                            else if (fp.current < fp.max) fp.current++;
                            update({ spellcasting: { ...sc, focusPoints: fp } });
                          }}
                          disabled={!onUpdate}
                          className={`w-5 h-5 rounded-full border-2 transition-colors ${
                            i < sc.focusPoints.current
                              ? 'bg-amber-500 border-amber-600 hover:bg-amber-400'
                              : 'border-input hover:border-amber-400'
                          }`}
                          title={
                            i < sc.focusPoints.current ? 'Spend focus point' : 'Recover focus point'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {sc.focusPoints.current}/{sc.focusPoints.max}
                    </span>
                  </div>
                  {/* Spell Slots */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => {
                      const slot = sc.spellSlots[level];
                      if (!slot || slot.max === 0) return null;
                      const remaining = slot.max - slot.used;
                      return (
                        <div key={level} className="text-center space-y-1">
                          <div className="text-[10px] font-medium text-muted-foreground">
                            Lv {level}
                          </div>
                          <div className="flex justify-center gap-0.5 flex-wrap">
                            {Array.from({ length: slot.max }, (_, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (!onUpdate) return;
                                  const slots = { ...sc.spellSlots };
                                  if (i < remaining)
                                    slots[level] = { ...slot, used: slot.used + 1 };
                                  else slots[level] = { ...slot, used: Math.max(0, slot.used - 1) };
                                  update({ spellcasting: { ...sc, spellSlots: slots } });
                                }}
                                disabled={!onUpdate}
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                  i < remaining
                                    ? 'bg-primary border-primary/80 hover:bg-primary/80'
                                    : 'border-input hover:border-primary/50'
                                }`}
                                title={
                                  i < remaining
                                    ? `Use level ${level} slot`
                                    : `Recover level ${level} slot`
                                }
                              />
                            ))}
                          </div>
                          <div className="text-[10px] tabular-nums text-muted-foreground">
                            {remaining}/{slot.max}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}
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
          {/* Bulk Tracking */}
          {(() => {
            const equipBulk = d.equipment.reduce((sum, e) => sum + (e.equipped ? e.bulk : 0), 0);
            const invBulk = d.inventory.reduce((sum, i) => sum + i.bulk * i.quantity, 0);
            const totalBulk = equipBulk + invBulk;
            const strMod = abilityMod(d.baseAttributes.str ?? 10);
            const encumbered = 5 + strMod;
            const maxBulk = 10 + strMod;
            const isEncumbered = totalBulk >= encumbered;
            const isOverloaded = totalBulk >= maxBulk;
            return (
              <section className="bg-card p-3 rounded-lg border flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Total Bulk</span>
                  <span
                    className={`text-lg font-bold tabular-nums ${isOverloaded ? 'text-destructive' : isEncumbered ? 'text-amber-500' : ''}`}
                  >
                    {totalBulk}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Encumbered at <span className="font-medium">{encumbered}</span> &bull; Max{' '}
                  <span className="font-medium">{maxBulk}</span>
                </div>
                {isOverloaded && (
                  <Badge variant="destructive" className="text-[10px]">
                    Overloaded
                  </Badge>
                )}
                {isEncumbered && !isOverloaded && (
                  <Badge variant="warning" className="text-[10px]">
                    Encumbered
                  </Badge>
                )}
              </section>
            );
          })()}
          <CurrencyEditor
            currency={d.currency as unknown as Record<string, number>}
            onChange={
              onUpdate
                ? (currency) => update({ currency: currency as unknown as typeof d.currency })
                : undefined
            }
          />
          <div className="mt-4" />
          <InventoryManager
            items={d.inventory.map((item) => ({
              id: item.itemId,
              name: item.name,
              quantity: item.quantity,
              weight: item.bulk,
              value: '0 gp',
            }))}
            onAddItem={
              onUpdate
                ? (item) => {
                    update({
                      inventory: [
                        ...d.inventory,
                        {
                          itemId: item.id,
                          name: item.name,
                          quantity: item.quantity,
                          bulk: item.weight,
                        },
                      ],
                    });
                  }
                : undefined
            }
            onRemoveItem={
              onUpdate
                ? (itemId) => {
                    update({ inventory: d.inventory.filter((i) => i.itemId !== itemId) });
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
                  value={d.personality?.description || ''}
                  onChange={(e) =>
                    update({ personality: { ...d.personality, description: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
                  placeholder="Physical description..."
                  disabled={!onUpdate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Backstory</label>
                <textarea
                  value={d.personality?.backstory || ''}
                  onChange={(e) =>
                    update({ personality: { ...d.personality, backstory: e.target.value } })
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
                value={d.notes || ''}
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
