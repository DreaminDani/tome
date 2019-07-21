-- Deploy tome:artifacts to pg
-- requires: appschema

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "artifacts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" integer REFERENCES users(id),
  "artifact_data" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER "artifacts_bu" BEFORE UPDATE ON "artifacts" FOR EACH ROW
EXECUTE PROCEDURE update_changetimestamp_column();

COMMIT;
