import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardNavigation = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrl === event.ctrlKey &&
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
