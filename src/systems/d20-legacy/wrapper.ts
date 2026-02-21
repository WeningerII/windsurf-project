import React from 'react';
import { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { D20LegacySheet } from './sheet';

/**
 * Creates a typed SheetComponent wrapper for the shared D20LegacySheet.
 * Same pattern as makeD20Sheet but for the 3.x-family native sheet.
 */
export function makeD20LegacySheet<T extends SystemDataModel>(): React.ComponentType<{
  document: CharacterDocument<T>;
  onUpdate?: (doc: CharacterDocument<SystemDataModel>) => void;
}> {
  const D20LegacyWrapper: React.FC<{
    document: CharacterDocument<T>;
    onUpdate?: (doc: CharacterDocument<SystemDataModel>) => void;
  }> = ({ document, onUpdate }) =>
    React.createElement(D20LegacySheet, { document, onUpdate });
  D20LegacyWrapper.displayName = 'D20LegacyWrapper';
  return D20LegacyWrapper;
}
