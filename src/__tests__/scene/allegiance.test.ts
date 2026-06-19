import { describe, expect, it } from 'vitest';
import type { SceneToken } from '../../types/core/scene';
import { defaultAllegiance, tokenAllegiance } from '../../scene/allegiance';

describe('defaultAllegiance', () => {
  it('sides each kind by default', () => {
    expect(defaultAllegiance('character')).toBe('party');
    expect(defaultAllegiance('monster')).toBe('hostile');
    expect(defaultAllegiance('npc')).toBe('neutral');
    expect(defaultAllegiance('object')).toBe('neutral');
  });
});

describe('tokenAllegiance', () => {
  it('falls back to the kind default when no override is set', () => {
    expect(tokenAllegiance({ kind: 'monster' } as SceneToken)).toBe('hostile');
    expect(tokenAllegiance({ kind: 'npc' } as SceneToken)).toBe('neutral');
  });

  it('honors an explicit override', () => {
    expect(tokenAllegiance({ kind: 'monster', allegiance: 'party' } as SceneToken)).toBe('party');
    expect(tokenAllegiance({ kind: 'npc', allegiance: 'hostile' } as SceneToken)).toBe('hostile');
    expect(tokenAllegiance({ kind: 'character', allegiance: 'hostile' } as SceneToken)).toBe(
      'hostile'
    );
  });
});
