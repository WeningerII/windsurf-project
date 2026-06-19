import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TokenPanel } from '../../components/scene/TokenPanel';
import type { SceneTokenKind } from '../../types/core/scene';

function renderPanel(overrides: Partial<React.ComponentProps<typeof TokenPanel>> = {}) {
  const props: React.ComponentProps<typeof TokenPanel> = {
    eligibleDocuments: [],
    tokenDocumentId: '',
    onSelectLinkedDocument: vi.fn(),
    tokenName: 'Guard',
    onTokenNameChange: vi.fn(),
    tokenKind: 'npc' as SceneTokenKind,
    onTokenKindChange: vi.fn(),
    tokenAllegiance: 'hostile',
    onTokenAllegianceChange: vi.fn(),
    isPlacing: false,
    onTogglePlace: vi.fn(),
    canDeleteToken: false,
    onDeleteSelectedToken: vi.fn(),
    ...overrides,
  };
  return { props, ...render(<TokenPanel {...props} />) };
}

describe('TokenPanel', () => {
  it('shows the NPC side selector only for the npc kind', () => {
    const { rerender, props } = renderPanel({ tokenKind: 'npc' });
    expect(screen.getByLabelText('NPC side')).toBeInTheDocument();

    rerender(<TokenPanel {...props} tokenKind="character" />);
    expect(screen.queryByLabelText('NPC side')).not.toBeInTheDocument();
  });

  it('reports the chosen NPC side', async () => {
    const user = userEvent.setup();
    const onTokenAllegianceChange = vi.fn();
    renderPanel({ tokenKind: 'npc', onTokenAllegianceChange });
    await user.selectOptions(screen.getByLabelText('NPC side'), 'party');
    expect(onTokenAllegianceChange).toHaveBeenCalledWith('party');
  });

  it('shows the selected-token side control only when a side is provided', async () => {
    const user = userEvent.setup();
    const onSetSelectedTokenSide = vi.fn();
    const { rerender, props } = renderPanel({
      selectedTokenSide: undefined,
      onSetSelectedTokenSide,
    });
    expect(screen.queryByLabelText('Selected token side')).not.toBeInTheDocument();

    rerender(<TokenPanel {...props} selectedTokenSide="hostile" />);
    const control = screen.getByLabelText('Selected token side');
    expect((control as HTMLSelectElement).value).toBe('hostile');
    await user.selectOptions(control, 'party');
    expect(onSetSelectedTokenSide).toHaveBeenCalledWith('party');
  });

  it('offers monster/object only for manual (unlinked) tokens', () => {
    const { rerender, props } = renderPanel({ tokenDocumentId: '' });
    expect(screen.getByRole('option', { name: 'Monster' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Object' })).toBeInTheDocument();

    // A linked sheet backs a character or NPC only.
    rerender(<TokenPanel {...props} tokenDocumentId="doc-1" />);
    expect(screen.queryByRole('option', { name: 'Monster' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Object' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'NPC' })).toBeInTheDocument();
  });
});
