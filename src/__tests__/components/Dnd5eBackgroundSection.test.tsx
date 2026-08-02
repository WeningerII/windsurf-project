import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dnd5eBackgroundSection } from '../../systems/dnd5e/shared/components/Dnd5eBackgroundSection';
import { acolyte } from '../../data/dnd/5e-2024/backgrounds/acolyte';
import { soldier } from '../../data/dnd/5e-2024/backgrounds/soldier';
import type { Background } from '../../types/character-options/backgrounds';

// The section is the only renderer of `Background` in the 5e systems, so the
// 2024-model fields (ability scores, Origin feat, lettered equipment packages)
// are asserted here against the shipped SRD 5.2 data rather than a fixture.
function renderSection(background: Background) {
  return render(
    <Dnd5eBackgroundSection
      selectedBackground={background}
      backgroundFixedTools={[]}
      backgroundToolSlots={[]}
      backgroundLanguageSlots={[]}
      canUpdate={false}
    />
  );
}

describe('Dnd5eBackgroundSection renders the 2024 background model', () => {
  it('surfaces ability scores and the Origin feat', () => {
    renderSection(acolyte);

    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
    expect(screen.getByText('Intelligence, Wisdom, Charisma')).toBeInTheDocument();
    expect(screen.getByText('Origin Feat')).toBeInTheDocument();
    expect(screen.getByText('Magic Initiate (Cleric)')).toBeInTheDocument();
  });

  it('lists both lettered equipment packages with quantities and gold', () => {
    const { container } = renderSection(acolyte);

    expect(screen.getByText('Starting Equipment')).toBeInTheDocument();
    const packages = Array.from(container.querySelectorAll('p')).map((p) => p.textContent);
    expect(packages).toContain(
      "A: Calligrapher's Supplies, Book, Holy Symbol, 10 Parchment, Robe, 8 GP"
    );
    expect(packages).toContain('B: 50 GP');
  });

  it('omits the 2014 background-feature line when the background has none', () => {
    renderSection(soldier);

    // The 2014 model's feature name sat directly under the heading; SRD 5.2
    // backgrounds have no feature, so nothing may be rendered in its place.
    expect(soldier.feature).toBeUndefined();
    expect(screen.queryByText('Military Rank')).not.toBeInTheDocument();
  });

  it('still renders a 2014-model feature name when one is present', () => {
    renderSection({
      ...acolyte,
      abilityScores: undefined,
      originFeat: undefined,
      equipmentOptions: undefined,
      feature: {
        id: 'shelter-of-the-faithful',
        name: 'Shelter of the Faithful',
        source: 'Acolyte Background',
        description: 'Legacy 2014 background feature.',
      },
    });

    expect(screen.getByText('Shelter of the Faithful')).toBeInTheDocument();
    expect(screen.queryByText('Ability Scores')).not.toBeInTheDocument();
    expect(screen.queryByText('Origin Feat')).not.toBeInTheDocument();
    expect(screen.queryByText('Starting Equipment')).not.toBeInTheDocument();
  });
});
