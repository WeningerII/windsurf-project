import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SceneCreateForm } from '../../components/scene/SceneCreateForm';
import type { Campaign } from '../../types/core/campaign';

const systemOptions = [
  { id: 'dnd-5e-2024', label: 'D&D 5e (2024)' },
  { id: 'pf2e', label: 'Pathfinder 2e' },
];

const now = new Date('2026-06-19T00:00:00.000Z');

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-1',
    name: 'Saltmarsh',
    systemId: 'pf2e',
    characterIds: [],
    notes: '',
    quests: [],
    sessionLog: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('SceneCreateForm', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SceneCreateForm
        open={false}
        systemOptions={systemOptions}
        campaigns={[]}
        defaultSystemId="dnd-5e-2024"
        onCancel={vi.fn()}
        onCreate={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('builds a scene from the entered fields and emits it', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <SceneCreateForm
        open
        systemOptions={systemOptions}
        campaigns={[]}
        defaultSystemId="dnd-5e-2024"
        onCancel={vi.fn()}
        onCreate={onCreate}
      />
    );

    await user.type(screen.getByPlaceholderText('Scene name'), 'The Crypt');
    await user.clear(screen.getByRole('textbox', { name: /scene width/i }));
    await user.type(screen.getByRole('textbox', { name: /scene width/i }), '8');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    const scene = onCreate.mock.calls[0][0];
    expect(scene).toMatchObject({ name: 'The Crypt', systemId: 'dnd-5e-2024' });
    // The grid lives on the folded initial state, not the document root.
    expect(scene.initialState.grid).toMatchObject({ width: 8, height: 10 });
  });

  it('adopts the chosen campaign system for the scene', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <SceneCreateForm
        open
        systemOptions={systemOptions}
        campaigns={[makeCampaign()]}
        defaultSystemId="dnd-5e-2024"
        onCancel={vi.fn()}
        onCreate={onCreate}
      />
    );

    await user.type(screen.getByPlaceholderText('Scene name'), 'Harbor Brawl');
    await user.selectOptions(screen.getByRole('combobox', { name: /scene campaign/i }), 'camp-1');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(onCreate.mock.calls[0][0]).toMatchObject({ systemId: 'pf2e', campaignId: 'camp-1' });
  });

  it('does not emit on an empty name and cancels cleanly', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onCancel = vi.fn();
    render(
      <SceneCreateForm
        open
        systemOptions={systemOptions}
        campaigns={[]}
        defaultSystemId="dnd-5e-2024"
        onCancel={onCancel}
        onCreate={onCreate}
      />
    );

    // Empty name → Create is disabled, nothing emitted.
    expect(screen.getByRole('button', { name: /^create$/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCreate).not.toHaveBeenCalled();
  });
});
