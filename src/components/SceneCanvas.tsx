/**
 * Phase-6 scene canvas: a `<canvas>` presentation of the current scene, an
 * opt-in alternative to the DOM `SceneGridView`. It is a pure VIEW over the
 * existing `SceneState` — it paints the grid, markers, token footprints and
 * token chips, and hit-tests clicks back into the SAME `onCellActivate` /
 * `onTokenActivate` callbacks the DOM grid uses. It dispatches no intents itself
 * and never touches `runtime.ts`; SceneManager keeps ownership of turning a cell
 * click into an existing `place-token` / `move-token` intent.
 *
 * All pixel<->cell arithmetic lives in the framework-free `scene/canvasGeometry`
 * module so it is unit-testable without a 2D context (happy-dom / jsdom provide
 * none); the draw pass here degrades to a no-op when `getContext('2d')` is null,
 * and the pointer/keyboard hit-testing keeps working regardless.
 *
 * Layer boundary: imports only shared modules and core scene types — never
 * `src/systems/**`.
 */
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { SceneCoordinate, SceneMarker, SceneState, SceneToken } from '../types/core/scene';
import { tokenAllegiance } from '../scene/allegiance';
import { footprintCells } from '../scene/grid';
import { cellOrigin, pointToCell, sceneCanvasGeometry, tokenAtCell } from '../scene/canvasGeometry';

/** Canvas fill/stroke colors by combat side. Fixed values (a canvas cannot read
 * Tailwind classes); chosen to read on both light and dark card backdrops. */
const ALLEGIANCE_COLORS: Record<
  ReturnType<typeof tokenAllegiance>,
  { fill: string; stroke: string; text: string }
> = {
  party: { fill: 'rgba(59,130,246,0.22)', stroke: 'rgba(59,130,246,0.85)', text: '#1d4ed8' },
  hostile: { fill: 'rgba(239,68,68,0.22)', stroke: 'rgba(239,68,68,0.85)', text: '#b91c1c' },
  neutral: { fill: 'rgba(120,120,130,0.22)', stroke: 'rgba(120,120,130,0.85)', text: '#3f3f46' },
};

const MARKER_FILL: Record<SceneMarker['kind'], string> = {
  terrain: 'rgba(16,185,129,0.14)',
  hazard: 'rgba(245,158,11,0.18)',
};

export interface SceneCanvasProps {
  state: SceneState;
  selectedTokenId?: string;
  /** Requested cell edge in CSS px; clamped by the geometry. Defaults to the
   * scene's own `grid.cellSize`. */
  cellSize?: number;
  onCellActivate?: (position: SceneCoordinate) => void;
  onTokenActivate?: (token: SceneToken) => void;
}

/**
 * Memoized like SceneGridView: SceneManager re-renders on every controlled-input
 * keystroke, and repainting a canvas on each is wasteful. With stable callbacks
 * prop equality skips the effect entirely.
 */
export const SceneCanvas = memo(function SceneCanvas({
  state,
  selectedTokenId,
  cellSize,
  onCellActivate,
  onTokenActivate,
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometry = useMemo(
    () => sceneCanvasGeometry(state.grid, cellSize ?? state.grid.cellSize),
    [state.grid, cellSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // happy-dom / jsdom (and any headless env) return null; the view still
    // mounts and stays interactive, it simply paints nothing there.
    if (!ctx) return;
    drawScene(ctx, state, geometry, selectedTokenId);
  }, [state, geometry, selectedTokenId]);

  const resolveCell = useCallback(
    (clientX: number, clientY: number): SceneCoordinate | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return pointToCell(
        { x: clientX - rect.left, y: clientY - rect.top },
        geometry,
        rect.width || geometry.width,
        rect.height || geometry.height
      );
    },
    [geometry]
  );

  const activateAt = useCallback(
    (position: SceneCoordinate) => {
      // Same separation the DOM grid enforces: a click on a token selects it,
      // an empty cell activates the cell — both flow through the existing
      // callbacks, so the dispatched intent is unchanged.
      const token = tokenAtCell(state, position);
      if (token) onTokenActivate?.(token);
      else onCellActivate?.(position);
    },
    [state, onCellActivate, onTokenActivate]
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLCanvasElement>) => {
      const position = resolveCell(event.clientX, event.clientY);
      if (position) activateAt(position);
    },
    [resolveCell, activateAt]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
      // Keyboard parity is intentionally minimal on the canvas (the DOM grid
      // remains the fully keyboard-navigable surface): Enter/Space re-activates
      // the currently selected token so it can be moved via the panel flow.
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const selected = selectedTokenId ? state.tokens[selectedTokenId] : undefined;
      if (!selected) return;
      event.preventDefault();
      onTokenActivate?.(selected);
    },
    [selectedTokenId, state.tokens, onTokenActivate]
  );

  const interactive = Boolean(onCellActivate || onTokenActivate);
  const visibleTokens = Object.values(state.tokens).filter((token) => !token.hidden);

  return (
    <section className="space-y-3" aria-label={`${state.name} scene canvas`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{state.name}</h2>
          <p className="text-sm text-muted-foreground">
            Round {state.round}
            {state.activeTokenId
              ? `, active ${state.tokens[state.activeTokenId]?.name ?? 'token'}`
              : ''}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {state.grid.width} x {state.grid.height}
        </div>
      </div>
      <div className="overflow-auto rounded-lg border bg-card p-1">
        <canvas
          ref={canvasRef}
          width={geometry.width}
          height={geometry.height}
          data-testid="scene-canvas"
          role="img"
          aria-label={buildCanvasLabel(state, visibleTokens)}
          tabIndex={interactive ? 0 : -1}
          className="block max-w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? handleClick : undefined}
          onKeyDown={interactive ? handleKeyDown : undefined}
        />
      </div>
    </section>
  );
});

/** A text summary of what the canvas shows, for assistive tech (a canvas has no
 * accessible sub-tree of its own). */
function buildCanvasLabel(state: SceneState, tokens: SceneToken[]): string {
  const head = `${state.name} grid, ${state.grid.width} by ${state.grid.height}`;
  if (tokens.length === 0) return `${head}, no tokens placed`;
  const names = tokens
    .map((token) => `${token.name} at ${token.position.x + 1}, ${token.position.y + 1}`)
    .join('; ');
  return `${head}. Tokens: ${names}`;
}

/** Paint the whole scene. Pure of React; safe to call only with a real 2D ctx. */
function drawScene(
  ctx: CanvasRenderingContext2D,
  state: SceneState,
  geometry: ReturnType<typeof sceneCanvasGeometry>,
  selectedTokenId: string | undefined
): void {
  const { cell, width, height } = geometry;
  ctx.clearRect(0, 0, width, height);

  // Markers (drawn under everything so tokens/gridlines paint on top).
  for (const marker of Object.values(state.markers)) {
    const { x, y } = cellOrigin(marker.position, cell);
    ctx.fillStyle = MARKER_FILL[marker.kind];
    ctx.fillRect(x, y, marker.width * cell, marker.height * cell);
  }

  // Multi-cell token footprints, shaded so a large creature visibly fills its
  // space (the chip itself is drawn in the anchor cell below).
  for (const token of Object.values(state.tokens)) {
    if (token.hidden || token.size <= 1) continue;
    const colors = ALLEGIANCE_COLORS[tokenAllegiance(token)];
    ctx.fillStyle = colors.fill;
    for (const footprint of footprintCells(token.position, token.size)) {
      const { x, y } = cellOrigin(footprint, cell);
      ctx.fillRect(x, y, cell, cell);
    }
  }

  // Gridlines.
  ctx.strokeStyle = 'rgba(120,120,130,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let col = 0; col <= geometry.cols; col += 1) {
    const px = Math.min(col * cell + 0.5, width - 0.5);
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
  }
  for (let row = 0; row <= geometry.rows; row += 1) {
    const py = Math.min(row * cell + 0.5, height - 0.5);
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
  }
  ctx.stroke();

  // Token chips in their anchor cell.
  for (const token of Object.values(state.tokens)) {
    if (token.hidden) continue;
    drawTokenChip(ctx, token, cell, token.id === selectedTokenId);
  }
}

function drawTokenChip(
  ctx: CanvasRenderingContext2D,
  token: SceneToken,
  cell: number,
  selected: boolean
): void {
  const colors = ALLEGIANCE_COLORS[tokenAllegiance(token)];
  const { x, y } = cellOrigin(token.position, cell);
  const cx = x + cell / 2;
  const cy = y + cell / 2;
  const radius = Math.max(4, cell * 0.36);

  const downed = token.hp ? token.hp.current <= 0 : false;
  ctx.globalAlpha = downed ? 0.4 : 1;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = colors.fill;
  ctx.fill();
  ctx.lineWidth = selected ? 3 : 1.5;
  ctx.strokeStyle = selected ? 'rgba(30,64,175,0.95)' : colors.stroke;
  ctx.stroke();

  ctx.fillStyle = colors.text;
  ctx.font = `${Math.max(8, Math.round(cell * 0.32))}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tokenInitials(token), cx, cy);

  // HP bar under the chip.
  if (token.hp && token.hp.max > 0) {
    const fraction = Math.max(0, Math.min(1, token.hp.current / token.hp.max));
    const barWidth = radius * 1.6;
    const barX = cx - barWidth / 2;
    const barY = cy + radius + 2;
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(120,120,130,0.4)';
    ctx.fillRect(barX, barY, barWidth, 3);
    ctx.fillStyle = fraction > 0.5 ? '#10b981' : fraction > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(barX, barY, barWidth * fraction, 3);
  }

  ctx.globalAlpha = 1;
}

function tokenInitials(token: SceneToken): string {
  const initials = token.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  return initials || token.id.slice(0, 2).toUpperCase();
}
