# Data Export / Import Format

**Last Updated**: February 18, 2026

This document specifies the canonical **V2** storage and export/import format.

---

## Canonical Storage Implementation

Primary implementation:

```text
src/utils/documentStorage.ts
```

Key functions:

| Function | Purpose |
|----------|---------|
| `saveDocuments(documents)` | Persist V2 docs to localStorage |
| `loadDocuments()` | Load V2 docs from localStorage |
| `exportDocuments(documents)` | Serialize V2 envelope JSON |
| `importDocuments(jsonString)` | Parse V2 envelope JSON |
| `clearDocumentStorage()` | Clear V2 localStorage key |

Legacy compatibility (migration path only):

```text
src/utils/storage.ts
```

---

## localStorage Keys

Canonical key:

```text
rpg-documents-v2
```

Legacy key (read for migration only):

```text
rpg-characters
```

---

## V2 Envelope Schema

```json
{
  "version": "2.0",
  "documents": [ /* CharacterDocument<SystemDataModel>[] */ ],
  "lastModified": "2026-02-18T18:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Schema version (`"2.0"` for V2 document storage). |
| `documents` | `CharacterDocument[]` | Array of V2 character documents. |
| `lastModified` | `string` | ISO 8601 timestamp of last write. |

---

## Date Serialization

`createdAt` and `updatedAt` are serialized as ISO strings and hydrated back to `Date` objects by `loadDocuments()` / `importDocuments()`.

---

## Import Behavior in App Flow

When importing through the UI:

1. File is parsed via `importDocuments(jsonString)`.
2. Each imported document is normalized with:
   - New UUID
   - New `createdAt`
   - New `updatedAt`
3. Normalized docs are appended to current documents.

This prevents ID collisions and ensures imported entries are treated as new local records.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| localStorage failure on save | Throws `"Failed to save document data. Storage may be full."` |
| malformed V2 JSON | `importDocuments` throws invalid JSON format error |
| malformed stored V2 data | `loadDocuments()` attempts legacy fallback (`rpg-characters`), otherwise returns `[]` |

---

## Legacy Migration Note

`loadDocuments()` in `src/utils/documentStorage.ts` owns migration behavior:

1. If valid V2 (`rpg-documents-v2`) exists, it is returned as canonical.
2. If V2 is missing/invalid, legacy `rpg-characters` is loaded via `src/utils/storage.ts`.
3. Legacy records are converted via `src/utils/migrateLegacy.ts`, persisted to V2, and returned.
4. Malformed legacy payloads fail safely to an empty list.

`App.tsx` no longer contains migration logic.
