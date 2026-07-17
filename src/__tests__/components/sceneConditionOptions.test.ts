import { describe, it, expect } from 'vitest';

import { sceneConditionOptions } from '../../components/scene/sceneConditionOptions';
import { collectSceneConditionEffects, mam3eBruisePenalty } from '../../rules';

/**
 * 5e-vestige sweep: the token-condition picker was wired for 5e-family scenes
 * only, so every other system's scenes got an empty option list even though
 * the rules dispatcher compiles their conditions. The picker's per-system
 * options must be exactly the vocabulary that dispatcher makes mechanical.
 */
describe('sceneConditionOptions — per-system picker vocabulary', () => {
  it('keeps the 5e list for the 5e family and for an unset systemId (rules default branch)', () => {
    expect(sceneConditionOptions('dnd-5e-2014')).toContain('poisoned');
    expect(sceneConditionOptions('dnd-5e-2024')).toContain('frightened');
    expect(sceneConditionOptions(undefined)).toEqual(sceneConditionOptions('dnd-5e-2014'));
  });

  it('offers the shared OGL flat-penalty catalog on 3.5e and PF1e scenes', () => {
    for (const systemId of ['dnd-3.5e', 'pf1e']) {
      const options = sceneConditionOptions(systemId);
      expect(options).toContain('shaken');
      expect(options).toContain('sickened');
      // Every offered id must compile to at least one effect — no dead options.
      for (const id of options) {
        expect(
          collectSceneConditionEffects(systemId, [id]).length,
          `${systemId} option '${id}' must compile`
        ).toBeGreaterThan(0);
      }
    }
  });

  it('offers PF2e only the valued frightened/sickened variants that actually fold into attacks', () => {
    const options = sceneConditionOptions('pf2e');
    expect(options).toEqual(['frightened-1', 'frightened-2', 'sickened-1', 'sickened-2']);
    for (const id of options) {
      expect(collectSceneConditionEffects('pf2e', [id]).length).toBeGreaterThan(0);
    }
  });

  it('offers Daggerheart its note-only conditions, which the dispatcher compiles as notes', () => {
    const options = sceneConditionOptions('daggerheart');
    expect(options).toEqual(['vulnerable', 'restrained', 'hidden']);
    for (const id of options) {
      const effects = collectSceneConditionEffects('daggerheart', [id]);
      expect(effects).toHaveLength(1);
      expect(effects[0].operation).toBe('note');
    }
  });

  it('offers M&M nothing — the bruise track is owned by attack resolution', () => {
    expect(sceneConditionOptions('mam3e')).toEqual([]);
    // The track itself stays mechanical through resolution, not the picker.
    expect(mam3eBruisePenalty(['bruised-2'])).toBe(2);
  });

  it('gives unknown system ids no options (their conditions would compile to nothing)', () => {
    expect(sceneConditionOptions('not-a-system')).toEqual([]);
  });
});
