import { describe, expect, it, vi } from 'vitest';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

describe('lazyWithPreload', () => {
  it('retries a failed preload and reuses the successful module', async () => {
    let attempts = 0;
    const loader = vi.fn(async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new Error('boom');
      }

      return {
        default: () => null,
      };
    });

    const LazyComponent = lazyWithPreload(loader);

    await expect(LazyComponent.preload()).rejects.toThrow('boom');
    await expect(LazyComponent.preload()).resolves.toMatchObject({
      default: expect.any(Function),
    });
    await expect(LazyComponent.preload()).resolves.toMatchObject({
      default: expect.any(Function),
    });

    expect(loader).toHaveBeenCalledTimes(2);
  });
});
