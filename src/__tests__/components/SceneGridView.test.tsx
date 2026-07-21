import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SceneGridView } from '../../components/SceneGridView';
import { mapImageLayerStyle } from '../../components/scene/mapImageLayer';
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

  describe('map image backdrop (RFC 006 Phase 9)', () => {
    const MAP_DATA_URL = 'data:image/png;base64,bWFwLWltYWdl';
    const registration = { offsetX: 0, offsetY: 0, cellSizePx: 70 };

    it('renders no image and opaque cells without a mapImage (missing-asset fallback)', () => {
      render(<SceneGridView state={makeState()} />);

      expect(screen.queryByTestId('scene-map-image')).not.toBeInTheDocument();
      expect(screen.getByRole('gridcell', { name: /Cell 4, 3/i })).toHaveClass('bg-background');
    });

    it('renders the map under transparent cells, hidden until its size is known', () => {
      render(
        <SceneGridView state={makeState()} mapImage={{ dataUrl: MAP_DATA_URL, registration }} />
      );

      const image = screen.getByTestId('scene-map-image');
      expect(image).toHaveAttribute('src', MAP_DATA_URL);
      expect(image).toHaveAttribute('aria-hidden', 'true');
      // No natural size reported yet: present but not painted.
      expect(image).toHaveStyle({ visibility: 'hidden' });
      expect(screen.getByRole('gridcell', { name: /Cell 4, 3/i })).toHaveClass('bg-transparent');
    });

    it('positions the loaded image from its natural size and registration', () => {
      render(
        <SceneGridView state={makeState()} mapImage={{ dataUrl: MAP_DATA_URL, registration }} />
      );

      const image = screen.getByTestId('scene-map-image');
      // happy-dom never decodes images; report a natural size ourselves.
      Object.defineProperty(image, 'naturalWidth', { value: 280, configurable: true });
      Object.defineProperty(image, 'naturalHeight', { value: 210, configurable: true });
      fireEvent.load(image);

      // 280px at 70px/cell spans the full 4-cell width; 210px the 3-cell height.
      expect(image).toHaveStyle({ left: '0%', top: '0%', width: '100%', height: '100%' });
    });
  });
});

describe('mapImageLayerStyle', () => {
  const grid = { width: 4, height: 3 };

  it('maps a perfectly registered image to the full container', () => {
    expect(
      mapImageLayerStyle(
        { width: 280, height: 210 },
        { offsetX: 0, offsetY: 0, cellSizePx: 70 },
        grid
      )
    ).toEqual({ left: '0%', top: '0%', width: '100%', height: '100%', maxWidth: 'none' });
  });

  it('shifts by the registered pixel offset, in container percentages', () => {
    const style = mapImageLayerStyle(
      { width: 280, height: 210 },
      { offsetX: 35, offsetY: -70, cellSizePx: 70 },
      grid
    );
    // 35px = half a cell of the 4-cell width; -70px = one cell of the 3-cell height.
    expect(style.left).toBe('-12.5%');
    expect(style.top).toBe(`${(70 / 70 / 3) * 100}%`);
  });

  it('scales when the image resolution differs from the display cell size', () => {
    // 140px cells: a 560x420 image still spans exactly the 4x3 grid.
    const style = mapImageLayerStyle(
      { width: 560, height: 420 },
      { offsetX: 0, offsetY: 0, cellSizePx: 140 },
      grid
    );
    expect(style.width).toBe('100%');
    expect(style.height).toBe('100%');
  });

  it('guards against a zero or negative cell size instead of dividing by it', () => {
    const style = mapImageLayerStyle(
      { width: 4, height: 3 },
      { offsetX: 0, offsetY: 0, cellSizePx: 0 },
      grid
    );
    // Falls back to 1px/cell — finite output, never NaN/Infinity.
    expect(style.width).toBe('100%');
    expect(style.height).toBe('100%');
  });
});
