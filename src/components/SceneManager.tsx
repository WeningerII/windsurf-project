import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, MousePointer2, Trash2 } from 'lucide-react';
import { useSceneEncounter } from './scene/useSceneEncounter';
import { supportsEncounterBudget } from '../scene/encounterDraft';
import { narrateSceneWithAi } from '../ai/sceneNarrationFlow';
import { illustrateSceneWithAi } from '../ai/illustrateSceneFlow';
import { isAiEnabled } from '../ai/gatewayClient';
import { foldSceneEvents } from '../scene/runtime';
import { buildDaggerheartAdversaryCombatant } from '../rules';
import { sceneConditionOptions } from './scene/sceneConditionOptions';
import type { Campaign } from '../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type {
  SceneCheckMode,
  SceneCoordinate,
  SceneDocument,
  SceneEvent,
  SceneOracleOdds,
  SceneToken,
} from '../types/core/scene';
import { systemRegistry } from '../registry';
import { exportScenes } from '../utils/sceneStorage';
import { downloadTextFile } from '../utils/fileTransfer';
import { generateUUID } from '../utils/browserCompat';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { SceneGridView } from './SceneGridView';
import { SceneCanvas } from './SceneCanvas';
import { SceneDispatchContext } from '../contexts/scene-dispatch-context';
import { SceneDropController } from './drag/SceneDropController';
import { isSceneDragEnabled } from './drag/sceneDragFlag';
import { isSceneCanvasEnabled } from './scene/sceneCanvasFlag';
import { EncounterPanel } from './scene/EncounterPanel';
import { InitiativeTracker } from './scene/InitiativeTracker';
import { MapPanel } from './scene/MapPanel';
import { MarkerPanel } from './scene/MarkerPanel';
import { TokenPanel } from './scene/TokenPanel';
import { CombatPanel } from './scene/CombatPanel';
import { CheckPanel } from './scene/CheckPanel';
import { OraclePanel } from './scene/OraclePanel';
import { ReactionPanel } from './scene/ReactionPanel';
import { DicePanel } from './scene/DicePanel';
import { RecapPanel } from './scene/RecapPanel';
import { IllustrationPanel } from './scene/IllustrationPanel';
import { useDaggerheartSceneCatalog } from './scene/useDaggerheartSceneCatalog';
import { useSceneActions } from './scene/useSceneActions';
import { useSceneCombat } from './scene/useSceneCombat';
import { useSceneInitiative } from './scene/useSceneInitiative';
import { useSceneMap } from './scene/useSceneMap';
import { useSceneMarkers } from './scene/useSceneMarkers';
import { useSceneTokens } from './scene/useSceneTokens';

type PlacementMode = 'none' | 'token' | 'marker' | 'adversary';

interface Props {
  scenes: SceneDocument[];
  documents: CharacterDocument<SystemDataModel>[];
  campaigns: Campaign[];
  /**
   * Controlled scene selection — shell-owned (useAppNav.sceneId). Scene
   * creation, import, and picking live in LibraryScenesView; this component
   * is the operating canvas for the selected scene.
   */
  selectedSceneId: string | null;
  /**
   * The shell's scene-selection seam (useAppNav.selectScene). Non-null ids
   * also flip the shell to the Scene surface.
   */
  onSelectScene: (id: string | null) => void;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  /**
   * Replace a scene document (document-level metadata edits — currently the
   * map reference). Event-log changes never go through here; they stay on
   * `onAppendSceneEvent` so the replay contract is untouched.
   */
  onUpdateScene: (scene: SceneDocument) => void;
  onDeleteScene: (id: string) => void;
  /** Append a factual recap of a scene to its linked campaign's session log. */
  onLogToCampaign?: (campaignId: string, title: string, body: string) => void;
}

/**
 * The scene surface: it resolves the shell-selected scene, owns the grid's own
 * selection state (which token is picked, what a click places), and composes
 * the per-concern controllers under `scene/` with the panels they feed. The
 * controllers hold the state and handlers; the one thing that stays here is the
 * placement dispatch, because a grid click is the single gesture whose meaning
 * depends on all of them.
 */
export function SceneManager({
  scenes,
  documents,
  campaigns,
  selectedSceneId,
  onSelectScene,
  onAppendSceneEvent,
  onUpdateScene,
  onDeleteScene,
  onLogToCampaign,
}: Props) {
  const [placementMode, setPlacementMode] = useState<PlacementMode>('none');
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>();
  // AI affordances are build-time gated (default OFF); each surface adds its own
  // further preconditions (e.g. a cited budget table for drafting).
  const aiEnabled = isAiEnabled();
  // Phase-4 drag: the grid container the interim drop target hit-tests, and the
  // single feature predicate that gates BOTH the drag mount and the paired
  // PlacementMode-button hiding (mutual exclusion, Finding 21).
  const gridRef = useRef<HTMLDivElement>(null);
  const sceneDragEnabled = isSceneDragEnabled();
  // Phase-6 opt-in canvas view. When on it REPLACES the DOM grid, so the
  // pointer-drag drop controller (which hit-tests the DOM grid's per-cell
  // `data-scene-cell` targets) is not mounted alongside it.
  const sceneCanvasEnabled = isSceneCanvasEnabled();

  // Shell-owned init/auto-reset (build-specs task 3): a stale or missing
  // selection re-anchors on the first scene through the shell seam. The
  // matching transient-state clears live in the per-scene effect below, which
  // fires on ANY selection change (shell-driven included). Note the seam flips
  // to the Scene surface on non-null ids, so a reselect while this component
  // is kept alive hidden surfaces the canvas — acceptable until Phase 2's
  // SurfaceStage owns visibility.
  useEffect(() => {
    if (selectedSceneId && scenes.some((scene) => scene.id === selectedSceneId)) return;
    if (!selectedSceneId && scenes.length === 0) return;
    onSelectScene(scenes[0]?.id ?? null);
  }, [scenes, selectedSceneId, onSelectScene]);

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
  // The campaign this scene is linked to, when it resolves to a known one —
  // gates the "log recap to campaign" bridge.
  const linkedCampaign = useMemo(
    () => (state?.campaignId ? campaigns.find((c) => c.id === state.campaignId) : undefined),
    [campaigns, state?.campaignId]
  );

  // The one mutation seam (RFC 006): every controller below authors intents and
  // hands them here, so nothing computes scene state outside the runtime fold.
  const { actionIssues, setActionIssues, emitSceneAction, emitBoundSceneAction } = useSceneActions({
    selectedScene,
    onAppendSceneEvent,
  });

  const { daggerheartWeaponsById, daggerheartAdversariesById, adversaryId, setAdversaryId } =
    useDaggerheartSceneCatalog(sceneSystemId);

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
  // Encounter building (catalog load, draft/AI/identify, plan/budget readouts)
  // lives in its own controller; destructured into the names the JSX/handlers
  // below already use. The model proposes; the deterministic gate + catalog decide.
  const {
    encounterMonsters,
    encounterMonsterId,
    setEncounterMonsterId,
    encounterCount,
    setEncounterCount,
    encounterDifficulty,
    setEncounterDifficulty,
    encounterOriginX,
    setEncounterOriginX,
    encounterOriginY,
    setEncounterOriginY,
    encounterSelections,
    encounterZoneId,
    setEncounterZoneId,
    aiEncounterPrompt,
    setAiEncounterPrompt,
    aiDrafting,
    aiIdentifying,
    identifyNotice,
    monstersLoading,
    monsterLoadError,
    eligibleStatblocks,
    selectedEncounterMonster,
    pendingEncounterSelections,
    encounterPlan,
    encounterParty,
    encounterXpPerPartyLevel,
    encounterValidation,
    selectedEncounterTotalXp,
    handleQueueEncounterMonster,
    handleDraftEncounter,
    handleAiDraftEncounter,
    handleIdentifyCreature,
    handleRemoveEncounterSelection,
    handleAdjustEncounterSelection,
    handleAddEncounter,
  } = useSceneEncounter({
    sceneSystemId,
    selectedScene,
    state,
    documents,
    eligibleDocuments,
    onAppendSceneEvent,
    onIssues: setActionIssues,
    onEncounterApplied: () => {
      setSelectedTokenId(undefined);
      setPlacementMode('none');
    },
  });

  // The loaded catalog indexed by id — shared by token placement (a statblock-
  // backed NPC), the drop controller, and combat-stat resolution.
  const monstersById = useMemo(() => {
    const map = new Map<string, Monster>();
    encounterMonsters.forEach((monster) => map.set(monster.id, monster));
    return map;
  }, [encounterMonsters]);

  const handleNpcDrafted = useCallback(() => setPlacementMode('token'), []);
  const handleTokenDeleted = useCallback(() => setSelectedTokenId(undefined), []);

  const {
    tokenDocumentId,
    tokenName,
    setTokenName,
    tokenKind,
    setTokenKind,
    tokenAllegiance,
    setTokenAllegiance,
    tokenStatblockId,
    selectedTokenSide,
    buildTokenAt,
    clearTokenDraft,
    handleSelectLinkedDocument,
    handleSelectStatblock,
    handleGenerateNpc,
    handleDeleteSelectedToken,
    handleToggleSelectedTokenCondition,
    handleSetSelectedTokenSide,
  } = useSceneTokens({
    selectedScene,
    state,
    documents,
    monstersById,
    encounterMonsters,
    selectedTokenId,
    emitSceneAction,
    onIssues: setActionIssues,
    onNpcDrafted: handleNpcDrafted,
    onTokenDeleted: handleTokenDeleted,
  });

  const {
    markerLabel,
    setMarkerLabel,
    markerKind,
    setMarkerKind,
    markerWidth,
    setMarkerWidth,
    markerHeight,
    setMarkerHeight,
    markerEffect,
    setMarkerEffect,
    buildMarkerAt,
    clearMarkerDraft,
    handleDeleteMarker,
  } = useSceneMarkers({ selectedScene, emitSceneAction });

  const {
    combatReadyIds,
    combatConcluded,
    combatTargetId,
    setCombatTargetId,
    combatLog,
    handleCombatAttack,
    handleRunRound,
  } = useSceneCombat({
    selectedScene,
    selectedSceneId,
    state,
    sceneSystemId,
    documents,
    monstersById,
    daggerheartWeaponsById,
    daggerheartAdversariesById,
    selectedTokenId,
    emitSceneAction,
    onAppendSceneEvent,
    onIssues: setActionIssues,
  });

  const { initiativeValues, handleInitiativeChange, handleSetInitiative, handleAdvanceTurn } =
    useSceneInitiative({
      selectedScene,
      state,
      emitSceneAction,
      onIssues: setActionIssues,
    });

  const {
    mapAsset,
    mapImage,
    mapImageSize,
    mapNotice,
    handleImportMapImage,
    handleChangeMapRegistration,
    handleRemoveMap,
    handleAnalyzeGrid,
    handleApplyMapAnalysis,
  } = useSceneMap({
    selectedScene,
    selectedSceneId,
    state,
    onUpdateScene,
    onAppendSceneEvent,
    onIssues: setActionIssues,
  });

  // Deselect a token that no longer exists (kept separate from the initiative
  // sync so selection changes cannot disturb the edit buffer).
  useEffect(() => {
    if (selectedTokenId && state && !state.tokens[selectedTokenId]) {
      setSelectedTokenId(undefined);
    }
  }, [selectedTokenId, state]);

  // Transient selections are per-scene: switching scenes (now shell-driven —
  // the picker, create, and import all live in LibraryScenesView) clears the
  // chosen token and placement mode (formerly cleared by the in-component
  // rail click) and the spawn zone (marker ids belong to the previous scene).
  // The combat target/log and the map notice clear in their own controllers.
  useEffect(() => {
    setSelectedTokenId(undefined);
    setPlacementMode('none');
    setEncounterZoneId('');
    // setEncounterZoneId comes from useSceneEncounter (a stable useState setter,
    // so it never re-fires this); listed to satisfy exhaustive-deps now that it
    // is not a directly-recognized local setter.
  }, [selectedSceneId, setEncounterZoneId]);

  // A grid click means whatever the armed placement mode says it means, so the
  // dispatch stays here rather than in any one controller. Each branch shapes
  // its subject through that controller and then takes the SAME resolve-then-
  // append route; the draft is cleared only once the event actually landed.
  const handleCellActivate = useCallback(
    (position: SceneCoordinate) => {
      if (!selectedScene || !state) return;

      if (placementMode === 'token') {
        const token = buildTokenAt(position);
        if (!token) return;

        const placed = emitSceneAction(selectedScene, { type: 'place-token', token });

        if (placed) {
          setPlacementMode('none');
          clearTokenDraft();
        }
        return;
      }

      if (placementMode === 'adversary') {
        const adversary = daggerheartAdversariesById.get(adversaryId);
        if (!adversary) return;
        const built = buildDaggerheartAdversaryCombatant(adversary, {
          tokenId: generateUUID(),
          position,
        });
        if (!built.supported) return;
        const placed = emitSceneAction(selectedScene, {
          type: 'place-token',
          token: built.combatant.token,
        });
        if (placed) setPlacementMode('none');
        return;
      }

      if (placementMode === 'marker') {
        const marker = buildMarkerAt(position);
        if (!marker) return;

        const placed = emitSceneAction(selectedScene, { type: 'add-marker', marker });

        if (placed) {
          setPlacementMode('none');
          clearMarkerDraft();
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
    },
    [
      selectedScene,
      state,
      placementMode,
      adversaryId,
      daggerheartAdversariesById,
      buildTokenAt,
      clearTokenDraft,
      buildMarkerAt,
      clearMarkerDraft,
      selectedTokenId,
      emitSceneAction,
    ]
  );

  const handleTokenActivate = useCallback((token: SceneToken) => {
    setSelectedTokenId(token.id);
    setPlacementMode('none');
  }, []);

  const handleRollCheck = (params: {
    label: string;
    modifier: number;
    dc?: number;
    actorTokenId?: string;
    mode?: SceneCheckMode;
  }) => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, { type: 'roll-check', ...params });
  };

  const handleConsultOracle = (params: { question?: string; odds: SceneOracleOdds }) => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, { type: 'consult-oracle', ...params });
  };

  const handleExportScenes = (targetScenes: SceneDocument[], filename: string) => {
    downloadTextFile(exportScenes(targetScenes), filename);
  };

  return (
    <section className="space-y-4">
      {actionIssues.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionIssues[0]}
        </div>
      )}

      {/* The former LEFT 18rem list rail (picker, create, import) now lives in
          LibraryScenesView; this component is the full-width operating canvas
          for the shell-selected scene, with the RIGHT operating rail docked. */}
      {!selectedScene || !state ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center space-y-2">
          {/* "No scene selected" doubles as the lazy-chunk marker in
              scripts/check-bundle-size.mjs (Finding 17). Keep them in sync if
              this copy changes, or that CI guard will fail loudly. */}
          <h3 className="text-2xl font-semibold tracking-tight">No scene selected</h3>
          <p className="text-sm text-muted-foreground">
            Pick a scene from the Library&apos;s Scenes tab, or create one there.
          </p>
        </div>
      ) : (
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
            <SceneDispatchContext.Provider value={emitBoundSceneAction}>
              {sceneCanvasEnabled ? (
                <SceneCanvas
                  state={state}
                  selectedTokenId={selectedTokenId}
                  onCellActivate={handleCellActivate}
                  onTokenActivate={handleTokenActivate}
                />
              ) : (
                <SceneGridView
                  state={state}
                  selectedTokenId={selectedTokenId}
                  mapImage={mapImage}
                  onCellActivate={handleCellActivate}
                  onTokenActivate={handleTokenActivate}
                  gridRef={gridRef}
                />
              )}
              {sceneDragEnabled && !sceneCanvasEnabled && (
                <SceneDropController
                  gridRef={gridRef}
                  documents={documents}
                  resolveStatblock={(statblockId) => monstersById.get(statblockId)}
                />
              )}
            </SceneDispatchContext.Provider>

            <div className="space-y-3">
              <TokenPanel
                eligibleDocuments={eligibleDocuments}
                tokenDocumentId={tokenDocumentId}
                onSelectLinkedDocument={handleSelectLinkedDocument}
                tokenName={tokenName}
                onTokenNameChange={setTokenName}
                tokenKind={tokenKind}
                onTokenKindChange={setTokenKind}
                tokenAllegiance={tokenAllegiance}
                onTokenAllegianceChange={setTokenAllegiance}
                eligibleStatblocks={eligibleStatblocks}
                tokenStatblockId={tokenStatblockId}
                onSelectStatblock={handleSelectStatblock}
                onGenerateNpc={handleGenerateNpc}
                isPlacing={placementMode === 'token'}
                onTogglePlace={() =>
                  setPlacementMode((current) => (current === 'token' ? 'none' : 'token'))
                }
                showPlaceButton={!sceneDragEnabled}
                canDeleteToken={Boolean(selectedTokenId)}
                onDeleteSelectedToken={handleDeleteSelectedToken}
                conditionOptions={sceneConditionOptions(sceneSystemId)}
                selectedTokenConditions={
                  (selectedTokenId && state.tokens[selectedTokenId]?.conditions) || []
                }
                onToggleSelectedTokenCondition={handleToggleSelectedTokenCondition}
                selectedTokenSide={selectedTokenSide}
                onSetSelectedTokenSide={handleSetSelectedTokenSide}
              />

              {sceneSystemId === 'daggerheart' && daggerheartAdversariesById.size > 0 && (
                <div className="rounded-lg border bg-card p-3 space-y-2">
                  <h5 className="text-sm font-semibold">Adversaries</h5>
                  <Select
                    aria-label="Adversary"
                    value={adversaryId}
                    onChange={(event) => setAdversaryId(event.target.value)}
                  >
                    {[...daggerheartAdversariesById.values()].map((adversary) => (
                      <option key={adversary.id} value={adversary.id}>
                        {adversary.name} (T{adversary.tier} {adversary.role})
                      </option>
                    ))}
                  </Select>
                  {!sceneDragEnabled && (
                    <Button
                      variant={placementMode === 'adversary' ? 'default' : 'outline'}
                      size="sm"
                      disabled={!adversaryId}
                      onClick={() =>
                        setPlacementMode((current) =>
                          current === 'adversary' ? 'none' : 'adversary'
                        )
                      }
                    >
                      {placementMode === 'adversary'
                        ? 'Click the grid to place...'
                        : 'Place Adversary'}
                    </Button>
                  )}
                </div>
              )}

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
                onAdjustSelection={handleAdjustEncounterSelection}
                zoneOptions={Object.values(state.markers).map((marker) => ({
                  id: marker.id,
                  label: marker.label,
                }))}
                zoneId={encounterZoneId}
                onZoneChange={setEncounterZoneId}
                // Drafting is offered only where a cited budget table
                // applies (see supportsEncounterBudget).
                onDraftEncounter={
                  supportsEncounterBudget(sceneSystemId ?? '') ? handleDraftEncounter : undefined
                }
                difficulty={encounterDifficulty}
                onDifficultyChange={setEncounterDifficulty}
                validation={encounterValidation}
                // AI drafting rides the same difficulty + deterministic gate
                // as the manual draft, offered only when AI is enabled and
                // the system has a cited budget table.
                onAiDraft={
                  aiEnabled && supportsEncounterBudget(sceneSystemId ?? '')
                    ? handleAiDraftEncounter
                    : undefined
                }
                aiPrompt={aiEncounterPrompt}
                onAiPromptChange={setAiEncounterPrompt}
                aiDrafting={aiDrafting}
                // Vision: identify a creature from an image (needs only the
                // loaded catalog, so it is offered wherever AI is enabled).
                onIdentifyImage={aiEnabled ? handleIdentifyCreature : undefined}
                identifying={aiIdentifying}
                identifyNotice={identifyNotice}
              />

              <MapPanel
                map={selectedScene.map}
                hasAsset={Boolean(mapAsset)}
                onImportImage={(file) => void handleImportMapImage(file)}
                onChangeRegistration={handleChangeMapRegistration}
                onRemoveMap={handleRemoveMap}
                notice={mapNotice}
                onAnalyzeGrid={
                  aiEnabled && mapAsset && mapImageSize ? handleAnalyzeGrid : undefined
                }
                onApplyAnalysis={handleApplyMapAnalysis}
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
                markerEffect={markerEffect}
                onMarkerEffectChange={setMarkerEffect}
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
                onInitiativeChange={handleInitiativeChange}
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
                combatConcluded={combatConcluded}
                log={combatLog}
              />

              <CheckPanel state={state} actorId={selectedTokenId} onRoll={handleRollCheck} />

              <OraclePanel state={state} onConsult={handleConsultOracle} />

              <ReactionPanel seed={state.seed} />

              <DicePanel seed={state.seed} systemId={sceneSystemId} />

              {/* Image-output surface: a creative aid, not scene state. */}
              {aiEnabled && (
                <IllustrationPanel illustrate={(params) => illustrateSceneWithAi(params)} />
              )}

              {onLogToCampaign && linkedCampaign && (
                <RecapPanel
                  state={state}
                  campaignName={linkedCampaign.name}
                  onLog={(title, body) => onLogToCampaign(linkedCampaign.id, title, body)}
                  // The model restyles the deterministic recap into prose the
                  // GM edits before logging; hidden entirely when AI is off.
                  narrate={aiEnabled ? (params) => narrateSceneWithAi(params) : undefined}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
