/**
 * Encounter-building controller for SceneManager. Owns the loaded creature
 * catalog, the encounter draft state, the derived plan/party/budget readouts,
 * and the queue/draft/AI/identify/add handlers — i.e. everything behind the
 * EncounterPanel's prop surface plus the catalog the NPC picker and combat-stat
 * resolution also read. Extracted verbatim from SceneManager to shrink that
 * component; the host destructures the return into the same names it used
 * inline, so behavior is unchanged.
 *
 * The model proposes (AI draft / identify); the deterministic encounter-spec
 * gate and loader catalog decide — an invented id is always rejected.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MAX_MONSTERS_PER_SELECTION,
  buildEncounterSceneEvents,
  summarizeEncounterParty,
  summarizeEncounterPlan,
  type EncounterMonsterSelection,
} from '../../scene/encounterBuilder';
import {
  draftEncounter,
  encounterPartyBudget,
  monsterEncounterCost,
  type EncounterDifficulty,
} from '../../scene/encounterDraft';
import { validateEncounterSpec } from '../../scene/encounterSpec';
import { positiveIntegerOrDefault } from '../../scene/runtime';
import { draftEncounterWithAi } from '../../ai/encounterDraftFlow';
import { identifyCreatureWithAi } from '../../ai/identifyCreatureFlow';
import { fileToAiImageInput } from '../../ai/imageInput';
import { generateUUID } from '../../utils/browserCompat';
import { loadMonstersForSystem } from '../../utils/dataLoader';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type { GameSystemId } from '../../types/game-systems';
import type { SceneDocument, SceneEvent, SceneState } from '../../types/core/scene';

/** Systems with a loader-backed monster catalog (encounters/NPCs draw from it). */
function isMonsterSystemId(systemId: string): systemId is GameSystemId {
  return (
    systemId === 'dnd-5e-2014' ||
    systemId === 'dnd-5e-2024' ||
    systemId === 'dnd-3.5e' ||
    systemId === 'pf1e' ||
    systemId === 'pf2e'
  );
}

export interface UseSceneEncounterParams {
  sceneSystemId: string | undefined;
  selectedScene: SceneDocument | undefined;
  state: SceneState | undefined;
  /** All documents (the encounter builder rolls initiative for placed PCs). */
  documents: CharacterDocument<SystemDataModel>[];
  /** Scene-eligible party documents (drives the budget/party readout). */
  eligibleDocuments: CharacterDocument<SystemDataModel>[];
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  /** Surface validation/error messages on the host (its actionIssues banner). */
  onIssues: (issues: string[]) => void;
  /** Applied an encounter: clear the host's token selection + placement mode. */
  onEncounterApplied: () => void;
}

export function useSceneEncounter(params: UseSceneEncounterParams) {
  const {
    sceneSystemId,
    selectedScene,
    state,
    documents,
    eligibleDocuments,
    onAppendSceneEvent,
    onIssues,
    onEncounterApplied,
  } = params;

  const [encounterMonsters, setEncounterMonsters] = useState<Monster[]>([]);
  const [encounterMonsterId, setEncounterMonsterId] = useState('');
  const [encounterCount, setEncounterCount] = useState('1');
  const [encounterDifficulty, setEncounterDifficulty] = useState<EncounterDifficulty>('moderate');
  const [encounterOriginX, setEncounterOriginX] = useState('0');
  const [encounterOriginY, setEncounterOriginY] = useState('0');
  const [encounterSelections, setEncounterSelections] = useState<EncounterMonsterSelection[]>([]);
  const [encounterZoneId, setEncounterZoneId] = useState('');
  const [aiEncounterPrompt, setAiEncounterPrompt] = useState('');
  const [aiDrafting, setAiDrafting] = useState(false);
  const [aiIdentifying, setAiIdentifying] = useState(false);
  const [identifyNotice, setIdentifyNotice] = useState<string | null>(null);
  const draftNonceRef = useRef(0);
  const [monstersLoading, setMonstersLoading] = useState(false);
  const [monsterLoadError, setMonsterLoadError] = useState<string | null>(null);

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

  // Creature catalog as lightweight {id,name} options for the NPC statblock picker.
  const eligibleStatblocks = useMemo(
    () => encounterMonsters.map((monster) => ({ id: monster.id, name: monster.name })),
    [encounterMonsters]
  );
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
  // same validator the AI drafting loop consumes.
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
    onIssues([]);
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
      // the draft and the gate can never disagree. Each system spends its own
      // cited model (5e's XP table, PF1e/PF2e's CRB tables, 3.5e's derived
      // Encounter-Level value scale); systems without a budget model get a 0
      // budget and draft nothing, rather than borrowing the 5e table.
      budget: encounterPartyBudget(sceneSystemId ?? '', partyLevels, difficulty),
      costFor: (monster: Monster) =>
        monsterEncounterCost(sceneSystemId ?? '', monster, partyLevels),
    });
    if (result.reason) {
      onIssues([`Encounter draft: ${result.reason}`]);
      return;
    }
    setEncounterSelections(result.selections);
    onIssues([]);
  };

  // AI-assisted draft: the model proposes selections from the loaded catalog;
  // the SAME deterministic encounter-spec gate then accepts or rejects them
  // (bounded repair on rejection). A success only populates the review list —
  // the GM still presses "Add Encounter" to apply it, exactly as for a manual
  // or deterministic draft. Failures degrade to the existing manual tools.
  const handleAiDraftEncounter = async () => {
    if (!selectedScene || !sceneSystemId) return;
    const prompt = aiEncounterPrompt.trim();
    if (!prompt || encounterMonsters.length === 0) return;
    const partyLevels = encounterParty.members.map((member) => member.level);
    const candidates = encounterMonsters.map((monster) => ({
      id: monster.id,
      name: monster.name,
      challengeRating: monster.challengeRating,
    }));

    setAiDrafting(true);
    onIssues([]);
    try {
      const result = await draftEncounterWithAi(
        {
          systemId: sceneSystemId,
          partyLevels,
          difficulty: encounterDifficulty,
          prompt,
          candidates,
        },
        (selections) =>
          validateEncounterSpec(
            { systemId: sceneSystemId, difficulty: encounterDifficulty, partyLevels, selections },
            { monsters: encounterMonsters }
          )
            .issues.filter((issue) => issue.severity === 'error')
            .map((issue) => issue.message)
      );
      if (!result.ok) {
        onIssues([`AI draft: ${result.error}`]);
        return;
      }
      setEncounterSelections(
        result.selections.map((selection) => ({
          monsterId: selection.monsterId,
          count: Math.min(MAX_MONSTERS_PER_SELECTION, selection.count),
        }))
      );
      onIssues([]);
    } finally {
      setAiDrafting(false);
    }
  };

  // AI vision: identify a creature from an uploaded image and select its
  // statblock for review. The model returns one catalog id; identifyCreatureWithAi
  // rejects any id outside the loaded pool before we touch the selection. The GM
  // still queues/places it manually, so nothing is applied automatically.
  const handleIdentifyCreature = async (file: File) => {
    if (!sceneSystemId || encounterMonsters.length === 0) return;
    setAiIdentifying(true);
    setIdentifyNotice(null);
    onIssues([]);
    try {
      let image;
      try {
        image = await fileToAiImageInput(file);
      } catch (error) {
        onIssues([error instanceof Error ? error.message : 'Could not read the image.']);
        return;
      }
      const candidates = encounterMonsters.map((monster) => ({
        id: monster.id,
        name: monster.name,
        challengeRating: monster.challengeRating,
      }));
      const result = await identifyCreatureWithAi({ systemId: sceneSystemId, candidates, image });
      if (!result.ok) {
        onIssues([`Identify: ${result.error}`]);
        return;
      }
      setEncounterMonsterId(result.monsterId);
      setIdentifyNotice(
        `Identified ${result.name} (${Math.round(result.confidence * 100)}% sure). Selected it below.`
      );
    } finally {
      setAiIdentifying(false);
    }
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
      onIssues(result.issues.map((issue) => issue.message));
      return;
    }

    result.events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setEncounterSelections([]);
    onEncounterApplied();
    onIssues([]);
  };

  return {
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
  };
}
