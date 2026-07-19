import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import type { Mam3eDataModel } from '../../../systems/mam3e/data-model';
import { Mam3eCreator } from '../../../systems/mam3e/creator/Mam3eCreator';
import { Mam3eCharacterSheet } from '../../../systems/mam3e/sheet';
import { Mam3eEngine } from '../../../systems/mam3e/engine';
import { CURRENT_DOCUMENT_VERSION } from '../../../utils/documentMigrations';

function ppReadout(): HTMLElement {
  return screen.getByTestId('mam3e-creator-pp-readout');
}

describe('Mam3eCreator', () => {
  it('re-derives the budget to 15 × Power Level when the Power Level changes', () => {
    render(<Mam3eCreator onCreate={vi.fn()} />);

    // Default PL 10 → budget 150, nothing spent yet.
    expect(ppReadout()).toHaveTextContent('0 / 150');

    fireEvent.change(screen.getByTitle('Power level'), { target: { value: '7' } });
    expect(ppReadout()).toHaveTextContent('0 / 105');

    fireEvent.change(screen.getByTitle('Power level'), { target: { value: '12' } });
    expect(ppReadout()).toHaveTextContent('0 / 180');
  });

  it('charges 2 PP per ability rank and updates the spent readout', () => {
    render(<Mam3eCreator onCreate={vi.fn()} />);

    fireEvent.change(screen.getByTitle('STR rank'), { target: { value: '3' } });

    // 3 ranks × 2 PP = 6 PP spent against the default 150 budget.
    expect(ppReadout()).toHaveTextContent('6 / 150');
    expect(screen.getByText('6 PP')).toBeInTheDocument();

    fireEvent.change(screen.getByTitle('AWE rank'), { target: { value: '2' } });
    // Now (3 + 2) ranks × 2 PP = 10 PP.
    expect(ppReadout()).toHaveTextContent('10 / 150');
  });

  it('surfaces an over-cap defense as a PL violation straight from the engine', () => {
    render(<Mam3eCreator onCreate={vi.fn()} />);

    // Low PL, high defensive abilities: at PL 1 the Dodge+Toughness cap is 2,
    // but Agility 5 / Stamina 5 drive Dodge and Toughness totals to 5 each.
    fireEvent.change(screen.getByTitle('Power level'), { target: { value: '1' } });
    fireEvent.change(screen.getByTitle('AGI rank'), { target: { value: '5' } });
    fireEvent.change(screen.getByTitle('STA rank'), { target: { value: '5' } });

    const violations = screen.getByTestId('mam3e-creator-pl-violations');
    expect(violations).toHaveTextContent(/Dodge \+ Toughness: 10 exceeds PL cap of 2/);
  });

  it('commits raw data that, prepared by the engine, round-trips through the sheet', () => {
    const onCreate = vi.fn<(data: Mam3eDataModel, name: string) => void>();
    const { unmount } = render(<Mam3eCreator onCreate={onCreate} />);

    fireEvent.change(screen.getByTitle('Character name'), {
      target: { value: 'Captain Deterministic' },
    });
    fireEvent.change(screen.getByTitle('STR rank'), { target: { value: '4' } });

    fireEvent.click(screen.getByRole('button', { name: /create character/i }));

    expect(onCreate).toHaveBeenCalledTimes(1);
    const [data, name] = onCreate.mock.calls[0];
    expect(name).toBe('Captain Deterministic');

    // onCreate hands over the RAW, pre-engine data model: abilities chosen,
    // budget = 15 × PL, spend still zero (the engine computes it at add time).
    expect(data.abilities.str).toBe(4);
    expect(data.powerPoints.total).toBe(150);
    expect(data.powerPoints.spent.abilities).toBe(0);

    // Mirror the production add path (useDocuments.addDocument runs the engine's
    // prepareData on every added document), which populates the spend.
    const prepared = new Mam3eEngine().prepareData({
      id: 'mam3e-roundtrip',
      name,
      systemId: 'mam3e',
      system: data,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      version: CURRENT_DOCUMENT_VERSION,
    } as CharacterDocument<Mam3eDataModel>);
    expect(prepared.system.powerPoints.spent.abilities).toBe(8); // 4 ranks × 2 PP

    // Round-trip: the prepared character renders cleanly on the existing sheet,
    // carrying its name and engine-computed spend.
    unmount();
    render(<Mam3eCharacterSheet document={prepared} onUpdate={vi.fn()} />);

    expect(screen.getByDisplayValue('Captain Deterministic')).toBeInTheDocument();
    expect(screen.getByText('Power Points')).toBeInTheDocument();
    expect(screen.getByText(/8 \/ 150/)).toBeInTheDocument();
  });
});
