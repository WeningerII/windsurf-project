import React from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { SystemSheetComponent } from '../../registry/types';
import { lazyWithPreload } from '../../utils/lazyWithPreload';

/**
 * Creates a typed SheetComponent wrapper for the shared D20LegacySheet.
 * Same pattern as makeD20Sheet but for the 3.x-family native sheet.
 */
export function makeD20LegacySheet<T extends SystemDataModel>(): SystemSheetComponent<T> {
  return lazyWithPreload(async () => {
    const module = await import('./sheet');
    const D20LegacyWrapper: React.FC<{
      document: CharacterDocument<T>;
      onUpdate?: (doc: CharacterDocument<SystemDataModel>) => void;
    }> = ({ document, onUpdate }) =>
      React.createElement(module.D20LegacySheet, { document, onUpdate });
    D20LegacyWrapper.displayName = 'D20LegacyWrapper';

    return { default: D20LegacyWrapper };
  }) as SystemSheetComponent<T>;
}
