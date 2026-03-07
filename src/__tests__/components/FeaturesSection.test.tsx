import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturesSection } from '../../components/FeaturesSection';
import type { Feature } from '../../types/core/character';

const features: Feature[] = [
  {
    id: 'action-surge',
    name: 'Action Surge',
    source: 'Fighter 2',
    description: 'Take one additional action.',
    uses: { current: 1, max: 2, recoveryType: 'short-rest' },
  },
  {
    id: 'lay-on-hands',
    name: 'Lay on Hands',
    source: 'Paladin 1',
    description: 'Restore a pool of hit points.',
    uses: { current: 0, max: 1, recoveryType: 'long-rest' },
  },
  {
    id: 'battle-readiness',
    name: 'Battle Readiness',
    source: 'Background',
    description: 'A manually recovered feature.',
    uses: { current: 0, max: 1, recoveryType: 'manual' },
  },
];

describe('FeaturesSection', () => {
  it('renders nothing when there are no features', () => {
    const { container } = render(<FeaturesSection features={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders feature metadata and uses the correct recovery abbreviations', () => {
    render(<FeaturesSection features={features} />);

    expect(screen.getByText('Class Features')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
    expect(screen.getByText('Fighter 2')).toBeInTheDocument();
    expect(screen.getByText(/1\/2/)).toHaveTextContent('SR');
    expect(screen.getAllByText(/0\/1/)[0]).toHaveTextContent('LR');
    expect(screen.getAllByText(/0\/1/)[1]).toHaveTextContent('manual');
  });

  it('fires use and recover callbacks from feature pips', async () => {
    const user = userEvent.setup();
    const onUseFeature = vi.fn();
    const onRecoverFeature = vi.fn();

    render(
      <FeaturesSection
        features={[features[0], features[1]]}
        onUseFeature={onUseFeature}
        onRecoverFeature={onRecoverFeature}
      />
    );

    await user.click(screen.getAllByTitle('Use')[0]);
    await user.click(screen.getAllByTitle('Recover')[0]);

    expect(onUseFeature).toHaveBeenCalledWith('action-surge');
    expect(onRecoverFeature).toHaveBeenCalledWith('action-surge');
  });
});
