// Equipment Types - Index
// Central export for all equipment type definitions.
//
// `items.ts` is the CANONICAL family (review M-2): Item/Weapon/Armor/Shield/
// MagicItem with object costs and ItemType discriminants. The gear/weapons/
// armor modules are the deprecated legacy family kept only for 3.5e/PF1e data
// authoring; the loader normalizes them to the canonical shapes.

export * from './items';
export * from './gear';
export * from './weapons';
export * from './armor';
