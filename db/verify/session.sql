-- Verify anymessage:users on pg

BEGIN;

SELECT "sid", "sess", "expire"
  FROM "session"
  WHERE FALSE;

ROLLBACK;
