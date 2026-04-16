import { useCallback, useEffect, useState } from 'react';

export const PWA_INSTALL_DISMISSED_STORAGE_KEY = 'rpg-pwa-install-dismissed-v1';

export interface DeferredInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface UsePwaInstallPromptOptions {
  onInstalled?: () => void;
}

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;

  const mediaStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = (
    window.navigator as Navigator & {
      standalone?: boolean;
    }
  ).standalone;

  return mediaStandalone || navigatorStandalone === true;
}

function readDismissedState() {
  try {
    return localStorage.getItem(PWA_INSTALL_DISMISSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeDismissedState(isDismissed: boolean) {
  try {
    if (isDismissed) {
      localStorage.setItem(PWA_INSTALL_DISMISSED_STORAGE_KEY, 'true');
      return;
    }

    localStorage.removeItem(PWA_INSTALL_DISMISSED_STORAGE_KEY);
  } catch {
    // Ignore storage failures; the prompt still works for the current session.
  }
}

export function usePwaInstallPrompt(options: UsePwaInstallPromptOptions = {}) {
  const { onInstalled } = options;
  const [installEvent, setInstallEvent] = useState<DeferredInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstalled = useCallback(() => {
    setInstallEvent(null);
    setIsInstalled(true);
    setIsDismissed(false);
    writeDismissedState(false);
    onInstalled?.();
  }, [onInstalled]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    setIsDismissed(readDismissedState());
    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      const deferredPrompt = event as DeferredInstallPromptEvent;
      deferredPrompt.preventDefault();
      setInstallEvent(deferredPrompt);
      setIsInstalled(false);
    };

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        handleInstalled();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleInstalled);

    const displayModeQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)')
        : null;

    if (displayModeQuery) {
      if (typeof displayModeQuery.addEventListener === 'function') {
        displayModeQuery.addEventListener('change', handleDisplayModeChange);
      } else if (typeof displayModeQuery.addListener === 'function') {
        displayModeQuery.addListener(handleDisplayModeChange);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleInstalled);

      if (displayModeQuery) {
        if (typeof displayModeQuery.removeEventListener === 'function') {
          displayModeQuery.removeEventListener('change', handleDisplayModeChange);
        } else if (typeof displayModeQuery.removeListener === 'function') {
          displayModeQuery.removeListener(handleDisplayModeChange);
        }
      }
    };
  }, [handleInstalled]);

  const dismissInstallPrompt = useCallback(() => {
    setIsDismissed(true);
    writeDismissedState(true);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return 'unavailable' as const;

    setIsInstalling(true);

    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;

      setInstallEvent(null);

      if (choice.outcome === 'dismissed') {
        setIsDismissed(true);
        writeDismissedState(true);
      } else {
        setIsDismissed(false);
        writeDismissedState(false);
      }

      return choice.outcome;
    } finally {
      setIsInstalling(false);
    }
  }, [installEvent]);

  return {
    canInstall: !!installEvent && !isDismissed && !isInstalled,
    dismissInstallPrompt,
    isInstalling,
    isInstalled,
    promptInstall,
  };
}
