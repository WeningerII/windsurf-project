import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Map,
  MousePointer2,
  Plus,
  RotateCcw,
  Skull,
  Swords,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  MAX_MONSTERS_PER_SELECTION,
  buildEncounterSceneEvents,
  summarizeEncounterParty,
  summarizeEncounterPlan,
  type EncounterMonsterSelection,
} from '../scene/encounterBuilder';
import { createSceneDocument, foldSceneEvents, resolveSceneAction } from '../scene/runtime';
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
import { loadMonstersForSystem } from '../utils/dataLoader';
import { exportScenes, importScenes } from '../utils/sceneStorage';
import { generateUUID } from '../utils/browserCompat';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { SceneGridView } from './SceneGridView';

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
  const [initiativeValues, setInitiativeValues] = useState<Record<string, string>>({});
  const [actionIssues, setActionIssues] = useState<string[]>([]);

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

  const handleCellActivate = (position: { x: number; y: number }) => {
    if (!selectedScene || !state) return;

    if (placementMode === 'token') {
      const linkedDoc = documents.find((doc) => doc.id === tokenDocumentId);
      const name = tokenName.trim() || linkedDoc?.name.trim();
      if (!name) return;

      const placed = emitSceneAction(selectedScene, {
        type: 'place-token',
        token: {
          id: generateUUID(),
          name,
          kind: linkedDoc ? 'character' : tokenKind,
          position,
          size: 1,
          refId: linkedDoc?.id,
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
        },
      });

      if (placed) {
        setPlacementMode('none');
        setMarkerLabel('');
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
            <Map className="h-6 w-6" /> Scenes
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
                  <div className="rounded-lg border bg-card p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h5 className="text-sm font-semibold">Token</h5>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={!selectedTokenId}
                        onClick={handleDeleteSelectedToken}
                        title="Remove token"
                        aria-label="Remove token"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Select
                        aria-label="Linked character"
                        value={tokenDocumentId}
                        onChange={(event) => {
                          const docId = event.target.value;
                          setTokenDocumentId(docId);
                          const doc = documents.find((entry) => entry.id === docId);
                          if (doc) {
                            setTokenName(doc.name);
                            setTokenKind('character');
                          }
                        }}
                      >
                        <option value="">Manual token</option>
                        {eligibleDocuments.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name}
                          </option>
                        ))}
                      </Select>
                      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                        <Input
                          aria-label="Token name"
                          value={tokenName}
                          onChange={(event) => setTokenName(event.target.value)}
                          placeholder="Token name"
                        />
                        <Select
                          aria-label="Token kind"
                          value={tokenKind}
                          onChange={(event) => setTokenKind(event.target.value as SceneTokenKind)}
                          disabled={Boolean(tokenDocumentId)}
                        >
                          <option value="character">Character</option>
                          <option value="monster">Monster</option>
                          <option value="npc">NPC</option>
                          <option value="object">Object</option>
                        </Select>
                      </div>
                      <Button
                        variant={placementMode === 'token' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          setPlacementMode((current) => (current === 'token' ? 'none' : 'token'))
                        }
                        disabled={!tokenName.trim() && !tokenDocumentId}
                      >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Place Token
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h5 className="text-sm font-semibold">Encounter</h5>
                      <Skull className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Select
                        aria-label="Encounter monster"
                        value={encounterMonsterId}
                        onChange={(event) => setEncounterMonsterId(event.target.value)}
                        disabled={monstersLoading || encounterMonsters.length === 0}
                      >
                        {encounterMonsters.length === 0 ? (
                          <option value="">
                            {monstersLoading ? 'Loading monsters...' : 'No monsters'}
                          </option>
                        ) : (
                          encounterMonsters.map((monster) => (
                            <option key={monster.id} value={monster.id}>
                              {monster.name} (CR {monster.challengeRating})
                            </option>
                          ))
                        )}
                      </Select>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          aria-label="Encounter count"
                          inputMode="numeric"
                          value={encounterCount}
                          onChange={(event) => setEncounterCount(event.target.value)}
                        />
                        <Input
                          aria-label="Encounter start x"
                          inputMode="numeric"
                          value={encounterOriginX}
                          onChange={(event) => setEncounterOriginX(event.target.value)}
                        />
                        <Input
                          aria-label="Encounter start y"
                          inputMode="numeric"
                          value={encounterOriginY}
                          onChange={(event) => setEncounterOriginY(event.target.value)}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedEncounterMonster
                          ? `${selectedEncounterTotalXp} XP / ${selectedEncounterMonster.source}`
                          : monsterLoadError || 'Loader-backed monsters only'}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!encounterMonsterId || monstersLoading}
                          onClick={handleQueueEncounterMonster}
                        >
                          <Plus className="mr-1.5 h-4 w-4" />
                          Queue Monster
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pendingEncounterSelections.length === 0 || monstersLoading}
                          onClick={handleAddEncounter}
                        >
                          <Plus className="mr-1.5 h-4 w-4" />
                          Add Encounter
                        </Button>
                      </div>
                      {encounterSelections.length > 0 && (
                        <div className="space-y-1 rounded border bg-muted/30 p-2">
                          {encounterPlan.entries.map((entry) => (
                            <div
                              key={entry.monsterId}
                              className="flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="min-w-0 truncate">
                                {entry.count} x {entry.name} ({entry.totalXp} XP)
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => handleRemoveEncounterSelection(entry.monsterId)}
                                title={`Remove ${entry.name} from encounter`}
                                aria-label={`Remove ${entry.name} from encounter`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {encounterPlan.issues.length > 0 ? (
                          <div className="text-destructive">{encounterPlan.issues[0].message}</div>
                        ) : (
                          <div>
                            Plan: {encounterPlan.totalCount} monster
                            {encounterPlan.totalCount === 1 ? '' : 's'} / {encounterPlan.totalXp} XP
                          </div>
                        )}
                        {encounterParty.members.length > 0 ? (
                          <div>
                            Party: {encounterParty.members.length} PC
                            {encounterParty.members.length === 1 ? '' : 's'} / avg level{' '}
                            {formatAverageLevel(encounterParty.averageLevel)} /{' '}
                            {encounterXpPerPartyLevel} XP per party level
                          </div>
                        ) : (
                          <div>Party: no linked character levels</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-3">
                    <h5 className="mb-2 text-sm font-semibold">Marker</h5>
                    <div className="space-y-2">
                      <Input
                        aria-label="Marker label"
                        value={markerLabel}
                        onChange={(event) => setMarkerLabel(event.target.value)}
                        placeholder="Marker label"
                      />
                      <div className="grid grid-cols-[minmax(0,1fr)_4rem_4rem] gap-2">
                        <Select
                          aria-label="Marker kind"
                          value={markerKind}
                          onChange={(event) => setMarkerKind(event.target.value as SceneMarkerKind)}
                        >
                          <option value="hazard">Hazard</option>
                          <option value="terrain">Terrain</option>
                        </Select>
                        <Input
                          aria-label="Marker width"
                          inputMode="numeric"
                          value={markerWidth}
                          onChange={(event) => setMarkerWidth(event.target.value)}
                        />
                        <Input
                          aria-label="Marker height"
                          inputMode="numeric"
                          value={markerHeight}
                          onChange={(event) => setMarkerHeight(event.target.value)}
                        />
                      </div>
                      <Button
                        variant={placementMode === 'marker' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          setPlacementMode((current) => (current === 'marker' ? 'none' : 'marker'))
                        }
                        disabled={!markerLabel.trim()}
                      >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Place Marker
                      </Button>
                      {Object.values(state.markers).length > 0 && (
                        <div className="space-y-1 pt-1">
                          {Object.values(state.markers).map((marker) => (
                            <div
                              key={marker.id}
                              className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-sm"
                            >
                              <span className="min-w-0 truncate">
                                {marker.label} ({marker.kind})
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => handleDeleteMarker(marker.id)}
                                title={`Remove ${marker.label}`}
                                aria-label={`Remove ${marker.label}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h5 className="text-sm font-semibold">Initiative</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={Object.keys(state.tokens).length === 0}
                        onClick={handleAdvanceTurn}
                      >
                        <RotateCcw className="mr-1.5 h-4 w-4" />
                        Next Turn
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {Object.values(state.tokens).map((token) => (
                        <label
                          key={token.id}
                          className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 text-sm"
                        >
                          <span className="truncate">{token.name}</span>
                          <Input
                            aria-label={`${token.name} initiative`}
                            inputMode="numeric"
                            value={initiativeValues[token.id] ?? '10'}
                            onChange={(event) =>
                              setInitiativeValues((current) => ({
                                ...current,
                                [token.id]: event.target.value,
                              }))
                            }
                          />
                        </label>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={Object.keys(state.tokens).length === 0}
                        onClick={handleSetInitiative}
                      >
                        <Swords className="mr-1.5 h-4 w-4" />
                        Set Order
                      </Button>
                    </div>
                  </div>
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

function formatAverageLevel(level: number): string {
  return Number.isInteger(level) ? String(level) : level.toFixed(1);
}

function isMonsterSystemId(systemId: string): systemId is GameSystemId {
  return systemId === 'dnd-5e-2014' || systemId === 'dnd-5e-2024';
}
