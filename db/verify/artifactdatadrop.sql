-- Verify tome:artifactdatadump on pg

BEGIN;

SELECT "name", "body", "comments", "artifact_id"
  FROM artifacts
  WHERE FALSE;

ROLLBACK;
