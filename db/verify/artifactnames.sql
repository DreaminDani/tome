-- Verify anymessage:users on pg

BEGIN;

SELECT "name"
  FROM artifacts
  WHERE FALSE;

ROLLBACK;
