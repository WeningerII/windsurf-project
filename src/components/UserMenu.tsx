import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SignIn } from './SignIn';
import { Button } from './ui/Button';
import { User, LogOut, RefreshCw, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import type { SyncState } from '../hooks/useSync';

interface UserMenuProps {
  syncState?: SyncState;
  lastSyncedAt?: Date | null;
  onSyncNow?: () => void;
}

export function UserMenu({ syncState, lastSyncedAt, onSyncNow }: UserMenuProps) {
  const { user, signOut, isConfigured, isLoading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isConfigured || isLoading) return null;

  if (!user) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSignIn(true)}
          title="Sign in to sync characters"
          className="flex items-center gap-1.5"
        >
          <Cloud className="w-4 h-4" />
          Sign In
        </Button>
        {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
      </>
    );
  }

  const syncIcon = (() => {
    if (syncState === 'syncing') return <RefreshCw className="w-3 h-3 animate-spin" />;
    if (syncState === 'error') return <AlertCircle className="w-3 h-3 text-red-500" />;
    if (syncState === 'idle' && lastSyncedAt)
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    return <Cloud className="w-3 h-3" />;
  })();

  return (
    <div className="relative">
      <button
        type="button"
        title={user.email ?? 'Signed in'}
        onClick={() => setShowDropdown((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <User className="w-4 h-4" />
        {syncIcon}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.email}
              </p>
              {lastSyncedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Synced {lastSyncedAt.toLocaleTimeString()}
                </p>
              )}
              {syncState === 'error' && <p className="text-xs text-red-500 mt-0.5">Sync failed</p>}
            </div>

            {onSyncNow && (
              <button
                type="button"
                onClick={() => {
                  onSyncNow();
                  setShowDropdown(false);
                }}
                disabled={syncState === 'syncing'}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                Sync Now
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                void signOut();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
