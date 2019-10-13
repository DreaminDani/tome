-- Revert tome:locallogin from pg

BEGIN;

-- Revert users table to use auth_id instead of email

ALTER TABLE "users"
ALTER "email" TYPE character varying,
ALTER "email" DROP DEFAULT,
ALTER "email" SET NOT NULL,
DROP "password";
ALTER TABLE "users" RENAME "email" TO "auth_id";
COMMENT ON COLUMN "users"."auth_id" IS '';
COMMENT ON TABLE "users" IS '';

-- Migrate data in auth_metadata to overwrite previously migrated auth_ids
UPDATE users SET auth_id=auth_metadata->>'sub'

COMMIT;
