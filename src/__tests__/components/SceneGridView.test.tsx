import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SceneGridView } from '../../components/SceneGridView';
import type { SceneState } from '../../types/core/scene';

function makeState(): SceneState {
  return {
    sceneId: 'scene-1',
    name: 'Training Yard',
    systemId: 'dnd-5e-2024',
    grid: {
      type: 'square',
      width: 4,
      height: 3,
      cellSize: 70,
    },
    tokens: {
      hero: {
        id: 'hero',
        name: 'Hero',
        kind: 'character',
        position: { x: 1, y: 1 },
        size: 1,
      },
      scout: {
        id: 'scout',
        name: 'Scout Captain',
        kind: 'npc',
        position: { x: 2, y: 1 },
        size: 1,
      },
    },
    markers: {
      fire: {
        id: 'fire',
        kind: 'hazard',
        label: 'Fire',
        position: { x: 0, y: 0 },
        width: 2,
        height: 1,
      },
    },
    initiative: [
      { tokenId: 'hero', value: 16 },
      { tokenId: 'scout', value: 12 },
    ],
    round: 2,
    activeTokenId: 'hero',
    seed: 'scene-seed',
    checkLog: [],
  };
}

describe('SceneGridView', () => {
  it('renders scene state as a manual grid surface', () => {
    render(<SceneGridView state={makeState()} selectedTokenId="hero" />);

    expect(screen.getByRole('grid', { name: /Training Yard grid/i })).toBeInTheDocument();
    expect(screen.getByText('Round 2, active Hero')).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /Cell 1, 1, Fire/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Token Hero/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: /Token Scout Captain/i })).toHaveTextContent('SC');
  });

  it('activates cells and tokens separately', () => {
    const onCellActivate = vi.fn();
    const onTokenActivate = vi.fn();

    render(
      <SceneGridView
        state={makeState()}
        onCellActivate={onCellActivate}
        onTokenActivate={onTokenActivate}
      />
    );

    fireEvent.click(screen.getByRole('gridcell', { name: /Cell 4, 3/i }));
    fireEvent.click(screen.getByRole('button', { name: /Token Hero/i }));

    expect(onCellActivate).toHaveBeenCalledWith({ x: 3, y: 2 });
    expect(onCellActivate).toHaveBeenCalledTimes(1);
    expect(onTokenActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'hero' }));
  });

  it('supports keyboard cell activation', () => {
    const onCellActivate = vi.fn();
    render(<SceneGridView state={makeState()} onCellActivate={onCellActivate} />);

    fireEvent.keyDown(screen.getByRole('gridcell', { name: /Cell 4, 3/i }), {
      key: 'Enter',
    });

    expect(onCellActivate).toHaveBeenCalledWith({ x: 3, y: 2 });
  });
});
