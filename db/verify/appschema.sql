-- Verify tome

BEGIN;

SELECT pg_catalog.has_schema_privilege('tome', 'usage');

select exists(select * from pg_proc where proname = 'update_changetimestamp_column');

ROLLBACK;