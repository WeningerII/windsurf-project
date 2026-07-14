import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSceneDocument } from '../../scene/runtime';
import { exportScenes } from '../../utils/sceneStorage';
import { LibraryScenesView } from '../../components/LibraryScenesView';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Campaign } from '../../types/core/campaign';
import type { SceneDocument } from '../../types/core/scene';

// The picker's import flow goes through the shared file-picker util; the mock
// hands each test direct control of the "chosen file" text.
const pickTextFileMock = vi.hoisted(() => vi.fn());
vi.mock('../../utils/fileTransfer', () => ({
  pickTextFile: pickTextFileMock,
  downloadTextFile: vi.fn(),
}));

const now = new Date('2026-05-01T12:00:00.000Z');

function makeScene(
  id: string,
  name: string,
  overrides: Partial<SceneDocument> = {}
): SceneDocument {
  return {
    ...createSceneDocument({
      id,
      name,
      systemId: 'dnd-5e-2024',
      grid: { width: 4, height: 4 },
      now,
    }),
    ...overrides,
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

function renderView({
  scenes = [],
  campaigns = [],
  selectedSceneId = null,
}: {
  scenes?: SceneDocument[];
  campaigns?: Campaign[];
  selectedSceneId?: string | null;
} = {}) {
  const onSelectScene = vi.fn();
  const onAddScene = vi.fn();
  const onAddScenes = vi.fn();
  render(
    <LibraryScenesView
      scenes={scenes}
      campaigns={campaigns}
      selectedSceneId={selectedSceneId}
      onSelectScene={onSelectScene}
      onAddScene={onAddScene}
      onAddScenes={onAddScenes}
    />
  );
  return { onSelectScene, onAddScene, onAddScenes };
}

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

beforeEach(() => {
  pickTextFileMock.mockReset();
});

describe('LibraryScenesView', () => {
  it('lists scenes select-only: a card click emits the shell seam, and no operating panels render', async () => {
    const user = userEvent.setup();
    const { onSelectScene } = renderView({
      scenes: [makeScene('scene-1', 'Training Room'), makeScene('scene-2', 'Empty Hall')],
    });

    expect(screen.getByText('2 scenes saved')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Training Room/i }));
    expect(onSelectScene).toHaveBeenCalledWith('scene-1');

    // Select-only picker: the operating canvas (placement, combat) is the
    // Scene surface's SceneManager, deliberately not rendered here.
    expect(screen.queryByRole('button', { name: /place token/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^attack$/i })).not.toBeInTheDocument();
  });

  it('filters the list by campaign', async () => {
    const user = userEvent.setup();
    renderView({
      scenes: [
        makeScene('scene-1', 'Training Room', { campaignId: 'campaign-1' }),
        makeScene('scene-2', 'Empty Hall'),
      ],
      campaigns: [makeCampaign()],
    });

    await user.selectOptions(
      screen.getByRole('combobox', { name: /filter scenes by campaign/i }),
      'campaign-1'
    );

    expect(screen.getByRole('button', { name: /Training Room/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Empty Hall/i })).not.toBeInTheDocument();
  });

  it('creates a scene and hands it to the shell seam (create-then-open)', async () => {
    const user = userEvent.setup();
    const { onSelectScene, onAddScene } = renderView();

    expect(screen.getByText('0 scenes saved')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new scene/i }));
    await user.type(screen.getByPlaceholderText('Scene name'), 'Night Raid');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(onAddScene).toHaveBeenCalledTimes(1);
    const created = onAddScene.mock.calls[0][0] as SceneDocument;
    expect(created.name).toBe('Night Raid');
    // The seam selects the new scene; useAppNav then flips to the Scene
    // surface, so create-then-open lands on the live canvas.
    expect(onSelectScene).toHaveBeenCalledWith(created.id);
  });

  it('imports scenes and selects the first imported through the seam', async () => {
    const user = userEvent.setup();
    const imported = [makeScene('scene-9', 'Ambush'), makeScene('scene-10', 'Escape')];
    pickTextFileMock.mockImplementation((onText: (text: string) => void) =>
      onText(exportScenes(imported))
    );
    const { onSelectScene, onAddScenes } = renderView();

    await user.click(screen.getByRole('button', { name: /import scenes/i }));

    expect(onAddScenes).toHaveBeenCalledTimes(1);
    expect((onAddScenes.mock.calls[0][0] as SceneDocument[]).map((scene) => scene.id)).toEqual([
      'scene-9',
      'scene-10',
    ]);
    expect(onSelectScene).toHaveBeenCalledWith('scene-9');
  });

  it('reports a scene-less import file without adding or selecting anything', async () => {
    const user = userEvent.setup();
    // A valid export envelope whose only candidate is structurally invalid:
    // the report path (not the parse-error catch) must surface it.
    pickTextFileMock.mockImplementation((onText: (text: string) => void) =>
      onText(JSON.stringify({ scenes: [{ nothing: 'usable' }] }))
    );
    const { onSelectScene, onAddScenes } = renderView();

    await user.click(screen.getByRole('button', { name: /import scenes/i }));

    expect(screen.getByText(/No valid scenes were found in that file/i)).toBeInTheDocument();
    expect(onAddScenes).not.toHaveBeenCalled();
    expect(onSelectScene).not.toHaveBeenCalled();
  });
});
