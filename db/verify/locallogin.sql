-- Verify tome:locallogin on pg

BEGIN;

SELECT "id", "auth_metadata", "email", "password", "created_at", "updated_at"
  FROM users
  WHERE FALSE;

ROLLBACK;
