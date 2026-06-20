import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DicePanel } from '../../components/scene/DicePanel';

describe('DicePanel', () => {
  it('rolls a typed expression into the history with a total', async () => {
    const user = userEvent.setup();
    render(<DicePanel seed="scene-seed" />);

    await user.type(screen.getByLabelText('Dice expression'), '2d6+3');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('2d6+3');
    // total = sum of the two d6 plus 3; just assert the "= N" shape is present.
    expect(item.textContent).toMatch(/=\s*\d+/);
  });

  it('rolls a quick-roll preset', async () => {
    const user = userEvent.setup();
    render(<DicePanel seed="scene-seed" />);

    await user.click(screen.getByRole('button', { name: '4d6kh3' }));
    expect(screen.getByRole('listitem')).toHaveTextContent('4d6kh3');
  });

  it('surfaces a parse error instead of rolling', async () => {
    const user = userEvent.setup();
    render(<DicePanel seed="scene-seed" />);

    await user.type(screen.getByLabelText('Dice expression'), 'garbage');
    await user.click(screen.getByRole('button', { name: /^Roll$/i }));

    expect(screen.getByText(/could not parse/i)).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('caps the history at ten entries', async () => {
    const user = userEvent.setup();
    render(<DicePanel seed="scene-seed" />);

    const quick = screen.getByRole('button', { name: 'd20' });
    for (let i = 0; i < 12; i += 1) {
      await user.click(quick);
    }
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
  });
});
