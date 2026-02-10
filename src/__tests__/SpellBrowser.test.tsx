import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpellBrowser } from '../components/SpellBrowser';

const mockSpells = [
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    level: 0,
    school: 'evocation',
    castingTime: '1 action',
    range: '120 feet',
    duration: 'Instantaneous',
    description: 'You hurl a mote of fire at a creature.',
    classes: ['wizard', 'sorcerer'],
  },
  {
    id: 'cure-wounds',
    name: 'Cure Wounds',
    level: 1,
    school: 'evocation',
    castingTime: '1 action',
    range: 'Touch',
    duration: 'Instantaneous',
    description: 'A creature regains hit points.',
    classes: ['cleric', 'bard'],
  },
  {
    id: 'shield',
    name: 'Shield',
    level: 1,
    school: 'abjuration',
    castingTime: '1 reaction',
    range: 'Self',
    duration: '1 round',
    description: 'An invisible barrier of magical force appears.',
    classes: ['wizard'],
  },
  {
    id: 'invisibility',
    name: 'Invisibility',
    level: 2,
    school: 'illusion',
    castingTime: '1 action',
    range: 'Touch',
    duration: 'Up to 1 hour',
    description: 'A creature you touch becomes invisible.',
    classes: ['wizard'],
  },
];

describe('SpellBrowser', () => {
  it('renders spell results with accurate counts', () => {
    render(<SpellBrowser spells={mockSpells} />);

    expect(screen.getByText('Showing 4 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Fire Bolt')).toBeInTheDocument();
    expect(screen.getByText('Cure Wounds')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.getByText('Invisibility')).toBeInTheDocument();
  });

  it('filters spells by search term', async () => {
    const user = userEvent.setup();
    render(<SpellBrowser spells={mockSpells} />);

    await user.type(screen.getByLabelText('Search spells'), 'becomes invisible');

    expect(screen.getByText('Showing 1 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Invisibility')).toBeInTheDocument();
    expect(screen.queryByText('Fire Bolt')).not.toBeInTheDocument();
  });

  it('filters spells by level', async () => {
    const user = userEvent.setup();
    render(<SpellBrowser spells={mockSpells} />);

    await user.selectOptions(
      screen.getByLabelText('Filter by spell level'),
      '1'
    );

    expect(screen.getByText('Showing 2 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Cure Wounds')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.queryByText('Invisibility')).not.toBeInTheDocument();
  });

  it('filters spells by school', async () => {
    const user = userEvent.setup();
    render(<SpellBrowser spells={mockSpells} />);

    await user.selectOptions(
      screen.getByLabelText('Filter by spell school'),
      'illusion'
    );

    expect(screen.getByText('Showing 1 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Invisibility')).toBeInTheDocument();
    expect(screen.queryByText('Shield')).not.toBeInTheDocument();
  });

  it('filters spells by class', async () => {
    const user = userEvent.setup();
    render(<SpellBrowser spells={mockSpells} />);

    await user.selectOptions(screen.getByLabelText('Filter by class'), 'cleric');

    expect(screen.getByText('Showing 1 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Cure Wounds')).toBeInTheDocument();
    expect(screen.queryByText('Fire Bolt')).not.toBeInTheDocument();
  });

  it('clears active filters', async () => {
    const user = userEvent.setup();
    render(<SpellBrowser spells={mockSpells} />);

    await user.type(screen.getByLabelText('Search spells'), 'shield');
    expect(screen.getByText('Showing 1 of 4 spells')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(screen.getByText('Showing 4 of 4 spells')).toBeInTheDocument();
    expect(screen.getByText('Fire Bolt')).toBeInTheDocument();
  });

  it('calls onSelectSpell when a spell card is clicked', async () => {
    const user = userEvent.setup();
    const onSelectSpell = vi.fn();
    render(<SpellBrowser spells={mockSpells} onSelectSpell={onSelectSpell} />);

    await user.click(screen.getByText('Fire Bolt'));

    expect(onSelectSpell).toHaveBeenCalledTimes(1);
    expect(onSelectSpell).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'fire-bolt', name: 'Fire Bolt' })
    );
  });
});
