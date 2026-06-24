// purpose: Render/interaction coverage for shared sheet presentational components
// under src/components/sheet. These take plain prop bundles; we render them
// directly and assert real observables (values, handler args, planner branches).
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AbilityScoreGrid } from '../components/sheet/AbilityScoreGrid';

afterEach(() => {
  vi.clearAllMocks();
});

const NAMES: Record<string, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

const POINT_BUY_BASE = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };

describe('AbilityScoreGrid', () => {
  it('renders names, scores, and modifiers and edits in manual mode', () => {
    const onUpdate = vi.fn();
    render(
      <AbilityScoreGrid
        attributes={{ str: 16, dex: 12 }}
        names={{ str: 'STR', dex: 'DEX' }}
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByTitle('STR Score')).toHaveValue(16);
    // +3 modifier for 16, +1 for 12
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('STR Score'), { target: { value: '18' } });
    expect(onUpdate).toHaveBeenCalledWith({ str: 18, dex: 12 });
  });

  it('hides planner controls unless planner=dnd5e with an onUpdate handler', () => {
    const { rerender } = render(
      <AbilityScoreGrid attributes={{ str: 10 }} names={{ str: 'STR' }} />
    );
    expect(screen.queryByRole('button', { name: 'Point Buy' })).not.toBeInTheDocument();

    // planner set but no onUpdate => still no planner toolbar.
    rerender(<AbilityScoreGrid attributes={{ str: 10 }} names={{ str: 'STR' }} planner="dnd5e" />);
    expect(screen.queryByRole('button', { name: 'Point Buy' })).not.toBeInTheDocument();
  });

  it('disables manual inputs when no onUpdate handler is supplied', () => {
    render(<AbilityScoreGrid attributes={{ str: 10 }} names={{ str: 'STR' }} />);
    expect(screen.getByTitle('STR Score')).toBeDisabled();
  });

  describe('point-buy planner', () => {
    const renderPointBuy = (attributes = POINT_BUY_BASE) => {
      const onUpdate = vi.fn();
      render(
        <AbilityScoreGrid
          attributes={attributes}
          names={NAMES}
          onUpdate={onUpdate}
          planner="dnd5e"
        />
      );
      return onUpdate;
    };

    it('opens point-buy mode and shows the remaining-points budget', async () => {
      renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      expect(screen.getByText('27-point buy. Scores stay between 8 and 15.')).toBeInTheDocument();
      // All 8s => full 27 budget remaining.
      expect(screen.getByText('Remaining: 27')).toBeInTheDocument();
    });

    it('warns when current scores are not a legal point-buy set', async () => {
      // 18 is above the point-buy max => fresh-baseline warning appears.
      renderPointBuy({ ...POINT_BUY_BASE, str: 18 });
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      expect(screen.getByText(/Planning from a fresh 8s baseline/)).toBeInTheDocument();
    });

    it('increments and decrements a score via the +/- buttons and clamps the budget', async () => {
      renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));

      const increaseStr = screen.getByRole('button', { name: 'Increase STR' });
      const decreaseStr = screen.getByRole('button', { name: 'Decrease STR' });
      // At the floor of 8 the decrease button is disabled.
      expect(decreaseStr).toBeDisabled();

      await userEvent.click(increaseStr); // 8 -> 9, costs 1
      expect(screen.getByText('Remaining: 26')).toBeInTheDocument();
      // After raising, decrease becomes available.
      expect(screen.getByRole('button', { name: 'Decrease STR' })).toBeEnabled();

      await userEvent.click(screen.getByRole('button', { name: 'Decrease STR' })); // 9 -> 8
      expect(screen.getByText('Remaining: 27')).toBeInTheDocument();
    });

    it('edits the score through the number input in point-buy mode', async () => {
      renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      // Editing the input routes through handlePointBuyUpdate (draft only).
      fireEvent.change(screen.getByTitle('DEX Score'), { target: { value: '14' } });
      expect(screen.getByTitle('DEX Score')).toHaveValue(14);
      // 14 costs 7 => remaining 20.
      expect(screen.getByText('Remaining: 20')).toBeInTheDocument();
    });

    it('applies the point-buy draft through onUpdate', async () => {
      const onUpdate = renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      await userEvent.click(screen.getByRole('button', { name: 'Increase STR' })); // 9
      await userEvent.click(screen.getByRole('button', { name: 'Apply Point Buy' }));
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ str: 9, dex: 8, con: 8, int: 8, wis: 8, cha: 8 })
      );
    });

    it('resets the draft to all 8s', async () => {
      renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      await userEvent.click(screen.getByRole('button', { name: 'Increase STR' }));
      expect(screen.getByText('Remaining: 26')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Reset To 8' }));
      expect(screen.getByText('Remaining: 27')).toBeInTheDocument();
    });

    it('rejects an increment that would exceed the 27-point budget', async () => {
      renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      // Spend the whole budget: three 15s cost 9 each (27 total).
      fireEvent.change(screen.getByTitle('STR Score'), { target: { value: '15' } });
      fireEvent.change(screen.getByTitle('DEX Score'), { target: { value: '15' } });
      fireEvent.change(screen.getByTitle('CON Score'), { target: { value: '15' } });
      expect(screen.getByText('Remaining: 0')).toBeInTheDocument();
      // Raising INT 8->9 would cost 1 more (over budget) => rejected, budget holds.
      await userEvent.click(screen.getByRole('button', { name: 'Increase INT' }));
      expect(screen.getByText('Remaining: 0')).toBeInTheDocument();
      expect(screen.getByTitle('INT Score')).toHaveValue(8);
    });

    it('returns to manual editing from the planner toolbar', async () => {
      const onUpdate = renderPointBuy();
      await userEvent.click(screen.getByRole('button', { name: 'Point Buy' }));
      await userEvent.click(screen.getByRole('button', { name: 'Manual' }));
      // Back in manual mode, editing writes straight through onUpdate.
      fireEvent.change(screen.getByTitle('STR Score'), { target: { value: '11' } });
      expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ str: 11 }));
    });
  });

  describe('standard-array planner', () => {
    const renderStdArray = (attributes = POINT_BUY_BASE) => {
      const onUpdate = vi.fn();
      render(
        <AbilityScoreGrid
          attributes={attributes}
          names={NAMES}
          onUpdate={onUpdate}
          planner="dnd5e"
        />
      );
      return onUpdate;
    };

    it('opens standard-array mode with all values remaining and apply disabled', async () => {
      renderStdArray();
      await userEvent.click(screen.getByRole('button', { name: 'Standard Array' }));
      expect(screen.getByText('Assign 15, 14, 13, 12, 10, and 8 once each.')).toBeInTheDocument();
      expect(screen.getByText('Remaining: 15, 14, 13, 12, 10, 8')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Apply Standard Array' })).toBeDisabled();
    });

    it('assigns a value, narrows the remaining pool, and clears the draft', async () => {
      renderStdArray();
      await userEvent.click(screen.getByRole('button', { name: 'Standard Array' }));

      // Assigning 15 to STR removes it from the remaining pool.
      fireEvent.change(screen.getByTitle('STR standard array'), { target: { value: '15' } });
      expect(screen.getByText('Remaining: 14, 13, 12, 10, 8')).toBeInTheDocument();
      // STR select now offers its assigned 15 plus the remaining values (sorted desc).
      const strSelect = screen.getByTitle('STR standard array');
      expect(within(strSelect).getByRole('option', { name: '15' })).toBeInTheDocument();

      // Clear resets all selects back to unassigned.
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(screen.getByText('Remaining: 15, 14, 13, 12, 10, 8')).toBeInTheDocument();
    });

    it('applies a complete standard array through onUpdate', async () => {
      const onUpdate = renderStdArray();
      await userEvent.click(screen.getByRole('button', { name: 'Standard Array' }));

      const assignments: Array<[string, string]> = [
        ['STR', '15'],
        ['DEX', '14'],
        ['CON', '13'],
        ['INT', '12'],
        ['WIS', '10'],
        ['CHA', '8'],
      ];
      for (const [ability, value] of assignments) {
        fireEvent.change(screen.getByTitle(`${ability} standard array`), { target: { value } });
      }

      expect(screen.getByText('Remaining: Ready')).toBeInTheDocument();
      const apply = screen.getByRole('button', { name: 'Apply Standard Array' });
      expect(apply).toBeEnabled();
      await userEvent.click(apply);
      expect(onUpdate).toHaveBeenCalledWith({
        str: 15,
        dex: 14,
        con: 13,
        int: 12,
        wis: 10,
        cha: 8,
      });
    });

    it('seeds the draft from scores that already match the standard array', async () => {
      // These scores ARE a standard array => the draft pre-fills, nothing remains.
      renderStdArray({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
      await userEvent.click(screen.getByRole('button', { name: 'Standard Array' }));
      expect(screen.getByText('Remaining: Ready')).toBeInTheDocument();
      expect(screen.getByTitle('STR standard array')).toHaveValue('15');
    });
  });
});
