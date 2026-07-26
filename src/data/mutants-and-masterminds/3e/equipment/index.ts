// Mutants & Masterminds 3e Equipment — master index.
//
// Two provenance tiers, kept in separate modules on purpose:
//   ./srd-*.ts            GENERATED from the Hero SRD EQUIPMENT list by
//                         scripts/encode-mam-equipment.mjs (113 entries, all
//                         cited `M&M 3e Hero SRD`). Never hand-edited.
//   ./original-not-srd.ts HAND-WRITTEN content with no Hero SRD counterpart
//                         (79 entries, cited `Original Content (not SRD)`).
//
// `loadMam3eEquipment` (src/utils/dataLoader.ts) flattens every array export of
// this module, so both tiers reach the product; `finalizeLoadedItems` then
// applies the open-content policy per entry. scripts/check-mam-equipment-
// provenance.mjs ratchets the split offline in `npm run verify`.

export * from './srd-weapons';
export * from './srd-armor';
export * from './srd-vehicles';
export * from './srd-gear';
export * from './srd-headquarters';
export * from './original-not-srd';
