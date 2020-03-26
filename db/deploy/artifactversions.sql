-- Deploy tome:users to pg
-- requires: appschema

BEGIN;

ALTER TABLE "artifacts"
ALTER "id" TYPE uuid,
ALTER "id" SET DEFAULT gen_random_uuid(),
ALTER "id" SET NOT NULL;
ALTER TABLE "artifacts" RENAME "id" TO "artifact_id";
COMMENT ON COLUMN "artifacts"."artifact_id" IS '';
COMMENT ON TABLE "artifacts" IS '';

ALTER TABLE "artifacts"
ADD "id" serial NOT NULL;
COMMENT ON TABLE "artifacts" IS '';

ALTER TABLE "artifacts"
ADD "name" text NULL,
ADD "body" text NULL,
ADD "comments" jsonb NULL;
COMMENT ON TABLE "artifacts" IS '';

UPDATE "artifacts"
SET    "name" = artifacts.artifact_data->>'name',
       "body" = artifacts.artifact_data->>'body',
       "comments" = artifacts.artifact_data->'comments';

COMMIT;
