-- Revert tome:session from pg

BEGIN;

DROP TABLE "session";

COMMIT;
