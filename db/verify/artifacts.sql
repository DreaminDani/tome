-- Verify tome:users on pg

BEGIN;

SELECT "id", "user_id", "artifact_data", "created_at", "updated_at"
  FROM artifacts
  WHERE FALSE;

select tgname
    from pg_trigger
    where not tgisinternal
    and tgname = 'artifacts_bu';

ROLLBACK;
