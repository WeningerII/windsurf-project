/**
 * Regression for 06-M5: resource-loader failures used to be swallowed by
 * `.catch(() => {})`, leaving empty catalogs with no error state. Real
 * failures must now surface via `resourceLoadError` (same pattern as
 * classTemplateError); only teardown/system-switch cancellation stays silent.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDnd5eSheetResources } from '../../../systems/dnd5e/shared/useDnd5eSheetResources';
import type { GameSystemId } from '../../../types/game-systems';
import * as dataLoader from '../../../utils/dataLoader';
import { errorLogger } from '../../../utils/errorLogger';

vi.mock('../../../utils/dataLoader', () => ({
  loadBackgroundsForSystem: vi.fn(() => Promise.resolve([])),
  loadClassesForSystem: vi.fn(() => Promise.resolve([])),
  loadEquipmentForSystem: vi.fn(() => Promise.resolve([])),
  loadFeatsForSystem: vi.fn(() => Promise.resolve([])),
  loadFeatureOptionsForSystem: vi.fn(() => Promise.resolve([])),
  loadSpeciesForSystem: vi.fn(() => Promise.resolve([])),
  loadSpellsForSystem: vi.fn(() => Promise.resolve([])),
}));

const defaultOptions: {
  systemId: GameSystemId;
  featCount: number;
  showFeatBrowser: boolean;
  showFeatureOptionBrowser: boolean;
} = {
  systemId: 'dnd-5e-2014',
  featCount: 0,
  showFeatBrowser: false,
  showFeatureOptionBrowser: false,
};

describe('useDnd5eSheetResources', () => {
  beforeEach(() => {
    errorLogger.clearLogs();
    vi.mocked(dataLoader.loadClassesForSystem).mockImplementation(() => Promise.resolve([]));
    // Silence the errorLogger's HIGH-severity console output in failure cases.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports no error when the core catalogs load', async () => {
    const { result } = renderHook(() => useDnd5eSheetResources(defaultOptions));

    await waitFor(() => {
      expect(dataLoader.loadClassesForSystem).toHaveBeenCalled();
    });
    expect(result.current.resourceLoadError).toBeNull();
  });

  it('surfaces a real catalog load failure as resourceLoadError and logs it', async () => {
    vi.mocked(dataLoader.loadClassesForSystem).mockImplementation(() =>
      Promise.reject(new Error('chunk load failed'))
    );

    const { result } = renderHook(() => useDnd5eSheetResources(defaultOptions));

    await waitFor(() => {
      expect(result.current.resourceLoadError).toMatch(
        /Failed to load classes\/species\/backgrounds/
      );
    });
    expect(errorLogger.getLogs().some((log) => log.message.includes('Failed to load'))).toBe(true);
  });

  it('stays silent for teardown-time cancellation (unmount before resolution)', async () => {
    let rejectLoad: (error: Error) => void = () => {};
    vi.mocked(dataLoader.loadClassesForSystem).mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectLoad = reject;
        })
    );

    const { unmount } = renderHook(() => useDnd5eSheetResources(defaultOptions));
    unmount();
    rejectLoad(new Error('cancelled by teardown'));

    // Allow the rejection to propagate through the catch handler.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(errorLogger.getLogs()).toHaveLength(0);
  });

  it('clears the error when the system changes and the new load succeeds', async () => {
    vi.mocked(dataLoader.loadClassesForSystem).mockImplementationOnce(() =>
      Promise.reject(new Error('first load failed'))
    );

    const { result, rerender } = renderHook(
      (props: typeof defaultOptions) => useDnd5eSheetResources(props),
      { initialProps: defaultOptions }
    );

    await waitFor(() => {
      expect(result.current.resourceLoadError).not.toBeNull();
    });

    rerender({ ...defaultOptions, systemId: 'dnd-5e-2024' });

    await waitFor(() => {
      expect(result.current.resourceLoadError).toBeNull();
    });
  });
});
