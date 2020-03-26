-- Verify anymessage:users on pg

BEGIN;

SELECT "name", "body", "comments", "artifact_id"
  FROM artifacts
  WHERE FALSE;

ROLLBACK;
