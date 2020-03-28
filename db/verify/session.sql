-- Verify tome:session on pg

BEGIN;

SELECT "sid", "sess", "expire"
  FROM "session"
  WHERE FALSE;

ROLLBACK;
