-- Deploy tome:users to pg
-- requires: appschema

BEGIN;

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "auth_id" varchar,
  "auth_metadata" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER "users_bu" BEFORE UPDATE ON "users" FOR EACH ROW
EXECUTE PROCEDURE update_changetimestamp_column();

COMMIT;
