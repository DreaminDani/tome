-- Revert tome:users from pg

BEGIN;

ALTER TABLE "artifacts"
DROP "name",
DROP "id",
DROP "body",
DROP "comments";
COMMENT ON TABLE "artifacts" IS '';

ALTER TABLE "artifacts"
ALTER "artifact_id" TYPE uuid,
ALTER "artifact_id" SET DEFAULT gen_random_uuid(),
ALTER "artifact_id" SET NOT NULL;
ALTER TABLE "artifacts" RENAME "artifact_id" TO "id";
COMMENT ON COLUMN "artifacts"."id" IS '';
COMMENT ON TABLE "artifacts" IS '';

COMMIT;
