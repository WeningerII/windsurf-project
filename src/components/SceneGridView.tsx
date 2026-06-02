import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { SceneCoordinate, SceneMarker, SceneState, SceneToken } from '../types/core/scene';

export interface SceneGridViewProps {
  state: SceneState;
  selectedTokenId?: string;
  onCellActivate?: (position: SceneCoordinate) => void;
  onTokenActivate?: (token: SceneToken) => void;
}

export function SceneGridView({
  state,
  selectedTokenId,
  onCellActivate,
  onTokenActivate,
}: SceneGridViewProps) {
  const tokensByCell = buildTokensByCell(state);
  const markers = Object.values(state.markers);

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
        className="grid overflow-hidden rounded-lg border bg-card"
        style={{
          gridTemplateColumns: `repeat(${state.grid.width}, minmax(2rem, 1fr))`,
        }}
      >
        {Array.from({ length: state.grid.height }).flatMap((_, y) =>
          Array.from({ length: state.grid.width }).map((__, x) => {
            const position = { x, y };
            const cellKey = coordinateKey(position);
            const cellTokens = tokensByCell.get(cellKey) ?? [];
            const marker = markers.find((entry) => markerContains(entry, position));
            return (
              <div
                key={cellKey}
                role="gridcell"
                aria-label={buildCellLabel(position, marker, cellTokens)}
                tabIndex={0}
                className={cn(
                  'relative aspect-square min-h-8 border-b border-r border-border/70 bg-background p-0.5 outline-none transition-colors',
                  marker?.kind === 'terrain' && 'bg-emerald-500/10',
                  marker?.kind === 'hazard' && 'bg-amber-500/15',
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
                        token.kind === 'character'
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-muted-foreground/30 bg-muted text-foreground',
                        selectedTokenId === token.id && 'ring-2 ring-ring ring-offset-1',
                        ((token.hp && token.hp.current <= 0) || token.conditions?.incapacitated) &&
                          'opacity-40 grayscale'
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
                      {token.statuses && token.statuses.length > 0 && (
                        <span
                          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-background bg-amber-500"
                          title={token.statuses.join(', ')}
                          aria-hidden="true"
                        />
                      )}
                      {token.hp && <TokenHpBar hp={token.hp} />}
                      {!token.hp && token.conditions && (
                        <TokenConditionBadge conditions={token.conditions} />
                      )}
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
}

function buildTokensByCell(state: SceneState): Map<string, SceneToken[]> {
  const byCell = new Map<string, SceneToken[]>();
  Object.values(state.tokens).forEach((token) => {
    const key = coordinateKey(token.position);
    byCell.set(key, [...(byCell.get(key) ?? []), token]);
  });
  return byCell;
}

function markerContains(marker: SceneMarker, position: SceneCoordinate): boolean {
  return (
    position.x >= marker.position.x &&
    position.y >= marker.position.y &&
    position.x < marker.position.x + marker.width &&
    position.y < marker.position.y + marker.height
  );
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

function coordinateKey(position: SceneCoordinate): string {
  return `${position.x}:${position.y}`;
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

/** The most severe active condition's short label, or undefined when unharmed. */
function topCondition(conditions: NonNullable<SceneToken['conditions']>): string | undefined {
  if (conditions.incapacitated) return 'Incap';
  if (conditions.staggered) return 'Stag';
  if (conditions.dazed) return 'Dazed';
  if (conditions.bruised > 0) return `Bruise×${conditions.bruised}`;
  return undefined;
}

/** Token aria-label, including HP or condition state when the token is a combatant. */
function buildTokenLabel(token: SceneToken): string {
  const statuses =
    token.statuses && token.statuses.length > 0 ? `, ${token.statuses.join(', ')}` : '';
  const death = token.deathSaves
    ? `, death saves ${token.deathSaves.successes}/3 successes, ${token.deathSaves.failures}/3 failures`
    : '';
  if (token.hp) {
    return `Token ${token.name}, ${Math.max(0, token.hp.current)} of ${token.hp.max} HP${statuses}${death}`;
  }
  if (token.conditions) {
    const top = topCondition(token.conditions);
    return top
      ? `Token ${token.name}, ${top}${statuses}`
      : `Token ${token.name}, unharmed${statuses}`;
  }
  return `Token ${token.name}${statuses}`;
}

/** A small condition badge for HP-less combatants (M&M condition track). */
function TokenConditionBadge({
  conditions,
}: {
  conditions: NonNullable<SceneToken['conditions']>;
}) {
  const top = topCondition(conditions);
  if (!top) return null;
  const color = conditions.incapacitated
    ? 'bg-red-600'
    : conditions.staggered
      ? 'bg-amber-600'
      : 'bg-slate-500';
  return (
    <span
      className={cn(
        'absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1 text-[8px] font-bold leading-tight text-white',
        color
      )}
      aria-hidden="true"
    >
      {top}
    </span>
  );
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
