import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeatBrowser } from '../../components/FeatBrowser';

const feats = [
  {
    id: 'athlete',
    name: 'Athlete',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    description: 'You have undergone extensive physical training.',
    benefits: ['Increase Strength or Dexterity by 1'],
    prerequisites: [{ type: 'ability', description: 'Strength 13+' }],
  },
  {
    id: 'tough',
    name: 'Tough',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    description: 'Your hit point maximum increases.',
    benefits: ['Hit point maximum increases by 2 per level'],
  },
];

describe('FeatBrowser', () => {
  it('renders feats and supports search filtering', async () => {
    const user = userEvent.setup();
    render(<FeatBrowser feats={feats} />);

    expect(screen.getByText('Showing 2 of 2 feats')).toBeInTheDocument();

    const search = screen.getByPlaceholderText('Search feats by name or description...');
    await user.type(search, 'tough');

    expect(screen.getByText('Showing 1 of 2 feats')).toBeInTheDocument();
    expect(screen.getByText('Tough')).toBeInTheDocument();
    expect(screen.queryByText('Athlete')).not.toBeInTheDocument();
  });

  it('filters to feats with prerequisites when checkbox is enabled', async () => {
    const user = userEvent.setup();
    render(<FeatBrowser feats={feats} />);

    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByText('Showing 1 of 2 feats')).toBeInTheDocument();
    expect(screen.getByText('Athlete')).toBeInTheDocument();
    expect(screen.queryByText('Tough')).not.toBeInTheDocument();
  });

  it('expands feat details and triggers selection callback', async () => {
    const user = userEvent.setup();
    const onSelectFeat = vi.fn();

    render(<FeatBrowser feats={feats} onSelectFeat={onSelectFeat} />);

    await user.click(screen.getByRole('button', { name: /athlete/i }));

    expect(screen.getByText('Prerequisites:')).toBeInTheDocument();
    expect(screen.getByText('Strength 13+')).toBeInTheDocument();
    expect(screen.getByText('Benefits:')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /select feat/i }));
    expect(onSelectFeat).toHaveBeenCalledWith(expect.objectContaining({ id: 'athlete' }));
  });

  it('shows empty state when no feats match', async () => {
    const user = userEvent.setup();
    render(<FeatBrowser feats={feats} />);

    await user.type(
      screen.getByPlaceholderText('Search feats by name or description...'),
      'nonexistent'
    );

    expect(screen.getByText('No feats found matching your criteria.')).toBeInTheDocument();
  });
});
