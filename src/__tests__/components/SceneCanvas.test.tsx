import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SceneCanvas } from '../../components/SceneCanvas';
import type { SceneState } from '../../types/core/scene';

function makeState(): SceneState {
  return {
    sceneId: 'scene-1',
    name: 'Training Yard',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 4, height: 3, cellSize: 70 },
    tokens: {
      hero: { id: 'hero', name: 'Hero', kind: 'character', position: { x: 1, y: 1 }, size: 1 },
      scout: {
        id: 'scout',
        name: 'Scout Captain',
        kind: 'npc',
        position: { x: 2, y: 1 },
        size: 1,
      },
    },
    markers: {},
    initiative: [],
    round: 2,
    activeTokenId: 'hero',
    seed: 'scene-seed',
    checkLog: [],
    oracleLog: [],
  };
}

// The 4x3 grid at 70px/cell is 280x210. happy-dom reports a zero-size rect, so
// stub getBoundingClientRect to the real geometry for deterministic hit-testing.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 280,
    bottom: 210,
    width: 280,
    height: 210,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
});

describe('SceneCanvas', () => {
  it('renders a canvas sized to the grid with a descriptive label', () => {
    render(<SceneCanvas state={makeState()} />);

    const canvas = screen.getByTestId('scene-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '280');
    expect(canvas).toHaveAttribute('height', '210');
    // The accessible label summarizes the scene and token positions.
    expect(canvas).toHaveAccessibleName(/Training Yard grid, 4 by 3/i);
    expect(canvas).toHaveAccessibleName(/Hero at 2, 2/i);
  });

  it('activates the token under a click, not the cell', () => {
    const onCellActivate = vi.fn();
    const onTokenActivate = vi.fn();
    render(
      <SceneCanvas
        state={makeState()}
        onCellActivate={onCellActivate}
        onTokenActivate={onTokenActivate}
      />
    );

    // Center of cell (1,1) where Hero stands: pixel (105, 105).
    fireEvent.click(screen.getByTestId('scene-canvas'), { clientX: 105, clientY: 105 });

    expect(onTokenActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'hero' }));
    expect(onCellActivate).not.toHaveBeenCalled();
  });

  it('activates an empty cell when no token is under the click', () => {
    const onCellActivate = vi.fn();
    const onTokenActivate = vi.fn();
    render(
      <SceneCanvas
        state={makeState()}
        onCellActivate={onCellActivate}
        onTokenActivate={onTokenActivate}
      />
    );

    // Empty bottom-right cell (3,2): pixel (245, 175).
    fireEvent.click(screen.getByTestId('scene-canvas'), { clientX: 245, clientY: 175 });

    expect(onCellActivate).toHaveBeenCalledWith({ x: 3, y: 2 });
    expect(onTokenActivate).not.toHaveBeenCalled();
  });

  it('ignores clicks outside the grid bounds', () => {
    const onCellActivate = vi.fn();
    const onTokenActivate = vi.fn();
    render(
      <SceneCanvas
        state={makeState()}
        onCellActivate={onCellActivate}
        onTokenActivate={onTokenActivate}
      />
    );

    fireEvent.click(screen.getByTestId('scene-canvas'), { clientX: 500, clientY: 500 });

    expect(onCellActivate).not.toHaveBeenCalled();
    expect(onTokenActivate).not.toHaveBeenCalled();
  });

  it('re-activates the selected token on Enter (minimal keyboard parity)', () => {
    const onTokenActivate = vi.fn();
    render(
      <SceneCanvas
        state={makeState()}
        selectedTokenId="scout"
        onCellActivate={vi.fn()}
        onTokenActivate={onTokenActivate}
      />
    );

    fireEvent.keyDown(screen.getByTestId('scene-canvas'), { key: 'Enter' });

    expect(onTokenActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'scout' }));
  });

  it('is non-interactive (not focusable) when no callbacks are provided', () => {
    render(<SceneCanvas state={makeState()} />);
    expect(screen.getByTestId('scene-canvas')).toHaveAttribute('tabindex', '-1');
  });
});
