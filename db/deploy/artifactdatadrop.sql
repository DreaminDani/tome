-- Deploy tome:artifactdatadrop to pg
-- requires: appschema

BEGIN;

ALTER TABLE "artifacts"
DROP "artifact_data";
COMMENT ON TABLE "artifacts" IS '';

COMMIT;