import { describe, expect, it } from 'vitest';

import {
  decodeShellNav,
  encodeShellNav,
  INITIAL_NAV_STATE,
  LIBRARY_SEGMENTS,
  sanitizeRestoredNav,
  type LibrarySegment,
  type ShellNavState,
  type Surface,
} from '../../contexts/shell-context';

/**
 * Phase 7 tasks 1-3: hash-sync restore-on-reload.
 *
 * The property that matters is not "it round-trips" — it is that a hash a user
 * edited, a bookmark from an older build, or a link to a document that has since
 * been deleted can never strand or crash the shell.
 */

const SURFACES: readonly Surface[] = ['library', 'sheet', 'scene'];

describe('encodeShellNav / decodeShellNav', () => {
  it('leaves the URL clean for the default state', () => {
    // A first visit and a return-to-default must look identical in the address
    // bar — a bare '#' would make "went somewhere and came back" visible.
    expect(encodeShellNav(INITIAL_NAV_STATE)).toBe('');
  });

  it('round-trips every surface and every library segment', () => {
    for (const surface of SURFACES) {
      for (const librarySegment of LIBRARY_SEGMENTS) {
        const state: ShellNavState = { ...INITIAL_NAV_STATE, surface, librarySegment };
        expect(decodeShellNav(encodeShellNav(state))).toEqual(state);
      }
    }
  });

  it('round-trips ids that need escaping', () => {
    const state: ShellNavState = {
      ...INITIAL_NAV_STATE,
      surface: 'sheet',
      sheetDocId: 'doc&id=weird #1',
      sceneId: 'scene/with?chars',
    };
    expect(decodeShellNav(encodeShellNav(state))).toEqual(state);
  });

  it('falls back per-field on an unrecognised value rather than throwing', () => {
    const restored = decodeShellNav('#s=nonsense&l=alsononsense&o=bogus');
    expect(restored).toEqual(INITIAL_NAV_STATE);
  });

  it('survives a malformed percent-escape without losing the rest of the hash', () => {
    // '%zz' is not a valid escape; decodeURIComponent throws on it.
    const restored = decodeShellNav('#d=%zz&s=scene');
    expect(restored.surface).toBe('scene');
    expect(restored.sheetDocId).toBeNull();
  });

  it('ignores keys it does not know, so a newer build cannot strand an older one', () => {
    const restored = decodeShellNav('#s=scene&futureKey=whatever');
    expect(restored.surface).toBe('scene');
  });

  it('tolerates junk shapes', () => {
    for (const junk of ['', '#', '#&&&', '#=', '#novalue', '#s', 'no-hash-prefix']) {
      expect(() => decodeShellNav(junk)).not.toThrow();
    }
  });
});

describe('sanitizeRestoredNav', () => {
  const known = { documentIds: ['doc-1'], sceneIds: ['scene-1'] };

  it('keeps ids that still resolve', () => {
    const state: ShellNavState = {
      ...INITIAL_NAV_STATE,
      surface: 'sheet',
      sheetDocId: 'doc-1',
      sceneId: 'scene-1',
    };
    expect(sanitizeRestoredNav(state, known)).toEqual(state);
  });

  it('lands on the Library when the restored sheet no longer exists', () => {
    // The stranding case: without this, reloading a bookmark to a deleted
    // character renders the sheet surface with nothing to render.
    const restored = sanitizeRestoredNav(
      { ...INITIAL_NAV_STATE, surface: 'sheet', sheetDocId: 'deleted' },
      known
    );
    expect(restored.surface).toBe('library');
    expect(restored.librarySegment).toBe('characters');
    expect(restored.sheetDocId).toBeNull();
  });

  it('clears a stale sheet id WITHOUT moving the user off another surface', () => {
    const restored = sanitizeRestoredNav(
      { ...INITIAL_NAV_STATE, surface: 'scene', sheetDocId: 'deleted', sceneId: 'scene-1' },
      known
    );
    expect(restored.sheetDocId).toBeNull();
    expect(restored.surface).toBe('scene');
    expect(restored.sceneId).toBe('scene-1');
  });

  it('clears a stale scene id and leaves the fallback to SceneManager', () => {
    // Deliberately NOT resolved to scenes[0] here: one owner of that fallback,
    // not two that can disagree.
    const restored = sanitizeRestoredNav(
      { ...INITIAL_NAV_STATE, surface: 'scene', sceneId: 'deleted' },
      known
    );
    expect(restored.sceneId).toBeNull();
    expect(restored.surface).toBe('scene');
  });

  it('is a no-op on the default state against empty catalogs', () => {
    expect(sanitizeRestoredNav(INITIAL_NAV_STATE, { documentIds: [], sceneIds: [] })).toEqual(
      INITIAL_NAV_STATE
    );
  });
});

describe('the encoder covers every discriminant member', () => {
  it('encodes each library segment distinguishably', () => {
    const encoded = new Set(
      LIBRARY_SEGMENTS.map((librarySegment: LibrarySegment) =>
        encodeShellNav({ ...INITIAL_NAV_STATE, librarySegment })
      )
    );
    // One collision would silently merge two tabs on reload.
    expect(encoded.size).toBe(LIBRARY_SEGMENTS.length);
  });

  it('encodes each surface distinguishably', () => {
    const encoded = new Set(
      SURFACES.map((surface) => encodeShellNav({ ...INITIAL_NAV_STATE, surface }))
    );
    expect(encoded.size).toBe(SURFACES.length);
  });
});
