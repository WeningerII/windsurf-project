import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignManager } from '../../components/CampaignManager';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { Campaign } from '../../types/core/campaign';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const now = new Date('2026-03-07T12:00:00.000Z');

function makeDoc(
  id: string,
  name: string,
  systemId: CharacterDocument<SystemDataModel>['systemId']
): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId,
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
  };
}

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'campaign-1',
    name: 'Alpha Squad',
    characterIds: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

describe('CampaignManager', () => {
  it('renders the empty state and supports creating a new campaign', async () => {
    const user = userEvent.setup();
    const onAddCampaign = vi.fn();

    render(
      <CampaignManager
        campaigns={[]}
        documents={[]}
        onAddCampaign={onAddCampaign}
        onUpdateCampaign={vi.fn()}
        onDeleteCampaign={vi.fn()}
        onAddCharacter={vi.fn()}
        onRemoveCharacter={vi.fn()}
        onOpenCharacter={vi.fn()}
      />
    );

    expect(screen.getByText(/No campaigns yet/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /new campaign/i }));

    const input = screen.getByPlaceholderText('Campaign name...');
    expect(screen.getByRole('button', { name: /^create$/i })).toBeDisabled();

    await user.type(input, 'Night Watch');
    await user.selectOptions(screen.getByRole('combobox', { name: /campaign system/i }), 'pf2e');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(onAddCampaign).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Night Watch',
        systemId: 'pf2e',
        characterIds: [],
        notes: '',
      })
    );
  });

  it('expands campaigns, opens members, updates notes, removes members, and deletes the campaign', async () => {
    const user = userEvent.setup();
    const onUpdateCampaign = vi.fn();
    const onRemoveCharacter = vi.fn();
    const onDeleteCampaign = vi.fn();
    const onOpenCharacter = vi.fn();
    const doc = makeDoc('doc-1', 'Astra', 'dnd-5e-2024');

    render(
      <CampaignManager
        campaigns={[makeCampaign({ characterIds: [doc.id], notes: 'Old notes' })]}
        documents={[doc]}
        onAddCampaign={vi.fn()}
        onUpdateCampaign={onUpdateCampaign}
        onDeleteCampaign={onDeleteCampaign}
        onAddCharacter={vi.fn()}
        onRemoveCharacter={onRemoveCharacter}
        onOpenCharacter={onOpenCharacter}
      />
    );

    await user.click(screen.getByRole('button', { name: /Alpha Squad/i }));
    await user.click(screen.getByText('Astra').closest('button') as HTMLButtonElement);
    await user.click(screen.getByTitle('Remove Astra from campaign'));
    fireEvent.change(screen.getByPlaceholderText(/Session notes/i), {
      target: { value: 'Track the goblin cave' },
    });
    await user.click(screen.getByRole('button', { name: /delete campaign/i }));

    expect(onOpenCharacter).toHaveBeenCalledWith('doc-1');
    expect(onRemoveCharacter).toHaveBeenCalledWith('campaign-1', 'doc-1');
    expect(onUpdateCampaign).toHaveBeenCalledWith(
      expect.objectContaining({ notes: 'Track the goblin cave' })
    );
    expect(onDeleteCampaign).toHaveBeenCalledWith('campaign-1');
  });

  it('shows available characters for adding and handles the all-added state', async () => {
    const user = userEvent.setup();
    const onAddCharacter = vi.fn();
    const member = makeDoc('doc-1', 'Astra', 'dnd-5e-2024');
    const available = makeDoc('doc-2', 'Borin', 'pf2e');

    const { rerender } = render(
      <CampaignManager
        campaigns={[makeCampaign({ characterIds: [member.id] })]}
        documents={[member, available]}
        onAddCampaign={vi.fn()}
        onUpdateCampaign={vi.fn()}
        onDeleteCampaign={vi.fn()}
        onAddCharacter={onAddCharacter}
        onRemoveCharacter={vi.fn()}
        onOpenCharacter={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Alpha Squad/i }));
    await user.click(screen.getByRole('button', { name: /add character/i }));
    await user.click(screen.getByRole('button', { name: /Borin/i }));
    await user.click(screen.getByRole('button', { name: /^done$/i }));

    expect(onAddCharacter).toHaveBeenCalledWith('campaign-1', 'doc-2');
    expect(screen.queryByText('Borin')).not.toBeInTheDocument();

    rerender(
      <CampaignManager
        campaigns={[makeCampaign({ characterIds: [member.id, available.id] })]}
        documents={[member, available]}
        onAddCampaign={vi.fn()}
        onUpdateCampaign={vi.fn()}
        onDeleteCampaign={vi.fn()}
        onAddCharacter={vi.fn()}
        onRemoveCharacter={vi.fn()}
        onOpenCharacter={vi.fn()}
      />
    );

    if (!screen.queryByRole('button', { name: /add character/i })) {
      await user.click(screen.getByRole('button', { name: /Alpha Squad/i }));
    }
    await user.click(screen.getByRole('button', { name: /add character/i }));

    expect(screen.getByText(/All characters are already in this campaign/i)).toBeInTheDocument();
  });

  it('filters available characters by campaign system', async () => {
    const user = userEvent.setup();
    const onAddCharacter = vi.fn();
    const dndCharacter = makeDoc('doc-1', 'Astra', 'dnd-5e-2024');
    const pf2eCharacter = makeDoc('doc-2', 'Borin', 'pf2e');

    render(
      <CampaignManager
        campaigns={[makeCampaign({ systemId: 'dnd-5e-2024' })]}
        documents={[dndCharacter, pf2eCharacter]}
        onAddCampaign={vi.fn()}
        onUpdateCampaign={vi.fn()}
        onDeleteCampaign={vi.fn()}
        onAddCharacter={onAddCharacter}
        onRemoveCharacter={vi.fn()}
        onOpenCharacter={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Alpha Squad/i }));
    expect(screen.getByRole('combobox', { name: /system for alpha squad/i })).toHaveValue(
      'dnd-5e-2024'
    );

    await user.click(screen.getByRole('button', { name: /add character/i }));
    expect(screen.getByRole('button', { name: /Astra/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Borin/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Astra/i }));
    expect(onAddCharacter).toHaveBeenCalledWith('campaign-1', 'doc-1');
  });

  it('updates an existing campaign system filter', async () => {
    const user = userEvent.setup();
    const onUpdateCampaign = vi.fn();

    render(
      <CampaignManager
        campaigns={[makeCampaign({ systemId: 'dnd-5e-2024' })]}
        documents={[]}
        onAddCampaign={vi.fn()}
        onUpdateCampaign={onUpdateCampaign}
        onDeleteCampaign={vi.fn()}
        onAddCharacter={vi.fn()}
        onRemoveCharacter={vi.fn()}
        onOpenCharacter={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Alpha Squad/i }));
    await user.selectOptions(
      screen.getByRole('combobox', { name: /system for alpha squad/i }),
      'pf2e'
    );

    expect(onUpdateCampaign).toHaveBeenCalledWith(expect.objectContaining({ systemId: 'pf2e' }));
  });
});
