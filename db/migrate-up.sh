#! /bin/bash

RETRIES=5

until psql "$TARGET_URI" -c '\q' > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

sqitch deploy --target "${TARGET_URI}" --verify