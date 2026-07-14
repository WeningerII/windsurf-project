import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface OverflowMenuItem {
  /** Row text; doubles as the menu item's accessible name. */
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  /** Styles the row as a destructive action (e.g. Delete). */
  destructive?: boolean;
}

interface OverflowMenuProps {
  /** Accessible name for the '…' trigger button (and the menu itself). */
  label: string;
  items: OverflowMenuItem[];
  /** Wrapper classes, e.g. absolute positioning on cards. Defaults to inline `relative`. */
  className?: string;
  /** Extra trigger classes, e.g. the hover-reveal pattern on cards. */
  triggerClassName?: string;
}

/**
 * Minimal '…' overflow menu: aria-haspopup trigger, backdrop outside-click
 * and Escape both close (Escape and item selection refocus the trigger, so
 * a follow-up ConfirmDialog restores focus there too). Same backdrop
 * pattern as UserMenu; no external menu dependency.
 */
export function OverflowMenu({ label, items, className, triggerClassName }: OverflowMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Dismiss only the menu — swallow the event so it does not also reach
        // App's global Escape shortcut (which closes the whole sheet). Both are
        // window keydown listeners; App's registers first and runs in the
        // bubble phase, so a capture-phase stopPropagation here is what
        // reliably pre-empts it and keeps Escape scoped to the open menu.
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey, { capture: true });
    return () => window.removeEventListener('keydown', handleKey, { capture: true });
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-haspopup="menu"
        aria-expanded={open}
        title={label}
        aria-label={label}
        className={triggerClassName}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            aria-label={label}
            className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border bg-card py-1 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                  item.onSelect();
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                  item.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'hover:bg-muted/50'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
