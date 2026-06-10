import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../utils/supabaseClient';
import {
  AuthContext,
  clearLocalDataForAccountChange,
  getLastSyncedUserId,
  setLastSyncedUserId,
} from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
  // Remount key for the children subtree: bumped whenever the local stores
  // are wiped so every collection hook reloads from the (now empty) storage
  // instead of keeping the previous account's data in memory.
  const [workspaceEpoch, setWorkspaceEpoch] = useState(0);
  const client = getSupabaseClient();

  const wipeLocalData = useCallback(async () => {
    await clearLocalDataForAccountChange();
    setWorkspaceEpoch((epoch) => epoch + 1);
  }, []);

  // Apply the account-switch policy (see auth-context.ts) before exposing the
  // new session: a sign-in by a different user than the one that last synced
  // here wipes the local stores so the initial sync cannot merge-and-upload
  // the previous user's data into the new account.
  const applySession = useCallback(
    async (newSession: Session | null) => {
      const newUserId = newSession?.user?.id ?? null;
      if (newUserId) {
        const lastUserId = getLastSyncedUserId();
        if (lastUserId && lastUserId !== newUserId) {
          await wipeLocalData();
        }
        setLastSyncedUserId(newUserId);
      }
      setSession(newSession);
    },
    [wipeLocalData]
  );

  useEffect(() => {
    if (!client) {
      setIsLoading(false);
      return;
    }

    client.auth.getSession().then(({ data }) => {
      void applySession(data.session).finally(() => {
        setIsLoading(false);
      });
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, newSession) => {
      void applySession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [applySession, client]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: 'Supabase not configured' };
      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: 'Supabase not configured' };
      const { error } = await client.auth.signUp({ email, password });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'github') => {
      if (!client) return { error: 'Supabase not configured' };
      const { error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    // Explicit sign-out wipes the local stores — the conservative choice for
    // shared devices. Passive session loss (token expiry) never reaches this
    // path, so offline-first users keep their data.
    await wipeLocalData();
  }, [client, wipeLocalData]);

  // Memoized so consumers do not re-render (and effects keyed on the value do
  // not re-fire) on every provider render — only when auth state changes.
  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signInWithEmail,
      signUpWithEmail,
      signInWithOAuth,
      signOut,
      isConfigured: isSupabaseConfigured(),
    }),
    [session, isLoading, signInWithEmail, signUpWithEmail, signInWithOAuth, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      <React.Fragment key={workspaceEpoch}>{children}</React.Fragment>
    </AuthContext.Provider>
  );
}
