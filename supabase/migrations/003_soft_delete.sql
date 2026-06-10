-- Soft-delete tombstones + client-owned updated_at.
--
-- 1. `deleted_at` columns: deletions are now soft-deletes.  The client marks
--    a row deleted (`deleted_at = now-ish ISO timestamp`) instead of removing
--    it, so every other device sees an explicit tombstone on its next fetch
--    and removes the entity locally rather than resurrecting it from a stale
--    local copy.  Live rows keep `deleted_at IS NULL`.  Client upserts never
--    include the column, so a stale full-collection push cannot revive a
--    tombstoned row; only the explicit restore path clears it.
--
-- 2. Drop the `update_updated_at` triggers: in this sync protocol the CLIENT
--    owns `updated_at` (it is the last-writer-wins conflict timestamp, stamped
--    at edit time).  The trigger rewrote it to the time of the last push,
--    which made any later push from another device "win" over a real edit and
--    silently revert it.  Nothing else uses the function, so it is dropped
--    too.
--
-- Runs idempotently.  Apply to existing Supabase projects BEFORE deploying a
-- client built from this revision.

ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

DROP TRIGGER IF EXISTS documents_updated_at ON documents;
DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
DROP FUNCTION IF EXISTS update_updated_at();
