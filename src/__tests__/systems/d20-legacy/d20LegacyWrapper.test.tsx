import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Dnd35eDataModel } from '../../../systems/dnd35e/data-model';
import { createDefaultDnd35eData } from '../../../systems/dnd35e/data-model';
import type { PreloadableLazyComponent } from '../../../utils/lazyWithPreload';

// Stub the lazily-imported native sheet so the wrapper's render path is
// observable without mounting the full sheet tree. The spy records the props
// the wrapper forwards to D20LegacySheet.
const sheetSpy = vi.fn((_props: unknown) => null);
vi.mock('../../../systems/d20-legacy/sheet', () => ({
  D20LegacySheet: (props: unknown) => sheetSpy(props),
}));

type D20WrapperProps = {
  document: CharacterDocument<Dnd35eDataModel>;
  onUpdate?: (doc: CharacterDocument<SystemDataModel>) => void;
};

import { makeD20LegacySheet } from '../../../systems/d20-legacy/wrapper';

function makeDoc(): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'd20-wrapper-test',
    name: 'Wrapper Hero',
    systemId: 'dnd-3.5e',
    system: createDefaultDnd35eData(),
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

describe('makeD20LegacySheet', () => {
  it('lazy-loads the native sheet and forwards document + onUpdate through a named wrapper', async () => {
    // makeD20LegacySheet returns the registry's SystemSheetComponent type, which
    // hides the preload() helper; the runtime object is the preloadable lazy
    // component, so narrow to it to drive the loader.
    const SheetComponent =
      makeD20LegacySheet<Dnd35eDataModel>() as unknown as PreloadableLazyComponent<D20WrapperProps>;

    // preload() runs the lazy loader: imports ./sheet and builds the wrapper.
    const loaded = await SheetComponent.preload();
    const Wrapper = loaded.default;
    expect(Wrapper.displayName).toBe('D20LegacyWrapper');

    const document = makeDoc();
    const onUpdate = vi.fn();
    render(<Wrapper document={document} onUpdate={onUpdate} />);

    // The wrapper renders D20LegacySheet with the exact props it received.
    expect(sheetSpy).toHaveBeenCalledTimes(1);
    expect(sheetSpy).toHaveBeenCalledWith(expect.objectContaining({ document, onUpdate }));
  });
});
