import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../systems';
import { Dnd5eSheet } from '../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import type { CharacterDocument } from '../types/core/document';
import * as dataLoader from '../utils/dataLoader';

type Dnd5eDocument = CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

function makeDnd5eDocument(
  systemOverrides: Partial<ReturnType<typeof createDefaultDnd5eData>> = {}
): Dnd5eDocument {
  return {
    id: 'dnd5e-edit-doc',
    name: 'Edit Handler Hero',
    systemId: 'dnd-5e-2014',
    system: {
      ...createDefaultDnd5eData(),
      ...systemOverrides,
    },
    createdAt: new Date('2026-04-29T00:00:00.000Z'),
    updatedAt: new Date('2026-04-29T00:00:00.000Z'),
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
  const onUpdate = vi.fn((nextDoc: Dnd5eDocument) => {
    currentDoc = nextDoc;
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

describe('shared 5e host edit handlers', () => {
  beforeAll(() => {
    registerAllSystems();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps overview and notes edits wired through the controller', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(makeDnd5eDocument());

    fireEvent.change(screen.getByTitle('Current hit points'), {
      target: { value: '4' },
    });
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.hitPoints.current).toBe(4);

    await user.click(screen.getByRole('tab', { name: /notes/i }));
    fireEvent.change(screen.getByLabelText('Appearance'), {
      target: { value: 'Blue cloak and silver clasp' },
    });
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.personality?.appearance).toBe('Blue cloak and silver clasp');

    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Keeps careful maps.' },
    });
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.notes).toBe('Keeps careful maps.');
  });

  it('keeps currency, attunement, inventory removal, and unequip edits wired through the controller', async () => {
    const user = userEvent.setup();
    stubShared5eLoaders();
    const sheet = renderEditableDnd5eSheet(
      makeDnd5eDocument({
        currency: {
          copper: 0,
          silver: 0,
          electrum: 0,
          gold: 5,
          platinum: 0,
        },
        inventory: [{ itemId: 'torch', quantity: 1, customName: 'Torch' }],
        equipment: [
          {
            itemId: 'leather',
            slot: 'chest',
            attuned: false,
            customName: 'Leather Armor',
            armorClass: 11,
            armorType: 'light',
          },
        ],
      })
    );

    await user.click(screen.getByRole('tab', { name: /^equipment$/i }));
    fireEvent.change(await screen.findByTitle('GP'), {
      target: { value: '42' },
    });
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    let updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.currency.gold).toBe(42);

    await user.click(screen.getByTitle('Attune'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.equipment[0]?.attuned).toBe(true);

    await user.click(screen.getByTitle('Remove item'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.inventory).toEqual([]);

    await user.click(screen.getByTitle('Unequip'));
    await waitFor(() => expect(sheet.onUpdate).toHaveBeenCalled());
    updatedDoc = sheet.applyLatestUpdate();
    expect(updatedDoc.system.equipment).toEqual([]);
  });
});
