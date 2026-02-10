# Data Export / Import Format

**Last Updated**: February 7, 2026

This document specifies the JSON format used when exporting and importing character data. The same envelope format is used for both localStorage persistence and file-based export/import.

---

## Storage Implementation

**Source file:** `src/utils/storage.ts`

| Function | Purpose |
|----------|---------|
| `saveCharacters(characters)` | Persist to localStorage |
| `loadCharacters()` | Load from localStorage |
| `exportCharacters(characters)` | Serialize to pretty-printed JSON string |
| `importCharacters(jsonString)` | Parse JSON string → `Character[]` |
| `clearAllData()` | Remove all character data from localStorage |
| `getStorageSize()` | Return byte size of stored data |

---

## localStorage Key

```
rpg-characters
```

Single key. All characters are stored together in one versioned envelope.

---

## Envelope Schema

Every persisted or exported payload uses this envelope:

```json
{
  "version": "1.0",
  "characters": [ /* Character objects */ ],
  "lastModified": "2026-02-07T21:15:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Schema version. Currently `"1.0"`. Used for future migration detection. |
| `characters` | `Character[]` | Array of character objects (see `character-schema.md`). |
| `lastModified` | `string` | ISO 8601 timestamp of when the payload was last written. |

---

## Date Serialization

`createdAt` and `updatedAt` on each character are stored as ISO 8601 strings in JSON. On load/import, they are hydrated back to `Date` objects:

```typescript
createdAt: new Date(char.createdAt),
updatedAt: new Date(char.updatedAt),
```

---

## Version Migration

When loading data, if `version` does not match the current `STORAGE_VERSION` (`"1.0"`), a warning is logged in development mode. Currently no migration logic exists—future breaking schema changes should add migration handlers in `loadCharacters()`.

---

## Import Behavior

When a user imports characters from a file:

1. The JSON is parsed and validated (must have a `characters` array).
2. Each character receives a **new UUID** via `generateUUID()` to prevent ID conflicts.
3. `createdAt` and `updatedAt` are reset to the current time.
4. Characters are appended to the existing list (not replaced).

This means imported characters are always treated as new entries.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| localStorage full | `saveCharacters` throws `"Failed to save character data. Storage may be full."` |
| Malformed JSON in localStorage | `loadCharacters` returns `[]`, logs error in dev mode |
| Invalid import file | `importCharacters` throws `"Failed to import characters. Invalid JSON format."` |
| Missing `characters` array | `importCharacters` throws `"Failed to import characters. Invalid JSON format."` |

---

## Example Export File

```json
{
  "version": "1.0",
  "characters": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Gandalf",
      "system": "dnd-5e-2014",
      "level": 20,
      "experiencePoints": 355000,
      "speciesId": "human",
      "classLevels": [
        {
          "classId": "wizard",
          "subclassId": "school-of-evocation",
          "level": 20,
          "hitDieRolls": [6, 4, 5, 3, 6, 4, 5, 3, 6, 4, 5, 3, 6, 4, 5, 3, 6, 4, 5, 3]
        }
      ],
      "baseAttributes": {
        "STR": 10,
        "DEX": 14,
        "CON": 12,
        "INT": 20,
        "WIS": 16,
        "CHA": 14
      },
      "skillProficiencies": {
        "arcana": { "level": "expertise", "source": ["Wizard"] },
        "history": { "level": "proficient", "source": ["Wizard"] }
      },
      "hitPoints": { "current": 102, "max": 102, "temp": 0 },
      "hitDice": [{ "die": "d6", "total": 20, "remaining": 20 }],
      "armorClass": 15,
      "initiative": 2,
      "speed": 30,
      "armorProficiencies": [],
      "weaponProficiencies": ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"],
      "toolProficiencies": [],
      "languageProficiencies": ["common", "elvish", "dwarvish"],
      "savingThrowProficiencies": ["INT", "WIS"],
      "features": [],
      "feats": [],
      "spellcasting": {
        "classes": [{ "classId": "wizard", "ability": "INT", "spellcastingLevel": 20 }],
        "spellsKnown": ["fireball", "shield", "magic-missile"],
        "spellsPrepared": ["fireball", "shield"],
        "spellSlots": {
          "1": { "max": 4, "used": 0 },
          "2": { "max": 3, "used": 0 },
          "3": { "max": 3, "used": 0 },
          "4": { "max": 3, "used": 0 },
          "5": { "max": 3, "used": 0 },
          "6": { "max": 2, "used": 0 },
          "7": { "max": 2, "used": 0 },
          "8": { "max": 1, "used": 0 },
          "9": { "max": 1, "used": 0 }
        }
      },
      "equipment": [],
      "inventory": [],
      "currency": { "copper": 0, "silver": 0, "electrum": 0, "gold": 500, "platinum": 0 },
      "notes": "The Grey Wanderer",
      "createdAt": "2026-02-07T12:00:00.000Z",
      "updatedAt": "2026-02-07T15:30:00.000Z"
    }
  ],
  "lastModified": "2026-02-07T15:30:00.000Z"
}
```

---

## Storage Limits

- **localStorage quota**: Typically 5-10 MB per origin (browser-dependent).
- **Practical limit**: ~50 characters before performance may degrade.
- Use `getStorageSize()` to check current usage in bytes.
- The Data Management screen in the UI exposes current storage usage.
