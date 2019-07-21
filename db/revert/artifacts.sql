-- Revert tome:artifacts from pg

BEGIN;

DROP TABLE "artifacts";

COMMIT;
