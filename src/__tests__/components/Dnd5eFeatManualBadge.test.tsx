import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../../components/ui/Tabs';
import { heavilyArmored, savageAttacker } from '../../data/dnd/5e-2014/feats';
import { Dnd5eFeatBrowserTab } from '../../systems/dnd5e/shared/components/Dnd5eFeatBrowserTab';
import { Dnd5eSelectedFeatsSection } from '../../systems/dnd5e/shared/components/Dnd5eSelectedFeatsSection';
import type { Feat } from '../../types/core/character';

const featDefinitionsById = new Map([
  [savageAttacker.id, savageAttacker],
  [heavilyArmored.id, heavilyArmored],
]);

const selectedFeats: Feat[] = [
  {
    id: savageAttacker.id,
    name: savageAttacker.name,
    description: savageAttacker.description,
    source: savageAttacker.source,
    automation: {
      abilityScores: {},
      armor: [],
      weapons: [],
      tools: [],
      languages: [],
      skills: {},
      savingThrows: [],
    },
  },
  {
    id: heavilyArmored.id,
    name: heavilyArmored.name,
    description: heavilyArmored.description,
    source: heavilyArmored.source,
    automation: {
      abilityScores: { str: 1 },
      armor: ['heavy'],
      weapons: [],
      tools: [],
      languages: [],
      skills: {},
      savingThrows: [],
    },
  },
];

describe('D&D 5e feat manual badges', () => {
  it('marks manual-only feats in the feat browser without marking automated feats', async () => {
    render(
      <Tabs defaultValue="feats">
        <Dnd5eFeatBrowserTab
          systemId="dnd-5e-2014"
          featsLoaded
          featTemplateError={null}
          featDefs={[savageAttacker, heavilyArmored]}
        />
      </Tabs>
    );

    const savageButton = await screen.findByRole('button', { name: /savage attacker/i });
    const heavilyArmoredButton = screen.getByRole('button', { name: /heavily armored/i });

    expect(within(savageButton).getByText('Manual')).toBeInTheDocument();
    expect(within(heavilyArmoredButton).queryByText('Manual')).not.toBeInTheDocument();
  });

  it('marks manual-only selected feats without marking selected feats with automation', () => {
    render(
      <Dnd5eSelectedFeatsSection
        feats={selectedFeats}
        featTemplateError={null}
        featDefinitionsById={featDefinitionsById}
        canUpdate={false}
        resolveFeatSelections={() => ({})}
        optionDisabledForRequirement={() => false}
        baseAttributes={{ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }}
        onFeatRemove={vi.fn()}
        onFeatSelectionChange={vi.fn()}
      />
    );

    expect(
      within(screen.getByText('Savage Attacker').parentElement!).getByText('Manual')
    ).toBeInTheDocument();
    expect(
      within(screen.getByText('Heavily Armored').parentElement!).queryByText('Manual')
    ).not.toBeInTheDocument();
  });
});
