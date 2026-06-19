import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReactionPanel } from '../../components/scene/ReactionPanel';

const DISPOSITIONS = /Hostile|Unfriendly|Indifferent|Friendly|Helpful/;

describe('ReactionPanel', () => {
  it('rolls a reaction into the history with a disposition and context', async () => {
    const user = userEvent.setup();
    render(<ReactionPanel seed="scene-seed" />);

    await user.type(screen.getByLabelText('Reaction context'), 'Gate guard');
    await user.click(screen.getByRole('button', { name: /^React$/i }));

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Gate guard');
    expect(item).toHaveTextContent('2d6 [');
    expect(item.textContent).toMatch(DISPOSITIONS);
  });

  it('caps the history at ten entries', async () => {
    const user = userEvent.setup();
    render(<ReactionPanel seed="scene-seed" />);

    const react = screen.getByRole('button', { name: /^React$/i });
    for (let i = 0; i < 12; i += 1) {
      await user.click(react);
    }
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
  });
});
