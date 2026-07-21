import { describe, it, expect } from 'vitest';
import {
  isKnownSystemDocument,
  isSystemDocument,
  type AnyCharacterDocument,
  type CharacterDocument,
} from '../../types/core/document';
import { createDefaultDnd35eData } from '../../systems/dnd35e/data-model';
import { createDefaultPf2eData } from '../../systems/pf2e/data-model';

function makeDoc(systemId: string, system: CharacterDocument['system']): CharacterDocument {
  return {
    id: `test-${systemId}`,
    name: 'Union Test',
    systemId,
    system,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('AnyCharacterDocument — discriminated union + systemId guards (Phase 3.1)', () => {
  it('isSystemDocument narrows to the matching system document', () => {
    const doc = makeDoc('dnd-3.5e', createDefaultDnd35eData());
    expect(isSystemDocument(doc, 'dnd-3.5e')).toBe(true);
    expect(isSystemDocument(doc, 'pf2e')).toBe(false);

    if (isSystemDocument(doc, 'dnd-3.5e')) {
      // Compile-time: `system` is now Dnd35eDataModel, so typed fields resolve.
      expect(Array.isArray(doc.system.classLevels)).toBe(true);
      // Compile-time: `systemId` is the literal.
      const id: 'dnd-3.5e' = doc.systemId;
      expect(id).toBe('dnd-3.5e');
    }
  });

  it('isKnownSystemDocument admits every known systemId and rejects unknowns', () => {
    for (const systemId of [
      'dnd-5e-2014',
      'dnd-5e-2024',
      'dnd-3.5e',
      'pf1e',
      'pf2e',
      'mam3e',
      'daggerheart',
    ]) {
      expect(isKnownSystemDocument(makeDoc(systemId, {}))).toBe(true);
    }
    expect(isKnownSystemDocument(makeDoc('made-up-system', {}))).toBe(false);
    expect(isKnownSystemDocument(makeDoc('', {}))).toBe(false);
  });

  it('the union switch-narrows on systemId (exhaustive discriminator)', () => {
    const doc = makeDoc('pf2e', createDefaultPf2eData());
    expect(isKnownSystemDocument(doc)).toBe(true);
    if (!isKnownSystemDocument(doc)) {
      throw new Error('unreachable');
    }
    const narrowed: AnyCharacterDocument = doc;
    switch (narrowed.systemId) {
      case 'pf2e':
        // Compile-time: Pf2eDataModel fields resolve without casts.
        expect(narrowed.system.skillProficiencies).toBeDefined();
        expect(typeof narrowed.system.heroPoints).toBe('number');
        break;
      default:
        throw new Error(`expected pf2e, got ${narrowed.systemId}`);
    }
  });
});
