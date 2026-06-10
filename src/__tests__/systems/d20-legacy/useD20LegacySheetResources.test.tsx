import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useD20LegacySheetResources } from '../../../systems/d20-legacy/useD20LegacySheetResources';

describe('useD20LegacySheetResources', () => {
  it('eagerly loads class/species options on mount (regression: dead Level input)', async () => {
    // handleClassLevelChange resolves the edited class from `classes` and
    // silently no-ops while the list is empty, so the options must load on
    // mount (matching usePf2eSheetResources) — not only when a class dropdown
    // happens to receive focus.
    const { result } = renderHook(() =>
      useD20LegacySheetResources({ systemId: 'pf1e', isPf1e: true })
    );

    expect(result.current.classes).toEqual([]);

    await waitFor(() => {
      expect(result.current.classes.length).toBeGreaterThan(0);
      expect(result.current.species.length).toBeGreaterThan(0);
    });
  });
});
