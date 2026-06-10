import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  /**
   * Primary modifier: matches Ctrl on Windows/Linux and Cmd (meta) on macOS.
   * Avoid combos browsers reserve for themselves (e.g. Ctrl/Cmd+N, +T, +W) —
   * those never reach the page in Chromium.
   */
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

/**
 * Returns the focused editable element when the keyboard event originates
 * from one (text inputs, textareas, selects, or contentEditable hosts), so
 * global shortcuts can yield to native text editing instead of hijacking it.
 */
function getEditableTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return target;
  }

  if (target.isContentEditable) {
    return target;
  }

  // Fallback for environments where `isContentEditable` is not implemented:
  // treat anything inside a [contenteditable] host (except an explicit
  // "false") as editable.
  const editableHost = target.closest('[contenteditable]');
  if (
    editableHost instanceof HTMLElement &&
    editableHost.getAttribute('contenteditable') !== 'false'
  ) {
    return target;
  }

  return null;
}

export const useKeyboardNavigation = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Mid-IME composition keys edit the composition string, never the app.
      if (event.isComposing) {
        return;
      }

      const editableTarget = getEditableTarget(event.target);
      if (editableTarget) {
        // While typing, global shortcuts must not fire (e.g. Ctrl+Z must
        // stay the native text undo). Escape is the one exception: the
        // first press blurs the field; with nothing editable focused, the
        // next press reaches the Escape shortcut below.
        if (event.key === 'Escape') {
          editableTarget.blur();
        }
        return;
      }

      // `ctrl` is the primary modifier: Ctrl on Windows/Linux, Cmd on macOS.
      const primaryModifier = event.ctrlKey || event.metaKey;
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrl === primaryModifier &&
          !!shortcut.shift === event.shiftKey &&
          !!shortcut.alt === event.altKey
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.callback();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return shortcuts;
};
