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
  it('plans 27-point buy adjustments and only commits on Apply', async () => {
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
    // All-10s is a legal point-buy set, so no baseline-reset notice appears.
    expect(screen.queryByText(/fresh 8s baseline/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increase STR' }));

    // Planner only: nothing is committed until Apply.
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Remaining: 14')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply Point Buy' }));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenLastCalledWith({
      str: 11,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    });
  });

  it('does not overwrite non-point-buy scores when planning from the 8s baseline', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    // A leveled character: 16 is not purchasable, so this is not a valid
    // point-buy set and the planner must fall back to an explicit baseline.
    const attributes = { str: 16, dex: 14, con: 14, int: 12, wis: 10, cha: 8 };

    render(
      <AbilityScoreGrid
        attributes={attributes}
        names={ABILITY_NAMES}
        planner="dnd5e"
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Point Buy' }));

    // The fallback draft is labelled, not silently presented as current.
    expect(screen.getByText(/fresh 8s baseline — current scores unchanged/i)).toBeInTheDocument();
    expect(screen.getByText('Remaining: 27')).toBeInTheDocument();

    // The first +/- click must not commit anything.
    await user.click(screen.getByRole('button', { name: 'Increase STR' }));
    expect(onUpdate).not.toHaveBeenCalled();

    // Reset To 8 is draft-only as well.
    await user.click(screen.getByRole('button', { name: 'Reset To 8' }));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Remaining: 27')).toBeInTheDocument();

    // Only an explicit Apply writes the draft over the stored scores.
    await user.click(screen.getByRole('button', { name: 'Increase DEX' }));
    await user.click(screen.getByRole('button', { name: 'Apply Point Buy' }));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenLastCalledWith({
      str: 8,
      dex: 9,
      con: 8,
      int: 8,
      wis: 8,
      cha: 8,
    });
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
