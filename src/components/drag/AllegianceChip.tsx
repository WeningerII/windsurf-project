/**
 * The 3b-ii friendly/hostile classifier chip (Phase 4).
 *
 * A statblock NPC needs an allegiance before it can be placed (buildPlacedToken
 * requires it for the `npc` kind), so this chip is pulled FORWARD on a monster
 * drop. It REUSES ConfirmDialog's portal + `inert` background + Escape + focus
 * plumbing but is a THIN bespoke chooser: ConfirmDialog is strictly two-action
 * (confirm/cancel) and this needs THREE outcomes (Friendly / Hostile / dismiss),
 * so overloading onConfirm/onCancel as allegiance would be wrong. Phase 6
 * relocates/hardens this into the canvas drop-time classify flow.
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import type { SceneAllegiance } from '../../types/core/scene';

interface AllegianceChipProps {
  /** The dropped creature's name, for the prompt. */
  name: string;
  /** Friendly → party, Hostile → hostile. */
  onChoose: (allegiance: SceneAllegiance) => void;
  /** Escape / backdrop / Cancel → snap back, place nothing. */
  onDismiss: () => void;
}

export function AllegianceChip({ name, onChoose, onDismiss }: AllegianceChipProps) {
  const friendlyRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    friendlyRef.current?.focus();

    const appRoot = document.getElementById('root');
    appRoot?.setAttribute('inert', '');

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      appRoot?.removeAttribute('inert');
      window.removeEventListener('keydown', handleKey);
      previousFocusRef.current?.focus();
    };
  }, [onDismiss]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onDismiss} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Place ${name}`}
        className="relative mx-4 w-full max-w-xs space-y-3 rounded-xl border bg-card p-5 shadow-lg animate-in fade-in zoom-in-95"
      >
        <p className="text-sm font-medium">
          Place <span className="font-semibold">{name}</span> as…
        </p>
        <div className="flex gap-2">
          <Button
            ref={friendlyRef}
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onChoose('party')}
          >
            Friendly
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => onChoose('hostile')}
          >
            Hostile
          </Button>
        </div>
        <Button size="sm" variant="ghost" className="w-full" onClick={onDismiss}>
          Cancel
        </Button>
      </div>
    </div>,
    document.body
  );
}
