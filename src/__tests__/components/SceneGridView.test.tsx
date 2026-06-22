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
    oracleLog: [],
  };
}

describe('SceneGridView — background map', () => {
  it('renders the map image when a registration and url are supplied', () => {
    const state = makeState();
    state.map = { assetHash: 'h1', pixelsPerCell: 70, offsetX: 0, offsetY: 0 };
    const { container } = render(
      <SceneGridView state={state} mapImageUrl="data:image/png;base64,AAAA" />
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('data:image/png;base64,AAAA');
  });

  it('renders no map image when there is no registration', () => {
    const { container } = render(<SceneGridView state={makeState()} />);
    expect(container.querySelector('img')).toBeNull();
  });
});

describe('SceneGridView', () => {
  it('colors and labels tokens by combat side, not kind', () => {
    const state = makeState();
    // A monster (default hostile) and a monster re-sided as an ally.
    state.tokens = {
      ...state.tokens,
      orc: { id: 'orc', name: 'Orc', kind: 'monster', position: { x: 0, y: 2 }, size: 1 },
      ally: {
        id: 'ally',
        name: 'Sworn Guard',
        kind: 'monster',
        position: { x: 1, y: 2 },
        size: 1,
        allegiance: 'party',
      },
    };
    render(<SceneGridView state={state} />);

    // Labels carry the side word.
    expect(screen.getByRole('button', { name: /Token Orc, enemy/i })).toBeInTheDocument();
    const ally = screen.getByRole('button', { name: /Token Sworn Guard, ally/i });
    const orc = screen.getByRole('button', { name: /Token Orc, enemy/i });
    // The allied monster is colored as party; the hostile one as destructive.
    expect(ally).toHaveClass('bg-primary/15');
    expect(orc).toHaveClass('bg-destructive/15');
  });

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
