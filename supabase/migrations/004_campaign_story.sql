-- Campaign story scaffolding: quests (with nested objectives) and a session log.
--
-- Both are client-owned JSONB blobs, mirroring how `system_data` works for
-- documents: the server stores the structure opaquely and the client is the
-- sole reader/writer.  `fromRemoteCampaign` re-parses the JSON through the same
-- `parseCampaign` boundary as every other field, so a malformed quest or entry
-- is dropped on read rather than trusted.  Defaulting to '[]' means rows
-- written before this migration (and the columns themselves) hydrate as empty
-- collections — no backfill required.
--
-- Runs idempotently.  Apply to existing Supabase projects BEFORE deploying a
-- client built from this revision.

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS quests JSONB NOT NULL DEFAULT '[]';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS session_log JSONB NOT NULL DEFAULT '[]';
