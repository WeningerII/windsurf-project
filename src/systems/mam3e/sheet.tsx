import React, { useCallback, useMemo, useState, Suspense, lazy } from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { Mam3eDataModel } from './data-model';
import {
  Shield,
  Zap,
  Brain,
  Activity,
  AlertTriangle,
  Plus,
  X,
  Target,
  Star,
  StickyNote,
  Sword,
  HeartPulse,
  RotateCcw,
} from 'lucide-react';
import { parseNum } from '../../utils/math';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { DiceRollButton } from '../../components/DiceRollButton';
const EquipmentBrowser = lazy(() =>
  import('../../components/EquipmentBrowser').then((m) => ({ default: m.EquipmentBrowser }))
);
const SpellBrowser = lazy(() =>
  import('../../components/SpellBrowser').then((m) => ({ default: m.SpellBrowser }))
);
const MamArchetypeBrowser = lazy(() =>
  import('../../components/MamArchetypeBrowser').then((m) => ({ default: m.MamArchetypeBrowser }))
);
const MamComplicationBrowser = lazy(() =>
  import('../../components/MamComplicationBrowser').then((m) => ({
    default: m.MamComplicationBrowser,
  }))
);
const MamPowerModifierBrowser = lazy(() =>
  import('../../components/MamPowerModifierBrowser').then((m) => ({
    default: m.MamPowerModifierBrowser,
  }))
);
import {
  loadEquipmentForSystem,
  loadSpellsForSystem,
  loadAdvantagesForSystem,
  loadComplicationsForSystem,
  loadMam3eArchetypesForSystem,
  loadPowerModifiersForSystem,
} from '../../utils/dataLoader';
import { systemRegistry } from '../../registry';
import {
  calculatePowerPointCost,
  getPowerModifierRank,
  getPowerRank,
  MAM3E_EXTRA_MODIFIERS,
  MAM3E_FLAW_MODIFIERS,
} from './powerMath';
import type { Spell } from '../../types/magic/spells';
import type { Advantage } from '../../types/mam/advantages';
import type { Power } from '../../types/mam/powers';
import type { Item } from '../../types/equipment/items';
import type { CharacterClass } from '../../types/character-options/classes';
import type { GameSystemId } from '../../types/game-systems';
import type { Complication } from '../../data/mutants-and-masterminds/3e/complications';
import type { PowerModifier } from '../../data/mutants-and-masterminds/3e/modifiers/extras';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

const MAM3E_SKILLS: Array<{ id: string; label: string; ability: string }> = [
  { id: 'acrobatics', label: 'Acrobatics', ability: 'agi' },
  { id: 'athletics', label: 'Athletics', ability: 'str' },
  { id: 'close-combat', label: 'Close Combat', ability: 'fgt' },
  { id: 'deception', label: 'Deception', ability: 'pre' },
  { id: 'expertise', label: 'Expertise', ability: 'int' },
  { id: 'insight', label: 'Insight', ability: 'awe' },
  { id: 'intimidation', label: 'Intimidation', ability: 'pre' },
  { id: 'investigation', label: 'Investigation', ability: 'int' },
  { id: 'perception', label: 'Perception', ability: 'awe' },
  { id: 'persuasion', label: 'Persuasion', ability: 'pre' },
  { id: 'ranged-combat', label: 'Ranged Combat', ability: 'dex' },
  { id: 'sleight-of-hand', label: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', label: 'Stealth', ability: 'agi' },
  { id: 'technology', label: 'Technology', ability: 'int' },
  { id: 'treatment', label: 'Treatment', ability: 'int' },
  { id: 'vehicles', label: 'Vehicles', ability: 'dex' },
];

function formatMamEquipmentCost(item: Item): string {
  const rawCost = (item as Item & { cost?: unknown }).cost;

  if (typeof rawCost === 'number' && Number.isFinite(rawCost)) {
    return `${rawCost} ep`;
  }

  if (rawCost && typeof rawCost === 'object') {
    const amount = (rawCost as { amount?: unknown }).amount;
    const currency = (rawCost as { currency?: unknown }).currency;

    if (typeof amount === 'number' && typeof currency === 'string') {
      return `${amount} ${currency}`;
    }
  }

  return '0';
}

function humanizeMamToken(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatMamPowerAction(power: Power): string {
  return humanizeMamToken(power.action);
}

function formatMamPowerRange(power: Power): string {
  return humanizeMamToken(power.range);
}

function formatMamPowerDuration(power: Power): string {
  return humanizeMamToken(power.duration);
}

export const Mam3eCharacterSheet: React.FC<Props> = ({ document, onUpdate }) => {
  const data = document.system;
  const { powerPoints, abilities, defenses } = data;
  const conditionTrack = useMemo(
    () =>
      data.conditionTrack ?? {
        bruised: 0,
        dazed: false,
        staggered: false,
        incapacitated: false,
      },
    [data.conditionTrack]
  );

  const update = useCallback(
    (patch: Partial<Mam3eDataModel>) => {
      if (!onUpdate) return;
      onUpdate({ ...document, system: { ...data, ...patch }, updatedAt: new Date() });
    },
    [document, data, onUpdate]
  );

  const updatePowerById = useCallback(
    (powerId: string, updater: (power: Power) => Power) => {
      update({
        powers: data.powers.map((power) => (power.id === powerId ? updater(power) : power)),
      });
    },
    [data.powers, update]
  );

  const addPowerModifier = useCallback(
    (powerId: string, modifierType: 'extra' | 'flaw', modifierId: string) => {
      if (!modifierId) return;

      updatePowerById(powerId, (power) => {
        if (modifierType === 'extra') {
          const extras = power.extras ?? [];
          if (extras.includes(modifierId)) return power;
          return {
            ...power,
            extras: [...extras, modifierId],
            modifierRanks: {
              ...(power.modifierRanks ?? {}),
              [modifierId]: getPowerModifierRank(power, modifierId),
            },
          };
        }

        const flaws = power.flaws ?? [];
        if (flaws.includes(modifierId)) return power;
        return {
          ...power,
          flaws: [...flaws, modifierId],
          modifierRanks: {
            ...(power.modifierRanks ?? {}),
            [modifierId]: getPowerModifierRank(power, modifierId),
          },
        };
      });
    },
    [updatePowerById]
  );

  const removePowerModifier = useCallback(
    (powerId: string, modifierType: 'extra' | 'flaw', modifierId: string) => {
      updatePowerById(powerId, (power) => {
        const nextModifierRanks = { ...(power.modifierRanks ?? {}) };
        delete nextModifierRanks[modifierId];
        const hasRanks = Object.keys(nextModifierRanks).length > 0;

        if (modifierType === 'extra') {
          return {
            ...power,
            extras: (power.extras ?? []).filter((id) => id !== modifierId),
            modifierRanks: hasRanks ? nextModifierRanks : undefined,
          };
        }

        return {
          ...power,
          flaws: (power.flaws ?? []).filter((id) => id !== modifierId),
          modifierRanks: hasRanks ? nextModifierRanks : undefined,
        };
      });
    },
    [updatePowerById]
  );

  const changeModifierRank = useCallback(
    (powerId: string, modifierId: string, delta: number) => {
      updatePowerById(powerId, (power) => {
        const current = getPowerModifierRank(power, modifierId);
        const next = Math.max(1, current + delta);
        return {
          ...power,
          modifierRanks: {
            ...(power.modifierRanks ?? {}),
            [modifierId]: next,
          },
        };
      });
    },
    [updatePowerById]
  );

  const updatePowerRank = useCallback(
    (powerId: string, rank: number) => {
      updatePowerById(powerId, (power) => ({
        ...power,
        rank: Math.max(1, Math.floor(rank)),
      }));
    },
    [updatePowerById]
  );

  const updateAbility = useCallback(
    (key: keyof typeof abilities, value: number) => {
      update({ abilities: { ...abilities, [key]: value } });
    },
    [abilities, update]
  );

  const updateDefenseRank = useCallback(
    (key: keyof typeof defenses, rank: number) => {
      update({ defenses: { ...defenses, [key]: { ...defenses[key], rank } } });
    },
    [defenses, update]
  );

  const updateConditionTrack = useCallback(
    (patch: Partial<typeof conditionTrack>) => {
      update({
        conditionTrack: {
          ...conditionTrack,
          ...patch,
        },
      });
    },
    [conditionTrack, update]
  );

  const applyToughnessFailure = useCallback(
    (failureMargin: number) => {
      const next = { ...conditionTrack };
      if (failureMargin >= 15) {
        next.incapacitated = true;
        update({ conditionTrack: next });
        return;
      }
      if (failureMargin >= 10) {
        next.bruised += 1;
        next.staggered = true;
        update({ conditionTrack: next });
        return;
      }
      if (failureMargin >= 5) {
        next.bruised += 1;
        if (next.dazed) next.staggered = true;
        next.dazed = true;
        update({ conditionTrack: next });
        return;
      }
      if (failureMargin > 0) {
        next.bruised += 1;
        update({ conditionTrack: next });
      }
    },
    [conditionTrack, update]
  );

  const [equipmentItems, setEquipmentItems] = useState<Item[]>([]);
  const [equipmentLoaded, setEquipmentLoaded] = useState(false);
  const loadEquipment = useCallback(async () => {
    if (equipmentLoaded) return;
    const loaded = await loadEquipmentForSystem(document.systemId as GameSystemId);
    setEquipmentItems(loaded);
    setEquipmentLoaded(true);
  }, [equipmentLoaded, document.systemId]);

  const [powers, setPowers] = useState<Spell[]>([]);
  const [powersLoaded, setPowersLoaded] = useState(false);
  const loadPowers = useCallback(async () => {
    if (powersLoaded) return;
    const loaded = await loadSpellsForSystem(document.systemId as GameSystemId);
    setPowers(loaded);
    setPowersLoaded(true);
  }, [powersLoaded, document.systemId]);

  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [advantagesLoaded, setAdvantagesLoaded] = useState(false);
  const loadAdvantages = useCallback(async () => {
    if (advantagesLoaded) return;
    const loaded = await loadAdvantagesForSystem(document.systemId as GameSystemId);
    setAdvantages(loaded);
    setAdvantagesLoaded(true);
  }, [advantagesLoaded, document.systemId]);

  const [archetypes, setArchetypes] = useState<CharacterClass[]>([]);
  const [archetypesLoaded, setArchetypesLoaded] = useState(false);
  const loadArchetypes = useCallback(async () => {
    if (archetypesLoaded) return;
    const loaded = await loadMam3eArchetypesForSystem(document.systemId as GameSystemId);
    setArchetypes(loaded);
    setArchetypesLoaded(true);
  }, [archetypesLoaded, document.systemId]);

  const [complicationCatalog, setComplicationCatalog] = useState<Complication[]>([]);
  const [complicationsLoaded, setComplicationsLoaded] = useState(false);
  const loadComplications = useCallback(async () => {
    if (complicationsLoaded) return;
    const loaded = await loadComplicationsForSystem(document.systemId as GameSystemId);
    setComplicationCatalog(loaded);
    setComplicationsLoaded(true);
  }, [complicationsLoaded, document.systemId]);

  const [modifierCatalog, setModifierCatalog] = useState<PowerModifier[]>(() => [
    ...MAM3E_EXTRA_MODIFIERS,
    ...MAM3E_FLAW_MODIFIERS,
  ]);
  const [powerModifiersLoaded, setPowerModifiersLoaded] = useState(false);
  const loadPowerModifiers = useCallback(async () => {
    if (powerModifiersLoaded) return;
    const loaded = await loadPowerModifiersForSystem(document.systemId as GameSystemId);
    if (loaded.length > 0) {
      setModifierCatalog(loaded);
    }
    setPowerModifiersLoaded(true);
  }, [document.systemId, powerModifiersLoaded]);

  const ppSpent =
    powerPoints.spent.abilities +
    powerPoints.spent.defenses +
    powerPoints.spent.powers +
    powerPoints.spent.advantages +
    powerPoints.spent.skills;
  const ppOver = ppSpent > powerPoints.total;
  const pinnedArchetypeIds = data.selectedArchetypeIds ?? [];
  const pinnedArchetypes = useMemo(
    () => archetypes.filter((archetype) => pinnedArchetypeIds.includes(archetype.id)),
    [archetypes, pinnedArchetypeIds]
  );
  const insertedComplicationIds = useMemo(
    () =>
      data.complications
        .map((complication) => complication.id)
        .filter((id): id is string => typeof id === 'string' && id.trim().length > 0),
    [data.complications]
  );
  const extraModifiers = useMemo(
    () =>
      modifierCatalog
        .filter((modifier) => modifier.type === 'extra')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [modifierCatalog]
  );
  const flawModifiers = useMemo(
    () =>
      modifierCatalog
        .filter((modifier) => modifier.type === 'flaw')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [modifierCatalog]
  );
  const modifierById = useMemo(
    () => new Map(modifierCatalog.map((modifier) => [modifier.id, modifier])),
    [modifierCatalog]
  );
  const togglePinnedArchetype = useCallback(
    (archetype: CharacterClass) => {
      const nextPinnedIds = pinnedArchetypeIds.includes(archetype.id)
        ? pinnedArchetypeIds.filter((id) => id !== archetype.id)
        : [...pinnedArchetypeIds, archetype.id];

      update({ selectedArchetypeIds: nextPinnedIds });
    },
    [pinnedArchetypeIds, update]
  );
  const insertComplication = useCallback(
    (complication: Complication) => {
      if (insertedComplicationIds.includes(complication.id)) {
        return;
      }

      update({
        complications: [
          ...data.complications,
          {
            id: complication.id,
            name: complication.name,
            description: complication.description,
            source: complication.source,
            category: complication.category,
          },
        ],
      });
    },
    [data.complications, insertedComplicationIds, update]
  );

  const AbilityBlock = ({
    label,
    abilityKey,
  }: {
    label: string;
    abilityKey: keyof typeof abilities;
  }) => (
    <div className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      <input
        type="number"
        value={abilities[abilityKey]}
        onChange={(e) => updateAbility(abilityKey, parseNum(e.target.value, 0))}
        className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
        disabled={!onUpdate}
        title={`${label} rank`}
      />
      <span className="text-xs text-muted-foreground tabular-nums">
        {abilities[abilityKey] * 2} PP
      </span>
    </div>
  );

  const DefenseRow = ({ label, defKey }: { label: string; defKey: keyof typeof defenses }) => {
    const def = defenses[defKey];
    return (
      <div className="flex justify-between items-center py-1 border-b last:border-0">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <span className="text-muted-foreground">Rank:</span>
            <input
              type="number"
              value={def.rank}
              onChange={(e) => updateDefenseRank(defKey, parseNum(e.target.value, 0))}
              className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
              disabled={!onUpdate}
            />
          </label>
          <span className="font-bold">Total: {def.total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {document.img ? (
              <img
                src={document.img}
                alt={document.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Zap className="w-8 h-8 text-primary" />
            )}
          </div>
          <div className="space-y-1">
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
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Power Level</span>
              <input
                type="number"
                value={data.powerLevel}
                onChange={(e) => update({ powerLevel: parseNum(e.target.value, 1) })}
                className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
                min={1}
                disabled={!onUpdate}
                title="Power level"
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">Power Points</div>
          <div className={`text-2xl font-bold ${ppOver ? 'text-destructive' : 'text-primary'}`}>
            {ppSpent} / {powerPoints.total}
          </div>
          {ppOver && (
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <AlertTriangle className="w-3 h-3" />
              Over budget by {ppSpent - powerPoints.total}
            </div>
          )}
          {data.plViolations && data.plViolations.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {data.plViolations.map((v, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] text-destructive">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {v.label}: {v.value} exceeds {v.limit}
                </div>
              ))}
            </div>
          )}
          <input
            type="number"
            value={powerPoints.total}
            onChange={(e) =>
              update({ powerPoints: { ...powerPoints, total: parseNum(e.target.value, 0) } })
            }
            className="w-16 text-center text-xs bg-transparent border-b border-input focus:outline-none focus:border-primary mt-1"
            min={0}
            disabled={!onUpdate}
            title="Total power points"
          />
          <span className="text-xs text-muted-foreground ml-1">total PP</span>
        </div>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="abilities">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="abilities" className="flex items-center gap-1.5">
            <Brain className="w-4 h-4" /> Abilities
          </TabsTrigger>
          <TabsTrigger value="skills-advantages" className="flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Skills
            {Object.keys(data.skills).length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {Object.keys(data.skills).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="archetypes"
            className="flex items-center gap-1.5"
            onClick={loadArchetypes}
          >
            <Shield className="w-4 h-4" /> Archetypes
            {pinnedArchetypeIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {pinnedArchetypeIds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="powers"
            className="flex items-center gap-1.5"
            onClick={loadPowerModifiers}
          >
            <Activity className="w-4 h-4" /> Powers
            {data.powers.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {data.powers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="power-browser"
            className="flex items-center gap-1.5"
            onClick={() => {
              void loadPowers();
              void loadPowerModifiers();
            }}
          >
            <Zap className="w-4 h-4" /> Powers DB
          </TabsTrigger>
          <TabsTrigger
            value="advantage-browser"
            className="flex items-center gap-1.5"
            onClick={loadAdvantages}
          >
            <Star className="w-4 h-4" /> Advantages DB
          </TabsTrigger>
          <TabsTrigger
            value="equipment-browser"
            className="flex items-center gap-1.5"
            onClick={loadEquipment}
          >
            <Sword className="w-4 h-4" /> Equipment
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4" /> Conditions
            {(conditionTrack.bruised > 0 ||
              conditionTrack.dazed ||
              conditionTrack.staggered ||
              conditionTrack.incapacitated) && (
              <Badge
                variant={conditionTrack.incapacitated ? 'destructive' : 'warning'}
                className="ml-1 text-[10px] px-1.5 py-0"
              >
                {conditionTrack.incapacitated ? 'KO' : conditionTrack.bruised}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="complications"
            className="flex items-center gap-1.5"
            onClick={loadComplications}
          >
            <AlertTriangle className="w-4 h-4" /> Complications
            {data.complications.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {data.complications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1.5">
            <StickyNote className="w-4 h-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="abilities">
          {/* Abilities Grid */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Abilities
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              <AbilityBlock label="STR" abilityKey="str" />
              <AbilityBlock label="STA" abilityKey="sta" />
              <AbilityBlock label="AGI" abilityKey="agi" />
              <AbilityBlock label="DEX" abilityKey="dex" />
              <AbilityBlock label="FGT" abilityKey="fgt" />
              <AbilityBlock label="INT" abilityKey="int" />
              <AbilityBlock label="AWE" abilityKey="awe" />
              <AbilityBlock label="PRE" abilityKey="pre" />
            </div>
          </section>

          {/* Defenses */}
          <section className="bg-card p-4 rounded-lg border mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Defenses
            </h3>
            <div className="space-y-2">
              <DefenseRow label="Dodge" defKey="dodge" />
              <DefenseRow label="Parry" defKey="parry" />
              <DefenseRow label="Fortitude" defKey="fortitude" />
              <DefenseRow label="Toughness" defKey="toughness" />
              <DefenseRow label="Will" defKey="will" />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="skills-advantages">
          {/* Skills */}
          <section className="bg-card p-4 rounded-lg border mb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" /> Skills
            </h3>
            <div className="space-y-1">
              {MAM3E_SKILLS.map(({ id, label, ability }) => {
                const skill = data.skills[id] ?? { rank: 0, total: 0 };
                const abilityRank = abilities[ability as keyof typeof abilities] ?? 0;
                const total = skill.rank + abilityRank;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded text-sm transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{label}</span>
                      <span className="text-muted-foreground text-xs uppercase">({ability})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={skill.rank}
                        onChange={(e) =>
                          update({
                            skills: {
                              ...data.skills,
                              [id]: { rank: parseNum(e.target.value, 0), total },
                            },
                          })
                        }
                        className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums text-sm"
                        min={0}
                        disabled={!onUpdate}
                        title={`${label} ranks`}
                      />
                      <span className="font-bold w-8 text-right tabular-nums">
                        {total >= 0 ? '+' : ''}
                        {total}
                      </span>
                      <DiceRollButton
                        label={`${label} Check`}
                        onRoll={() =>
                          systemRegistry.get(document.systemId)!.engine.rollCheck(document, id)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Advantages */}
          <section className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" /> Advantages
              {data.advantages.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {data.advantages.length}
                </Badge>
              )}
            </h3>
            <div className="space-y-2">
              {data.advantages.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No advantages added yet.</p>
              ) : (
                data.advantages.map((adv, i) => (
                  <div
                    key={adv.id}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{adv.name}</span>
                      {adv.rank != null && adv.rank > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 tabular-nums">
                          Rank {adv.rank}
                        </Badge>
                      )}
                    </div>
                    {onUpdate && (
                      <button
                        onClick={() =>
                          update({ advantages: data.advantages.filter((_, j) => j !== i) })
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove advantage"
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
                      advantages: [
                        ...data.advantages,
                        { id: `adv-${Date.now()}`, name: 'New Advantage' },
                      ],
                    })
                  }
                  className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Advantage
                </button>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="archetypes">
          {!archetypesLoaded ? (
            <div className="text-center py-8 text-muted-foreground">
              Click to load archetypes...
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedArchetypes.length > 0 && (
                <section className="rounded-lg border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Pinned Archetypes
                    </h3>
                    <Badge variant="secondary">{pinnedArchetypes.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pinned archetypes are reference-only. Review them while building the character
                    manually.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {pinnedArchetypes.map((archetype) => (
                      <article
                        key={archetype.id}
                        className="rounded-lg border bg-muted/20 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{archetype.name}</div>
                            <div className="text-xs text-muted-foreground">{archetype.source}</div>
                          </div>
                          {onUpdate && (
                            <button
                              type="button"
                              onClick={() => togglePinnedArchetype(archetype)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title={`Unpin ${archetype.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{archetype.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <Suspense
                fallback={
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Loading Archetype Browser...
                  </div>
                }
              >
                <MamArchetypeBrowser
                  archetypes={archetypes}
                  selectedArchetypeIds={pinnedArchetypeIds}
                  onToggleArchetype={onUpdate ? togglePinnedArchetype : undefined}
                />
              </Suspense>
            </div>
          )}
        </TabsContent>

        <TabsContent value="powers">
          <section className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Powers
            </h3>
            <div className="space-y-3">
              {data.powers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No powers added yet.</p>
              ) : (
                data.powers.map((power) => {
                  const rank = getPowerRank(power);
                  const powerCost = calculatePowerPointCost(power);
                  const extraIds = power.extras ?? [];
                  const flawIds = power.flaws ?? [];
                  const availableExtras = extraModifiers.filter(
                    (modifier) => !extraIds.includes(modifier.id)
                  );
                  const availableFlaws = flawModifiers.filter(
                    (modifier) => !flawIds.includes(modifier.id)
                  );

                  return (
                    <div
                      key={power.id}
                      className="p-3 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                    >
                      <div className="flex justify-between font-medium">
                        <span>{power.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="info">{power.action}</Badge>
                          {onUpdate && (
                            <button
                              onClick={() =>
                                update({ powers: data.powers.filter((p) => p.id !== power.id) })
                              }
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove power"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{power.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <Badge variant="outline">{power.range}</Badge>
                        <Badge variant="outline">{power.duration}</Badge>
                        {power.perRank && (
                          <label className="text-xs text-muted-foreground flex items-center gap-1">
                            Rank
                            <input
                              type="number"
                              min={1}
                              value={rank}
                              onChange={(e) =>
                                updatePowerRank(power.id, parseNum(e.target.value, 1))
                              }
                              disabled={!onUpdate}
                              className="w-14 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                              title="Power rank"
                            />
                          </label>
                        )}
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                          Base
                          <input
                            type="number"
                            min={0}
                            step="1"
                            value={power.baseCost}
                            onChange={(e) =>
                              updatePowerById(power.id, (entry) => ({
                                ...entry,
                                baseCost: parseNum(e.target.value, 0),
                              }))
                            }
                            disabled={!onUpdate}
                            className="w-16 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                            title="Base cost per rank"
                          />
                        </label>
                        <Badge variant="secondary" className="tabular-nums">
                          {powerCost} PP
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                            Extras
                          </div>
                          {extraIds.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No extras.</p>
                          ) : (
                            extraIds.map((modifierId) => {
                              const modifier = modifierById.get(modifierId);
                              if (!modifier) return null;
                              const modifierRank = getPowerModifierRank(power, modifierId);
                              return (
                                <div
                                  key={modifierId}
                                  className="flex items-center justify-between gap-2 text-xs border border-input rounded px-2 py-1 bg-card/50"
                                >
                                  <span className="font-medium">{modifier.name}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => changeModifierRank(power.id, modifierId, -1)}
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                                      title="Decrease modifier rank"
                                    >
                                      -
                                    </button>
                                    <span className="tabular-nums min-w-[1.5rem] text-center">
                                      {modifierRank}
                                    </span>
                                    <button
                                      onClick={() => changeModifierRank(power.id, modifierId, 1)}
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                                      title="Increase modifier rank"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() =>
                                        removePowerModifier(power.id, 'extra', modifierId)
                                      }
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-destructive hover:text-destructive disabled:opacity-50"
                                      title="Remove extra"
                                    >
                                      <X className="w-3 h-3 mx-auto" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          {onUpdate && (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                const modifierId = e.target.value;
                                if (!modifierId) return;
                                addPowerModifier(power.id, 'extra', modifierId);
                                e.currentTarget.value = '';
                              }}
                              className="w-full px-2 py-1 text-xs border border-input rounded bg-transparent focus:outline-none focus:border-primary"
                              title="Add extra"
                            >
                              <option value="">Add extra...</option>
                              {availableExtras.map((modifier) => (
                                <option key={modifier.id} value={modifier.id}>
                                  {modifier.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                            Flaws
                          </div>
                          {flawIds.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No flaws.</p>
                          ) : (
                            flawIds.map((modifierId) => {
                              const modifier = modifierById.get(modifierId);
                              if (!modifier) return null;
                              const modifierRank = getPowerModifierRank(power, modifierId);
                              return (
                                <div
                                  key={modifierId}
                                  className="flex items-center justify-between gap-2 text-xs border border-input rounded px-2 py-1 bg-card/50"
                                >
                                  <span className="font-medium">{modifier.name}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => changeModifierRank(power.id, modifierId, -1)}
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                                      title="Decrease modifier rank"
                                    >
                                      -
                                    </button>
                                    <span className="tabular-nums min-w-[1.5rem] text-center">
                                      {modifierRank}
                                    </span>
                                    <button
                                      onClick={() => changeModifierRank(power.id, modifierId, 1)}
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                                      title="Increase modifier rank"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() =>
                                        removePowerModifier(power.id, 'flaw', modifierId)
                                      }
                                      disabled={!onUpdate}
                                      className="w-5 h-5 rounded border border-input hover:border-destructive hover:text-destructive disabled:opacity-50"
                                      title="Remove flaw"
                                    >
                                      <X className="w-3 h-3 mx-auto" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          {onUpdate && (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                const modifierId = e.target.value;
                                if (!modifierId) return;
                                addPowerModifier(power.id, 'flaw', modifierId);
                                e.currentTarget.value = '';
                              }}
                              className="w-full px-2 py-1 text-xs border border-input rounded bg-transparent focus:outline-none focus:border-primary"
                              title="Add flaw"
                            >
                              <option value="">Add flaw...</option>
                              {availableFlaws.map((modifier) => (
                                <option key={modifier.id} value={modifier.id}>
                                  {modifier.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {onUpdate && (
                <button
                  onClick={() => {
                    const id = `power-${Date.now()}`;
                    update({
                      powers: [
                        ...data.powers,
                        {
                          id,
                          name: 'New Power',
                          system: 'mam3e',
                          source: 'Custom',
                          type: 'attack',
                          action: 'standard',
                          range: 'close',
                          duration: 'instant',
                          baseCost: 1,
                          perRank: true,
                          rank: 1,
                          extras: [],
                          flaws: [],
                          modifierRanks: {},
                          description: '',
                          effects: [],
                        },
                      ],
                    });
                  }}
                  className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Power
                </button>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="conditions">
          <section className="bg-card p-4 rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HeartPulse className="w-5 h-5" /> Condition Track
              </h3>
              {onUpdate && (
                <button
                  onClick={() =>
                    update({
                      conditionTrack: {
                        bruised: 0,
                        dazed: false,
                        staggered: false,
                        incapacitated: false,
                      },
                    })
                  }
                  className="text-xs px-2 py-1 rounded border border-input hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1"
                  title="Reset condition track"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded border bg-muted/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Bruised
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold tabular-nums">{conditionTrack.bruised}</span>
                  {onUpdate && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateConditionTrack({ bruised: Math.max(0, conditionTrack.bruised - 1) })
                        }
                        className="w-7 h-7 rounded border border-input hover:border-primary hover:text-primary transition-colors"
                        title="Reduce bruised"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          updateConditionTrack({ bruised: conditionTrack.bruised + 1 })
                        }
                        className="w-7 h-7 rounded border border-input hover:border-primary hover:text-primary transition-colors"
                        title="Add bruised"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(
                [
                  { key: 'dazed', label: 'Dazed' },
                  { key: 'staggered', label: 'Staggered' },
                  { key: 'incapacitated', label: 'Incapacitated' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onUpdate && updateConditionTrack({ [key]: !conditionTrack[key] })}
                  disabled={!onUpdate}
                  className={`p-3 rounded border text-left transition-colors ${
                    conditionTrack[key]
                      ? key === 'incapacitated'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'border-input bg-muted/10 hover:border-primary'
                  }`}
                >
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {label}
                  </div>
                  <div className="font-semibold">{conditionTrack[key] ? 'Active' : 'Inactive'}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Apply Toughness Failure</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdate && applyToughnessFailure(2)}
                  disabled={!onUpdate}
                  className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
                >
                  Fail by 1-4: +1 Bruised
                </button>
                <button
                  onClick={() => onUpdate && applyToughnessFailure(7)}
                  disabled={!onUpdate}
                  className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
                >
                  Fail by 5-9: +1 Bruised, Dazed
                </button>
                <button
                  onClick={() => onUpdate && applyToughnessFailure(12)}
                  disabled={!onUpdate}
                  className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
                >
                  Fail by 10-14: +1 Bruised, Staggered
                </button>
                <button
                  onClick={() => onUpdate && applyToughnessFailure(16)}
                  disabled={!onUpdate}
                  className="px-3 py-2 rounded border border-destructive/40 hover:border-destructive hover:text-destructive transition-colors text-sm text-left"
                >
                  Fail by 15+: Incapacitated
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Track follows the M&M damage progression (Bruised → Dazed/Staggered →
                Incapacitated).
              </p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="complications">
          <section className="bg-card p-4 rounded-lg border space-y-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Complications
            </h3>
            <div className="space-y-2">
              {data.complications.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No complications added yet.</p>
              ) : (
                data.complications.map((comp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <input
                        value={comp.name}
                        onChange={(e) => {
                          const updated = [...data.complications];
                          updated[i] = { ...comp, name: e.target.value };
                          update({ complications: updated });
                        }}
                        className="font-medium bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
                        placeholder="Complication name"
                        disabled={!onUpdate}
                      />
                      <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                        {comp.category && (
                          <span className="rounded-full border px-2 py-0.5 capitalize">
                            {comp.category}
                          </span>
                        )}
                        {comp.source && (
                          <span className="rounded-full border px-2 py-0.5">{comp.source}</span>
                        )}
                      </div>
                      <input
                        value={comp.description}
                        onChange={(e) => {
                          const updated = [...data.complications];
                          updated[i] = { ...comp, description: e.target.value };
                          update({ complications: updated });
                        }}
                        className="text-sm text-muted-foreground bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full mt-1"
                        placeholder="Description"
                        disabled={!onUpdate}
                      />
                    </div>
                    {onUpdate && (
                      <button
                        onClick={() =>
                          update({ complications: data.complications.filter((_, j) => j !== i) })
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                        title="Remove complication"
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
                      complications: [...data.complications, { name: '', description: '' }],
                    })
                  }
                  className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Complication
                </button>
              )}
            </div>

            {complicationsLoaded ? (
              <Suspense
                fallback={
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Loading Complication Browser...
                  </div>
                }
              >
                <MamComplicationBrowser
                  complications={complicationCatalog}
                  insertedComplicationIds={insertedComplicationIds}
                  onInsertComplication={onUpdate ? insertComplication : undefined}
                />
              </Suspense>
            ) : (
              <div className="rounded-lg border border-dashed border-input px-3 py-6 text-center text-sm text-muted-foreground">
                Loading complication catalog...
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="power-browser">
          <div className="space-y-4">
            {!powersLoaded ? (
              <div className="text-center py-8 text-muted-foreground">Click to load powers...</div>
            ) : (
              <Suspense
                fallback={
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Loading Power Browser...
                  </div>
                }
              >
                <SpellBrowser
                  spells={powers.map((p) => {
                    const power = p as unknown as Power;

                    return {
                      id: p.id,
                      name: p.name,
                      level: power.rank ?? 0,
                      school: humanizeMamToken(power.type).toLowerCase(),
                      castingTime: formatMamPowerAction(power),
                      range: formatMamPowerRange(power),
                      components: '',
                      duration: formatMamPowerDuration(power),
                      description: p.description,
                      source: p.source,
                      classes: [humanizeMamToken(power.type)],
                    };
                  })}
                />
              </Suspense>
            )}

            {powerModifiersLoaded ? (
              <Suspense
                fallback={
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Loading Modifier Catalog...
                  </div>
                }
              >
                <MamPowerModifierBrowser modifiers={modifierCatalog} />
              </Suspense>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Loading modifier catalog...
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="advantage-browser">
          {!advantagesLoaded ? (
            <div className="text-center py-8 text-muted-foreground">
              Click to load advantages...
            </div>
          ) : (
            <section className="bg-card p-4 rounded-lg border space-y-2">
              <h3 className="text-lg font-semibold">SRD Advantages ({advantages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {advantages.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-2 border rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{adv.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                        {adv.type}
                      </Badge>
                      {adv.ranked && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Ranked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {adv.benefit || adv.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
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
                  cost: formatMamEquipmentCost(item),
                  weight: item.weight ?? 0,
                  description: item.description,
                }))}
              />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <section className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <textarea
              value={data.notes || ''}
              onChange={(e) => update({ notes: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[200px]"
              placeholder="Character notes, backstory, etc..."
              disabled={!onUpdate}
            />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};
