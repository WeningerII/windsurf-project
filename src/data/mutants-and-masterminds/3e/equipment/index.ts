// Mutants & Masterminds 3e Equipment — master index.
//
// ONE provenance tier, by design. Every module here is GENERATED from the Hero
// SRD EQUIPMENT list by scripts/encode-mam-equipment.mjs (113 entries, all cited
// `M&M 3e Hero SRD`) and is never hand-edited.
//
// A second tier used to exist — ./original-not-srd.ts, 79 hand-written entries
// with no Hero SRD counterpart, cited `Original Content (not SRD)`. It was
// deleted 2026-07-30 (owner decision): this application transcribes open
// documents, it does not author game content. scripts/check-mam-equipment-
// provenance.mjs now fails on any entry citing anything but a Hero SRD source,
// so the tier cannot come back by accident.
//
// `loadMam3eEquipment` (src/utils/dataLoader.ts) flattens every array export of
// this module; `finalizeLoadedItems` then applies the open-content policy per
// entry.

export * from './srd-weapons';
export * from './srd-armor';
export * from './srd-vehicles';
export * from './srd-gear';
export * from './srd-headquarters';
