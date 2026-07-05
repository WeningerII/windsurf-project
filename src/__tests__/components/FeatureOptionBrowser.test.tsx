import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeatureOptionBrowser } from '../../systems/dnd5e/shared/components/FeatureOptionBrowser';
import type { Dnd5eFeatureOptionDefinition } from '../../types/character-options/feature-options';

const featureOptions: Dnd5eFeatureOptionDefinition[] = [
  {
    id: 'agonizing-blast',
    group: 'invocations',
    name: 'Agonizing Blast',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    description: 'Add your Charisma modifier to eldritch blast damage.',
    classIds: ['warlock'],
    minLevel: 2,
    prerequisites: ['Eldritch blast cantrip'],
  },
  {
    id: 'archery',
    group: 'fighting-styles',
    name: 'Archery',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    description: 'Gain a +2 bonus to ranged weapon attack rolls.',
    classIds: ['fighter', 'paladin'],
  },
  {
    id: 'preserve-life',
    group: 'channel-divinity',
    name: 'Preserve Life',
    system: 'dnd-5e-2014',
    source: 'SRD 5.1',
    description: 'Restore hit points equal to five times your cleric level.',
    classIds: ['cleric'],
    subclassIds: ['life-domain'],
    minLevel: 2,
    prerequisites: ['life domain'],
  },
];

describe('FeatureOptionBrowser', () => {
  it('renders grouped feature-option cards with metadata chips', () => {
    render(<FeatureOptionBrowser options={featureOptions} onSelectOption={vi.fn()} />);

    expect(screen.getByText('Feature Options')).toBeInTheDocument();
    expect(screen.getByText('Eldritch Invocations')).toBeInTheDocument();
    expect(screen.getByText('Fighting Styles')).toBeInTheDocument();
    expect(screen.getByText('Channel Divinity')).toBeInTheDocument();
    expect(screen.getAllByText('Level 2+')).toHaveLength(2);
    expect(screen.getByText('life-domain')).toBeInTheDocument();
    expect(screen.getByText(/Prerequisites: Eldritch blast cantrip/i)).toBeInTheDocument();
  });

  it('filters visible options from the search field', async () => {
    const user = userEvent.setup();
    render(<FeatureOptionBrowser options={featureOptions} onSelectOption={vi.fn()} />);

    await user.type(screen.getByLabelText('Search feature options'), 'cleric');

    expect(screen.getByText('Preserve Life')).toBeInTheDocument();
    expect(screen.queryByText('Agonizing Blast')).not.toBeInTheDocument();
    expect(screen.queryByText('Archery')).not.toBeInTheDocument();
  });

  it('calls back for unselected options and marks selected ones as disabled', async () => {
    const user = userEvent.setup();
    const onSelectOption = vi.fn();

    render(
      <FeatureOptionBrowser
        options={featureOptions}
        selectedOptions={[{ id: 'agonizing-blast', group: 'invocations' }]}
        onSelectOption={onSelectOption}
      />
    );

    const selectedButton = screen.getByRole('button', { name: 'Selected' });
    expect(selectedButton).toBeDisabled();

    await user.click(screen.getAllByRole('button', { name: 'Add' })[0]);

    expect(onSelectOption).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'archery',
      })
    );
  });

  it('renders an empty state and hides action buttons when callbacks are omitted', async () => {
    const user = userEvent.setup();
    render(<FeatureOptionBrowser options={featureOptions} />);

    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Search feature options'), 'no matches here');

    expect(screen.getByText('No feature options match the current filters.')).toBeInTheDocument();
  });
});
