import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SheetDispatchProvider } from '../SheetDispatchContext';
import {
  useSheetDispatch,
  useSheetDispatchRegister,
  type SheetAddHandlers,
} from '../sheet-dispatch-context';
import type { Spell } from '../../types/magic/spells';
import type { FeatDefinition } from '../../types/character-options/feats';
import type { Item } from '../../types/equipment/items';

const SPELL = { id: 'fireball', name: 'Fireball' } as unknown as Spell;
const FEAT = { id: 'alert', name: 'Alert' } as unknown as FeatDefinition;
const ITEM = { id: 'rope', name: 'Rope' } as unknown as Item;

/** Publishes handlers up; docId/handlers are driven from props so a rerender
 * can simulate opening/closing a sheet. */
function Registrar({ docId, handlers }: { docId: string | null; handlers: SheetAddHandlers }) {
  useSheetDispatchRegister(docId, handlers);
  return null;
}

/** Reads the registry down and exposes the gate + verbs to the test. */
function Consumer() {
  const dispatch = useSheetDispatch();
  return (
    <div>
      <span data-testid="canSpell">{String(dispatch.canAddSpell)}</span>
      <span data-testid="canFeat">{String(dispatch.canAddFeat)}</span>
      <span data-testid="canEquip">{String(dispatch.canAddEquipment)}</span>
      <span data-testid="activeDoc">{dispatch.activeDocId ?? 'none'}</span>
      <button onClick={() => dispatch.addSpell(SPELL)}>add-spell</button>
      <button onClick={() => dispatch.addFeat(FEAT)}>add-feat</button>
      <button onClick={() => dispatch.addEquipment(ITEM)}>add-equip</button>
    </div>
  );
}

describe('SheetDispatchContext', () => {
  it('invokes the registered handler on dispatch when an active doc resolves', async () => {
    const user = userEvent.setup();
    const addSpell = vi.fn();
    const addFeat = vi.fn();
    const addEquipment = vi.fn();

    render(
      <SheetDispatchProvider>
        <Registrar docId="doc-1" handlers={{ addSpell, addFeat, addEquipment }} />
        <Consumer />
      </SheetDispatchProvider>
    );

    expect(screen.getByTestId('canSpell').textContent).toBe('true');
    expect(screen.getByTestId('canFeat').textContent).toBe('true');
    expect(screen.getByTestId('canEquip').textContent).toBe('true');
    expect(screen.getByTestId('activeDoc').textContent).toBe('doc-1');

    await user.click(screen.getByRole('button', { name: 'add-spell' }));
    await user.click(screen.getByRole('button', { name: 'add-feat' }));
    await user.click(screen.getByRole('button', { name: 'add-equip' }));

    expect(addSpell).toHaveBeenCalledWith(SPELL);
    expect(addFeat).toHaveBeenCalledWith(FEAT);
    expect(addEquipment).toHaveBeenCalledWith(ITEM);
  });

  it('gates dispatch to a no-op when no active doc is registered (never targets a stale controller)', async () => {
    const user = userEvent.setup();
    const addSpell = vi.fn();

    // docId null → nothing published even though a handler is passed.
    render(
      <SheetDispatchProvider>
        <Registrar docId={null} handlers={{ addSpell }} />
        <Consumer />
      </SheetDispatchProvider>
    );

    expect(screen.getByTestId('canSpell').textContent).toBe('false');
    expect(screen.getByTestId('activeDoc').textContent).toBe('none');

    await user.click(screen.getByRole('button', { name: 'add-spell' }));
    expect(addSpell).not.toHaveBeenCalled();
  });

  it('reports canAdd=false for a verb whose handler the active sheet did not publish', () => {
    // An active doc, but only a spell handler — feat/equipment stay disabled.
    render(
      <SheetDispatchProvider>
        <Registrar docId="doc-1" handlers={{ addSpell: vi.fn() }} />
        <Consumer />
      </SheetDispatchProvider>
    );

    expect(screen.getByTestId('canSpell').textContent).toBe('true');
    expect(screen.getByTestId('canFeat').textContent).toBe('false');
    expect(screen.getByTestId('canEquip').textContent).toBe('false');
  });

  it('clears the registry when the publishing sheet unmounts', async () => {
    const user = userEvent.setup();
    const addSpell = vi.fn();

    function Harness({ mounted }: { mounted: boolean }) {
      return (
        <SheetDispatchProvider>
          {mounted && <Registrar docId="doc-1" handlers={{ addSpell }} />}
          <Consumer />
        </SheetDispatchProvider>
      );
    }

    const { rerender } = render(<Harness mounted />);
    expect(screen.getByTestId('canSpell').textContent).toBe('true');

    rerender(<Harness mounted={false} />);
    expect(screen.getByTestId('canSpell').textContent).toBe('false');

    await user.click(screen.getByRole('button', { name: 'add-spell' }));
    expect(addSpell).not.toHaveBeenCalled();
  });

  it('is an inert no-op when a sheet registers with no provider present', () => {
    // Registrar mounted standalone (no provider): must not throw, and a lone
    // consumer sees an empty, disabled registry.
    expect(() =>
      render(<Registrar docId="doc-1" handlers={{ addSpell: vi.fn() }} />)
    ).not.toThrow();

    render(<Consumer />);
    expect(screen.getByTestId('canSpell').textContent).toBe('false');
    expect(screen.getByTestId('activeDoc').textContent).toBe('none');
  });

  it('lets a newly-active sheet take over the registry from a previous one', () => {
    // Two sheets publish in turn; the last registration wins, and a late
    // teardown from the first must not wipe the second.
    function Harness({ activeDocId }: { activeDocId: string }) {
      return (
        <SheetDispatchProvider>
          <Registrar docId={activeDocId} handlers={{ addSpell: vi.fn() }} />
          <Consumer />
        </SheetDispatchProvider>
      );
    }

    const { rerender } = render(<Harness activeDocId="doc-1" />);
    expect(screen.getByTestId('activeDoc').textContent).toBe('doc-1');

    act(() => {
      rerender(<Harness activeDocId="doc-2" />);
    });
    expect(screen.getByTestId('activeDoc').textContent).toBe('doc-2');
  });
});
