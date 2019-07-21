-- Revert tome:users from pg

BEGIN;

DROP TABLE "users";

COMMIT;
