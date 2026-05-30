import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pf2eSpellsTab } from '../../systems/pf2e/components/Pf2eSpellsTab';
import type { Spell } from '../../types/magic/spells';

const focusPulseSpell: Spell = {
  id: 'focus-pulse-pf2e',
  name: 'Focus Pulse',
  system: 'pf2e',
  source: 'Test',
  level: 1,
  school: 'evocation',
  traditions: ['arcane'],
  traits: ['focus'],
  castingTime: { type: 'action', amount: 1 },
  range: { type: 'ranged', feet: 30 },
  components: { verbal: true, somatic: true, material: false },
  duration: { type: 'instant' },
  concentration: false,
  ritual: false,
  description: 'A focused pulse of force.',
  classes: ['wizard'],
};

describe('Pf2eSpellsTab', () => {
  it('renders persisted focus spells as an honest manual surface', () => {
    render(
      <Pf2eSpellsTab
        classId="wizard"
        spellsLoaded={false}
        spells={[focusPulseSpell]}
        spellcasting={{
          tradition: 'arcane',
          type: 'prepared',
          proficiency: { tier: 'trained', total: 3 },
          spellSlots: {},
          spellsKnown: [],
          preparedSpellsByRank: {},
          alwaysPreparedSpellIds: [],
          focusSpells: ['focus-pulse-pf2e', 'missing-focus-pf2e'],
          focusPoints: { current: 1, max: 1 },
        }}
      />
    );

    expect(screen.getByText('Focus Spells')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByText('Focus Pulse')).toBeInTheDocument();
    expect(screen.getByText('Missing Focus Pf2e')).toBeInTheDocument();
    expect(screen.getAllByText('Applied manually')).toHaveLength(2);
    expect(screen.getByText('Unresolved')).toBeInTheDocument();
  });
});
