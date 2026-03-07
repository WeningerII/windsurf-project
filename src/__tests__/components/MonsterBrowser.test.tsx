import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Monster } from '../../types/creatures/monsters';
import { MonsterBrowser } from '../../components/MonsterBrowser';

const monsters: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 15,
    hitPoints: { count: 2, die: 'd6', notation: '2d6' },
    speed: 30,
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: ['darkvision 60 ft.'],
    languages: ['Common', 'Goblin'],
    specialAbilities: [
      { name: 'Nimble Escape', description: 'Can Disengage or Hide as a bonus action.' },
    ],
    actions: [{ name: 'Scimitar', description: 'Melee weapon attack.' }],
  },
  {
    id: 'young-red-dragon',
    name: 'Young Red Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    size: 'large',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 10,
    experiencePoints: 5900,
    armorClass: 18,
    hitPoints: { count: 19, die: 'd10', notation: '19d10+76' },
    speed: { walk: 40, fly: 80 },
    abilities: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [{ name: 'Fire Breath', description: 'Exhales fire in a cone.' }],
    actions: [{ name: 'Bite', description: 'Melee weapon attack.' }],
  },
];

describe('MonsterBrowser', () => {
  it('renders monster list and summary count', () => {
    render(<MonsterBrowser monsters={monsters} />);

    expect(screen.getByText('Showing 2 of 2 monsters')).toBeInTheDocument();
    expect(screen.getByText('Goblin')).toBeInTheDocument();
    expect(screen.getByText('Young Red Dragon')).toBeInTheDocument();
  });

  it('filters monsters by search, type, CR, and size', async () => {
    const user = userEvent.setup();
    render(<MonsterBrowser monsters={monsters} />);

    await user.type(screen.getByLabelText('Search monsters'), 'fire breath');
    expect(screen.getByText('Showing 1 of 2 monsters')).toBeInTheDocument();
    expect(screen.getByText('Young Red Dragon')).toBeInTheDocument();

    const [typeSelect, crSelect, sizeSelect] = screen.getAllByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'humanoid' } });
    expect(screen.getByText('No monsters found matching your criteria.')).toBeInTheDocument();

    fireEvent.change(typeSelect, { target: { value: 'dragon' } });
    fireEvent.change(crSelect, { target: { value: '10' } });
    fireEvent.change(sizeSelect, { target: { value: 'large' } });
    expect(screen.getByText('Young Red Dragon')).toBeInTheDocument();
  });

  it('clears filters back to full results', async () => {
    const user = userEvent.setup();
    render(<MonsterBrowser monsters={monsters} />);

    await user.type(screen.getByLabelText('Search monsters'), 'goblin');
    expect(screen.getByText('Showing 1 of 2 monsters')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByText('Showing 2 of 2 monsters')).toBeInTheDocument();
  });

  it('calls selection callback when clicking a monster card', async () => {
    const user = userEvent.setup();
    const onSelectMonster = vi.fn();

    render(<MonsterBrowser monsters={monsters} onSelectMonster={onSelectMonster} />);

    await user.click(screen.getByText('Goblin'));

    expect(onSelectMonster).toHaveBeenCalledTimes(1);
    expect(onSelectMonster).toHaveBeenCalledWith(expect.objectContaining({ id: 'goblin' }));
  });
});
