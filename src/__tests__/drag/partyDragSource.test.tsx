import { describe, it, expect, vi } from 'vitest';
import { useRef } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PartyDockTab } from '../../dock/PartyDockTab';
import { SceneDropController } from '../../components/drag/SceneDropController';
import { DragContext } from '../../components/drag/dragContext';
import type { DragContextValue, DropTargetRegistration } from '../../components/drag/dragTypes';
import { SceneDispatchContext, type SceneEmit } from '../../contexts/scene-dispatch-context';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type { SceneActionIntent } from '../../types/core/scene';

const now = new Date('2026-06-20T00:00:00.000Z');
function doc(
  over: Partial<CharacterDocument<SystemDataModel>> = {}
): CharacterDocument<SystemDataModel> {
  return {
    id: 'doc-1',
    name: 'Astra',
    systemId: 'dnd-5e-2024',
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
    ...over,
  };
}

function goblin(): Monster {
  return {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 15,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: [],
    languages: [],
    actions: [],
  } as Monster;
}

describe('PartyDockTab as a drag source', () => {
  it('asks makeDragHandlers for a {documentId,label} payload per entry and spreads the handlers', () => {
    const onPointerDown = vi.fn();
    const makeDragHandlers = vi.fn(() => ({ onPointerDown }));
    render(
      <PartyDockTab
        documents={[doc(), doc({ id: 'doc-2', name: 'Bran' })]}
        makeDragHandlers={makeDragHandlers}
      />
    );

    expect(makeDragHandlers).toHaveBeenCalledWith('doc-1', 'Astra');
    expect(makeDragHandlers).toHaveBeenCalledWith('doc-2', 'Bran');

    const entry = screen.getByText('Astra').closest('li')!;
    fireEvent.pointerDown(entry);
    expect(onPointerDown).toHaveBeenCalled();
  });

  it('stays browse-only (no drag handlers, no grab cursor) when makeDragHandlers is absent', () => {
    render(<PartyDockTab documents={[doc()]} />);
    const entry = screen.getByText('Astra').closest('li')!;
    expect(entry.className).not.toContain('cursor-grab');
  });
});

/** Renders the drop controller under a fake DragContext that captures the
 *  registration, exposing its onDrop so a drop can be simulated. */
function renderDropController(opts: {
  emit: SceneEmit;
  documents: CharacterDocument<SystemDataModel>[];
  resolveStatblock: (id: string) => Monster | undefined;
  onRegistered: (reg: DropTargetRegistration) => void;
}) {
  function Harness() {
    const gridRef = useRef<HTMLDivElement>(null);
    const ctx: DragContextValue = {
      makeSourceHandlers: () => ({}),
      registerDropTarget: (_id, reg) => {
        opts.onRegistered(reg);
        return () => {};
      },
    };
    return (
      <DragContext.Provider value={ctx}>
        <SceneDispatchContext.Provider value={opts.emit}>
          <div ref={gridRef} role="grid" />
          <SceneDropController
            gridRef={gridRef}
            documents={opts.documents}
            resolveStatblock={opts.resolveStatblock}
          />
        </SceneDispatchContext.Provider>
      </DragContext.Provider>
    );
  }
  return render(<Harness />);
}

describe('SceneDropController (drop → existing place-token intent)', () => {
  it('3b-i: a character drop auto-applies place-token with NO chip', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    let reg: DropTargetRegistration | undefined;
    renderDropController({
      emit,
      documents: [doc()],
      resolveStatblock: () => undefined,
      onRegistered: (r) => (reg = r),
    });

    expect(reg).toBeDefined();
    act(() =>
      reg!.onDrop({ kind: 'character', documentId: 'doc-1', label: 'Astra' }, { x: 4, y: 5 })
    );

    expect(emit).toHaveBeenCalledTimes(1);
    const [intent] = emit.mock.calls[0];
    expect(intent).toMatchObject({
      type: 'place-token',
      token: {
        name: 'Astra',
        kind: 'character',
        position: { x: 4, y: 5 },
        refId: 'doc-1',
        playerControlled: true,
      },
    });
    // No allegiance chip on the 1-choice path.
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('3b-i: an unknown documentId places nothing', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    let reg: DropTargetRegistration | undefined;
    renderDropController({
      emit,
      documents: [doc()],
      resolveStatblock: () => undefined,
      onRegistered: (r) => (reg = r),
    });
    act(() =>
      reg!.onDrop({ kind: 'character', documentId: 'missing', label: 'Ghost' }, { x: 0, y: 0 })
    );
    expect(emit).not.toHaveBeenCalled();
  });

  it('3b-ii: a monster drop shows the friendly/hostile chip, then emits place-token with the chosen allegiance', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    let reg: DropTargetRegistration | undefined;
    renderDropController({
      emit,
      documents: [],
      resolveStatblock: (id) => (id === 'goblin' ? goblin() : undefined),
      onRegistered: (r) => (reg = r),
    });

    act(() =>
      reg!.onDrop({ kind: 'monster', monsterId: 'goblin', label: 'Goblin' }, { x: 7, y: 8 })
    );
    // No emit yet — the classifier chip is up.
    expect(emit).not.toHaveBeenCalled();
    const dialog = screen.getByRole('dialog', { name: /Place Goblin/i });
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hostile' }));
    expect(emit).toHaveBeenCalledTimes(1);
    const [intent] = emit.mock.calls[0];
    expect(intent).toMatchObject({
      type: 'place-token',
      token: {
        name: 'Goblin',
        kind: 'npc',
        allegiance: 'hostile',
        position: { x: 7, y: 8 },
        refId: 'goblin',
      },
    });
    // Chip dismisses after the choice.
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('3b-ii: Friendly maps to the party allegiance', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    let reg: DropTargetRegistration | undefined;
    renderDropController({
      emit,
      documents: [],
      resolveStatblock: () => goblin(),
      onRegistered: (r) => (reg = r),
    });
    act(() =>
      reg!.onDrop({ kind: 'monster', monsterId: 'goblin', label: 'Goblin' }, { x: 1, y: 1 })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Friendly' }));
    expect(emit.mock.calls[0][0]).toMatchObject({ token: { allegiance: 'party' } });
  });

  it('3b-ii: dismissing the chip (Cancel) places nothing (snap-back)', () => {
    const emit = vi.fn((_intent: SceneActionIntent) => true);
    let reg: DropTargetRegistration | undefined;
    renderDropController({
      emit,
      documents: [],
      resolveStatblock: () => goblin(),
      onRegistered: (r) => (reg = r),
    });
    act(() =>
      reg!.onDrop({ kind: 'monster', monsterId: 'goblin', label: 'Goblin' }, { x: 1, y: 1 })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(emit).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
