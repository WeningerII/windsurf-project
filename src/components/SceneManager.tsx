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
  draftEncounter,
  encounterPartyBudget,
  monsterEncounterCost,
  supportsEncounterBudget,
  type EncounterDifficulty,
} from '../scene/encounterDraft';
import { validateEncounterSpec } from '../scene/encounterSpec';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  positiveIntegerOrDefault,
  resolveSceneAction,
} from '../scene/runtime';
import {
  buildCharacterCombatant,
  buildDaggerheartAdversaryCombatant,
  buildSceneCombatants,
  isRoundConclusive,
  NEUTRAL_FACTION,
  resolveSceneAttack,
  runSceneRound,
  type ResolveCombatStats,
} from '../rules';
import { resolveSceneCombatStats } from '../scene/combatStats';
import type { Campaign } from '../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Monster } from '../types/creatures/monsters';
import type { GameSystemId } from '../types/game-systems';
import type {
  SceneActionIntent,
  SceneAllegiance,
  SceneCheckMode,
  SceneDocument,
  SceneEvent,
  SceneMarkerKind,
  SceneOracleOdds,
  SceneToken,
  SceneTokenKind,
} from '../types/core/scene';
import { systemRegistry } from '../registry';
import { loadDaggerheartAdversariesForSystem, loadMonstersForSystem } from '../utils/dataLoader';
import { errorLogger, guardSync, ErrorCategory, ErrorSeverity } from '../utils/errorLogger';
import { exportScenes, importScenesWithReport } from '../utils/sceneStorage';
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
import { CheckPanel } from './scene/CheckPanel';
import { OraclePanel } from './scene/OraclePanel';
import { DicePanel } from './scene/DicePanel';
import { RecapPanel } from './scene/RecapPanel';

type PlacementMode = 'none' | 'token' | 'marker' | 'adversary';

/** Shown when a guarded engine call throws (the failure is logged to Sentry). */
const ENGINE_FAILURE_ISSUE = 'This action could not be applied. The error was logged.';

interface Props {
  scenes: SceneDocument[];
  documents: CharacterDocument<SystemDataModel>[];
  campaigns: Campaign[];
  onAddScene: (scene: SceneDocument) => void;
  onAddScenes: (scenes: SceneDocument[]) => void;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  onDeleteScene: (id: string) => void;
  /** Append a factual recap of a scene to its linked campaign's session log. */
  onLogToCampaign?: (campaignId: string, title: string, body: string) => void;
}

const DEFAULT_SYSTEM_ID = 'dnd-5e-2024';

// Conditions offered on tokens: exactly the ids the rules layer compiles into
// combat effects (collectDnd5eConditionEffects); 5e vocabulary, so the section
// only renders for 5e-family scenes.
const DND5E_SCENE_CONDITIONS = [
  'blinded',
  'frightened',
  'poisoned',
  'prone',
  'restrained',
  'paralyzed',
  'stunned',
] as const;

export function SceneManager({
  scenes,
  documents,
  campaigns,
  onAddScene,
  onAddScenes,
  onAppendSceneEvent,
  onDeleteScene,
  onLogToCampaign,
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
  // Scene-list filter: '' = all, a campaign id = that campaign's encounters,
  // 'none' = scenes not assigned to any campaign.
  const [sceneCampaignFilter, setSceneCampaignFilter] = useState('');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('none');
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>();
  const [tokenDocumentId, setTokenDocumentId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenKind, setTokenKind] = useState<SceneTokenKind>('character');
  // The side a placed NPC fights on (only used when kind === 'npc'); enemies are
  // the common case for an encounter, allies/bystanders are opt-in.
  const [tokenAllegiance, setTokenAllegiance] = useState<SceneAllegiance>('hostile');
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerKind, setMarkerKind] = useState<SceneMarkerKind>('hazard');
  const [markerWidth, setMarkerWidth] = useState('1');
  const [markerHeight, setMarkerHeight] = useState('1');
  const [encounterMonsters, setEncounterMonsters] = useState<Monster[]>([]);
  const [encounterMonsterId, setEncounterMonsterId] = useState('');
  const [encounterCount, setEncounterCount] = useState('1');
  const [encounterDifficulty, setEncounterDifficulty] = useState<EncounterDifficulty>('moderate');
  const [encounterOriginX, setEncounterOriginX] = useState('0');
  const [encounterOriginY, setEncounterOriginY] = useState('0');
  const [encounterSelections, setEncounterSelections] = useState<EncounterMonsterSelection[]>([]);
  const [encounterZoneId, setEncounterZoneId] = useState('');
  const draftNonceRef = useRef(0);
  const [monstersLoading, setMonstersLoading] = useState(false);
  const [monsterLoadError, setMonsterLoadError] = useState<string | null>(null);
  const [initiativeValues, setInitiativeValues] = useState<Record<string, string>>({});
  const [actionIssues, setActionIssues] = useState<string[]>([]);
  const [combatTargetId, setCombatTargetId] = useState('');
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
  // Sidebar fold summaries: event logs grow without bound, and folding every
  // scene inline made each keystroke O(total events across all scenes).
  const foldedScenesById = useMemo(
    () => new Map(scenes.map((scene) => [scene.id, foldSceneEvents(scene)])),
    [scenes]
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
  // Memoized: a fresh array identity here defeated the encounterPlan useMemo
  // below on every render.
  const pendingEncounterSelections = useMemo(
    () =>
      encounterSelections.length > 0
        ? encounterSelections
        : selectedEncounterMonster
          ? [{ monsterId: selectedEncounterMonster.id, count: encounterCountValue }]
          : [],
    [encounterSelections, selectedEncounterMonster, encounterCountValue]
  );
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
  // The deterministic encounter-spec gate (RFC 006): validates the pending
  // selections against the party's budget for the chosen difficulty plus the
  // open-content policy, so the panel can show on/over-budget live. This is the
  // same validator a future AI drafting loop consumes.
  const encounterValidation = useMemo(
    () =>
      validateEncounterSpec(
        {
          systemId: sceneSystemId ?? '',
          difficulty: encounterDifficulty,
          partyLevels: encounterParty.members.map((member) => member.level),
          selections: pendingEncounterSelections,
        },
        { monsters: encounterMonsters }
      ),
    [
      sceneSystemId,
      encounterDifficulty,
      encounterParty,
      pendingEncounterSelections,
      encounterMonsters,
    ]
  );
  const selectedEncounterTotalXp = selectedEncounterMonster
    ? selectedEncounterMonster.experiencePoints * encounterCountValue
    : 0;

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

  // Combat selections are per-scene: switching scenes clears the chosen target,
  // the rolling log (otherwise another scene's log lingers), and the spawn
  // zone (marker ids belong to the previous scene).
  useEffect(() => {
    setCombatTargetId('');
    setCombatLog([]);
    setEncounterZoneId('');
  }, [selectedSceneId]);

  // Clear a stale combat target: when the chosen token dies or is removed, the
  // target select would otherwise render blank while Attack stays armed.
  useEffect(() => {
    if (!combatTargetId || !state) return;
    const target = state.tokens[combatTargetId];
    if (!target || (target.hp && target.hp.current <= 0)) {
      setCombatTargetId('');
    }
  }, [combatTargetId, state]);

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

    // Thread a local copy so each emitted event gets a correct sequence, then
    // dispatch them all through the event-sourced persistence path.
    let working = selectedScene;
    const events: SceneEvent[] = [];
    const rejected: string[] = [];
    for (const intent of outcome.intents) {
      const result = resolveSceneAction(working, intent, {
        eventId: generateUUID(),
        createdAt: new Date(),
      });
      if (result.event) {
        events.push(result.event);
        working = appendSceneEvent(working, result.event);
      } else {
        // A simulated intent the runtime rejected on re-validation: surface it
        // rather than dropping the effect silently while the log claims it landed.
        rejected.push(...result.issues.map((issue) => issue.message));
      }
    }
    events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setCombatLog((current) => [...outcome.log.slice().reverse(), ...current].slice(0, 30));
    setActionIssues(rejected);
  };

  const handleCellActivate = useCallback(
    (position: { x: number; y: number }) => {
      if (!selectedScene || !state) return;

      if (placementMode === 'token') {
        const linkedDoc = documents.find((doc) => doc.id === tokenDocumentId);
        const name = tokenName.trim() || linkedDoc?.name.trim();
        if (!name) return;

        // A linked sheet can be placed as your character or as a (sheet-backed)
        // NPC; both carry combat HP so they are grid-combat-ready. Manual tokens
        // use the chosen kind as-is.
        const kind: SceneTokenKind = linkedDoc
          ? tokenKind === 'npc'
            ? 'npc'
            : 'character'
          : tokenKind;
        const built = linkedDoc
          ? buildCharacterCombatant(linkedDoc, { tokenId: linkedDoc.id, position })
          : undefined;
        const hp = built && built.supported ? built.combatant.token.hp : undefined;

        const placed = emitSceneAction(selectedScene, {
          type: 'place-token',
          token: {
            id: generateUUID(),
            name,
            kind,
            position,
            size: 1,
            refId: linkedDoc?.id,
            ...(hp ? { hp } : {}),
            // The player drives their own characters; Run Round skips them so a
            // solo player keeps manual control of their party. NPCs are
            // engine-driven and carry an explicit side.
            ...(kind === 'character' ? { playerControlled: true } : {}),
            ...(kind === 'npc' ? { allegiance: tokenAllegiance } : {}),
          },
        });

        if (placed) {
          setPlacementMode('none');
          setTokenName('');
          setTokenDocumentId('');
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
      markerLabel,
      markerKind,
      markerWidth,
      markerHeight,
      selectedTokenId,
      emitSceneAction,
    ]
  );

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

  const handleTokenActivate = useCallback((token: SceneToken) => {
    setSelectedTokenId(token.id);
    setPlacementMode('none');
  }, []);

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

  const handleDraftEncounter = (difficulty: EncounterDifficulty) => {
    if (!selectedScene) return;
    // Per-click nonce: re-drafting walks to the next deterministic variation
    // instead of returning the identical composition (rebalance ergonomics).
    draftNonceRef.current += 1;
    const partyLevels = encounterParty.members.map((member) => member.level);
    const result = draftEncounter({
      monsters: encounterMonsters,
      partyLevels,
      difficulty,
      seed: `${selectedScene.initialState.seed}:draft:${selectedScene.events.length}:${difficulty}:${draftNonceRef.current}`,
      systemId: sceneSystemId,
      // Budget and per-monster cost dispatch to each system's cited table
      // through the shared helpers the encounter-spec validator also uses, so
      // the draft and the gate can never disagree. Systems without a budget
      // model (e.g. 3.5e's Encounter-Level system) get a 0 budget and draft
      // nothing, rather than borrowing the 5e table.
      budget: encounterPartyBudget(sceneSystemId ?? '', partyLevels, difficulty),
      costFor: (monster: Monster) =>
        monsterEncounterCost(sceneSystemId ?? '', monster, partyLevels),
    });
    if (result.reason) {
      setActionIssues([`Encounter draft: ${result.reason}`]);
      return;
    }
    setEncounterSelections(result.selections);
    setActionIssues([]);
  };

  const handleRemoveEncounterSelection = (monsterId: string) => {
    setEncounterSelections((current) =>
      current.filter((selection) => selection.monsterId !== monsterId)
    );
  };

  const handleAdjustEncounterSelection = (monsterId: string, delta: number) => {
    setEncounterSelections((current) =>
      current.map((selection) =>
        selection.monsterId === monsterId
          ? {
              ...selection,
              count: Math.min(MAX_MONSTERS_PER_SELECTION, Math.max(1, selection.count + delta)),
            }
          : selection
      )
    );
  };

  const handleAddEncounter = () => {
    if (!selectedScene || pendingEncounterSelections.length === 0) return;

    const result = buildEncounterSceneEvents({
      scene: selectedScene,
      monsters: encounterMonsters,
      selections: pendingEncounterSelections,
      // Lets the builder roll seeded d20+DEX initiative for already-placed
      // character tokens instead of defaulting the party to a flat 10.
      documents,
      origin: {
        x: Math.max(0, positiveIntegerOrDefault(encounterOriginX, 0)),
        y: Math.max(0, positiveIntegerOrDefault(encounterOriginY, 0)),
      },
      // Map-aware spawn zone: a chosen terrain marker constrains placement.
      zone: (() => {
        const marker = encounterZoneId ? state?.markers[encounterZoneId] : undefined;
        return marker
          ? { position: marker.position, width: marker.width, height: marker.height }
          : undefined;
      })(),
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
          const { scenes: imported, droppedCount } = importScenesWithReport(
            String(loadEvent.target?.result ?? '')
          );
          const skipped =
            droppedCount > 0
              ? ` — ${droppedCount} invalid ${droppedCount === 1 ? 'entry' : 'entries'} skipped`
              : '';
          // Valid JSON can still contain no usable scenes (every candidate
          // structurally invalid). Say so instead of silently no-op'ing while
          // clearing the message — which reads as a successful import.
          if (imported.length === 0) {
            setActionIssues([
              droppedCount > 0
                ? `No valid scenes were found in that file${skipped}.`
                : 'No valid scenes were found in that file.',
            ]);
            return;
          }
          onAddScenes(imported);
          setSelectedSceneId(imported[0]?.id ?? selectedSceneId);
          // A partial import (some entries dropped) is surfaced, not silent.
          setActionIssues(
            droppedCount > 0
              ? [
                  `Imported ${imported.length} of ${imported.length + droppedCount} scenes${skipped}.`,
                ]
              : []
          );
        } catch (err) {
          setActionIssues([err instanceof Error ? err.message : 'Failed to import scenes.']);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportScenes = (targetScenes: SceneDocument[], filename: string) => {
    // Blob URLs avoid Chromium's ~2MB cap on data: anchors, which silently
    // no-ops exactly when a large scene log most needs exporting.
    const blob = new Blob([exportScenes(targetScenes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
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
            {campaigns.length > 0 && (
              <Select
                aria-label="Filter scenes by campaign"
                value={sceneCampaignFilter}
                onChange={(event) => setSceneCampaignFilter(event.target.value)}
              >
                <option value="">All campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
                <option value="none">No campaign</option>
              </Select>
            )}
            {scenes
              .filter((scene) =>
                sceneCampaignFilter === ''
                  ? true
                  : sceneCampaignFilter === 'none'
                    ? !scene.campaignId
                    : scene.campaignId === sceneCampaignFilter
              )
              .map((scene) => {
                const { state: sceneState, issues } = foldedScenesById.get(scene.id)!;
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
                  onTokenActivate={handleTokenActivate}
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
                    tokenAllegiance={tokenAllegiance}
                    onTokenAllegianceChange={setTokenAllegiance}
                    isPlacing={placementMode === 'token'}
                    onTogglePlace={() =>
                      setPlacementMode((current) => (current === 'token' ? 'none' : 'token'))
                    }
                    canDeleteToken={Boolean(selectedTokenId)}
                    onDeleteSelectedToken={handleDeleteSelectedToken}
                    conditionOptions={
                      sceneSystemId === 'dnd-5e-2014' || sceneSystemId === 'dnd-5e-2024'
                        ? DND5E_SCENE_CONDITIONS
                        : []
                    }
                    selectedTokenConditions={
                      (selectedTokenId && state.tokens[selectedTokenId]?.conditions) || []
                    }
                    onToggleSelectedTokenCondition={handleToggleSelectedTokenCondition}
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
                      supportsEncounterBudget(sceneSystemId ?? '')
                        ? handleDraftEncounter
                        : undefined
                    }
                    difficulty={encounterDifficulty}
                    onDifficultyChange={setEncounterDifficulty}
                    validation={encounterValidation}
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

                  <DicePanel seed={state.seed} />

                  {onLogToCampaign && linkedCampaign && (
                    <RecapPanel
                      state={state}
                      campaignName={linkedCampaign.name}
                      onLog={(title, body) => onLogToCampaign(linkedCampaign.id, title, body)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function isMonsterSystemId(systemId: string): systemId is GameSystemId {
  return (
    systemId === 'dnd-5e-2014' ||
    systemId === 'dnd-5e-2024' ||
    systemId === 'dnd-3.5e' ||
    systemId === 'pf1e' ||
    systemId === 'pf2e'
  );
}
