import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MamArchetypeBrowser } from '../../systems/mam3e/components/MamArchetypeBrowser';
import { battlesuitArchetype } from '../../data/mutants-and-masterminds/3e/archetypes/battlesuit';
import { constructArchetype } from '../../data/mutants-and-masterminds/3e/archetypes/construct';

describe('MamArchetypeBrowser', () => {
  it('renders archetypes and supports search filtering', async () => {
    const user = userEvent.setup();

    render(<MamArchetypeBrowser archetypes={[battlesuitArchetype, constructArchetype]} />);

    expect(screen.getByText('Battlesuit')).toBeInTheDocument();
    expect(screen.getByText('Construct')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search archetypes/i), 'battle');

    expect(screen.getByText('Battlesuit')).toBeInTheDocument();
    expect(screen.queryByText('Construct')).not.toBeInTheDocument();
  });

  it('shows pinned state and calls the toggle callback', async () => {
    const user = userEvent.setup();
    const onToggleArchetype = vi.fn();

    render(
      <MamArchetypeBrowser
        archetypes={[battlesuitArchetype]}
        selectedArchetypeIds={[battlesuitArchetype.id]}
        onToggleArchetype={onToggleArchetype}
      />
    );

    expect(screen.getByText('Pinned')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /unpin battlesuit/i }));

    expect(onToggleArchetype).toHaveBeenCalledWith(battlesuitArchetype);
  });
});
