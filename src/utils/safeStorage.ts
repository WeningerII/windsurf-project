/**
 * Defensive localStorage access shared by the persistence modules.
 *
 * `localStorage` is absent under SSR and throws on access in private-mode
 * Safari and when the quota is exceeded, so every read/write must be guarded.
 * These helpers centralize that guard (previously duplicated, and missing
 * entirely from campaignStorage) so a hostile storage environment degrades to
 * an in-memory no-op instead of throwing into the UI.
 */

/** True when localStorage exists and is reachable without throwing. */
export function canUseLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    // Some environments throw merely on *accessing* the global.
    return false;
  }
}

/** Read a key, or null when storage is unavailable or the read throws. */
export function safeGetItem(key: string): string | null {
  if (!canUseLocalStorage()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write a key; returns false (never throws) when storage is unavailable/full. */
export function safeSetItem(key: string, value: string): boolean {
  if (!canUseLocalStorage()) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Remove a key; no-op (never throws) when storage is unavailable. */
export function safeRemoveItem(key: string): void {
  if (!canUseLocalStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore — nothing to remove if storage is unreachable.
  }
}
