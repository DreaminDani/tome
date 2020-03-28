-- Revert tome:artifactdatadrop from pg

BEGIN;

ALTER TABLE "artifacts"
ADD "artifact_data" jsonb NULL;
COMMENT ON TABLE "artifacts" IS '';

COMMIT;
