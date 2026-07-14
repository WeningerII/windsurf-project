import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSurfaceSwitchMetrics } from '../../hooks/useSurfaceSwitchMetrics';
import type { Surface } from '../../hooks/useAppNav';

// No-op implementations so the tests neither depend on the host's User
// Timing support nor leak entries into the shared performance buffer.
function spyOnUserTiming() {
  const mark = vi
    .spyOn(performance, 'mark')
    .mockImplementation(() => undefined as unknown as PerformanceMark);
  const measure = vi
    .spyOn(performance, 'measure')
    .mockImplementation(() => undefined as unknown as PerformanceMeasure);
  return { mark, measure };
}

function renderMetrics(initialSurface: Surface) {
  return renderHook((surface: Surface) => useSurfaceSwitchMetrics(surface), {
    initialProps: initialSurface,
  });
}

describe('useSurfaceSwitchMetrics', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('marks the initial surface on mount without measuring', () => {
    const { mark, measure } = spyOnUserTiming();
    renderMetrics('library');
    expect(mark).toHaveBeenCalledTimes(1);
    expect(mark).toHaveBeenCalledWith('shell:surface:library');
    expect(measure).not.toHaveBeenCalled();
  });

  it('marks the new surface and measures between consecutive surface marks', () => {
    const { mark, measure } = spyOnUserTiming();
    const { rerender } = renderMetrics('library');
    rerender('scene');
    expect(mark).toHaveBeenLastCalledWith('shell:surface:scene');
    expect(measure).toHaveBeenCalledTimes(1);
    expect(measure).toHaveBeenCalledWith(
      'shell:surface-switch:library->scene',
      'shell:surface:library',
      'shell:surface:scene'
    );
  });

  it('chains measures across multiple switches', () => {
    const { measure } = spyOnUserTiming();
    const { rerender } = renderMetrics('library');
    rerender('scene');
    rerender('sheet');
    rerender('library');
    expect(measure.mock.calls.map((call) => call[0])).toEqual([
      'shell:surface-switch:library->scene',
      'shell:surface-switch:scene->sheet',
      'shell:surface-switch:sheet->library',
    ]);
  });

  it('does not re-mark or re-measure when the surface is unchanged', () => {
    const { mark, measure } = spyOnUserTiming();
    const { rerender } = renderMetrics('library');
    rerender('library');
    rerender('library');
    expect(mark).toHaveBeenCalledTimes(1);
    expect(measure).not.toHaveBeenCalled();
  });

  it('is a no-op when the User Timing API is missing', () => {
    vi.stubGlobal('performance', { now: () => 0 });
    expect(() => {
      const { rerender } = renderMetrics('library');
      rerender('scene');
    }).not.toThrow();
  });

  it('is a no-op when performance itself is undefined', () => {
    vi.stubGlobal('performance', undefined);
    expect(() => {
      const { rerender } = renderMetrics('library');
      rerender('scene');
    }).not.toThrow();
  });

  it('swallows User Timing errors instead of breaking navigation', () => {
    vi.spyOn(performance, 'mark').mockImplementation(() => {
      throw new Error('user timing rejected');
    });
    expect(() => {
      const { rerender } = renderMetrics('library');
      rerender('scene');
    }).not.toThrow();
  });
});
