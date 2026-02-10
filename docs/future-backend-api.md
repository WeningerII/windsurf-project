# Future Backend API Contract

**Last Updated**: February 7, 2026  
**Status**: Draft — no backend exists yet. This documents the contract a future backend should implement to replace localStorage persistence.

---

## Overview

The application currently runs entirely client-side with localStorage as the persistence layer (see `data-export-format.md`). A future backend would enable:

- Cross-device sync
- Shared campaigns / party management
- Server-side validation
- User accounts and authentication
- Larger storage capacity

---

## Design Principles

1. **Backward compatible** — The JSON envelope format (`version`, `characters[]`, `lastModified`) must remain the canonical wire format.
2. **Offline-first** — The client should continue working with localStorage and sync when connectivity is available.
3. **Stateless API** — Use token-based auth (JWT). No server-side sessions.
4. **Idempotent writes** — PUT and DELETE operations should be safely retryable.

---

## Proposed Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `POST` | `/api/auth/refresh` | Refresh JWT |

### Characters

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/characters` | List all characters for authenticated user |
| `GET` | `/api/characters/:id` | Get single character |
| `POST` | `/api/characters` | Create character |
| `PUT` | `/api/characters/:id` | Update character (full replace) |
| `PATCH` | `/api/characters/:id` | Partial update |
| `DELETE` | `/api/characters/:id` | Delete character |

### Bulk Operations

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/characters/export` | Export all characters (returns envelope JSON) |
| `POST` | `/api/characters/import` | Import characters from envelope JSON |
| `DELETE` | `/api/characters` | Clear all characters (requires confirmation header) |

### Sync

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/sync` | Two-way sync. Client sends local state + `lastSyncedAt`; server returns merged result. |

---

## Request / Response Format

### Create Character

**Request:**

```http
POST /api/characters
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Gandalf",
  "system": "dnd-5e-2014",
  "level": 20,
  ...
}
```

**Response (201):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Gandalf",
  "system": "dnd-5e-2014",
  "level": 20,
  "createdAt": "2026-02-07T12:00:00.000Z",
  "updatedAt": "2026-02-07T12:00:00.000Z"
}
```

### Export All

**Response (200):**

Uses the same envelope format as file export:

```json
{
  "version": "1.0",
  "characters": [ ... ],
  "lastModified": "2026-02-07T15:30:00.000Z"
}
```

### Sync

**Request:**

```json
{
  "lastSyncedAt": "2026-02-07T10:00:00.000Z",
  "localCharacters": [ ... ]
}
```

**Response (200):**

```json
{
  "mergedCharacters": [ ... ],
  "conflicts": [
    {
      "characterId": "abc123",
      "localVersion": { ... },
      "serverVersion": { ... }
    }
  ],
  "syncedAt": "2026-02-07T15:30:00.000Z"
}
```

---

## Error Responses

All errors use a consistent envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Character name is required",
    "details": { "field": "name" }
  }
}
```

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Not owner of resource |
| 404 | `NOT_FOUND` | Character does not exist |
| 409 | `CONFLICT` | Version conflict during sync |
| 413 | `PAYLOAD_TOO_LARGE` | Import file exceeds size limit |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Migration Path

To add a backend without breaking existing users:

1. **Phase A**: Ship backend with account creation. Client continues using localStorage as primary.
2. **Phase B**: Add optional "Sign in to sync" button. On first sign-in, upload localStorage data to server.
3. **Phase C**: Once synced, server becomes source of truth. localStorage acts as offline cache.
4. **Phase D**: Deprecate localStorage-only mode (optional).

The `StorageData.version` field should be bumped to `"2.0"` when server sync is introduced, with a migration handler in `loadCharacters()`.

---

## Technology Recommendations

| Concern | Recommendation |
|---------|----------------|
| Runtime | Node.js + Express or Fastify |
| Database | PostgreSQL (relational, JSONB for flexible fields) |
| Auth | JWT with refresh tokens, bcrypt for passwords |
| Validation | Zod (shared schemas between client and server) |
| Hosting | Vercel Serverless Functions or Railway |
| ORM | Drizzle or Prisma |
