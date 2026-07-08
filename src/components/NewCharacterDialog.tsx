import { useEffect, useRef, type FC } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { GameSystemId } from '../types/game-systems';
import { GameSystemSelector } from './GameSystemSelector';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called with the picked system id; the parent creates + opens the sheet. */
  onCreate: (systemId: GameSystemId) => void;
}

/**
 * Portaled system-picker dialog. Replaces the always-visible hero +
 * `GameSystemSelector` grid that used to sit at the top of the home scroll.
 * Embeds the existing `GameSystemSelector` verbatim (so it stays rendered —
 * satisfying knip and the doc-drift RUNTIME_COPY_RULES guard on that file —
 * and keeps its support-note/badge tokens) but rewires its selection to
 * create-and-close instead of highlight-then-action-bar.
 *
 * Portal/backdrop/Escape/focus-trap/inert-root idiom mirrors ConfirmDialog.
 */
export const NewCharacterDialog: FC<Props> = ({ open, onClose, onCreate }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const appRoot = document.getElementById('root');
    appRoot?.setAttribute('inert', '');
    return () => {
      appRoot?.removeAttribute('inert');
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.closest('[aria-hidden="true"]'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const focusIsInDialog = active instanceof HTMLElement && dialogRef.current?.contains(active);
      if (!focusIsInDialog) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handlePick = (systemId: GameSystemId) => {
    onCreate(systemId);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-character-title"
        aria-describedby="new-character-desc"
        className="relative bg-card border rounded-2xl shadow-lg p-6 max-w-3xl w-full mx-4 space-y-5 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="new-character-title" className="text-lg font-semibold tracking-tight">
              New character
            </h2>
            <p id="new-character-desc" className="text-sm text-muted-foreground mt-1">
              Pick a game system to start from its SRD template.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selecting a system here creates the character immediately and closes. */}
        <GameSystemSelector selectedSystem={null} onSelect={handlePick} />

        <p className="text-center text-[11px] text-muted-foreground">
          You can also import a character from a JSON backup via the ··· menu on the Characters tab.
        </p>
      </div>
    </div>,
    document.body
  );
};
