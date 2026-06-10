import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useTheme } from '../../hooks/useTheme';

const STORAGE_KEY = 'rpg-theme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('falls back to system when the stored theme is invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'neon-hotdog');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(['light', 'dark']).toContain(result.current.resolvedTheme);
    // The arbitrary stored string must never end up as a class on <html>.
    expect(document.documentElement.classList.contains('neon-hotdog')).toBe(false);
    expect(
      document.documentElement.classList.contains('light') ||
        document.documentElement.classList.contains('dark')
    ).toBe(true);
  });

  it('falls back to system when nothing is stored', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
  });

  it('uses a valid stored theme', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists and applies theme changes', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
