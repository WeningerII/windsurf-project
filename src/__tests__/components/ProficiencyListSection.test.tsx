import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProficiencyListSection } from '../../components/ProficiencyListSection';

describe('ProficiencyListSection', () => {
  it('renders nothing when there are no proficiencies', () => {
    const { container } = render(
      <ProficiencyListSection armor={[]} weapons={[]} tools={[]} languages={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the populated proficiency groups and total count', () => {
    render(
      <ProficiencyListSection
        armor={['light']}
        weapons={[]}
        tools={['thieves-tools']}
        languages={['Common']}
      />
    );

    expect(screen.getByText('Proficiencies')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
    expect(screen.getByText('Armor')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.queryByText('Weapons')).not.toBeInTheDocument();
    expect(screen.getByText('light')).toBeInTheDocument();
    expect(screen.getByText('thieves-tools')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
  });
});
