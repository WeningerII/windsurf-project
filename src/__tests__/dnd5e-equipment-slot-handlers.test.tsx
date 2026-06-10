import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../systems';
import { Dnd5eSheet } from '../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { EquippedItem } from '../types/core/character';
import * as dataLoader from '../utils/dataLoader';

type Dnd5eDocument = CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

function makeDnd5eDocument(
  systemOverrides: Partial<ReturnType<typeof createDefaultDnd5eData>> = {}
): Dnd5eDocument {
  return {
    id: 'dnd5e-slot-doc',
    name: 'Slot Handler Hero',
    systemId: 'dnd-5e-2014',
    system: {
      ...createDefaultDnd5eData(),
      ...systemOverrides,
    },
    createdAt: new Date('2026-06-10T00:00:00.000Z'),
    updatedAt: new Date('2026-06-10T00:00:00.000Z'),
  };
}

function stubShared5eLoaders() {
  vi.spyOn(dataLoader, 'loadClassesForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadSpeciesForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadBackgroundsForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadFeatureOptionsForSystem').mockResolvedValue([]);
  vi.spyOn(dataLoader, 'loadEquipmentForSystem').mockResolvedValue([]);
}

function renderEditableDnd5eSheet(initialDoc: Dnd5eDocument) {
  let currentDoc = initialDoc;
  // Match the sheet's host-facing onUpdate signature (the broad document
  // type); the narrowing to Dnd5eDocument happens via the cast below.
  const onUpdate = vi.fn((nextDoc: CharacterDocument<SystemDataModel>) => {
    currentDoc = nextDoc as Dnd5eDocument;
  });
  const view = render(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);

  const applyLatestUpdate = () => {
    const updatedDoc = onUpdate.mock.calls.at(-1)?.[0] as Dnd5eDocument | undefined;
    expect(updatedDoc).toBeDefined();
    currentDoc = updatedDoc!;
    onUpdate.mockClear();
    view.rerender(<Dnd5eSheet document={currentDoc} onUpdate={onUpdate} />);
    return currentDoc;
  };

  return {
    onUpdate,
    applyLatestUpdate,
    get currentDoc() {
      return currentDoc;
    },
  };
}

const ringOfProtection = (slot: 'ring1' | 'ring2'): EquippedItem => ({
  itemId: 'ring-of-protection',
  slot,
  attuned: false,
  customName: 'Ring of Protection',
});

describe('shared 5e equipment slot handlers', () => {
  beforeAll(() => {
    registerAllSystems();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('unequips and attunes only the targeted slot when duplicate item ids are equipped', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        equipment: [ringOfProtection('ring1'), ringOfProtection('ring2')],
      })
    );

    await user.click(screen.getByRole('tab', { name: /^equipment$/i }));
    // Slots render in slot order, so the second control belongs to ring2.
    const attuneButtons = await screen.findAllByTitle('Attune');
    expect(attuneButtons).toHaveLength(2);

    await user.click(attuneButtons[1]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.equipment).toHaveLength(2);
    expect(updatedDoc.system.equipment.find((entry) => entry.slot === 'ring1')?.attuned).toBe(
      false
    );
    expect(updatedDoc.system.equipment.find((entry) => entry.slot === 'ring2')?.attuned).toBe(true);

    const unequipButtons = await screen.findAllByTitle('Unequip');
    expect(unequipButtons).toHaveLength(2);
    await user.click(unequipButtons[1]);
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.equipment).toHaveLength(1);
    expect(updatedDoc.system.equipment[0]?.slot).toBe('ring1');
    expect(updatedDoc.system.equipment[0]?.itemId).toBe('ring-of-protection');
  });
});
