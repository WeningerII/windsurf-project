import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FeatDefinition } from '../../types/character-options/feats';
import { Dock } from '../../dock/Dock';
import { Dnd5eSelectedFeatsSection } from '../../systems/dnd5e/shared/components/Dnd5eSelectedFeatsSection';
import type { Feat } from '../../types/core/character';

// The in-sheet 5e feat browser was evicted in Phase 5: the Dock's Feats tab is
// now the SINGLE browse-and-add home, so the manual-rider badge is asserted
// there. Only the catalog loaders are stubbed — the Dock's own mapping (which
// is what computes the badge) runs for real.
vi.mock('../../utils/dataLoader', () => ({
  loadSpellsForSystem: vi.fn(() => Promise.resolve([])),
  loadFeatsForSystem: vi.fn(() => Promise.resolve([manualFeat, automatedFeat])),
  loadEquipmentForSystem: vi.fn(() => Promise.resolve([])),
  loadMonstersForSystem: vi.fn(() => Promise.resolve([])),
}));

// Neutral fixtures: one feat with no automatable grants (so the browser marks it
// "Manual") and one with structured grants (no badge). The 5e-2014 PHB feats this
// test originally used were removed as non-SRD content.
const manualFeat: FeatDefinition = {
  id: 'test-manual-feat',
  name: 'Test Manual Feat',
  system: 'dnd-5e-2014',
  source: 'Test Fixture',
  description: 'A feat whose benefit cannot be automated.',
  benefits: ['Manual benefit only.'],
};

const automatedFeat: FeatDefinition = {
  id: 'test-automated-feat',
  name: 'Test Automated Feat',
  system: 'dnd-5e-2014',
  source: 'Test Fixture',
  abilityScoreIncrease: { type: 'fixed', attributes: { strength: 1 } },
  proficienciesGranted: { armor: ['heavy armor'] },
  description: 'A feat whose benefits are fully automated.',
  benefits: ['Ability Score Increase: Increase your Strength by 1, to a maximum of 20.'],
};

const featDefinitionsById = new Map([
  [manualFeat.id, manualFeat],
  [automatedFeat.id, automatedFeat],
]);

const selectedFeats: Feat[] = [
  {
    id: manualFeat.id,
    name: manualFeat.name,
    description: manualFeat.description,
    source: manualFeat.source,
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
    id: automatedFeat.id,
    name: automatedFeat.name,
    description: automatedFeat.description,
    source: automatedFeat.source,
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
  it('marks manual-only feats in the Dock feat browser without marking automated feats', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[]} activeSystemId="dnd-5e-2014" />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
    await user.click(screen.getByRole('tab', { name: /feats/i }));

    const manualButton = await screen.findByRole('button', { name: /test manual feat/i });
    const automatedButton = screen.getByRole('button', { name: /test automated feat/i });

    expect(within(manualButton).getByText('Manual')).toBeInTheDocument();
    expect(within(automatedButton).queryByText('Manual')).not.toBeInTheDocument();
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
      within(screen.getByText('Test Manual Feat').parentElement!).getByText('Manual')
    ).toBeInTheDocument();
    expect(
      within(screen.getByText('Test Automated Feat').parentElement!).queryByText('Manual')
    ).not.toBeInTheDocument();
  });
});
