-- Deploy tome:locallogin to pg
-- requires: users

BEGIN;

-- Update users table to use email as auth_id

ALTER TABLE "users"
ALTER "auth_id" TYPE character varying,
ALTER "auth_id" DROP DEFAULT,
ALTER "auth_id" DROP NOT NULL,
ADD "password" character varying NULL;
ALTER TABLE "users" RENAME "auth_id" TO "email";
COMMENT ON COLUMN "users"."email" IS '';
COMMENT ON TABLE "users" IS '';

-- Migrate data in auth_metadata to overwrite existing auth_ids with email
UPDATE users SET email=auth_metadata->>'email';

COMMIT;
