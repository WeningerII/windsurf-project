import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Map as MapIcon, MousePointer2, Plus, Trash2, Upload } from 'lucide-react';
import {
  MAX_MONSTERS_PER_SELECTION,
  buildEncounterSceneEvents,
  summarizeEncounterParty,
  summarizeEncounterPlan,
  type EncounterMonsterSelection,
} from '../scene/encounterBuilder';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../scene/runtime';
import {
  areaShapeForAction,
  buildCharacterCombatant,
  buildMonsterCombatant,
  casterSpellAreaActions,
  characterSaveBonus,
  diagonalRuleForSystem,
  monsterAuras,
  monsterSaveActions,
  monsterSaveBonus,
  resolveSceneAreaEffect,
  resolveSceneAttack,
  runSceneRound,
  tokensInArea,
  type ResolveAreaActions,
  type ResolveAuras,
  type ResolveCombatStats,
  type SceneAreaAction,
} from '../rules';
import type { Campaign } from '../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type { GameSystemId } from '../types/game-systems';
import type {
  SceneActionIntent,
  SceneDocument,
  SceneEvent,
  SceneMarkerKind,
  SceneTokenKind,
} from '../types/core/scene';
import { systemRegistry } from '../registry';
import { loadMonstersForSystem, loadSpellsForSystem } from '../utils/dataLoader';
import type { Spell } from '../types/magic/spells';
import { exportScenes, importScenes } from '../utils/sceneStorage';
import { generateUUID } from '../utils/browserCompat';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { SceneGridView } from './SceneGridView';
import { EncounterPanel } from './scene/EncounterPanel';
import { InitiativeTracker } from './scene/InitiativeTracker';
import { MarkerPanel } from './scene/MarkerPanel';
import { TokenPanel } from './scene/TokenPanel';
import { CombatPanel } from './scene/CombatPanel';

type PlacementMode = 'none' | 'token' | 'marker';

interface Props {
  scenes: SceneDocument[];
  documents: CharacterDocument<SystemDataModel>[];
  campaigns: Campaign[];
  onAddScene: (scene: SceneDocument) => void;
  onAddScenes: (scenes: SceneDocument[]) => void;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  onDeleteScene: (id: string) => void;
}

const DEFAULT_SYSTEM_ID = 'dnd-5e-2024';

export function SceneManager({
  scenes,
  documents,
  campaigns,
  onAddScene,
  onAddScenes,
  onAppendSceneEvent,
  onDeleteScene,
}: Props) {
  const systemOptions = useMemo(() => systemRegistry.getAll(), []);
  const fallbackSystemId = systemOptions[0]?.id ?? DEFAULT_SYSTEM_ID;
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(scenes[0]?.id ?? null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneSystemId, setNewSceneSystemId] = useState<string>(DEFAULT_SYSTEM_ID);
  const [newSceneCampaignId, setNewSceneCampaignId] = useState('');
  const [newSceneWidth, setNewSceneWidth] = useState('12');
  const [newSceneHeight, setNewSceneHeight] = useState('10');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('none');
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>();
  const [tokenDocumentId, setTokenDocumentId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenKind, setTokenKind] = useState<SceneTokenKind>('character');
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerKind, setMarkerKind] = useState<SceneMarkerKind>('hazard');
  const [markerBlocksLoE, setMarkerBlocksLoE] = useState(false);
  const [markerWidth, setMarkerWidth] = useState('1');
  const [markerHeight, setMarkerHeight] = useState('1');
  const [encounterMonsters, setEncounterMonsters] = useState<Monster[]>([]);
  const [encounterMonsterId, setEncounterMonsterId] = useState('');
  const [encounterCount, setEncounterCount] = useState('1');
  const [encounterOriginX, setEncounterOriginX] = useState('0');
  const [encounterOriginY, setEncounterOriginY] = useState('0');
  const [encounterSelections, setEncounterSelections] = useState<EncounterMonsterSelection[]>([]);
  const [monstersLoading, setMonstersLoading] = useState(false);
  const [monsterLoadError, setMonsterLoadError] = useState<string | null>(null);
  const [spellsById, setSpellsById] = useState<Map<string, Spell>>(() => new Map());
  const [initiativeValues, setInitiativeValues] = useState<Record<string, string>>({});
  const [actionIssues, setActionIssues] = useState<string[]>([]);
  const [combatTargetId, setCombatTargetId] = useState('');
  const [combatSaveActionName, setCombatSaveActionName] = useState('');
  const [combatLog, setCombatLog] = useState<string[]>([]);
  // Per-click nonce so a missed attack (which appends no event) still advances
  // the RNG stream — otherwise re-clicking Attack would reproduce the same miss.
  const attackNonce = useRef(0);

  useEffect(() => {
    if (selectedSceneId && scenes.some((scene) => scene.id === selectedSceneId)) return;
    setSelectedSceneId(scenes[0]?.id ?? null);
    setSelectedTokenId(undefined);
    setPlacementMode('none');
  }, [scenes, selectedSceneId]);

  useEffect(() => {
    if (systemOptions.some((system) => system.id === newSceneSystemId)) return;
    setNewSceneSystemId(fallbackSystemId);
  }, [fallbackSystemId, newSceneSystemId, systemOptions]);

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId),
    [scenes, selectedSceneId]
  );
  const foldedScene = useMemo(
    () => (selectedScene ? foldSceneEvents(selectedScene) : undefined),
    [selectedScene]
  );
  const state = foldedScene?.state;
  const sceneSystemId = state?.systemId;

  useEffect(() => {
    if (!sceneSystemId || !isMonsterSystemId(sceneSystemId)) {
      setEncounterMonsters([]);
      setEncounterMonsterId('');
      setEncounterSelections([]);
      setMonstersLoading(false);
      setMonsterLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setMonstersLoading(true);
    setMonsterLoadError(null);

    loadMonstersForSystem(sceneSystemId)
      .then((monsters) => {
        if (cancelled) return;
        const sorted = [...monsters].sort(
          (a, b) => a.challengeRating - b.challengeRating || a.name.localeCompare(b.name)
        );
        setEncounterMonsters(sorted);
        setEncounterSelections([]);
        setEncounterMonsterId((current) =>
          sorted.some((monster) => monster.id === current) ? current : (sorted[0]?.id ?? '')
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setEncounterMonsters([]);
        setEncounterMonsterId('');
        setMonsterLoadError(err instanceof Error ? err.message : 'Failed to load monsters.');
      })
      .finally(() => {
        if (!cancelled) setMonstersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sceneSystemId]);

  // Load the system's spells so a selected PC caster can unleash its known AoE
  // spells (fireball, etc.); skipped for systems without character combatants.
  useEffect(() => {
    if (!sceneSystemId || !isSpellcasterSystem(sceneSystemId)) {
      setSpellsById(new Map());
      return undefined;
    }
    let cancelled = false;
    loadSpellsForSystem(sceneSystemId)
      .then((spells) => {
        if (!cancelled) setSpellsById(new Map(spells.map((spell) => [spell.id, spell])));
      })
      .catch(() => {
        if (!cancelled) setSpellsById(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, [sceneSystemId]);

  const eligibleDocuments = useMemo(() => {
    if (!state) return [];
    const sceneCampaign = state.campaignId
      ? campaigns.find((campaign) => campaign.id === state.campaignId)
      : undefined;

    return documents.filter((doc) => {
      if (doc.systemId !== state.systemId) return false;
      if (!sceneCampaign) return true;
      return sceneCampaign.characterIds.includes(doc.id);
    });
  }, [campaigns, documents, state]);
  const selectedEncounterMonster = useMemo(
    () => encounterMonsters.find((monster) => monster.id === encounterMonsterId),
    [encounterMonsterId, encounterMonsters]
  );
  const encounterCountValue = positiveIntegerOrDefault(encounterCount, 1);
  const currentEncounterSelection = selectedEncounterMonster
    ? [{ monsterId: selectedEncounterMonster.id, count: encounterCountValue }]
    : [];
  const pendingEncounterSelections =
    encounterSelections.length > 0 ? encounterSelections : currentEncounterSelection;
  const encounterPlan = useMemo(
    () =>
      summarizeEncounterPlan({
        monsters: encounterMonsters,
        selections: pendingEncounterSelections,
        systemId: sceneSystemId,
      }),
    [encounterMonsters, pendingEncounterSelections, sceneSystemId]
  );
  const encounterParty = useMemo(
    () => summarizeEncounterParty(eligibleDocuments),
    [eligibleDocuments]
  );
  const encounterXpPerPartyLevel =
    encounterParty.totalLevel > 0
      ? Math.round(encounterPlan.totalXp / encounterParty.totalLevel)
      : 0;
  const selectedEncounterTotalXp = selectedEncounterMonster
    ? selectedEncounterMonster.experiencePoints * encounterCountValue
    : 0;

  useEffect(() => {
    if (!state) return;

    setInitiativeValues((current) => {
      const next = { ...current };
      state.initiative.forEach((entry) => {
        next[entry.tokenId] = String(entry.value);
      });
      Object.keys(state.tokens).forEach((tokenId) => {
        next[tokenId] ??= '10';
      });
      Object.keys(next).forEach((tokenId) => {
        if (!state.tokens[tokenId]) {
          delete next[tokenId];
        }
      });
      return next;
    });

    if (selectedTokenId && !state.tokens[selectedTokenId]) {
      setSelectedTokenId(undefined);
    }
  }, [selectedTokenId, state]);

  const handleCreateScene = () => {
    const name = newSceneName.trim();
    if (!name) return;

    const id = generateUUID();
    const campaignId = newSceneCampaignId || undefined;
    const campaign = campaignId ? campaigns.find((entry) => entry.id === campaignId) : undefined;
    const systemId = campaign?.systemId ?? newSceneSystemId;
    const scene = createSceneDocument({
      id,
      name,
      systemId,
      campaignId,
      seed: id,
      grid: {
        width: positiveIntegerOrDefault(newSceneWidth, 12),
        height: positiveIntegerOrDefault(newSceneHeight, 10),
      },
    });

    onAddScene(scene);
    setSelectedSceneId(scene.id);
    setNewSceneName('');
    setCreatingNew(false);
    setActionIssues([]);
  };

  const emitSceneAction = (scene: SceneDocument, intent: SceneActionIntent) => {
    const result = resolveSceneAction(scene, intent, {
      eventId: generateUUID(),
      createdAt: new Date(),
    });

    if (!result.event) {
      setActionIssues(result.issues.map((issue) => issue.message));
      return false;
    }

    onAppendSceneEvent(scene.id, result.event);
    setActionIssues(result.issues.map((issue) => issue.message));
    return true;
  };

  // Combat stats are resolved at action time from a token's refId (monster
  // statblock or character document), never stored on the token. Tokens whose
  // stats can't be resolved (no refId, unsupported system) simply can't fight.
  const monstersById = useMemo(() => {
    const map = new Map<string, Monster>();
    encounterMonsters.forEach((monster) => map.set(monster.id, monster));
    return map;
  }, [encounterMonsters]);
  const documentsById = useMemo(() => {
    const map = new Map<string, CharacterDocument<SystemDataModel>>();
    documents.forEach((doc) => map.set(doc.id, doc));
    return map;
  }, [documents]);

  const resolveCombatStats = useCallback<ResolveCombatStats>(
    (token) => {
      if (token.kind === 'monster' && token.refId) {
        const monster = monstersById.get(token.refId);
        if (!monster) return undefined;
        const built = buildMonsterCombatant(monster, {
          tokenId: token.id,
          position: token.position,
        });
        return {
          attackEffects: built.attackEffects,
          damageEffects: built.damageEffects,
          armorClass: built.armorClass,
          reach: built.reach,
          saveBonus: (ability: string) => monsterSaveBonus(monster, ability),
        };
      }
      if (token.kind === 'character' && token.refId) {
        const doc = documentsById.get(token.refId);
        if (!doc) return undefined;
        const built = buildCharacterCombatant(doc, { tokenId: token.id, position: token.position });
        if (!built.supported) return undefined;
        return {
          attackEffects: built.combatant.attackEffects,
          damageEffects: built.combatant.damageEffects,
          armorClass: built.combatant.armorClass,
          reach: built.combatant.reach,
          saveBonus: (ability: string) => characterSaveBonus(doc, ability),
        };
      }
      return undefined;
    },
    [monstersById, documentsById]
  );

  const combatReadyIds = useMemo(() => {
    const ids = new Set<string>();
    if (!state) return ids;
    Object.values(state.tokens).forEach((token) => {
      if (resolveCombatStats(token)) ids.add(token.id);
    });
    return ids;
  }, [state, resolveCombatStats]);

  const handleCombatAttack = () => {
    if (!selectedScene || !state || !selectedTokenId || !combatTargetId) return;
    const outcome = resolveSceneAttack({
      state,
      attackerId: selectedTokenId,
      targetId: combatTargetId,
      resolveStats: resolveCombatStats,
      seed: `${selectedScene.initialState.seed}:attack:${selectedScene.events.length}`,
      cause: 'attack',
    });
    if (outcome.intent) {
      emitSceneAction(selectedScene, outcome.intent);
    }
    setCombatLog((current) => [outcome.log, ...current].slice(0, 30));
  };

  const handleRunRound = () => {
    if (!selectedScene || !state) return;
    const outcome = runSceneRound({
      state,
      resolveStats: resolveCombatStats,
      resolveAreaActions,
      resolveAuras,
      seed: `${selectedScene.initialState.seed}:round:${state.round}:${selectedScene.events.length}:${attackNonce.current++}`,
      round: state.round,
    });

    // Thread a local copy so each emitted event gets a correct sequence, then
    // dispatch them all through the event-sourced persistence path.
    let working = selectedScene;
    const events: SceneEvent[] = [];
    for (const intent of outcome.intents) {
      const result = resolveSceneAction(working, intent, {
        eventId: generateUUID(),
        createdAt: new Date(),
      });
      if (result.event) {
        events.push(result.event);
        working = appendSceneEvent(working, result.event);
      }
    }
    events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setCombatLog((current) => [...outcome.log.slice().reverse(), ...current].slice(0, 30));
    setActionIssues([]);
  };

  // Save-based area actions a token can unleash: a monster's breath / AoE from
  // its statblock, or a PC caster's known AoE spells (fireball, etc.). Shared by
  // the manual panel (selected token) and the auto round-runner (every token).
  const resolveAreaActions = useCallback<ResolveAreaActions>(
    (token) => {
      if (!token.refId) return [];
      if (token.kind === 'monster') {
        const monster = monstersById.get(token.refId);
        return monster ? monsterSaveActions(monster) : [];
      }
      if (token.kind === 'character') {
        const doc = documentsById.get(token.refId);
        return doc ? casterSpellAreaActions(doc, spellsById, doc.systemId as GameSystemId) : [];
      }
      return [];
    },
    [monstersById, documentsById, spellsById]
  );

  const attackerAreaActions = useMemo<SceneAreaAction[]>(() => {
    if (!state || !selectedTokenId) return [];
    const token = state.tokens[selectedTokenId];
    return token ? resolveAreaActions(token) : [];
  }, [state, selectedTokenId, resolveAreaActions]);

  // Recurring auras (e.g. a Balor's Fire Aura) a token emits each round, for the
  // auto round-runner to pulse on its turn.
  const resolveAuras = useCallback<ResolveAuras>(
    (token) => {
      if (token.kind !== 'monster' || !token.refId) return [];
      const monster = monstersById.get(token.refId);
      return monster ? monsterAuras(monster) : [];
    },
    [monstersById]
  );

  const selectedSaveAction = useMemo(
    () => attackerAreaActions.find((action) => action.name === combatSaveActionName),
    [attackerAreaActions, combatSaveActionName]
  );

  // Live count of tokens the chosen area action would catch, aimed at the current
  // target — drives the "N creatures in area" hint before committing.
  const areaPreviewCount = useMemo(() => {
    if (!state || !selectedTokenId || !selectedSaveAction || !combatTargetId) return 0;
    const source = state.tokens[selectedTokenId];
    const aim = state.tokens[combatTargetId];
    if (!source || !aim) return 0;
    const shape = areaShapeForAction(selectedSaveAction.area, source.position, aim.position);
    const rule = diagonalRuleForSystem(state.systemId);
    return tokensInArea(state, shape, rule).filter(
      (token) => token.id !== selectedTokenId && (token.hp ? token.hp.current > 0 : false)
    ).length;
  }, [state, selectedTokenId, selectedSaveAction, combatTargetId]);

  const handleAreaEffect = () => {
    if (!selectedScene || !state || !selectedTokenId || !selectedSaveAction || !combatTargetId) {
      return;
    }
    const aim = state.tokens[combatTargetId];
    if (!aim) return;

    const outcome = resolveSceneAreaEffect({
      state,
      sourceId: selectedTokenId,
      action: selectedSaveAction,
      aim: aim.position,
      resolveStats: resolveCombatStats,
      seed: `${selectedScene.initialState.seed}:area:${selectedScene.events.length}:${attackNonce.current++}`,
      cause: selectedSaveAction.name,
    });
    if (outcome.intent) {
      emitSceneAction(selectedScene, outcome.intent);
    }
    setCombatLog((current) => [...outcome.log, ...current].slice(0, 30));
  };

  const handleCellActivate = (position: { x: number; y: number }) => {
    if (!selectedScene || !state) return;

    if (placementMode === 'token') {
      const linkedDoc = documents.find((doc) => doc.id === tokenDocumentId);
      const name = tokenName.trim() || linkedDoc?.name.trim();
      if (!name) return;

      // A linked character token carries combat HP so it is grid-combat-ready.
      const built = linkedDoc
        ? buildCharacterCombatant(linkedDoc, { tokenId: linkedDoc.id, position })
        : undefined;
      const hp = built && built.supported ? built.combatant.token.hp : undefined;

      const placed = emitSceneAction(selectedScene, {
        type: 'place-token',
        token: {
          id: generateUUID(),
          name,
          kind: linkedDoc ? 'character' : tokenKind,
          position,
          size: 1,
          refId: linkedDoc?.id,
          ...(hp ? { hp } : {}),
        },
      });

      if (placed) {
        setPlacementMode('none');
        setTokenName('');
        setTokenDocumentId('');
      }
      return;
    }

    if (placementMode === 'marker') {
      const label = markerLabel.trim();
      if (!label) return;

      const placed = emitSceneAction(selectedScene, {
        type: 'add-marker',
        marker: {
          id: generateUUID(),
          kind: markerKind,
          label,
          position,
          width: positiveIntegerOrDefault(markerWidth, 1),
          height: positiveIntegerOrDefault(markerHeight, 1),
          // A wall carries a `cover` terrain effect so area resolution treats it
          // as blocking line of effect (and casts the cover gradient behind it).
          ...(markerBlocksLoE
            ? {
                effects: [
                  {
                    target: 'cover',
                    operation: 'set',
                    value: 'total',
                    label: 'Blocks line of effect',
                  },
                ],
              }
            : {}),
        },
      });

      if (placed) {
        setPlacementMode('none');
        setMarkerLabel('');
        setMarkerBlocksLoE(false);
      }
      return;
    }

    if (selectedTokenId && state.tokens[selectedTokenId]) {
      emitSceneAction(selectedScene, {
        type: 'move-token',
        tokenId: selectedTokenId,
        position,
      });
    }
  };

  const handleSelectLinkedDocument = (documentId: string) => {
    setTokenDocumentId(documentId);
    const doc = documents.find((entry) => entry.id === documentId);
    if (doc) {
      setTokenName(doc.name);
      setTokenKind('character');
    }
  };

  const handleDeleteSelectedToken = () => {
    if (!selectedScene || !selectedTokenId) return;
    const removed = emitSceneAction(selectedScene, {
      type: 'remove-token',
      tokenId: selectedTokenId,
    });
    if (removed) setSelectedTokenId(undefined);
  };

  const handleDeleteMarker = (markerId: string) => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, {
      type: 'remove-marker',
      markerId,
    });
  };

  const handleSetInitiative = () => {
    if (!selectedScene || !state) return;

    const entries = Object.values(state.tokens)
      .map((token) => ({
        tokenId: token.id,
        value: Number.parseFloat(initiativeValues[token.id] ?? '10'),
      }))
      .filter((entry) => Number.isFinite(entry.value))
      .sort((a, b) => b.value - a.value);

    emitSceneAction(selectedScene, {
      type: 'set-initiative',
      entries,
      activeTokenId: entries[0]?.tokenId,
    });
  };

  const handleAdvanceTurn = () => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, { type: 'advance-turn' });
  };

  const handleQueueEncounterMonster = () => {
    if (!encounterMonsterId) return;

    const count = Math.min(encounterCountValue, MAX_MONSTERS_PER_SELECTION);
    setEncounterSelections((current) => {
      const existing = current.find((selection) => selection.monsterId === encounterMonsterId);
      if (!existing) {
        return [...current, { monsterId: encounterMonsterId, count }];
      }

      return current.map((selection) =>
        selection.monsterId === encounterMonsterId
          ? {
              ...selection,
              count: Math.min(MAX_MONSTERS_PER_SELECTION, selection.count + count),
            }
          : selection
      );
    });
    setEncounterCount('1');
    setActionIssues([]);
  };

  const handleRemoveEncounterSelection = (monsterId: string) => {
    setEncounterSelections((current) =>
      current.filter((selection) => selection.monsterId !== monsterId)
    );
  };

  const handleAddEncounter = () => {
    if (!selectedScene || pendingEncounterSelections.length === 0) return;

    const result = buildEncounterSceneEvents({
      scene: selectedScene,
      monsters: encounterMonsters,
      selections: pendingEncounterSelections,
      origin: {
        x: Math.max(0, positiveIntegerOrDefault(encounterOriginX, 0)),
        y: Math.max(0, positiveIntegerOrDefault(encounterOriginY, 0)),
      },
      seed: `${selectedScene.initialState.seed}:encounter:${selectedScene.events.length}`,
      createdAt: new Date(),
      eventIdFactory: generateUUID,
    });

    if (result.issues.length > 0) {
      setActionIssues(result.issues.map((issue) => issue.message));
      return;
    }

    result.events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setEncounterSelections([]);
    setSelectedTokenId(undefined);
    setPlacementMode('none');
    setActionIssues([]);
  };

  const handleImportScenes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const imported = importScenes(String(loadEvent.target?.result ?? ''));
          onAddScenes(imported);
          setSelectedSceneId(imported[0]?.id ?? selectedSceneId);
          setActionIssues([]);
        } catch (err) {
          setActionIssues([err instanceof Error ? err.message : 'Failed to import scenes.']);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportScenes = (targetScenes: SceneDocument[], filename: string) => {
    const link = document.createElement('a');
    link.href = `data:application/json;charset=utf-8,${encodeURIComponent(exportScenes(targetScenes))}`;
    link.download = filename;
    link.click();
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <MapIcon className="h-6 w-6" /> Scenes
          </h3>
          <p className="text-sm text-muted-foreground">
            {scenes.length} scene{scenes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleImportScenes}>
            <Upload className="mr-1.5 h-4 w-4" />
            Import Scenes
          </Button>
          {scenes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportScenes(
                  scenes,
                  `all_scenes_${new Date().toISOString().slice(0, 10)}.json`
                )
              }
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export All Scenes
            </Button>
          )}
          {!creatingNew && (
            <Button variant="outline" size="sm" onClick={() => setCreatingNew(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Scene
            </Button>
          )}
        </div>
      </div>

      {creatingNew && (
        <div className="grid gap-2 rounded-lg border bg-card p-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_minmax(10rem,14rem)_5rem_5rem_auto_auto] md:items-center">
          <Input
            autoFocus
            value={newSceneName}
            onChange={(event) => setNewSceneName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleCreateScene();
              if (event.key === 'Escape') setCreatingNew(false);
            }}
            placeholder="Scene name"
          />
          <Select
            aria-label="Scene campaign"
            value={newSceneCampaignId}
            onChange={(event) => {
              const campaignId = event.target.value;
              setNewSceneCampaignId(campaignId);
              const campaign = campaigns.find((entry) => entry.id === campaignId);
              if (campaign?.systemId) {
                setNewSceneSystemId(campaign.systemId);
              }
            }}
          >
            <option value="">No campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Scene system"
            value={newSceneSystemId}
            onChange={(event) => setNewSceneSystemId(event.target.value)}
          >
            {systemOptions.map((system) => (
              <option key={system.id} value={system.id}>
                {system.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Scene width"
            inputMode="numeric"
            value={newSceneWidth}
            onChange={(event) => setNewSceneWidth(event.target.value)}
          />
          <Input
            aria-label="Scene height"
            inputMode="numeric"
            value={newSceneHeight}
            onChange={(event) => setNewSceneHeight(event.target.value)}
          />
          <Button size="sm" onClick={handleCreateScene} disabled={!newSceneName.trim()}>
            Create
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCreatingNew(false);
              setNewSceneName('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {actionIssues.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionIssues[0]}
        </div>
      )}

      {scenes.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="space-y-2">
            {scenes.map((scene) => {
              const { state: sceneState, issues } = foldSceneEvents(scene);
              const system = systemRegistry.get(scene.systemId);
              const campaign = scene.campaignId
                ? campaigns.find((entry) => entry.id === scene.campaignId)
                : undefined;
              const isSelected = scene.id === selectedScene?.id;

              return (
                <button
                  key={scene.id}
                  type="button"
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedSceneId(scene.id);
                    setSelectedTokenId(undefined);
                    setPlacementMode('none');
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{scene.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {system?.label ?? scene.systemId}
                        {campaign ? ` / ${campaign.name}` : ''}
                      </div>
                    </div>
                    {issues.length > 0 && (
                      <Badge variant="destructive" className="shrink-0">
                        {issues.length}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                    <span>{Object.keys(sceneState.tokens).length} tokens</span>
                    <span>{Object.keys(sceneState.markers).length} markers</span>
                    <span>{scene.events.length} events</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedScene && state && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-lg font-semibold tracking-tight">
                      {selectedScene.name}
                    </h4>
                    {placementMode !== 'none' && (
                      <Badge variant="info">
                        <MousePointer2 className="mr-1 h-3 w-3" />
                        {placementMode}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {systemRegistry.get(selectedScene.systemId)?.label ?? selectedScene.systemId} /
                    Round {state.round}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleExportScenes(
                        [selectedScene],
                        `${selectedScene.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_scene.json`
                      )
                    }
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteScene(selectedScene.id)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {foldedScene?.issues.length ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {foldedScene.issues[0].message}
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <SceneGridView
                  state={state}
                  selectedTokenId={selectedTokenId}
                  onCellActivate={handleCellActivate}
                  onTokenActivate={(token) => {
                    setSelectedTokenId(token.id);
                    setPlacementMode('none');
                  }}
                />

                <div className="space-y-3">
                  <TokenPanel
                    eligibleDocuments={eligibleDocuments}
                    tokenDocumentId={tokenDocumentId}
                    onSelectLinkedDocument={handleSelectLinkedDocument}
                    tokenName={tokenName}
                    onTokenNameChange={setTokenName}
                    tokenKind={tokenKind}
                    onTokenKindChange={setTokenKind}
                    isPlacing={placementMode === 'token'}
                    onTogglePlace={() =>
                      setPlacementMode((current) => (current === 'token' ? 'none' : 'token'))
                    }
                    canDeleteToken={Boolean(selectedTokenId)}
                    onDeleteSelectedToken={handleDeleteSelectedToken}
                  />

                  <EncounterPanel
                    monsters={encounterMonsters}
                    monsterId={encounterMonsterId}
                    onMonsterChange={setEncounterMonsterId}
                    count={encounterCount}
                    onCountChange={setEncounterCount}
                    originX={encounterOriginX}
                    onOriginXChange={setEncounterOriginX}
                    originY={encounterOriginY}
                    onOriginYChange={setEncounterOriginY}
                    loading={monstersLoading}
                    loadError={monsterLoadError}
                    selectedMonster={selectedEncounterMonster}
                    selectedMonsterTotalXp={selectedEncounterTotalXp}
                    canAddEncounter={pendingEncounterSelections.length > 0}
                    hasSelections={encounterSelections.length > 0}
                    plan={encounterPlan}
                    party={encounterParty}
                    xpPerPartyLevel={encounterXpPerPartyLevel}
                    onQueueMonster={handleQueueEncounterMonster}
                    onAddEncounter={handleAddEncounter}
                    onRemoveSelection={handleRemoveEncounterSelection}
                  />

                  <MarkerPanel
                    markerLabel={markerLabel}
                    onMarkerLabelChange={setMarkerLabel}
                    markerKind={markerKind}
                    onMarkerKindChange={setMarkerKind}
                    markerWidth={markerWidth}
                    onMarkerWidthChange={setMarkerWidth}
                    markerHeight={markerHeight}
                    onMarkerHeightChange={setMarkerHeight}
                    markerBlocksLoE={markerBlocksLoE}
                    onMarkerBlocksLoEChange={setMarkerBlocksLoE}
                    isPlacing={placementMode === 'marker'}
                    onTogglePlace={() =>
                      setPlacementMode((current) => (current === 'marker' ? 'none' : 'marker'))
                    }
                    markers={state.markers}
                    onDeleteMarker={handleDeleteMarker}
                  />

                  <InitiativeTracker
                    tokens={state.tokens}
                    initiativeValues={initiativeValues}
                    onInitiativeChange={(tokenId, value) =>
                      setInitiativeValues((current) => ({ ...current, [tokenId]: value }))
                    }
                    onAdvanceTurn={handleAdvanceTurn}
                    onSetOrder={handleSetInitiative}
                  />

                  <CombatPanel
                    state={state}
                    attackerId={selectedTokenId}
                    combatReadyIds={combatReadyIds}
                    targetId={combatTargetId}
                    onTargetChange={setCombatTargetId}
                    onAttack={handleCombatAttack}
                    onRunRound={handleRunRound}
                    saveActions={attackerAreaActions}
                    selectedSaveActionName={selectedSaveAction?.name ?? ''}
                    onSaveActionChange={setCombatSaveActionName}
                    onAreaEffect={handleAreaEffect}
                    areaPreviewCount={areaPreviewCount}
                    log={combatLog}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function positiveIntegerOrDefault(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isMonsterSystemId(systemId: string): systemId is GameSystemId {
  return systemId === 'dnd-5e-2014' || systemId === 'dnd-5e-2024';
}

/** Systems whose characters become combatants and can therefore cast AoE spells. */
function isSpellcasterSystem(systemId: string): systemId is GameSystemId {
  return (
    systemId === 'dnd-5e-2014' ||
    systemId === 'dnd-5e-2024' ||
    systemId === 'dnd-3.5e' ||
    systemId === 'pf1e' ||
    systemId === 'pf2e'
  );
}
