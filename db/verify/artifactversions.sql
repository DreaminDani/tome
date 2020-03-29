-- Verify tome:artifactversions on pg

BEGIN;

SELECT "name", "body", "comments", "artifact_id"
  FROM artifacts
  WHERE FALSE;

ROLLBACK;
