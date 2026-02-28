#!/bin/bash
if [ -z "$URI"  ]; then
  echo "Usage: $0 <mongodb-uri>"
  exit 1
fi

MAX_WAIT=60  # seconds
COUNTER=0

until mongosh "$URI" --authenticationDatabase admin --eval "db.adminCommand('ping')"|| [ $COUNTER -ge $MAX_WAIT ]; do
  echo "Waiting for MongoDB at $HOST..."
  sleep 5
  COUNTER=$((COUNTER + 5))
done
if [ $COUNTER -ge $MAX_WAIT ]; then
  echo "ERROR: MongoDB not ready after ${MAX_WAIT}s timeout. Exiting."
  exit 1
fi

echo "MongoDB ready, importing..."
mongosh "$URI" --authenticationDatabase admin --eval "db.dropDatabase()"
mongoimport --uri "$URI" --collection anime --authenticationDatabase=admin ./animedb-data.json --jsonArray
mongoimport --uri "$URI" --collection metadata --authenticationDatabase=admin ./animedb-meta.json