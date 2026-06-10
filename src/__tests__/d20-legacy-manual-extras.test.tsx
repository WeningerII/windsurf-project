import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../types/core/document';
import type { Spell } from '../types/magic/spells';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { createDefaultPf1eData, type Pf1eDataModel } from '../systems/pf1e/data-model';
import { D20SpellsTab } from '../systems/d20-legacy/components/D20SpellsTab';
import { resetD20LegacyManualSpellcastingExtras } from '../systems/d20-legacy/d20LegacySheetShared';
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
    id: 'd20-manual-extras-35e',
    name: '3.5e Manual Extras',
    systemId: 'dnd-3.5e',
    system: {
      ...createDefaultDnd35eData(),
      manualSpellcastingExtras: {
        domainSlotConsumedByLevel: { 1: true },
        specialistSlotConsumedByLevel: { 2: true },
        spontaneousConversionReference: 'both',
        dragonDiscipleBonusSlots: { total: 2, used: 1 },
      },
    },
    createdAt: new Date('2026-04-01T00:00:00.000Z'),
    updatedAt: new Date('2026-04-01T00:00:00.000Z'),
  };
}

function makePf1eDoc(): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'd20-manual-extras-pf1e',
    name: 'PF1e Manual Extras',
    systemId: 'pf1e',
    system: {
      ...createDefaultPf1eData(),
      manualSpellcastingExtras: {
        domainSlotConsumedByLevel: { 1: false },
        specialistSlotConsumedByLevel: { 1: true },
        spontaneousConversionReference: 'cure',
        dragonDiscipleBonusSlots: { total: 1, used: 1 },
      },
    },
    createdAt: new Date('2026-04-01T00:00:00.000Z'),
    updatedAt: new Date('2026-04-01T00:00:00.000Z'),
  };
}

describe('d20 legacy manual spellcasting extras', () => {
  it('round-trips manual extra state through document import/export', () => {
    const docs = [makeDnd35eDoc(), makePf1eDoc()];
    const imported = importDocuments(exportDocuments(docs));

    expect(imported.map((doc) => doc.system.manualSpellcastingExtras)).toEqual([
      docs[0].system.manualSpellcastingExtras,
      docs[1].system.manualSpellcastingExtras,
    ]);
  });

  it('resets manual usage counters without removing manual reference state', () => {
    expect(
      resetD20LegacyManualSpellcastingExtras(makeDnd35eDoc().system.manualSpellcastingExtras)
    ).toEqual({
      domainSlotConsumedByLevel: { 1: false },
      specialistSlotConsumedByLevel: { 2: false },
      spontaneousConversionReference: 'both',
      dragonDiscipleBonusSlots: { total: 2, used: 0 },
    });
  });

  it('renders manual controls for domain, specialist, conversion, and dragon disciple extras', () => {
    const onSetManualExtraConsumed = vi.fn();
    const onSetSpontaneousConversionReference = vi.fn();
    const onSetDragonDiscipleBonusSlots = vi.fn();

    render(
      <D20SpellsTab
        spellsLoaded
        spells={[cureLightWounds, inflictLightWounds]}
        spellListIds={['cleric']}
        trackedSpellIds={[]}
        preparedSpellsByLevel={{}}
        alwaysPreparedSpellIds={[]}
        spellSlots={{ 1: { total: 2, used: 0 } }}
        spellSlotLevels={[1]}
        manualSpellcastingExtras={{
          domainSlotConsumedByLevel: { 1: true },
          specialistSlotConsumedByLevel: { 1: false },
          spontaneousConversionReference: 'both',
          dragonDiscipleBonusSlots: { total: 2, used: 1 },
        }}
        canUpdate
        onAddSpellLevel={vi.fn()}
        onAddKnownSpell={vi.fn()}
        onRemoveKnownSpell={vi.fn()}
        onSetPreparedSpell={vi.fn()}
        onUseSpellSlot={vi.fn()}
        onRecoverSpellSlot={vi.fn()}
        onSetSpellSlotTotal={vi.fn()}
        onSetManualExtraConsumed={onSetManualExtraConsumed}
        onSetSpontaneousConversionReference={onSetSpontaneousConversionReference}
        onSetDragonDiscipleBonusSlots={onSetDragonDiscipleBonusSlots}
      />
    );

    expect(screen.getByText('Manual Extras')).toBeInTheDocument();
    expect(screen.getByText('Domain Slots')).toBeInTheDocument();
    expect(screen.getByText('Specialist Slots')).toBeInTheDocument();
    expect(screen.getByText('Spontaneous Conversion')).toBeInTheDocument();
    expect(screen.getByText('Dragon Disciple Bonus Slots')).toBeInTheDocument();
    expect(screen.getByText('Cure Light Wounds')).toBeInTheDocument();
    expect(screen.getByText('Inflict Light Wounds')).toBeInTheDocument();

    const domainSection = screen.getByText('Domain Slots').closest('div')?.parentElement;
    expect(domainSection).toBeTruthy();
    fireEvent.click(within(domainSection as HTMLElement).getByRole('checkbox'));
    expect(onSetManualExtraConsumed).toHaveBeenCalledWith('domain', 1, false);

    fireEvent.change(screen.getByLabelText('Spontaneous conversion reference'), {
      target: { value: 'cure' },
    });
    expect(onSetSpontaneousConversionReference).toHaveBeenCalledWith('cure');

    const dragonSection = screen
      .getByText('Dragon Disciple Bonus Slots')
      .closest('div')?.parentElement;
    expect(dragonSection).toBeTruthy();
    const totalInput = within(dragonSection as HTMLElement).getByDisplayValue('2');
    fireEvent.change(totalInput, { target: { value: '3' } });
    expect(onSetDragonDiscipleBonusSlots).toHaveBeenCalledWith({ total: 3 });
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
        canUpdate
        onAddSpellLevel={vi.fn()}
        onAddKnownSpell={vi.fn()}
        onRemoveKnownSpell={vi.fn()}
        onSetPreparedSpell={vi.fn()}
        onUseSpellSlot={vi.fn()}
        onRecoverSpellSlot={vi.fn()}
        onSetSpellSlotTotal={vi.fn()}
        onSetManualExtraConsumed={vi.fn()}
        onSetSpontaneousConversionReference={vi.fn()}
        onSetDragonDiscipleBonusSlots={vi.fn()}
      />
    );

    const trackedRow = screen.getByText('Magic Missile').closest('div')?.parentElement;
    expect(trackedRow).toBeTruthy();
    expect(screen.queryByText('Unresolved')).not.toBeInTheDocument();
    expect(screen.queryByText('Unknown level')).not.toBeInTheDocument();
    expect(within(trackedRow as HTMLElement).getByText('Level 1')).toBeInTheDocument();
  });
});
