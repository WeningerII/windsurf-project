import '@testing-library/jest-dom';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { SceneGridView } from '../../components/SceneGridView';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { SceneState } from '../../types/core/scene';

/**
 * Accessibility regression lock for the SHARED shell surfaces (ledger
 * p5.infra-gaps, a11y lane).
 *
 * WHY THESE ARE UNIT TESTS AND NOT AXE
 * `@axe-core/playwright` is already a devDependency and `e2e/a11y.spec.ts`
 * scans the landing page, a sheet and the bestiary with it. What that gate
 * CANNOT do is run here — Playwright is CI-only in this environment — and what
 * it never covers at all is behavior: axe reads a static DOM snapshot, so it
 * cannot see that a focus trap leaks, that dismissing a panel strands focus on
 * <body>, or that stepping past a tab strip costs eight keypresses. Those are
 * the defects this file pins. No new dependency was added for it: everything
 * below is @testing-library/react + user-event, both already present.
 *
 * WHY SHARED: the shell is system-agnostic — one `Tabs` primitive backs every
 * one of the seven system sheets AND the Dock, and one `SceneGridView` backs
 * every system's scene. Fixing them once is what makes the improvement land
 * equally for all seven, so these tests deliberately exercise the shared
 * primitives rather than seven near-identical per-system copies.
 */

function TabsHarness() {
  return (
    <Tabs defaultValue="stats">
      <TabsList>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="spells">Spells</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="stats">Stats body</TabsContent>
      <TabsContent value="spells">Spells body</TabsContent>
      <TabsContent value="notes">Notes body</TabsContent>
    </Tabs>
  );
}

describe('Tabs primitive — ARIA tabs pattern (shared by all seven sheets + the Dock)', () => {
  it('names each panel from its own tab and points the active tab back at it', () => {
    render(<TabsHarness />);

    const active = screen.getByRole('tab', { name: 'Stats' });
    const panel = screen.getByRole('tabpanel');

    // Would catch: a tabpanel announced as an unnamed region, and an
    // aria-controls that points at nothing.
    expect(panel).toHaveAccessibleName('Stats');
    expect(active).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', active.id);
    expect(active.id).not.toBe('');
  });

  it('never points aria-controls at an unmounted panel', () => {
    render(<TabsHarness />);

    // Inactive TabsContent unmounts, so an inactive trigger must NOT claim to
    // control a panel — a dangling aria-controls is itself a defect.
    expect(screen.getByRole('tab', { name: 'Spells' })).not.toHaveAttribute('aria-controls');
  });

  it('gives two independently-mounted tab sets non-colliding ids', () => {
    render(
      <>
        <TabsHarness />
        <TabsHarness />
      </>
    );

    const ids = screen.getAllByRole('tab', { name: 'Stats' }).map((tab) => tab.id);
    // The sheet strip and the Dock are on screen together; duplicate ids would
    // make aria-controls/aria-labelledby resolve to the wrong element.
    expect(new Set(ids).size).toBe(2);
  });

  it('is a single tab stop with a roving tabindex, not one stop per tab', () => {
    render(<TabsHarness />);

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Spells' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with Arrow/Home/End and wraps at both ends', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    const stats = screen.getByRole('tab', { name: 'Stats' });
    const spells = screen.getByRole('tab', { name: 'Spells' });
    const notes = screen.getByRole('tab', { name: 'Notes' });

    stats.focus();
    await user.keyboard('{ArrowRight}');
    expect(spells).toHaveFocus();
    await user.keyboard('{End}');
    expect(notes).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(stats).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(notes).toHaveFocus();
    await user.keyboard('{Home}');
    expect(stats).toHaveFocus();
  });

  it('activates manually, so arrowing over a tab does not mount its panel', async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);

    screen.getByRole('tab', { name: 'Stats' }).focus();
    await user.keyboard('{ArrowRight}');

    // Several panels here mount lazily-fetched SRD browsers; auto-activation
    // would fetch a chunk for every tab the user passes over.
    expect(screen.getByText('Stats body')).toBeInTheDocument();
    expect(screen.queryByText('Spells body')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.getByText('Spells body')).toBeInTheDocument();
  });

  it('still lets a caller add its own onKeyDown to the list', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <Tabs defaultValue="a">
        <TabsList onKeyDown={onKeyDown}>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A body</TabsContent>
      </Tabs>
    );

    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(onKeyDown).toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
  });
});

function makeScene(width = 4, height = 3): SceneState {
  return {
    sceneId: 'scene-a11y',
    name: 'Training Yard',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width, height, cellSize: 70 },
    tokens: {},
    markers: {},
    initiative: [],
    round: 1,
    activeTokenId: undefined,
    seed: 'seed',
    checkLog: [],
    oracleLog: [],
  };
}

/** Enters the grid the way Tab would, act-wrapped (focus updates the anchor). */
function focusCell(name: RegExp) {
  const cell = screen.getByRole('gridcell', { name });
  act(() => cell.focus());
  return cell;
}

describe('SceneGridView — the keyboard-accessible scene surface', () => {
  it('parents every gridcell in a row, as role="grid" requires', () => {
    render(<SceneGridView state={makeScene()} />);

    const grid = screen.getByRole('grid');
    const rows = within(grid).getAllByRole('row');

    // Would catch a regression back to gridcells parented directly by the grid
    // — invalid structure that axe reports as aria-required-children /
    // aria-required-parent (both serious) on every single cell.
    expect(rows).toHaveLength(3);
    rows.forEach((row) => expect(within(row).getAllByRole('gridcell')).toHaveLength(4));
    within(grid)
      .getAllByRole('gridcell')
      .forEach((cell) => expect(cell.parentElement).toHaveAttribute('role', 'row'));
  });

  it('exposes the grid extent and each cell position', () => {
    render(<SceneGridView state={makeScene()} />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '4');
    expect(screen.getByRole('gridcell', { name: /Cell 4, 3/i })).toHaveAttribute(
      'aria-colindex',
      '4'
    );
  });

  it('is one tab stop, not width x height tab stops', () => {
    render(<SceneGridView state={makeScene(6, 5)} />);

    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(30);
    // Would catch a regression to tabIndex={0} on every cell — a 20x20 scene
    // then costs 400 Tab presses to step past, which is operable on paper and
    // unusable in practice.
    expect(cells.filter((cell) => cell.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(screen.getByRole('gridcell', { name: /Cell 1, 1/i })).toHaveAttribute('tabindex', '0');
  });

  it('walks cells with the arrow keys and clamps at the edges', async () => {
    const user = userEvent.setup();
    render(<SceneGridView state={makeScene()} />);

    focusCell(/Cell 1, 1/i);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('gridcell', { name: /Cell 2, 1/i })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('gridcell', { name: /Cell 2, 2/i })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('gridcell', { name: /Cell 4, 2/i })).toHaveFocus();
    // Clamped, not wrapped, and never focus-lost off the edge.
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('gridcell', { name: /Cell 4, 2/i })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('gridcell', { name: /Cell 1, 2/i })).toHaveFocus();
  });

  it('moves the single tab stop to follow the focused cell', async () => {
    const user = userEvent.setup();
    render(<SceneGridView state={makeScene()} />);

    focusCell(/Cell 1, 1/i);
    await user.keyboard('{ArrowRight}');

    // Re-entering the grid by Tab must land where the user left off, not reset
    // to the origin.
    expect(screen.getByRole('gridcell', { name: /Cell 2, 1/i })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('gridcell', { name: /Cell 1, 1/i })).toHaveAttribute('tabindex', '-1');
  });

  it('keeps a visible focus indicator even when cells are not activatable', () => {
    // Read-only scene (no onCellActivate): the cells are still focusable, so
    // `outline-none` with no replacement ring would leave a keyboard user with
    // no visible focus at all (WCAG 2.4.7).
    render(<SceneGridView state={makeScene()} />);

    expect(screen.getByRole('gridcell', { name: /Cell 1, 1/i })).toHaveClass(
      'focus-visible:ring-2'
    );
  });

  it('still activates a cell with Enter and Space', async () => {
    const user = userEvent.setup();
    const onCellActivate = vi.fn();
    render(<SceneGridView state={makeScene()} onCellActivate={onCellActivate} />);

    focusCell(/Cell 1, 1/i);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onCellActivate).toHaveBeenCalledTimes(2);
    expect(onCellActivate).toHaveBeenCalledWith({ x: 0, y: 0 });
  });
});

describe('Modal focus trap', () => {
  it('cycles past a DISABLED control instead of leaking focus at it', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Behind the modal</button>
        <ConfirmDialog
          open
          title="Delete Character"
          description="This cannot be undone."
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      </>
    );

    const dialog = screen.getByRole('alertdialog');
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' });
    const confirm = within(dialog).getByRole('button', { name: 'Confirm' });

    // Disable the LAST control, the position the wrap-around keys off. With the
    // old selector this element still counted as the cycle's `last`, so the
    // wrap never fired and Tab walked out of the modal.
    confirm.setAttribute('disabled', '');
    cancel.focus();
    await user.tab();

    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(cancel).toHaveFocus();
  });

  it('restores focus to the opener when it closes', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const view = render(
      <ConfirmDialog
        open
        title="Delete Character"
        description="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    view.rerender(
      <ConfirmDialog
        open={false}
        title="Delete Character"
        description="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(opener).toHaveFocus();
    opener.remove();
  });
});
