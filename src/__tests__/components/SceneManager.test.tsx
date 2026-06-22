import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { appendSceneEvent, createSceneDocument } from '../../scene/runtime';
import { resolveSceneAttack } from '../../rules';
import { SceneManager } from '../../components/SceneManager';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Campaign } from '../../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneDocument, SceneEvent } from '../../types/core/scene';

const encounterMonsterFixtures = vi.hoisted(() => [
  {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 15,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: ['darkvision 60 ft.'],
    languages: ['Common', 'Goblin'],
    actions: [{ name: 'Scimitar', description: 'Melee Weapon Attack.' }],
  },
  {
    id: 'ogre',
    name: 'Ogre',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'large',
    type: 'giant',
    alignment: 'chaotic evil',
    challengeRating: 2,
    experiencePoints: 450,
    armorClass: 11,
    hitPoints: { count: 7, die: 'd10', modifier: 21, notation: '7d10+21' },
    speed: { walk: 40 },
    abilities: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
    senses: ['darkvision 60 ft.'],
    languages: ['Common', 'Giant'],
    actions: [{ name: 'Greatclub', description: 'Melee Weapon Attack.' }],
  },
  // Never lands damage: every total misses (nat 20 crits, but 2d4 - 98 < 0
  // produces no intent either), so attacking appends NO event — the exact
  // stuck-seed shape from 05-H1/02-H1.
  {
    id: 'peasant',
    name: 'Peasant',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'medium',
    type: 'humanoid',
    alignment: 'neutral',
    challengeRating: 0.25,
    experiencePoints: 10,
    armorClass: 10,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    senses: [],
    languages: ['Common'],
    actions: [
      {
        name: 'Flail Wildly',
        description:
          'Melee Weapon Attack: -98 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 98) bludgeoning damage.',
      },
    ],
  },
  // One-shots anything it hits (only a natural 1 misses): deterministic kills
  // for the stale-target tests.
  {
    id: 'brute',
    name: 'Vicious Brute',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'medium',
    type: 'humanoid',
    alignment: 'chaotic evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 10,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 18, dex: 10, con: 10, int: 6, wis: 8, cha: 6 },
    senses: [],
    languages: ['Common'],
    actions: [
      {
        name: 'Overhead Smash',
        description:
          'Melee Weapon Attack: +98 to hit, reach 5 ft., one target. Hit: 99 (1d4 + 98) bludgeoning damage.',
      },
    ],
  },
]);

vi.mock('../../utils/dataLoader', () => ({
  loadMonstersForSystem: vi.fn(async () => encounterMonsterFixtures),
}));

// Pass-through spy: real resolution behavior, observable call arguments (the
// per-click seed regression below asserts on the seeds the UI derives).
vi.mock('../../rules', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../rules')>();
  return {
    ...actual,
    resolveSceneAttack: vi.fn(actual.resolveSceneAttack),
  };
});

const now = new Date('2026-05-01T12:00:00.000Z');

function makeDoc(
  id: string,
  name: string,
  systemId: CharacterDocument<SystemDataModel>['systemId'] = 'dnd-5e-2024',
  system: SystemDataModel = {} as SystemDataModel
): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId,
    system,
    createdAt: now,
    updatedAt: now,
  };
}

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'campaign-1',
    name: 'Night Watch',
    systemId: 'dnd-5e-2024',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeScene(overrides: Partial<SceneDocument> = {}): SceneDocument {
  return {
    ...createSceneDocument({
      id: 'scene-1',
      name: 'Training Room',
      systemId: 'dnd-5e-2024',
      grid: { width: 4, height: 4 },
      now,
    }),
    ...overrides,
  };
}

function SceneHarness({
  initialScenes = [],
  documents = [],
  campaigns = [],
}: {
  initialScenes?: SceneDocument[];
  documents?: CharacterDocument<SystemDataModel>[];
  campaigns?: Campaign[];
}) {
  const [scenes, setScenes] = useState(initialScenes);

  return (
    <SceneManager
      scenes={scenes}
      documents={documents}
      campaigns={campaigns}
      onAddScene={(scene) => setScenes((current) => [...current, scene])}
      onAddScenes={(incoming) => setScenes((current) => [...current, ...incoming])}
      onAppendSceneEvent={(sceneId: string, event: SceneEvent) =>
        setScenes((current) =>
          current.map((scene) => (scene.id === sceneId ? appendSceneEvent(scene, event) : scene))
        )
      }
      onDeleteScene={(id) => setScenes((current) => current.filter((scene) => scene.id !== id))}
    />
  );
}

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

afterEach(() => {
  // The AI tests below stub VITE_AI_ENABLED and global fetch; keep that from
  // leaking into the (AI-off-by-default) tests above and elsewhere.
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('SceneManager', () => {
  it('creates a scene and opens the manual grid', async () => {
    const user = userEvent.setup();
    render(<SceneHarness />);

    expect(screen.getByText('0 scenes saved')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new scene/i }));
    await user.type(screen.getByPlaceholderText('Scene name'), 'Training Room');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(screen.getByText('1 scene saved')).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: /Training Room grid/i })).toBeInTheDocument();
  });

  it('places a linked token, moves it through grid activation, and advances initiative', async () => {
    const user = userEvent.setup();
    const doc = makeDoc('doc-1', 'Astra');
    render(
      <SceneHarness
        initialScenes={[makeScene()]}
        documents={[doc]}
        campaigns={[makeCampaign({ characterIds: [doc.id] })]}
      />
    );

    await user.selectOptions(screen.getByRole('combobox', { name: /linked character/i }), doc.id);
    await user.click(screen.getByRole('button', { name: /place token/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 2, 2/i }));

    expect(screen.getByRole('button', { name: /Token Astra/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Token Astra/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 4, 4/i }));

    expect(screen.getByRole('gridcell', { name: /Cell 4, 4, Astra/i })).toBeInTheDocument();

    await user.clear(screen.getByRole('textbox', { name: /Astra initiative/i }));
    await user.type(screen.getByRole('textbox', { name: /Astra initiative/i }), '18');
    await user.click(screen.getByRole('button', { name: /set order/i }));

    await waitFor(() => {
      expect(screen.getByText('Round 1, active Astra')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /next turn/i }));
    expect(screen.getByText('Round 2, active Astra')).toBeInTheDocument();
  });

  it('places a mechanically-real NPC backed by a creature statblock', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    // Wait for the creature catalog to load (drives the NPC statblock picker).
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    await user.selectOptions(screen.getByRole('combobox', { name: /token kind/i }), 'npc');
    await user.selectOptions(screen.getByRole('combobox', { name: /npc statblock/i }), 'goblin');
    await user.click(screen.getByRole('button', { name: /place token/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 2, 2/i }));

    // Hostile by default and carrying statblock HP — a real combatant, not set dressing.
    expect(
      screen.getByRole('button', { name: /Token Goblin, enemy, \d+ of \d+ HP/i })
    ).toBeInTheDocument();
  });

  it('places and removes terrain or hazard markers as scene events', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await user.type(screen.getByRole('textbox', { name: /marker label/i }), 'Fire');
    await user.click(screen.getByRole('button', { name: /place marker/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 1, 1/i }));

    expect(screen.getByRole('gridcell', { name: /Cell 1, 1, Fire/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove fire/i }));
    expect(screen.queryByRole('gridcell', { name: /Cell 1, 1, Fire/i })).not.toBeInTheDocument();
  });

  it('adds loader-backed monsters as an event-backed encounter', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    expect(screen.getByRole('button', { name: /Token Goblin 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Token Goblin 2/i })).toBeInTheDocument();
    expect(screen.getByText(/100 XP \/ SRD 5.2/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Round 1, active Goblin/i)).toBeInTheDocument();
    });
  });

  it('queues multiple monster types and previews party-aware XP', async () => {
    const user = userEvent.setup();
    const astra = makeDoc('doc-1', 'Astra', 'dnd-5e-2024', { level: 3 });
    const borin = makeDoc('doc-2', 'Borin', 'dnd-5e-2024', { level: 3 });
    render(<SceneHarness initialScenes={[makeScene()]} documents={[astra, borin]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /queue monster/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: /encounter monster/i }), 'ogre');
    await user.click(screen.getByRole('button', { name: /queue monster/i }));

    expect(screen.getByText(/Plan: 3 monsters \/ 550 XP/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Party: 2 PCs \/ avg level 3 \/ 92 XP per party level/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    expect(screen.getByRole('button', { name: /Token Goblin 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Token Goblin 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Token Ogre/i })).toBeInTheDocument();
  });

  it('hides the AI draft affordance when AI is disabled (default)', async () => {
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    // Default-OFF: the panel is byte-for-byte the pre-AI experience.
    expect(screen.queryByRole('button', { name: /draft with ai/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /ai encounter prompt/i })).not.toBeInTheDocument();
  });

  it('drafts an encounter via the AI gateway, then applies it through the same builder', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    // Stub the same-origin gateway: the model "proposes" two goblins; the
    // deterministic encounter-spec gate then accepts them (100 XP, on budget).
    const fetchSpy = vi.fn(async () => ({
      json: async () => ({
        ok: true,
        task: 'encounter-draft',
        data: { selections: [{ monsterId: 'goblin', count: 2 }], rationale: 'A scouting pack.' },
        usage: { source: 'fixture' },
      }),
    }));
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    const user = userEvent.setup();
    const astra = makeDoc('doc-1', 'Astra', 'dnd-5e-2024', { level: 3 });
    const borin = makeDoc('doc-2', 'Borin', 'dnd-5e-2024', { level: 3 });
    render(<SceneHarness initialScenes={[makeScene()]} documents={[astra, borin]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    await user.type(
      screen.getByRole('textbox', { name: /ai encounter prompt/i }),
      'a goblin scouting pack'
    );
    await user.click(screen.getByRole('button', { name: /draft with ai/i }));

    // The accepted draft populates the review list — it is NOT auto-applied.
    await waitFor(() => {
      expect(screen.getByText(/2 x Goblin/i)).toBeInTheDocument();
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      '/.netlify/functions/ai-gateway',
      expect.objectContaining({ method: 'POST' })
    );
    expect(screen.queryByRole('button', { name: /Token Goblin 1/i })).not.toBeInTheDocument();

    // The GM applies it through the SAME deterministic builder a manual draft uses.
    await user.click(screen.getByRole('button', { name: /add encounter/i }));
    expect(screen.getByRole('button', { name: /Token Goblin 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Token Goblin 2/i })).toBeInTheDocument();
  });

  it('surfaces a gateway failure without applying anything (degrades to manual)', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }) as unknown as typeof fetch
    );

    const user = userEvent.setup();
    const astra = makeDoc('doc-1', 'Astra', 'dnd-5e-2024', { level: 3 });
    render(<SceneHarness initialScenes={[makeScene()]} documents={[astra]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    await user.type(screen.getByRole('textbox', { name: /ai encounter prompt/i }), 'anything');
    await user.click(screen.getByRole('button', { name: /draft with ai/i }));

    await waitFor(() => {
      expect(screen.getByText(/AI draft:/i)).toBeInTheDocument();
    });
    // Nothing was placed; the manual tools remain fully usable.
    expect(screen.queryByRole('button', { name: /Token Goblin 1/i })).not.toBeInTheDocument();
  });

  it('hides the identify-from-image affordance when AI is disabled', async () => {
    render(<SceneHarness initialScenes={[makeScene()]} />);
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    expect(screen.queryByRole('button', { name: /identify from image/i })).not.toBeInTheDocument();
  });

  it('identifies a creature from an uploaded image and selects its statblock', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    // The vision model "recognizes" the ogre; the flow then confirms the id is
    // in the loaded catalog before the panel selects it.
    const fetchSpy = vi.fn(async () => ({
      json: async () => ({
        ok: true,
        task: 'identify-creature',
        data: { monsterId: 'ogre', confidence: 0.82, reason: 'a hulking brute' },
        usage: { source: 'fixture' },
      }),
    }));
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    const file = new File([new Uint8Array([1, 2, 3, 4])], 'ogre.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/creature image to identify/i), file);

    // The identified creature is selected for review (not placed automatically).
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('ogre');
    });
    expect(screen.getByText(/Identified Ogre \(82% sure\)/i)).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      '/.netlify/functions/ai-gateway',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('reports an unreadable / non-image upload without selecting anything', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    render(<SceneHarness initialScenes={[makeScene()]} />);
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });

    const notImage = new File(['plain text'], 'notes.txt', { type: 'text/plain' });
    // fireEvent bypasses the input's accept filter so the handler's own guard
    // (not the browser's) is what we exercise here.
    fireEvent.change(screen.getByLabelText(/creature image to identify/i), {
      target: { files: [notImage] },
    });

    await waitFor(() => {
      expect(screen.getByText(/choose an image file/i)).toBeInTheDocument();
    });
    // Rejected before any network call; selection unchanged.
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
  });

  it('REGRESSION (05-H1/02-H1): each Attack click derives a fresh seed even when no event lands', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    await user.selectOptions(
      screen.getByRole('combobox', { name: /encounter monster/i }),
      'peasant'
    );
    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    // Pick attacker + target; the peasant's attack can never produce a damage
    // event, so events.length stays frozen between clicks.
    await user.click(screen.getByRole('button', { name: /Token Peasant 1/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: /attack target/i }), 'peasant-2');
    await user.click(screen.getByRole('button', { name: /^attack$/i }));
    await user.click(screen.getByRole('button', { name: /^attack$/i }));

    const seeds = vi
      .mocked(resolveSceneAttack)
      .mock.calls.map(([params]) => (params as { seed: string }).seed);
    expect(seeds).toHaveLength(2);
    // Same scene seed and same (frozen) events.length, but the per-click nonce
    // advances — before the fix both clicks were byte-identical streams.
    expect(seeds[0]).toMatch(/^scene-1:attack:\d+:0$/);
    expect(seeds[1]).toMatch(/^scene-1:attack:\d+:1$/);
    expect(seeds[0].replace(/:\d+$/, '')).toBe(seeds[1].replace(/:\d+$/, ''));
    expect(seeds[0]).not.toBe(seeds[1]);

    // Two log lines were appended (the misses are visible, just not events).
    const log = screen.getAllByText(/Peasant 1 .*Peasant 2/i);
    expect(log.length).toBeGreaterThanOrEqual(2);
  });

  it('REGRESSION (05-M6): Run Round advances the scene round machinery', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Round 1, active Goblin/i)).toBeInTheDocument();
    });

    // The goblins share a faction (no damage events), but the completed engine
    // round still walks the initiative cycle — the round was pinned at 1
    // forever before the fix.
    await user.click(screen.getByRole('button', { name: /run round/i }));
    await waitFor(() => {
      expect(screen.getByText(/Round 2, active Goblin/i)).toBeInTheDocument();
    });
  });

  it('PHASE 12: the AI strategist toggle fetches hints between rounds without blocking the turn', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    const fetchSpy = vi.fn(async (_url: string, _init?: { body?: string }) => ({
      json: async () => ({
        ok: true,
        task: 'strategy-hints',
        data: { hints: [] },
        usage: { source: 'fixture' },
      }),
    }));
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));
    await waitFor(() => {
      expect(screen.getByText(/Round 1, active Goblin/i)).toBeInTheDocument();
    });

    // Enable the strategist, then run a round. The round must complete
    // synchronously (Round 2 shows) AND the strategist must have been consulted
    // for the next round — proving the surface is reachable and non-blocking.
    await user.click(screen.getByRole('checkbox', { name: /ai strategist/i }));
    await user.click(screen.getByRole('button', { name: /run round/i }));

    await waitFor(() => {
      expect(screen.getByText(/Round 2, active Goblin/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      const strategyCalls = fetchSpy.mock.calls.filter(([, init]) => {
        return typeof init?.body === 'string' && JSON.parse(init.body).task === 'strategy-hints';
      });
      expect(strategyCalls.length).toBeGreaterThan(0);
    });
  });

  it('REGRESSION (02-M2): typing an initiative value survives appended events', async () => {
    const user = userEvent.setup();
    const doc = makeDoc('doc-1', 'Astra');
    render(<SceneHarness initialScenes={[makeScene()]} documents={[doc]} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /linked character/i }), doc.id);
    await user.click(screen.getByRole('button', { name: /place token/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 2, 2/i }));

    await user.clear(screen.getByRole('textbox', { name: /Astra initiative/i }));
    await user.type(screen.getByRole('textbox', { name: /Astra initiative/i }), '18');
    await user.click(screen.getByRole('button', { name: /set order/i }));

    // Start editing a NEW value, then append an event (move the token): the
    // sync effect used to clobber the input back to the stored 18.
    await user.clear(screen.getByRole('textbox', { name: /Astra initiative/i }));
    await user.type(screen.getByRole('textbox', { name: /Astra initiative/i }), '25');
    await user.click(screen.getByRole('button', { name: /Token Astra/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 4, 4/i }));

    expect(screen.getByRole('gridcell', { name: /Cell 4, 4, Astra/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Astra initiative/i })).toHaveValue('25');
  });

  it('REGRESSION (02-L3): clearing an initiative input keeps the token with its previous value', async () => {
    const user = userEvent.setup();
    const doc = makeDoc('doc-1', 'Astra');
    render(<SceneHarness initialScenes={[makeScene()]} documents={[doc]} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /linked character/i }), doc.id);
    await user.click(screen.getByRole('button', { name: /place token/i }));
    await user.click(screen.getByRole('gridcell', { name: /Cell 2, 2/i }));

    await user.clear(screen.getByRole('textbox', { name: /Astra initiative/i }));
    await user.type(screen.getByRole('textbox', { name: /Astra initiative/i }), '18');
    await user.click(screen.getByRole('button', { name: /set order/i }));
    await waitFor(() => {
      expect(screen.getByText('Round 1, active Astra')).toBeInTheDocument();
    });

    // Clear the input and Set Order again: the token must NOT drop out of the
    // initiative order; the previous value (18) is kept and surfaced.
    await user.clear(screen.getByRole('textbox', { name: /Astra initiative/i }));
    await user.click(screen.getByRole('button', { name: /set order/i }));

    expect(
      screen.getByText(/Invalid initiative for Astra — kept the previous value\./i)
    ).toBeInTheDocument();
    expect(screen.getByText('Round 1, active Astra')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Astra initiative/i })).toHaveValue('18');
  });

  it('REGRESSION (02-M3): killing the selected target clears it from the combat panel', async () => {
    const user = userEvent.setup();
    render(<SceneHarness initialScenes={[makeScene()]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    await user.selectOptions(screen.getByRole('combobox', { name: /encounter monster/i }), 'brute');
    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    await user.click(screen.getByRole('button', { name: /Token Vicious Brute 1/i }));
    const targetSelect = screen.getByRole('combobox', { name: /attack target/i });
    await user.selectOptions(targetSelect, 'brute-2');

    // Pinned: under this scene's fixed seed chain the +98 attack hits (only a
    // natural 1 could miss) and the 99 damage drops Brute 2 to 0 HP.
    await user.click(screen.getByRole('button', { name: /^attack$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vicious Brute 1 (hits|crits) Vicious Brute 2/i)).toBeInTheDocument();
    });
    // The dead target is deselected (no blank-but-armed Attack button)...
    await waitFor(() => {
      expect(targetSelect).toHaveValue('');
    });
    // ...and Attack is disabled until a new target is chosen.
    expect(screen.getByRole('button', { name: /^attack$/i })).toBeDisabled();
  });

  it('REGRESSION (02-M3): switching scenes clears the combat target and log', async () => {
    const user = userEvent.setup();
    const otherScene = {
      ...createSceneDocument({
        id: 'scene-2',
        name: 'Empty Hall',
        systemId: 'dnd-5e-2024',
        grid: { width: 4, height: 4 },
        now,
      }),
    };
    render(<SceneHarness initialScenes={[makeScene(), otherScene]} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /encounter monster/i })).toHaveValue('goblin');
    });
    await user.selectOptions(
      screen.getByRole('combobox', { name: /encounter monster/i }),
      'peasant'
    );
    await user.clear(screen.getByRole('textbox', { name: /encounter count/i }));
    await user.type(screen.getByRole('textbox', { name: /encounter count/i }), '2');
    await user.click(screen.getByRole('button', { name: /add encounter/i }));

    await user.click(screen.getByRole('button', { name: /Token Peasant 1/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: /attack target/i }), 'peasant-2');
    await user.click(screen.getByRole('button', { name: /^attack$/i }));
    expect(screen.getByText(/Peasant 1 .*Peasant 2/i)).toBeInTheDocument();

    // Switch scenes: the other scene must not show this scene's combat log.
    await user.click(screen.getByRole('button', { name: /Empty Hall/i }));
    expect(screen.queryByText(/Peasant 1 .*Peasant 2/i)).not.toBeInTheDocument();
  });
});
