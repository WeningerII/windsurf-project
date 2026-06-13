import { describe, it, expect, afterEach } from 'vitest';
import {
  canUseLocalStorage,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
} from '../../utils/safeStorage';
import { loadCampaigns, saveCampaigns, clearCampaignStorage } from '../../utils/campaignStorage';

const realLocalStorage = globalThis.localStorage;

function setLocalStorage(value: unknown): void {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value,
  });
}

/** A storage object whose every method throws, as private-mode/quota would. */
const hostileStorage = {
  getItem() {
    throw new DOMException('SecurityError');
  },
  setItem() {
    throw new DOMException('QuotaExceededError');
  },
  removeItem() {
    throw new DOMException('SecurityError');
  },
};

afterEach(() => {
  setLocalStorage(realLocalStorage);
  localStorage.clear();
});

describe('safeStorage guards', () => {
  it('round-trips through localStorage when available', () => {
    expect(canUseLocalStorage()).toBe(true);
    expect(safeSetItem('k', 'v')).toBe(true);
    expect(safeGetItem('k')).toBe('v');
    safeRemoveItem('k');
    expect(safeGetItem('k')).toBeNull();
  });

  it('never throws when a write exceeds quota — returns false instead', () => {
    setLocalStorage(hostileStorage);
    expect(() => safeSetItem('k', 'v')).not.toThrow();
    expect(safeSetItem('k', 'v')).toBe(false);
  });

  it('never throws when a read is blocked — returns null instead', () => {
    setLocalStorage(hostileStorage);
    expect(() => safeGetItem('k')).not.toThrow();
    expect(safeGetItem('k')).toBeNull();
  });

  it('degrades to a no-op when localStorage is absent (SSR)', () => {
    setLocalStorage(undefined);
    expect(canUseLocalStorage()).toBe(false);
    expect(safeGetItem('k')).toBeNull();
    expect(safeSetItem('k', 'v')).toBe(false);
    expect(() => safeRemoveItem('k')).not.toThrow();
  });
});

describe('campaignStorage tolerates a hostile storage environment', () => {
  it('save/load/clear never throw even when localStorage throws', () => {
    setLocalStorage(hostileStorage);
    expect(() => saveCampaigns([])).not.toThrow();
    expect(() => loadCampaigns()).not.toThrow();
    expect(loadCampaigns()).toEqual([]);
    expect(() => clearCampaignStorage()).not.toThrow();
  });
});
