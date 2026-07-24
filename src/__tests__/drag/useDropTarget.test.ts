import { describe, it, expect } from 'vitest';
import { resolveCellFromPoint } from '../../components/drag/useDropTarget';

/** Build a container holding a grid of data-scene-cell divs. */
function buildGrid(
  width: number,
  height: number
): {
  container: HTMLElement;
  cellAt: (x: number, y: number) => HTMLElement;
} {
  const container = document.createElement('div');
  const cells = new Map<string, HTMLElement>();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = document.createElement('div');
      cell.setAttribute('data-scene-cell', '');
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      container.appendChild(cell);
      cells.set(`${x},${y}`, cell);
    }
  }
  return { container, cellAt: (x, y) => cells.get(`${x},${y}`)! };
}

describe('resolveCellFromPoint', () => {
  it('returns the integer cell coordinate for a point over a cell', () => {
    const { container, cellAt } = buildGrid(4, 4);
    const target = cellAt(2, 3);
    const coord = resolveCellFromPoint(50, 60, container, () => target);
    expect(coord).toEqual({ x: 2, y: 3 });
  });

  it('resolves a nested hit (e.g. a token chip inside the cell) to the cell', () => {
    const { container, cellAt } = buildGrid(4, 4);
    const cell = cellAt(1, 1);
    const inner = document.createElement('button');
    cell.appendChild(inner);
    expect(resolveCellFromPoint(10, 10, container, () => inner)).toEqual({ x: 1, y: 1 });
  });

  it('returns null when the point is over no cell', () => {
    const { container } = buildGrid(4, 4);
    const outside = document.createElement('div');
    expect(resolveCellFromPoint(10, 10, container, () => outside)).toBeNull();
    expect(resolveCellFromPoint(10, 10, container, () => null)).toBeNull();
  });

  it('returns null for a cell outside the registered container (a different grid)', () => {
    const { cellAt } = buildGrid(2, 2);
    const otherContainer = document.createElement('div');
    // The hit cell belongs to the first grid, not otherContainer.
    expect(resolveCellFromPoint(10, 10, otherContainer, () => cellAt(0, 0))).toBeNull();
  });

  it('returns null with no container', () => {
    expect(resolveCellFromPoint(10, 10, null, () => document.createElement('div'))).toBeNull();
  });
});
