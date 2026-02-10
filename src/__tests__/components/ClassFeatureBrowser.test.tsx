import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClassFeatureBrowser } from '../../components/ClassFeatureBrowser';

const features = [
  {
    id: 'action-surge',
    name: 'Action Surge',
    class: 'fighter',
    level: 2,
    description: 'Take an additional action on your turn.',
    benefits: ['One extra action'],
  },
  {
    id: 'arcane-recovery',
    name: 'Arcane Recovery',
    class: 'wizard',
    level: 1,
    description: 'Recover spell slots on a short rest.',
    benefits: ['Recover spell slots once per day'],
  },
];

describe('ClassFeatureBrowser', () => {
  it('renders grouped features and supports search + class filters', async () => {
    const user = userEvent.setup();
    render(<ClassFeatureBrowser features={features} />);

    expect(screen.getByText('Showing 2 features')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search class features...'), 'arcane');
    expect(screen.getByText('Showing 1 features')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /fighter/i }));
    expect(screen.getByText('No class features found matching your criteria.')).toBeInTheDocument();
  });

  it('expands details and triggers select callback', async () => {
    const user = userEvent.setup();
    const onSelectFeature = vi.fn();

    render(
      <ClassFeatureBrowser features={features} onSelectFeature={onSelectFeature} />
    );

    await user.click(screen.getByRole('button', { name: /action surge/i }));
    expect(screen.getByText('Benefits:')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /select feature/i }));
    expect(onSelectFeature).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'action-surge' })
    );
  });
});
