import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../../components/ui/Tabs';
import { Dnd5eSpellsTab } from '../../systems/dnd5e/shared/components/Dnd5eSpellsTab';
import { Pf2eSpellBrowserPanel } from '../../systems/pf2e/components/Pf2eSpellBrowserPanel';
import type { Spell } from '../../types/magic/spells';

const stinkingCloudSpell: Spell = {
  id: 'stinking-cloud-test',
  name: 'Stinking Cloud',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  level: 3,
  school: 'conjuration',
  castingTime: { type: 'action', amount: 1 },
  range: { type: 'ranged', feet: 90 },
  components: { verbal: true, somatic: true, material: true },
  duration: { type: 'concentration', maxDuration: '1 minute' },
  areaOfEffect: { type: 'sphere', radius: 20 },
  concentration: true,
  ritual: false,
  description: 'A nauseating cloud fills a 20-foot-radius sphere.',
  classes: ['wizard'],
};

const teleportSpell: Spell = {
  id: 'teleport-test',
  name: 'Teleport',
  system: 'pf2e',
  source: 'Core Rulebook',
  level: 6,
  school: 'conjuration',
  traditions: ['arcane'],
  castingTime: { type: 'action', amount: 10 },
  range: { type: 'unlimited' },
  components: { verbal: true, somatic: true, material: false },
  duration: { type: 'instant' },
  concentration: false,
  ritual: false,
  description: 'You and the other targets are instantly transported.',
  classes: ['sorcerer', 'wizard'],
  target: 'You and the other targets',
  heightening: {
    mode: 'fixed',
    summary: 'Heightened (7th): You and up to 8 willing creatures travel on the same plane.',
    ranks: {
      7: 'You and up to 8 willing creatures travel on the same plane.',
    },
  },
};

describe('Spell Browser Panels', () => {
  it('formats areaOfEffect fallback in the shared 5e spell browser path', async () => {
    render(
      <Tabs defaultValue="spells">
        <Dnd5eSpellsTab
          spellcasting={{ spellsKnown: [], spellsPrepared: [] }}
          spellsLoaded
          spells={[stinkingCloudSpell]}
          spellNames={new Map()}
          alwaysPreparedSpellIds={new Set()}
          preparedSpellIds={new Set()}
          preparedCasterSummaries={[]}
        />
      </Tabs>
    );

    expect(await screen.findByText('Stinking Cloud')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' && element.textContent === 'Area: 20-foot-radius sphere'
      )
    ).toBeInTheDocument();
  });

  it('surfaces target and fixed heightening in the PF2e spell browser panel', async () => {
    render(<Pf2eSpellBrowserPanel spells={[teleportSpell]} />);

    expect(await screen.findByText('Teleport')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' && element.textContent === 'Target: You and the other targets'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent ===
            'Scaling: Heightened (7th): You and up to 8 willing creatures travel on the same plane.'
      )
    ).toBeInTheDocument();
  });
});
