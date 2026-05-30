import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { appendSceneEvent, createSceneDocument } from '../../scene/runtime';
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
    source: 'SRD 5.2.1',
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
    source: 'SRD 5.2.1',
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
]);

vi.mock('../../utils/dataLoader', () => ({
  loadMonstersForSystem: vi.fn(async () => encounterMonsterFixtures),
}));

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
    expect(screen.getByText(/100 XP \/ SRD 5.2.1/i)).toBeInTheDocument();

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
});
