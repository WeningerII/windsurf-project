import { memo, useCallback, useMemo, useState } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import { cn } from '@/lib/utils';
import { mapImageLayerStyle } from './scene/mapImageLayer';
import type {
  SceneAllegiance,
  SceneCoordinate,
  SceneGridRegistration,
  SceneMarker,
  SceneState,
  SceneToken,
} from '../types/core/scene';
import { cellKey, footprintCells } from '../scene/grid';
import { tokenAllegiance } from '../scene/allegiance';

/** Token chip colors by combat side: party blue, hostile red, neutral muted. */
const ALLEGIANCE_TOKEN_CLASS: Record<SceneAllegiance, string> = {
  party: 'border-primary/40 bg-primary/15 text-primary',
  hostile: 'border-destructive/40 bg-destructive/15 text-destructive',
  neutral: 'border-muted-foreground/30 bg-muted text-foreground',
};

/** Human-readable side word for token labels/tooltips. */
const ALLEGIANCE_LABEL: Record<SceneAllegiance, string> = {
  party: 'ally',
  hostile: 'enemy',
  neutral: 'neutral',
};

/** A resolved map backdrop: the asset's data URL plus its grid registration. */
export interface SceneMapImage {
  dataUrl: string;
  registration: SceneGridRegistration;
}

export interface SceneGridViewProps {
  state: SceneState;
  selectedTokenId?: string;
  /**
   * Optional map image rendered under the grid cells (RFC 006 Phase 9). The
   * caller resolves the scene's `map.assetHash` against local asset storage;
   * when the asset is missing this is simply omitted and the grid renders
   * exactly as it always has (graceful absence).
   */
  mapImage?: SceneMapImage;
  onCellActivate?: (position: SceneCoordinate) => void;
  onTokenActivate?: (token: SceneToken) => void;
  /**
   * Optional ref to the grid container (Phase 4). The interim drag drop target
   * registers this element and hit-tests the pointer against the per-cell
   * `data-scene-cell` / `data-x` / `data-y` attributes below. Purely additive:
   * the click/keyboard `onCellActivate` contract and all aria are unchanged.
   */
  gridRef?: Ref<HTMLDivElement>;
}

/**
 * Memoized: SceneManager re-renders on every keystroke of its controlled
 * inputs, and this view rebuilds width x height cells. With stable callbacks
 * from the parent, prop equality skips the rebuild entirely; the
 * cell-to-marker index turns the per-cell `markers.find` (O(cells x markers))
 * into a map hit.
 */
export const SceneGridView = memo(function SceneGridView({
  state,
  selectedTokenId,
  mapImage,
  onCellActivate,
  onTokenActivate,
  gridRef,
}: SceneGridViewProps) {
  // Roving-tabindex anchor for the grid (WAI-ARIA grid pattern). The DOM grid
  // is the fully keyboard-accessible scene surface, and before this every one
  // of width x height cells was a Tab stop — a 20x20 scene cost 400 presses to
  // step past. Now the grid is ONE stop and arrows move between cells.
  const [focusedCell, setFocusedCell] = useState<SceneCoordinate>({ x: 0, y: 0 });
  const anchor = {
    x: Math.min(focusedCell.x, Math.max(0, state.grid.width - 1)),
    y: Math.min(focusedCell.y, Math.max(0, state.grid.height - 1)),
  };

  const handleCellKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, position: SceneCoordinate) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onCellActivate?.(position);
        return;
      }
      const next = nextCell(event.key, position, state.grid);
      if (!next) return;
      // Consume the key even at an edge, so an arrow inside the grid never
      // scrolls the page out from under the user mid-traversal.
      event.preventDefault();
      if (next.x === position.x && next.y === position.y) return;
      setFocusedCell(next);
      event.currentTarget
        .closest('[role="grid"]')
        ?.querySelector<HTMLElement>(`[data-scene-cell][data-x="${next.x}"][data-y="${next.y}"]`)
        ?.focus();
    },
    [onCellActivate, state.grid]
  );

  const tokensByCell = useMemo(() => buildTokensByCell(state), [state]);
  // Cells covered by a multi-cell token's footprint (the chip renders in the
  // anchor cell; this lets the other cells it occupies be shaded so a large
  // creature visibly takes up its whole space).
  const largeTokenFootprintByCell = useMemo(() => {
    const index = new Map<string, SceneToken>();
    for (const token of Object.values(state.tokens)) {
      if (token.size <= 1) continue;
      for (const cell of footprintCells(token.position, token.size)) {
        const key = cellKey(cell);
        if (!index.has(key)) index.set(key, token);
      }
    }
    return index;
  }, [state.tokens]);
  const markerByCell = useMemo(() => {
    const index = new Map<string, SceneMarker>();
    for (const marker of Object.values(state.markers)) {
      for (let dy = 0; dy < marker.height; dy += 1) {
        for (let dx = 0; dx < marker.width; dx += 1) {
          const key = cellKey({ x: marker.position.x + dx, y: marker.position.y + dy });
          if (!index.has(key)) {
            index.set(key, marker);
          }
        }
      }
    }
    return index;
  }, [state.markers]);

  return (
    <section className="space-y-3" aria-label={`${state.name} scene`}>
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
      <div
        ref={gridRef}
        role="grid"
        aria-label={`${state.name} grid`}
        aria-rowcount={state.grid.height}
        aria-colcount={state.grid.width}
        className="relative grid overflow-hidden rounded-lg border bg-card"
        style={{
          gridTemplateColumns: `repeat(${state.grid.width}, minmax(2rem, 1fr))`,
        }}
      >
        {/* Backdrop first in DOM: the (also-positioned) cells paint above it. */}
        {mapImage && <SceneMapImageLayer grid={state.grid} mapImage={mapImage} />}
        {Array.from({ length: state.grid.height }).map((_, y) => (
          // `role="grid"` REQUIRES row children — a gridcell parented directly
          // by the grid is an invalid structure (axe aria-required-children /
          // aria-required-parent, both serious). `display: contents` supplies
          // the row semantics while leaving the CSS grid placement of the cells
          // exactly as it was, so the visual layout is byte-for-byte unchanged.
          <div key={`row-${y}`} role="row" aria-rowindex={y + 1} style={{ display: 'contents' }}>
            {Array.from({ length: state.grid.width }).map((__, x) => {
              const position = { x, y };
              const key = cellKey(position);
              const cellTokens = tokensByCell.get(key) ?? [];
              const marker = markerByCell.get(key);
              const footprintToken = largeTokenFootprintByCell.get(key);
              return (
                <div
                  key={key}
                  role="gridcell"
                  aria-colindex={x + 1}
                  aria-label={buildCellLabel(position, marker, cellTokens)}
                  tabIndex={x === anchor.x && y === anchor.y ? 0 : -1}
                  data-scene-cell=""
                  data-x={x}
                  data-y={y}
                  className={cn(
                    'relative aspect-square min-h-8 border-b border-r border-border/70 p-0.5 outline-none transition-colors',
                    // With a map backdrop the cells go transparent so the image
                    // shows through the gridlines; without one, exactly as before.
                    mapImage ? 'bg-transparent' : 'bg-background',
                    marker?.kind === 'terrain' && 'bg-emerald-500/10',
                    marker?.kind === 'hazard' && 'bg-amber-500/15',
                    // A multi-cell creature's reserved footprint, shaded so the
                    // space it occupies beyond its anchor chip is visible.
                    footprintToken &&
                      (footprintToken.kind === 'character'
                        ? 'bg-primary/10'
                        : 'bg-muted-foreground/15'),
                    // The ring is NOT gated on onCellActivate: the cells are
                    // focusable either way, and a focusable element with
                    // `outline-none` and no replacement ring has no visible
                    // focus indicator at all (WCAG 2.4.7).
                    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                    onCellActivate && 'cursor-pointer hover:bg-muted'
                  )}
                  onClick={() => onCellActivate?.(position)}
                  onFocus={() => setFocusedCell(position)}
                  onKeyDown={(event) => handleCellKeyDown(event, position)}
                >
                  {marker && marker.position.x === x && marker.position.y === y && (
                    <span className="absolute left-1 top-1 max-w-[calc(100%-0.5rem)] truncate rounded bg-background/90 px-1 text-[10px] font-medium text-muted-foreground">
                      {marker.label}
                    </span>
                  )}
                  <div className="flex h-full w-full items-center justify-center gap-0.5">
                    {cellTokens.map((token) => (
                      <button
                        key={token.id}
                        type="button"
                        className={cn(
                          'relative flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold shadow-sm transition-colors',
                          // Color by combat side, not kind: an allied monster reads
                          // as an ally, a hostile NPC as an enemy.
                          ALLEGIANCE_TOKEN_CLASS[tokenAllegiance(token)],
                          selectedTokenId === token.id && 'ring-2 ring-ring ring-offset-1',
                          token.hp && token.hp.current <= 0 && 'opacity-40 grayscale'
                        )}
                        title={token.name}
                        aria-label={buildTokenLabel(token)}
                        aria-pressed={selectedTokenId === token.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          onTokenActivate?.(token);
                        }}
                      >
                        {getTokenInitials(token)}
                        {token.hp && <TokenHpBar hp={token.hp} />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
});

/**
 * The map backdrop. Natural size is read from the decoded image itself (the
 * asset stores only hash/mime/dataUrl), so the layer stays hidden until the
 * browser reports real dimensions.
 */
function SceneMapImageLayer({
  grid,
  mapImage,
}: {
  grid: { width: number; height: number };
  mapImage: SceneMapImage;
}) {
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const ready = natural !== null && natural.width > 0 && natural.height > 0;
  return (
    <img
      src={mapImage.dataUrl}
      alt=""
      aria-hidden="true"
      data-testid="scene-map-image"
      draggable={false}
      onLoad={(event) =>
        setNatural({
          width: event.currentTarget.naturalWidth,
          height: event.currentTarget.naturalHeight,
        })
      }
      className="pointer-events-none absolute select-none"
      style={
        ready ? mapImageLayerStyle(natural, mapImage.registration, grid) : { visibility: 'hidden' }
      }
    />
  );
}

function buildTokensByCell(state: SceneState): Map<string, SceneToken[]> {
  const byCell = new Map<string, SceneToken[]>();
  Object.values(state.tokens).forEach((token) => {
    const key = cellKey(token.position);
    byCell.set(key, [...(byCell.get(key) ?? []), token]);
  });
  return byCell;
}

function buildCellLabel(
  position: SceneCoordinate,
  marker: SceneMarker | undefined,
  tokens: SceneToken[]
): string {
  const parts = [`Cell ${position.x + 1}, ${position.y + 1}`];
  if (marker) {
    parts.push(marker.label);
  }
  if (tokens.length > 0) {
    parts.push(tokens.map((token) => token.name).join(', '));
  }
  return parts.join(', ');
}

/**
 * Resolves a grid-navigation key to the cell it should move focus to, clamped
 * to the grid. Returns null for keys the grid does not own, so everything else
 * (Tab out, typing, shortcuts) keeps its default behavior.
 */
function nextCell(
  key: string,
  from: SceneCoordinate,
  grid: { width: number; height: number }
): SceneCoordinate | null {
  const clamp = (position: SceneCoordinate): SceneCoordinate => ({
    x: Math.min(Math.max(position.x, 0), Math.max(0, grid.width - 1)),
    y: Math.min(Math.max(position.y, 0), Math.max(0, grid.height - 1)),
  });
  switch (key) {
    case 'ArrowRight':
      return clamp({ x: from.x + 1, y: from.y });
    case 'ArrowLeft':
      return clamp({ x: from.x - 1, y: from.y });
    case 'ArrowDown':
      return clamp({ x: from.x, y: from.y + 1 });
    case 'ArrowUp':
      return clamp({ x: from.x, y: from.y - 1 });
    // Home/End walk to the ends of the current row.
    case 'Home':
      return clamp({ x: 0, y: from.y });
    case 'End':
      return clamp({ x: grid.width - 1, y: from.y });
    default:
      return null;
  }
}

function getTokenInitials(token: SceneToken): string {
  const initials = token.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  return initials || token.id.slice(0, 2).toUpperCase();
}

/** Token aria-label, including its combat side and current/max HP. */
function buildTokenLabel(token: SceneToken): string {
  const side = ALLEGIANCE_LABEL[tokenAllegiance(token)];
  if (token.hp) {
    return `Token ${token.name}, ${side}, ${Math.max(0, token.hp.current)} of ${token.hp.max} HP`;
  }
  return `Token ${token.name}, ${side}`;
}

/** A thin HP bar under a combatant token, green→amber→red by fraction. */
function TokenHpBar({ hp }: { hp: NonNullable<SceneToken['hp']> }) {
  const fraction = hp.max > 0 ? Math.max(0, Math.min(1, hp.current / hp.max)) : 0;
  const color = fraction > 0.5 ? 'bg-emerald-500' : fraction > 0.25 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <span
      className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 overflow-hidden rounded-full bg-border"
      aria-hidden="true"
    >
      <span
        className={cn('block h-full rounded-full transition-all', color)}
        style={{ width: `${Math.round(fraction * 100)}%` }}
      />
    </span>
  );
}
