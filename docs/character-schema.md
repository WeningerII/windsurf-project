# Character Data Schema

**Last Updated**: February 18, 2026

This document describes the canonical **V2** character model used by the app runtime, local storage, and export/import.

---

## Source of Truth

Primary schema and contracts:

```text
src/types/core/document.ts      — CharacterDocument<T>, SystemDataModel
src/registry/types.ts           — SystemDefinition<T>, SystemEngine<T>
src/systems/*/data-model.ts     — System-specific payload schemas
```

Legacy compatibility types still exist:

```text
src/types/core/character.ts     — Legacy Character model (migration compatibility)
```

---

## Canonical V2 Model

The application persists and renders `CharacterDocument<T>` objects.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID (generated via `generateUUID()`) |
| `name` | `string` | ✅ | Character display name |
| `systemId` | `string` | ✅ | System discriminator (for registry lookup) |
| `system` | `T` | ✅ | System-specific payload (`SystemDataModel`) |
| `img` | `string` | — | Optional character image |
| `createdAt` | `Date` | ✅ | Creation timestamp |
| `updatedAt` | `Date` | ✅ | Last-modified timestamp |

`T` is system-specific and defined in each system module:

- `src/systems/dnd5e/data-model.ts`
- `src/systems/dnd5e-2024/data-model.ts`
- `src/systems/dnd35e/data-model.ts`
- `src/systems/pf1e/data-model.ts`
- `src/systems/pf2e/data-model.ts`
- `src/systems/mam3e/data-model.ts`

---

## Supported `systemId` Values

```typescript
'dnd-5e-2014' | 'dnd-5e-2024' | 'dnd-3.5e' | 'pf1e' | 'pf2e' | 'mam3e'
```

The `SystemRegistry` resolves each `systemId` to:

1. Default data factory
2. Engine (`prepareData`, `rollCheck`, `applyDamage`)
3. Sheet component renderer

---

## Legacy Compatibility

The app still supports legacy `Character[]` storage (`rpg-characters`) through `loadDocuments()`.

Migration path:

1. Prefer valid V2 payload from `rpg-documents-v2`.
2. If V2 is missing/invalid, load legacy via `src/utils/storage.ts`.
3. Convert via `src/utils/migrateLegacy.ts`.
4. Persist as V2 via `src/utils/documentStorage.ts`.

Legacy shape is no longer the canonical runtime model.
