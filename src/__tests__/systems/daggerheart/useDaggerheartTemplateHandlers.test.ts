import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument } from '../../../types/core/document';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../../systems/daggerheart/data-model';
import { useDaggerheartTemplateHandlers } from '../../../systems/daggerheart/useDaggerheartTemplateHandlers';
import { getDaggerheartClass } from '../../../data/daggerheart/1.0/classes';
import { getDaggerheartAncestry } from '../../../data/daggerheart/1.0/ancestries';
import { getDaggerheartCommunity } from '../../../data/daggerheart/1.0/communities';

/**
 * The class/ancestry/community change handlers route a recognised option through
 * the corresponding template (committing a whole document) and an UNrecognised
 * name through `update` (a free-text patch). Both paths are asserted on the real
 * observable: which callback fired and the exact payload it received.
 */

const bard = getDaggerheartClass('daggerheart-bard')!;
const guardian = getDaggerheartClass('daggerheart-guardian')!;
const human = getDaggerheartAncestry('human')!;
const wanderborne = getDaggerheartCommunity('wanderborne')!;

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {}
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'dh-template-handlers',
    name: 'Hero',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-09T00:00:00.000Z'),
    updatedAt: new Date('2026-03-09T00:00:00.000Z'),
  };
}

function renderHandlers(
  document: CharacterDocument<DaggerheartDataModel>,
  options: {
    selectedClass?: typeof bard;
    selectedAncestry?: typeof human;
  } = {}
) {
  const commitDocument = vi.fn();
  const update = vi.fn();
  const view = renderHook(() =>
    useDaggerheartTemplateHandlers({
      document,
      data: document.system,
      classOptions: [bard, guardian],
      ancestryOptions: [human],
      communityOptions: [wanderborne],
      selectedClass: options.selectedClass,
      selectedAncestry: options.selectedAncestry,
      commitDocument,
      update,
    })
  );
  return { result: view.result, commitDocument, update };
}

describe('useDaggerheartTemplateHandlers', () => {
  it('commits the class template when the chosen class resolves', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc());

    act(() => result.current.handleClassChange(bard.name));

    expect(update).not.toHaveBeenCalled();
    expect(commitDocument).toHaveBeenCalledTimes(1);
    expect(commitDocument.mock.calls[0][0].system.class).toBe(bard.name);
  });

  it('keeps a still-valid subclass and clears one that the new class lacks', () => {
    const validSubclass = guardian.subclasses[0].name;

    const kept = renderHandlers(makeDoc({ subclass: validSubclass }), { selectedClass: bard });
    act(() => kept.result.current.handleClassChange(guardian.name));
    expect(kept.commitDocument.mock.calls[0][0].system.subclass).toBe(validSubclass);

    const cleared = renderHandlers(makeDoc({ subclass: 'Subclass The New Class Lacks' }), {
      selectedClass: bard,
    });
    act(() => cleared.result.current.handleClassChange(guardian.name));
    expect(cleared.commitDocument.mock.calls[0][0].system.subclass).toBe('');
  });

  it('falls back to a free-text patch (clearing subclass) for an unknown class name', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc({ subclass: 'Old Sub' }));

    act(() => result.current.handleClassChange('Homebrew Class'));

    expect(commitDocument).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({ class: 'Homebrew Class', subclass: '' });
  });

  it('commits the ancestry template when the chosen ancestry resolves', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc());

    act(() => result.current.handleAncestryChange(human.name));

    expect(update).not.toHaveBeenCalled();
    expect(commitDocument).toHaveBeenCalledTimes(1);
    expect(commitDocument.mock.calls[0][0].system.heritage).toBe(human.name);
  });

  it('falls back to a heritage patch for an unknown ancestry name', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc());

    act(() => result.current.handleAncestryChange('Homebrew Ancestry'));

    expect(commitDocument).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({ heritage: 'Homebrew Ancestry' });
  });

  it('commits the community template when the chosen community resolves', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc());

    act(() => result.current.handleCommunityChange(wanderborne.name));

    expect(update).not.toHaveBeenCalled();
    expect(commitDocument).toHaveBeenCalledTimes(1);
    expect(commitDocument.mock.calls[0][0].system.community).toBe(wanderborne.name);
  });

  it('falls back to a community patch for an unknown community name', () => {
    const { result, commitDocument, update } = renderHandlers(makeDoc());

    act(() => result.current.handleCommunityChange('Homebrew Community'));

    expect(commitDocument).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({ community: 'Homebrew Community' });
  });
});
