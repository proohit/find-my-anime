#!/bin/bash
curl -L --output animedb.json "https://github.com/manami-project/anime-offline-database/releases/download/latest/anime-offline-database-minified.json"
cat animedb.json | jq .data > animedb-data.json
jq '{lastUpdate: .lastUpdate}' animedb.json > animedb-meta.json
jq --arg now "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)" '. + {lastDownload: $now}' animedb-meta.json > metadata.tmp && mv metadata.tmp animedb-meta.json

rm animedb.json