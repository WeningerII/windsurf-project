import { memo, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type {
  SceneAllegiance,
  SceneCoordinate,
  SceneGrid,
  SceneMapRegistration,
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

export interface SceneGridViewProps {
  state: SceneState;
  selectedTokenId?: string;
  onCellActivate?: (position: SceneCoordinate) => void;
  onTokenActivate?: (token: SceneToken) => void;
  /** Resolved data URL of the registered background map asset, if any. */
  mapImageUrl?: string;
}

/**
 * The background map, positioned by its registration. The image is placed in
 * grid-relative percentages — its size and origin offset are expressed against
 * the grid's total span in image pixels (cells x pixels-per-cell) — so it scales
 * with the responsive grid without measuring the container. The GM corrects the
 * pixels-per-cell and offset until the art's squares line up with the grid.
 */
function MapBackground({
  imageUrl,
  registration,
  grid,
}: {
  imageUrl: string;
  registration: SceneMapRegistration;
  grid: SceneGrid;
}) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const spanX = grid.width * registration.pixelsPerCell;
  const spanY = grid.height * registration.pixelsPerCell;
  const placed = natural && spanX > 0 && spanY > 0;
  return (
    <img
      src={imageUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      onLoad={(event) =>
        setNatural({ w: event.currentTarget.naturalWidth, h: event.currentTarget.naturalHeight })
      }
      className="pointer-events-none absolute select-none"
      style={
        placed
          ? {
              left: `${(-registration.offsetX / spanX) * 100}%`,
              top: `${(-registration.offsetY / spanY) * 100}%`,
              width: `${(natural.w / spanX) * 100}%`,
              height: `${(natural.h / spanY) * 100}%`,
              opacity: 0.85,
            }
          : { opacity: 0, width: 1, height: 1, left: 0, top: 0 }
      }
    />
  );
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
  onCellActivate,
  onTokenActivate,
  mapImageUrl,
}: SceneGridViewProps) {
  const hasMap = Boolean(state.map && mapImageUrl);
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
        role="grid"
        aria-label={`${state.name} grid`}
        className="relative grid overflow-hidden rounded-lg border bg-card"
        style={{
          gridTemplateColumns: `repeat(${state.grid.width}, minmax(2rem, 1fr))`,
        }}
      >
        {hasMap && state.map && (
          <MapBackground imageUrl={mapImageUrl!} registration={state.map} grid={state.grid} />
        )}
        {Array.from({ length: state.grid.height }).flatMap((_, y) =>
          Array.from({ length: state.grid.width }).map((__, x) => {
            const position = { x, y };
            const key = cellKey(position);
            const cellTokens = tokensByCell.get(key) ?? [];
            const marker = markerByCell.get(key);
            const footprintToken = largeTokenFootprintByCell.get(key);
            return (
              <div
                key={key}
                role="gridcell"
                aria-label={buildCellLabel(position, marker, cellTokens)}
                tabIndex={0}
                className={cn(
                  'relative aspect-square min-h-8 border-b border-r border-border/70 p-0.5 outline-none transition-colors',
                  // Transparent over a background map so the art shows through;
                  // opaque otherwise (unchanged default).
                  hasMap ? 'bg-transparent' : 'bg-background',
                  marker?.kind === 'terrain' && 'bg-emerald-500/10',
                  marker?.kind === 'hazard' && 'bg-amber-500/15',
                  // A multi-cell creature's reserved footprint, shaded so the
                  // space it occupies beyond its anchor chip is visible.
                  footprintToken &&
                    (footprintToken.kind === 'character'
                      ? 'bg-primary/10'
                      : 'bg-muted-foreground/15'),
                  onCellActivate &&
                    'cursor-pointer hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'
                )}
                onClick={() => onCellActivate?.(position)}
                onKeyDown={(event) => handleCellKeyDown(event, () => onCellActivate?.(position))}
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
          })
        )}
      </div>
    </section>
  );
});

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

function handleCellKeyDown(event: KeyboardEvent<HTMLDivElement>, callback: () => void): void {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }
  event.preventDefault();
  callback();
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
