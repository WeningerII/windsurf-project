/**
 * The AI character-draft affordance: RFC 002 requires the user to SEE what was
 * proposed and approve it before anything durable happens, and requires the
 * surface to degrade rather than break when AI is off or unconfigured.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AiCharacterDraftPanel } from '../../components/AiCharacterDraftPanel';
import type { CharacterDraftOutcome } from '../../ai/characterDraftSession';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const SYSTEM = { abilities: { strength: 10 } } as unknown as SystemDataModel;

const DOCUMENT = {
  id: 'draft-1',
  name: 'Thera Stonehand',
  systemId: 'dnd-5e-2024',
  system: SYSTEM,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  version: 1,
} as unknown as CharacterDocument<SystemDataModel>;

const PROPOSAL: CharacterDraftOutcome = {
  ok: true,
  proposal: {
    document: DOCUMENT,
    rationale: 'A cautious healer who used to be a soldier.',
    choices: [
      { category: 'classes', id: 'cleric', name: 'Cleric', applied: true },
      { category: 'ancestries', id: 'dwarf', name: 'Dwarf', applied: true },
      { category: 'spells', id: 'bless', name: 'Bless', applied: false },
    ],
  },
};

describe('AiCharacterDraftPanel', () => {
  it('shows the proposal for review and only creates on approval', async () => {
    const user = userEvent.setup();
    const draft = vi.fn(async () => PROPOSAL);
    const onAccept = vi.fn();
    render(<AiCharacterDraftPanel systemId="dnd-5e-2024" draft={draft} onAccept={onAccept} />);

    // Nothing to draft until there is a concept.
    expect(screen.getByRole('button', { name: /^draft$/i })).toBeDisabled();

    await user.type(screen.getByRole('textbox', { name: /character concept/i }), 'a healer');
    await user.click(screen.getByRole('button', { name: /^draft$/i }));

    expect(draft).toHaveBeenCalledWith({ systemId: 'dnd-5e-2024', prompt: 'a healer' });

    // The user sees WHAT was proposed before anything is created.
    expect(await screen.findByText('Thera Stonehand')).toBeInTheDocument();
    expect(screen.getByText(/cautious healer/i)).toBeInTheDocument();
    expect(screen.getByText('Cleric')).toBeInTheDocument();
    expect(screen.getByText('Dwarf')).toBeInTheDocument();
    // An id the plan could not route is reported, not silently claimed.
    expect(screen.getByText(/nowhere to apply Bless/i)).toBeInTheDocument();
    expect(onAccept).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /create character/i }));
    // Accepting hands the VALIDATED system data to the host's normal create
    // path — the panel never writes character state itself.
    expect(onAccept).toHaveBeenCalledWith('dnd-5e-2024', SYSTEM, 'Thera Stonehand');
  });

  it('discards a proposal without creating anything', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(
      <AiCharacterDraftPanel
        systemId="dnd-5e-2024"
        draft={async () => PROPOSAL}
        onAccept={onAccept}
      />
    );

    await user.type(screen.getByRole('textbox', { name: /character concept/i }), 'a healer');
    await user.click(screen.getByRole('button', { name: /^draft$/i }));
    await user.click(await screen.findByRole('button', { name: /discard/i }));

    expect(screen.queryByText('Thera Stonehand')).not.toBeInTheDocument();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it('shows the failure and creates nothing when the gateway is unconfigured', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(
      <AiCharacterDraftPanel
        systemId="dnd-5e-2024"
        draft={async () => ({ ok: false, error: 'AI features are turned off.' })}
        onAccept={onAccept}
      />
    );

    await user.type(screen.getByRole('textbox', { name: /character concept/i }), 'a healer');
    await user.click(screen.getByRole('button', { name: /^draft$/i }));

    expect(await screen.findByText(/AI features are turned off\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create character/i })).not.toBeInTheDocument();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it('never lets a thrown drafting error escape into the creation dialog', async () => {
    const user = userEvent.setup();
    render(
      <AiCharacterDraftPanel
        systemId="dnd-5e-2024"
        draft={async () => {
          throw new Error('boom');
        }}
        onAccept={vi.fn()}
      />
    );

    await user.type(screen.getByRole('textbox', { name: /character concept/i }), 'a healer');
    await user.click(screen.getByRole('button', { name: /^draft$/i }));

    expect(await screen.findByText(/could not be completed/i)).toBeInTheDocument();
    // Recoverable: the surface is usable again, not stuck in a busy state.
    expect(screen.getByRole('button', { name: /^draft$/i })).toBeEnabled();
  });

  it('cannot draft before a game system is picked', () => {
    render(<AiCharacterDraftPanel systemId={null} draft={vi.fn()} onAccept={vi.fn()} />);
    expect(screen.getByRole('button', { name: /^draft$/i })).toBeDisabled();
    expect(screen.getByText(/pick a game system above first/i)).toBeInTheDocument();
  });
});
