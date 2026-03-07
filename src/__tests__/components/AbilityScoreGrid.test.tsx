import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AbilityScoreGrid } from '../../components/sheet/AbilityScoreGrid';

const ABILITY_NAMES = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

function makeAttributes(value: number): Record<string, number> {
  return {
    str: value,
    dex: value,
    con: value,
    int: value,
    wis: value,
    cha: value,
  };
}

describe('AbilityScoreGrid', () => {
  it('supports 27-point buy adjustments for 5e planners', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(
      <AbilityScoreGrid
        attributes={makeAttributes(10)}
        names={ABILITY_NAMES}
        planner="dnd5e"
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Point Buy' }));
    expect(screen.getByText('Remaining: 15')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increase STR' }));

    expect(onUpdate).toHaveBeenLastCalledWith({
      str: 11,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    });
    expect(screen.getByText('Remaining: 14')).toBeInTheDocument();
  });

  it('applies a standard array assignment once all scores are chosen', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(
      <AbilityScoreGrid
        attributes={makeAttributes(10)}
        names={ABILITY_NAMES}
        planner="dnd5e"
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Standard Array' }));

    await user.selectOptions(screen.getByTitle('STR standard array'), '15');
    await user.selectOptions(screen.getByTitle('DEX standard array'), '14');
    await user.selectOptions(screen.getByTitle('CON standard array'), '13');
    await user.selectOptions(screen.getByTitle('INT standard array'), '12');
    await user.selectOptions(screen.getByTitle('WIS standard array'), '10');
    await user.selectOptions(screen.getByTitle('CHA standard array'), '8');

    await user.click(screen.getByRole('button', { name: 'Apply Standard Array' }));

    expect(onUpdate).toHaveBeenLastCalledWith({
      str: 15,
      dex: 14,
      con: 13,
      int: 12,
      wis: 10,
      cha: 8,
    });
    expect(screen.getByText('Remaining: Ready')).toBeInTheDocument();
  });
});
