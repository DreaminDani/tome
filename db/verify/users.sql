-- Verify anymessage:users on pg

BEGIN;

SELECT "id", "auth_metadata", "auth_id", "created_at", "updated_at"
  FROM users
  WHERE FALSE;

select tgname
    from pg_trigger
    where not tgisinternal
    and tgname = 'users_bu';

ROLLBACK;
