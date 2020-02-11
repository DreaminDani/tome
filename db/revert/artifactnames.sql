-- Revert tome:users from pg

BEGIN;

ALTER TABLE "artifacts"
DROP "name";
COMMENT ON TABLE "artifacts" IS '';

COMMIT;
