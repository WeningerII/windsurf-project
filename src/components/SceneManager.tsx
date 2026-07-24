import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, MousePointer2, Trash2 } from 'lucide-react';
import { buildPlacedToken } from '../scene/tokenPlacement';
import { useSceneEncounter } from './scene/useSceneEncounter';
import { generateNpc } from '../scene/npcGenerator';
import { supportsEncounterBudget } from '../scene/encounterDraft';
import { narrateSceneWithAi } from '../ai/sceneNarrationFlow';
import { illustrateSceneWithAi } from '../ai/illustrateSceneFlow';
import { isAiEnabled } from '../ai/gatewayClient';
import {
  applySceneIntents,
  foldSceneEvents,
  positiveIntegerOrDefault,
  resolveSceneAction,
} from '../scene/runtime';
import {
  buildDaggerheartAdversaryCombatant,
  buildSceneCombatants,
  factionForToken,
  isRoundConclusive,
  NEUTRAL_FACTION,
  resolveSceneAttack,
  runSceneRound,
  type ResolveCombatStats,
} from '../rules';
import { sceneConditionOptions } from './scene/sceneConditionOptions';
import { resolveSceneCombatStats } from '../scene/combatStats';
import { createSeededRng } from '../scene/seededRng';
import type { Campaign } from '../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type {
  SceneActionIntent,
  SceneAllegiance,
  SceneCheckMode,
  SceneDocument,
  SceneEvent,
  SceneGridRegistration,
  SceneMarkerKind,
  SceneOracleOdds,
  SceneToken,
  SceneTokenKind,
} from '../types/core/scene';
import { systemRegistry } from '../registry';
import { loadDaggerheartAdversariesForSystem } from '../utils/dataLoader';
import { errorLogger, guardSync, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';
import { exportScenes } from '../utils/sceneStorage';
import { createMapAsset, loadMapAsset } from '../utils/mapAssetStorage';
import { downloadTextFile, readFileAsDataUrl } from '../utils/fileTransfer';
import { generateUUID } from '../utils/browserCompat';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Select } from './ui/Select';
import { SceneGridView } from './SceneGridView';
import { SceneDispatchContext } from '../contexts/scene-dispatch-context';
import { SceneDropController } from './drag/SceneDropController';
import { isSceneDragEnabled } from './drag/sceneDragFlag';
import { EncounterPanel } from './scene/EncounterPanel';
import { InitiativeTracker } from './scene/InitiativeTracker';
import { MapPanel } from './scene/MapPanel';
import { MarkerPanel } from './scene/MarkerPanel';
import { terrainEffectsForPreset, type MarkerEffectPreset } from './scene/markerEffects';
import { TokenPanel } from './scene/TokenPanel';
import { CombatPanel } from './scene/CombatPanel';
import { CheckPanel } from './scene/CheckPanel';
import { OraclePanel } from './scene/OraclePanel';
import { ReactionPanel } from './scene/ReactionPanel';
import { DicePanel } from './scene/DicePanel';
import { RecapPanel } from './scene/RecapPanel';
import { IllustrationPanel } from './scene/IllustrationPanel';

type PlacementMode = 'none' | 'token' | 'marker' | 'adversary';

/**
 * Decode an image data URL just far enough to read its natural size, for the
 * fit-the-grid default cell registration. Resolves null (never rejects) when
 * decoding is unavailable or fails — the caller falls back to a fixed default.
 */
function measureImageSize(dataUrl: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}

/** Shown when a guarded engine call throws (the failure is logged to Sentry). */
const ENGINE_FAILURE_ISSUE = 'This action could not be applied. The error was logged.';

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
  const [tokenDocumentId, setTokenDocumentId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenKind, setTokenKind] = useState<SceneTokenKind>('character');
  // The side a placed NPC fights on (only used when kind === 'npc'); enemies are
  // the common case for an encounter, allies/bystanders are opt-in.
  const [tokenAllegiance, setTokenAllegiance] = useState<SceneAllegiance>('hostile');
  // A creature statblock backing an NPC (picked or generated); '' = none.
  const [tokenStatblockId, setTokenStatblockId] = useState('');
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerKind, setMarkerKind] = useState<SceneMarkerKind>('hazard');
  const [markerWidth, setMarkerWidth] = useState('1');
  const [markerHeight, setMarkerHeight] = useState('1');
  // Optional functional-terrain preset authored for the next placed marker; 'none'
  // leaves the marker's `effects` absent so placement stays strictly additive.
  const [markerEffect, setMarkerEffect] = useState<MarkerEffectPreset>('none');
  // AI affordances are build-time gated (default OFF); each surface adds its own
  // further preconditions (e.g. a cited budget table for drafting).
  const aiEnabled = isAiEnabled();
  const [initiativeValues, setInitiativeValues] = useState<Record<string, string>>({});
  const [actionIssues, setActionIssues] = useState<string[]>([]);
  // Map-image import/storage problem, surfaced inside the Map panel.
  const [mapNotice, setMapNotice] = useState<string | null>(null);
  const [combatTargetId, setCombatTargetId] = useState('');
  const [combatLog, setCombatLog] = useState<string[]>([]);
  // Per-click nonce so a missed attack (which appends no event) still advances
  // the RNG stream — otherwise re-clicking Attack would reproduce the same miss.
  const attackNonce = useRef(0);
  // Monotonic nonce so each "Generate NPC" yields a fresh (still seeded) result.
  const npcGenNonce = useRef(0);
  // Phase-4 drag: the grid container the interim drop target hit-tests, and the
  // single feature predicate that gates BOTH the drag mount and the paired
  // PlacementMode-button hiding (mutual exclusion, Finding 21).
  const gridRef = useRef<HTMLDivElement>(null);
  const sceneDragEnabled = isSceneDragEnabled();

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

  // Daggerheart scenes need the weapon catalog so character tokens can fight
  // (weapons are catalog refs on the document); mirrors the monster preload.
  const [daggerheartWeaponsById, setDaggerheartWeaponsById] = useState<
    ReadonlyMap<string, import('../types/daggerheart').DaggerheartWeapon>
  >(new Map());
  useEffect(() => {
    if (sceneSystemId !== 'daggerheart') {
      setDaggerheartWeaponsById(new Map());
      return;
    }
    let cancelled = false;
    import('../data/daggerheart/1.0/equipment')
      .then((mod) => {
        if (cancelled) return;
        setDaggerheartWeaponsById(
          new Map((mod.daggerheartWeapons ?? []).map((weapon) => [weapon.id, weapon]))
        );
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        errorLogger.log(
          ErrorCategory.DATA_LOAD,
          ErrorSeverity.LOW,
          'Failed to preload Daggerheart weapon catalog',
          error instanceof Error ? error : undefined
        );
      });
    return () => {
      cancelled = true;
    };
  }, [sceneSystemId]);

  // Daggerheart scenes field SRD adversaries as monster-kind tokens.
  const [daggerheartAdversariesById, setDaggerheartAdversariesById] = useState<
    ReadonlyMap<string, import('../types/daggerheart').DaggerheartAdversary>
  >(new Map());
  const [adversaryId, setAdversaryId] = useState('');
  useEffect(() => {
    if (sceneSystemId !== 'daggerheart') {
      setDaggerheartAdversariesById(new Map());
      setAdversaryId('');
      return;
    }
    let cancelled = false;
    loadDaggerheartAdversariesForSystem('daggerheart')
      .then((adversaries) => {
        if (cancelled) return;
        setDaggerheartAdversariesById(
          new Map(adversaries.map((adversary) => [adversary.id, adversary]))
        );
        setAdversaryId((current) => current || (adversaries[0]?.id ?? ''));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        errorLogger.log(
          ErrorCategory.DATA_LOAD,
          ErrorSeverity.LOW,
          'Failed to load Daggerheart adversaries',
          error instanceof Error ? error : undefined
        );
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

  useEffect(() => {
    if (!state) return;

    // The inputs are an edit buffer: seed defaults only for tokens we have no
    // buffered value for, and drop removed tokens. Never overwrite a value the
    // user may be editing (every appended event re-runs this effect).
    setInitiativeValues((current) => {
      const next = { ...current };
      state.initiative.forEach((entry) => {
        next[entry.tokenId] ??= String(entry.value);
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
  }, [state]);

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
  // rail click), the combat target, the rolling log (otherwise another
  // scene's log lingers), and the spawn zone (marker ids belong to the
  // previous scene).
  useEffect(() => {
    setSelectedTokenId(undefined);
    setPlacementMode('none');
    setCombatTargetId('');
    setCombatLog([]);
    setMapNotice(null);
    setEncounterZoneId('');
    // setEncounterZoneId comes from useSceneEncounter (a stable useState setter,
    // so it never re-fires this); listed to satisfy exhaustive-deps now that it
    // is not a directly-recognized local setter.
  }, [selectedSceneId, setEncounterZoneId]);

  // Clear a stale combat target: when the chosen token dies or is removed, the
  // target select would otherwise render blank while Attack stays armed.
  useEffect(() => {
    if (!combatTargetId || !state) return;
    const target = state.tokens[combatTargetId];
    if (!target || (target.hp && target.hp.current <= 0)) {
      setCombatTargetId('');
    }
  }, [combatTargetId, state]);

  const emitSceneAction = useCallback(
    (scene: SceneDocument, intent: SceneActionIntent) => {
      // resolveSceneAction returns `issues` for EXPECTED invalid input; the
      // guard only catches an UNEXPECTED throw in the fold, so a bug there is a
      // monitored signal that degrades to "action rejected" instead of an
      // unhandled error in whichever handler emitted it.
      const result = guardSync(
        () =>
          resolveSceneAction(scene, intent, {
            eventId: generateUUID(),
            createdAt: new Date(),
          }),
        {
          fallback: undefined,
          category: ErrorCategory.USER_ACTION,
          message: 'Scene action failed',
          context: { intentType: intent.type },
        }
      );

      if (!result) {
        setActionIssues([ENGINE_FAILURE_ISSUE]);
        return false;
      }

      if (!result.event) {
        setActionIssues(result.issues.map((issue) => issue.message));
        return false;
      }

      onAppendSceneEvent(scene.id, result.event);
      setActionIssues(result.issues.map((issue) => issue.message));
      return true;
    },
    [onAppendSceneEvent]
  );

  // The zero-arg bound emit seam (Phase 4): a shared-layer drop handler emits an
  // EXISTING intent through this without knowing about scene resolution. Bound to
  // the shell-resolved selectedScene; a no-op returning false when none resolves,
  // so a drop never targets a stale scene. runtime.ts + the 12 intents untouched.
  const emitBoundSceneAction = useCallback(
    (intent: SceneActionIntent): boolean =>
      selectedScene ? emitSceneAction(selectedScene, intent) : false,
    [selectedScene, emitSceneAction]
  );

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
    (token) =>
      resolveSceneCombatStats(token, {
        monstersById,
        documentsById,
        daggerheartWeaponsById,
        daggerheartAdversariesById,
      }),
    [monstersById, documentsById, daggerheartWeaponsById, daggerheartAdversariesById]
  );

  const combatReadyIds = useMemo(() => {
    const ids = new Set<string>();
    if (!state) return ids;
    Object.values(state.tokens).forEach((token) => {
      if (resolveCombatStats(token)) ids.add(token.id);
    });
    return ids;
  }, [state, resolveCombatStats]);

  // A fight is "over" once it had opposing sides and one of them is wiped.
  // Requiring two factions to have been present distinguishes a finished battle
  // (disable Run Round, surface "Combat over") from a single-faction scene where
  // Run Round still legitimately walks the initiative/round cycle.
  const combatConcluded = useMemo(() => {
    if (!state) return false;
    const combatants = buildSceneCombatants(state, resolveCombatStats);
    if (combatants.length < 2) return false;
    // Count only real combat sides — a neutral NPC/object never constitutes a
    // "side", so its presence alone must not read as a finished two-faction
    // battle (nor keep one alive).
    const sidesPresent = new Set(
      combatants
        .map((combatant) => combatant.faction)
        .filter((faction) => faction !== NEUTRAL_FACTION)
    );
    return sidesPresent.size >= 2 && isRoundConclusive(combatants, {});
  }, [state, resolveCombatStats]);

  const handleCombatAttack = () => {
    if (!selectedScene || !state || !selectedTokenId || !combatTargetId) return;
    // The combat engine is pure but field inputs are not: a malformed token or
    // effect must surface as a logged, monitored signal — never an unhandled
    // error in this click handler that silently loses the action.
    const outcome = guardSync(
      () =>
        resolveSceneAttack({
          state,
          attackerId: selectedTokenId,
          targetId: combatTargetId,
          resolveStats: resolveCombatStats,
          // The nonce makes every click a fresh stream even when nothing was
          // appended (a miss adds no event, so events.length alone would replay
          // the byte-identical roll forever).
          seed: `${selectedScene.initialState.seed}:attack:${selectedScene.events.length}:${attackNonce.current++}`,
          cause: 'attack',
        }),
      {
        fallback: undefined,
        category: ErrorCategory.USER_ACTION,
        message: 'Combat attack failed',
        context: {
          systemId: sceneSystemId,
          attackerId: selectedTokenId,
          targetId: combatTargetId,
        },
      }
    );
    if (!outcome) {
      setActionIssues([ENGINE_FAILURE_ISSUE]);
      return;
    }
    if (outcome.intent) {
      // Only log the hit if its damage event actually applied; emitSceneAction
      // surfaces the issue when the runtime rejects it, so don't also claim it landed.
      const applied = emitSceneAction(selectedScene, outcome.intent);
      if (!applied) {
        return;
      }
    }
    setCombatLog((current) => [outcome.log, ...current].slice(0, 30));
  };

  const handleRunRound = () => {
    if (!selectedScene || !state) return;
    const roundState = state;
    const outcome = guardSync(
      () =>
        runSceneRound({
          state: roundState,
          resolveStats: resolveCombatStats,
          seed: `${selectedScene.initialState.seed}:round:${roundState.round}:${selectedScene.events.length}:${attackNonce.current++}`,
          round: roundState.round,
        }),
      {
        fallback: undefined,
        category: ErrorCategory.USER_ACTION,
        message: 'Combat round failed',
        context: { systemId: sceneSystemId, round: roundState.round },
      }
    );
    if (!outcome) {
      setActionIssues([ENGINE_FAILURE_ISSUE]);
      return;
    }

    // Re-validate and sequence the round's intents against a working copy, then
    // dispatch the accepted events through the event-sourced persistence path.
    // Rejected (simulated-but-illegal) intents are surfaced, not dropped.
    const { events, rejected } = applySceneIntents(selectedScene, outcome.intents, {
      eventIdFactory: generateUUID,
    });
    events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setCombatLog((current) => [...outcome.log.slice().reverse(), ...current].slice(0, 30));
    setActionIssues(rejected);
  };

  const handleCellActivate = useCallback(
    (position: { x: number; y: number }) => {
      if (!selectedScene || !state) return;

      if (placementMode === 'token') {
        const linkedDoc = documents.find((doc) => doc.id === tokenDocumentId);
        // An NPC may instead be backed by a creature statblock (picked or
        // generated) — mechanically real via the same statblocks monsters use.
        const statblock =
          !linkedDoc && tokenKind === 'npc' && tokenStatblockId
            ? monstersById.get(tokenStatblockId)
            : undefined;
        const token = buildPlacedToken({
          position,
          linkedDoc,
          statblock,
          nameInput: tokenName,
          tokenKind,
          tokenAllegiance,
          idFactory: generateUUID,
        });
        if (!token) return;

        const placed = emitSceneAction(selectedScene, { type: 'place-token', token });

        if (placed) {
          setPlacementMode('none');
          setTokenName('');
          setTokenDocumentId('');
          setTokenStatblockId('');
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
        const label = markerLabel.trim();
        if (!label) return;

        // 'none' → undefined, so a marker authored without terrain omits `effects`
        // entirely and resolves exactly as before (strict-additive).
        const effects = terrainEffectsForPreset(markerEffect);

        const placed = emitSceneAction(selectedScene, {
          type: 'add-marker',
          marker: {
            id: generateUUID(),
            kind: markerKind,
            label,
            position,
            width: positiveIntegerOrDefault(markerWidth, 1),
            height: positiveIntegerOrDefault(markerHeight, 1),
            ...(effects ? { effects } : {}),
          },
        });

        if (placed) {
          setPlacementMode('none');
          setMarkerLabel('');
          setMarkerEffect('none');
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
      documents,
      tokenDocumentId,
      tokenName,
      tokenKind,
      tokenAllegiance,
      tokenStatblockId,
      monstersById,
      markerLabel,
      markerKind,
      markerWidth,
      markerHeight,
      markerEffect,
      selectedTokenId,
      emitSceneAction,
    ]
  );

  const handleGenerateNpc = useCallback(() => {
    npcGenNonce.current += 1;
    const seed = state?.seed ?? selectedScene?.id ?? 'npc';
    const generated = generateNpc(
      encounterMonsters,
      createSeededRng(`${seed}:npc:${npcGenNonce.current}`)
    );
    if (!generated) {
      setActionIssues(['No creatures are loaded for this system to generate an NPC from.']);
      return;
    }
    setTokenDocumentId('');
    setTokenKind('npc');
    setTokenStatblockId(generated.monster.id);
    setTokenName(generated.name);
    setPlacementMode('token');
  }, [encounterMonsters, selectedScene?.id, state?.seed]);

  const handleToggleSelectedTokenCondition = useCallback(
    (conditionId: string) => {
      if (!selectedScene || !state || !selectedTokenId) return;
      const token = state.tokens[selectedTokenId];
      if (!token) return;
      const current = token.conditions ?? [];
      const next = current.includes(conditionId)
        ? current.filter((entry) => entry !== conditionId)
        : [...current, conditionId];
      emitSceneAction(selectedScene, {
        type: 'set-token-conditions',
        tokenId: selectedTokenId,
        conditions: next,
      });
    },
    [selectedScene, state, selectedTokenId, emitSceneAction]
  );

  const handleSetSelectedTokenSide = useCallback(
    (allegiance: SceneAllegiance) => {
      if (!selectedScene || !selectedTokenId) return;
      emitSceneAction(selectedScene, {
        type: 'set-token-allegiance',
        tokenId: selectedTokenId,
        allegiance,
      });
    },
    [selectedScene, selectedTokenId, emitSceneAction]
  );

  // The selected token's current side, for the re-side control (objects are
  // permanent non-combatants, so no control is offered for them).
  const selectedTokenSide = useMemo<SceneAllegiance | undefined>(() => {
    const token = selectedTokenId ? state?.tokens[selectedTokenId] : undefined;
    if (!token || token.kind === 'object') return undefined;
    return factionForToken(token);
  }, [selectedTokenId, state]);

  const handleTokenActivate = useCallback((token: SceneToken) => {
    setSelectedTokenId(token.id);
    setPlacementMode('none');
  }, []);

  const handleSelectLinkedDocument = (documentId: string) => {
    setTokenDocumentId(documentId);
    const doc = documents.find((entry) => entry.id === documentId);
    if (doc) {
      setTokenStatblockId(''); // a sheet and a statblock are mutually exclusive backings
      setTokenName(doc.name);
      setTokenKind('character');
    }
  };

  const handleSelectStatblock = (statblockId: string) => {
    setTokenStatblockId(statblockId);
    if (!statblockId) return;
    setTokenDocumentId(''); // mutually exclusive with a linked sheet
    setTokenKind('npc');
    const statblock = monstersById.get(statblockId);
    if (statblock) setTokenName(statblock.name);
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

    // An empty/invalid input keeps the token's previous initiative (or the
    // default 10) instead of silently dropping it from the order.
    const existingByTokenId = new Map(
      state.initiative.map((entry) => [entry.tokenId, entry.value])
    );
    const keptTokens: Array<{ name: string; tokenId: string; value: number }> = [];
    const entries = Object.values(state.tokens)
      .map((token) => {
        const parsed = Number.parseFloat(initiativeValues[token.id] ?? '10');
        if (Number.isFinite(parsed)) {
          return { tokenId: token.id, value: parsed };
        }
        const fallback = existingByTokenId.get(token.id) ?? 10;
        keptTokens.push({ name: token.name, tokenId: token.id, value: fallback });
        return { tokenId: token.id, value: fallback };
      })
      .sort((a, b) => b.value - a.value);

    const emitted = emitSceneAction(selectedScene, {
      type: 'set-initiative',
      entries,
      activeTokenId: entries[0]?.tokenId,
    });

    if (emitted && keptTokens.length > 0) {
      // Resync the cleared inputs to the value that was actually set, and say so.
      setInitiativeValues((current) => {
        const next = { ...current };
        keptTokens.forEach((kept) => {
          next[kept.tokenId] = String(kept.value);
        });
        return next;
      });
      setActionIssues([
        `Invalid initiative for ${keptTokens.map((kept) => kept.name).join(', ')} — kept the previous value.`,
      ]);
    }
  };

  const handleAdvanceTurn = () => {
    if (!selectedScene) return;
    emitSceneAction(selectedScene, { type: 'advance-turn' });
  };

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

  // --- Map backdrop (RFC 006 Phase 9): document-level metadata, not events. ---
  // Storage lookup keyed on the reference object: every map update creates a
  // fresh `map` object, so an import that just stored a new asset re-reads
  // storage through this memo without an extra invalidation signal.
  const sceneMap = selectedScene?.map;
  const mapAsset = useMemo(
    () => (sceneMap ? loadMapAsset(sceneMap.assetHash) : undefined),
    [sceneMap]
  );
  const mapImage =
    sceneMap && mapAsset
      ? { dataUrl: mapAsset.dataUrl, registration: sceneMap.gridRegistration }
      : undefined;

  const handleImportMapImage = useCallback(
    async (file: File) => {
      if (!selectedScene || !state) return;
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const result = await createMapAsset(file.type, dataUrl);
        if (!result.ok) {
          setMapNotice(result.error);
          return;
        }
        setMapNotice(null);
        const existing = selectedScene.map;
        // Same image re-imported: keep the registration the user already
        // dialed in. Otherwise default to fit-the-grid-width (or 50px/cell
        // when the image cannot be decoded here).
        const measured = await measureImageSize(dataUrl);
        const cellSizePx =
          measured && measured.width > 0
            ? Math.max(1, Math.round(measured.width / state.grid.width))
            : 50;
        onUpdateScene({
          ...selectedScene,
          map: {
            assetHash: result.asset.hash,
            gridRegistration:
              existing && existing.assetHash === result.asset.hash
                ? existing.gridRegistration
                : { offsetX: 0, offsetY: 0, cellSizePx },
          },
        });
      } catch {
        setMapNotice('The image could not be read.');
      }
    },
    [selectedScene, state, onUpdateScene]
  );

  const handleChangeMapRegistration = useCallback(
    (gridRegistration: SceneGridRegistration) => {
      if (!selectedScene?.map) return;
      onUpdateScene({
        ...selectedScene,
        map: { ...selectedScene.map, gridRegistration },
      });
    },
    [selectedScene, onUpdateScene]
  );

  const handleRemoveMap = useCallback(() => {
    if (!selectedScene?.map) return;
    // Drop only the reference; the content-addressed asset stays stored (other
    // scenes may share it, and re-adding the same image is then instant).
    const rest = { ...selectedScene };
    delete rest.map;
    onUpdateScene(rest);
    setMapNotice(null);
  }, [selectedScene, onUpdateScene]);

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
              <SceneGridView
                state={state}
                selectedTokenId={selectedTokenId}
                mapImage={mapImage}
                onCellActivate={handleCellActivate}
                onTokenActivate={handleTokenActivate}
                gridRef={gridRef}
              />
              {sceneDragEnabled && (
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
