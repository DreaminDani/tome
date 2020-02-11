-- Deploy tome:users to pg
-- requires: appschema

BEGIN;

ALTER TABLE "artifacts"
ADD "name" text NULL;
COMMENT ON TABLE "artifacts" IS '';

UPDATE "artifacts"
SET    "name" = artifacts.artifact_data->>'name'

COMMIT;
