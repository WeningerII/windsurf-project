-- Enable realtime on the campaigns table.
--
-- Runs idempotently.  Supabase migrations are forward-only, so existing
-- projects that already ran 001_initial.sql should apply this file to
-- start receiving realtime INSERT / UPDATE / DELETE events on their own
-- campaign rows (subject to the RLS policy declared in 001).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'campaigns'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE campaigns';
  END IF;
END
$$;
