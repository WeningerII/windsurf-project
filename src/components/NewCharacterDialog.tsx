import { useEffect, useRef, useState, type FC } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { GameSystemId } from '../types/game-systems';
import type { SystemDataModel } from '../types/core/document';
import type { CharacterDraftOutcome } from '../ai/characterDraftSession';
import { isAiEnabled } from '../ai/gatewayClient';
import { DIALOG_FOCUSABLE_SELECTOR } from './ui/ConfirmDialog';
import { GameSystemSelector } from './GameSystemSelector';
import { AiCharacterDraftPanel } from './AiCharacterDraftPanel';

/**
 * Ask the gateway for a character draft. Loaded on demand so the drafting
 * modules (candidate-pool loaders + creation-plan replay) stay out of the eager
 * index chunk in the shipped, AI-off build. An import failure degrades to the
 * same typed outcome any other AI failure does — the manual path is untouched.
 */
async function draftCharacter(params: {
  systemId: GameSystemId;
  prompt: string;
}): Promise<CharacterDraftOutcome> {
  try {
    const { draftCharacterForSystem } = await import('../ai/characterDraftSession');
    return await draftCharacterForSystem(params);
  } catch {
    return {
      ok: false,
      error: 'AI drafting could not be loaded. Build this character manually instead.',
    };
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called with the picked system id; the parent creates + opens the sheet. */
  onCreate: (systemId: GameSystemId) => void;
  /**
   * Called with an ACCEPTED AI draft's validated system data. The parent
   * persists it through the same create path `onCreate`'s guided flow uses — a
   * draft never reaches storage on its own.
   */
  onCreateDrafted: (systemId: GameSystemId, system: SystemDataModel, name: string) => void;
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
export const NewCharacterDialog: FC<Props> = ({ open, onClose, onCreate, onCreateDrafted }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Default OFF: with `VITE_AI_ENABLED` unset this is false and the dialog is
  // byte-for-byte the system picker it has always been.
  const aiEnabled = isAiEnabled();
  const [mode, setMode] = useState<'template' | 'ai'>('template');
  const [aiSystemId, setAiSystemId] = useState<GameSystemId | null>(null);

  // Each opening starts from the unchanged manual surface.
  useEffect(() => {
    if (!open) return;
    setMode('template');
    setAiSystemId(null);
  }, [open]);

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
        dialogRef.current?.querySelectorAll<HTMLElement>(DIALOG_FOCUSABLE_SELECTOR) ?? []
      ).filter((el) => !el.closest('[aria-hidden="true"],[inert]'));
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
              {mode === 'ai'
                ? 'Pick a game system, then describe the character you want drafted.'
                : 'Pick a game system to start from its SRD template.'}
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

        {/* AI is an alternative ENTRY to the same creation path, never a
            replacement for it: the manual picker below stays exactly as it is,
            and the toggle only exists when the flag is on. */}
        {aiEnabled && (
          <div role="group" aria-label="Creation method" className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={mode === 'template'}
              onClick={() => setMode('template')}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                mode === 'template' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Start from template
            </button>
            <button
              type="button"
              aria-pressed={mode === 'ai'}
              onClick={() => setMode('ai')}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                mode === 'ai' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Draft with AI
            </button>
          </div>
        )}

        {/* In template mode, selecting a system creates the character
            immediately and closes; in AI mode it only chooses the target. */}
        {mode === 'ai' ? (
          <>
            <GameSystemSelector selectedSystem={aiSystemId} onSelect={setAiSystemId} />
            <AiCharacterDraftPanel
              systemId={aiSystemId}
              draft={draftCharacter}
              onAccept={(systemId, system, name) => {
                onCreateDrafted(systemId, system, name);
                onClose();
              }}
            />
          </>
        ) : (
          <GameSystemSelector selectedSystem={null} onSelect={handlePick} />
        )}

        <p className="text-center text-[11px] text-muted-foreground">
          You can also import a character from a JSON backup via the ··· menu on the Characters tab.
        </p>
      </div>
    </div>,
    document.body
  );
};
