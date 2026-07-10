---
type: "query"
date: "2026-07-10T14:10:08.730975+00:00"
question: "where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)"
contributor: "graphify"
outcome: "useful"
---

# Q: where are pending debounced document saves flushed to localStorage on page hide or unload (persistence flush)

## Answer

useDebouncedPersistence.ts registers pagehide/beforeunload/visibilitychange flush handlers (L78-95); combined with the IndexedDB mirror in documentStorage.ts this resurrects cleared localStorage in e2e resets

## Outcome

- Signal: useful