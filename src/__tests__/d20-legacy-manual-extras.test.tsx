import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../types/core/document';
import type { Spell } from '../types/magic/spells';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import { D20SpellsTab } from '../systems/d20-legacy/components/D20SpellsTab';
import { exportDocuments, importDocuments } from '../utils/documentStorage';

const cureLightWounds: Spell = {
  id: 'cure-light-wounds-test',
  name: 'Cure Light Wounds',
  system: 'dnd-3.5e',
  source: 'Test',
  level: 1,
  school: 'conjuration',
  castingTime: { type: 'standard', amount: 1 },
  range: { type: 'touch' },
  components: { verbal: true, somatic: true, material: false },
  duration: { type: 'instant' },
  concentration: false,
  ritual: false,
  description: 'Heals a creature.',
  classes: ['cleric'],
};

const inflictLightWounds: Spell = {
  ...cureLightWounds,
  id: 'inflict-light-wounds-test',
  name: 'Inflict Light Wounds',
  description: 'Harms a creature.',
};

const magicMissile: Spell = {
  ...cureLightWounds,
  id: 'magic-missile-test',
  name: 'Magic Missile',
  description: 'Darts of force.',
  classes: ['wizard'],
};

function makeDnd35eDoc(): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'd20-spellcasting-options-35e',
    name: '3.5e Spellcasting Options',
    systemId: 'dnd-3.5e',
    system: {
      ...createDefaultDnd35eData(),
      arcaneSpecialtySchool: 'evocation',
      manualSpellcastingExtras: { spontaneousConversionReference: 'both' },
    },
    createdAt: new Date('2026-04-01T00:00:00.000Z'),
    updatedAt: new Date('2026-04-01T00:00:00.000Z'),
  };
}

function makePf1eDoc(): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'd20-spellcasting-options-pf1e',
    name: 'PF1e Spellcasting Options',
    systemId: 'pf1e',
    system: {
      ...createDefaultPf1eData(),
      arcaneSpecialtySchool: 'necromancy',
      manualSpellcastingExtras: { spontaneousConversionReference: 'cure' },
    },
    createdAt: new Date('2026-04-01T00:00:00.000Z'),
    updatedAt: new Date('2026-04-01T00:00:00.000Z'),
  };
}

describe('d20 legacy spellcasting options', () => {
  it('round-trips arcane specialization and the spontaneous-conversion reference', () => {
    const docs = [makeDnd35eDoc(), makePf1eDoc()];
    const imported = importDocuments(exportDocuments(docs));

    expect(imported.map((doc) => doc.system.arcaneSpecialtySchool)).toEqual([
      'evocation',
      'necromancy',
    ]);
    expect(imported.map((doc) => doc.system.manualSpellcastingExtras)).toEqual([
      docs[0].system.manualSpellcastingExtras,
      docs[1].system.manualSpellcastingExtras,
    ]);
  });

  it('renders the arcane-school and spontaneous-conversion controls (no manual slot trackers)', () => {
    const onSetSpontaneousConversionReference = vi.fn();
    const onSetArcaneSpecialtySchool = vi.fn();

    render(
      <D20SpellsTab
        spellsLoaded
        spells={[cureLightWounds, inflictLightWounds]}
        spellListIds={['cleric']}
        trackedSpellIds={[]}
        preparedSpellsByLevel={{}}
        alwaysPreparedSpellIds={[]}
        spellSlots={{ 1: { total: 3, used: 0 } }}
        spellSlotLevels={[1]}
        manualSpellcastingExtras={{ spontaneousConversionReference: 'both' }}
        arcaneSpecialtySchool="evocation"
        canUpdate
        onAddSpellLevel={vi.fn()}
        onAddKnownSpell={vi.fn()}
        onRemoveKnownSpell={vi.fn()}
        onSetPreparedSpell={vi.fn()}
        onUseSpellSlot={vi.fn()}
        onRecoverSpellSlot={vi.fn()}
        onSetSpellSlotTotal={vi.fn()}
        onSetSpontaneousConversionReference={onSetSpontaneousConversionReference}
        onSetArcaneSpecialtySchool={onSetArcaneSpecialtySchool}
      />
    );

    expect(screen.getByText('Spellcasting Options')).toBeInTheDocument();
    expect(screen.getByText('Spontaneous Conversion')).toBeInTheDocument();
    expect(screen.getByText('Cure Light Wounds')).toBeInTheDocument();
    expect(screen.getByText('Inflict Light Wounds')).toBeInTheDocument();

    // The old manual slot trackers are gone — these are auto-resolved now.
    expect(screen.queryByText('Domain Slots')).not.toBeInTheDocument();
    expect(screen.queryByText('Specialist Slots')).not.toBeInTheDocument();
    expect(screen.queryByText('Dragon Disciple Bonus Slots')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Arcane School'), { target: { value: 'necromancy' } });
    expect(onSetArcaneSpecialtySchool).toHaveBeenCalledWith('necromancy');

    fireEvent.change(screen.getByLabelText('Spontaneous conversion reference'), {
      target: { value: 'cure' },
    });
    expect(onSetSpontaneousConversionReference).toHaveBeenCalledWith('cure');
  });

  it('resolves tracked spells outside the current class spell lists (regression: false "Unresolved")', () => {
    // Magic Missile is wizard-only while the browse filter is cleric-only —
    // e.g. a spell tracked before a class change. It must resolve from the
    // full loaded spell list instead of rendering an "Unresolved" badge.
    render(
      <D20SpellsTab
        spellsLoaded
        spells={[cureLightWounds, inflictLightWounds, magicMissile]}
        spellListIds={['cleric']}
        trackedSpellIds={[magicMissile.id]}
        preparedSpellsByLevel={{}}
        alwaysPreparedSpellIds={[]}
        spellSlots={{ 1: { total: 2, used: 0 } }}
        spellSlotLevels={[1]}
        manualSpellcastingExtras={undefined}
        arcaneSpecialtySchool={undefined}
        canUpdate
        onAddSpellLevel={vi.fn()}
        onAddKnownSpell={vi.fn()}
        onRemoveKnownSpell={vi.fn()}
        onSetPreparedSpell={vi.fn()}
        onUseSpellSlot={vi.fn()}
        onRecoverSpellSlot={vi.fn()}
        onSetSpellSlotTotal={vi.fn()}
        onSetSpontaneousConversionReference={vi.fn()}
        onSetArcaneSpecialtySchool={vi.fn()}
      />
    );

    const trackedRow = screen.getByText('Magic Missile').closest('div')?.parentElement;
    expect(trackedRow).toBeTruthy();
    expect(screen.queryByText('Unresolved')).not.toBeInTheDocument();
    expect(screen.queryByText('Unknown level')).not.toBeInTheDocument();
    expect(within(trackedRow as HTMLElement).getByText('Level 1')).toBeInTheDocument();
  });
});
