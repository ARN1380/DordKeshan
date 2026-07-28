#!/bin/sh
set -e

PB_URL="http://localhost:8090"

/usr/local/bin/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/data &
PB_PID=$!

echo "Waiting for PocketBase to start..."
RETRIES=0
MAX_RETRIES=30
until wget -q -O /dev/null "${PB_URL}/api/health" 2>/dev/null; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: PocketBase failed to start after ${MAX_RETRIES} attempts"
    kill $PB_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done
echo "PocketBase is up."

/usr/local/bin/pocketbase superuser upsert --dir=/pb/data "${PB_ADMIN_EMAIL}" "${PB_ADMIN_PASSWORD}" 2>/dev/null || true

echo "Authenticating as superuser..."
AUTH_RESP=$(wget -q -O- --post-data="{\"identity\":\"${PB_ADMIN_EMAIL}\",\"password\":\"${PB_ADMIN_PASSWORD}\"}" \
  --header="Content-Type: application/json" \
  "${PB_URL}/api/collections/_superusers/auth-with-password" 2>/dev/null)

ADMIN_TOKEN=$(echo "$AUTH_RESP" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "ERROR: Failed to get admin token"
  echo "Auth response: $AUTH_RESP"
  wait $PB_PID
  exit 1
fi

AUTH="Authorization: Bearer ${ADMIN_TOKEN}"
echo "Got admin token."

collection_exists() {
  local code
  code=$(wget -q -O /dev/null --server-response --header="${AUTH}" "${PB_URL}/api/collections/$1" 2>&1 | grep "HTTP/" | awk '{print $2}')
  [ "$code" = "200" ]
}

# Create people collection
if collection_exists "people"; then
  echo "Collection 'people' already exists, skipping."
else
  echo "Creating collection 'people'..."
  RESP=$(wget -q -O- --post-data='{
    "name": "people",
    "type": "base",
    "fields": [
      {"name": "name", "type": "text", "required": true, "min": 1, "max": 255},
      {"name": "slug", "type": "text", "required": true, "min": 1, "max": 255},
      {"name": "title", "type": "text", "required": false, "max": 500},
      {"name": "bio", "type": "text", "required": false, "max": 10000},
      {"name": "categories", "type": "text", "required": false, "max": 500},
      {"name": "photo", "type": "file", "required": false, "maxSelect": 1, "maxSize": 10485760, "mimeTypes": ["image/jpeg", "image/png", "image/webp"]},
      {"name": "order", "type": "number", "required": false}
    ],
    "indexes": ["CREATE UNIQUE INDEX idx_people_slug ON people (slug)"],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }' \
    --header="Content-Type: application/json" \
    --header="${AUTH}" \
    "${PB_URL}/api/collections" 2>/dev/null)

  if echo "$RESP" | grep -q '"id"'; then
    echo "Created 'people' successfully."
  else
    echo "ERROR creating people: $RESP"
  fi
fi

# Get people collection ID
PEOPLE_ID=$(wget -q -O- --header="${AUTH}" "${PB_URL}/api/collections/people" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PEOPLE_ID" ]; then
  echo "ERROR: Could not find people collection ID"
  wait $PB_PID
  exit 1
fi

echo "People collection ID: ${PEOPLE_ID}"

# Create collections collection (groups of speeches per person)
if collection_exists "speech_collections"; then
  echo "Collection 'speech_collections' already exists, skipping."
else
  echo "Creating collection 'speech_collections'..."
  RESP=$(wget -q -O- --post-data="{
    \"name\": \"speech_collections\",
    \"type\": \"base\",
    \"fields\": [
      {\"name\": \"person\", \"type\": \"relation\", \"required\": true, \"collectionId\": \"${PEOPLE_ID}\", \"cascadeDelete\": true, \"maxSelect\": 1},
      {\"name\": \"title\", \"type\": \"text\", \"required\": true, \"min\": 1, \"max\": 500},
      {\"name\": \"description\", \"type\": \"text\", \"required\": false, \"max\": 5000},
      {\"name\": \"cover_image\", \"type\": \"file\", \"required\": false, \"maxSelect\": 1, \"maxSize\": 10485760, \"mimeTypes\": [\"image/jpeg\", \"image/png\", \"image/webp\"]},
      {\"name\": \"order\", \"type\": \"number\", \"required\": false}
    ],
    \"listRule\": \"\",
    \"viewRule\": \"\",
    \"createRule\": null,
    \"updateRule\": null,
    \"deleteRule\": null
  }" \
    --header="Content-Type: application/json" \
    --header="${AUTH}" \
    "${PB_URL}/api/collections" 2>/dev/null)

  if echo "$RESP" | grep -q '"id"'; then
    echo "Created 'speech_collections' successfully."
  else
    echo "ERROR creating speech_collections: $RESP"
  fi
fi

# Get speech_collections collection ID
COLLECTIONS_ID=$(wget -q -O- --header="${AUTH}" "${PB_URL}/api/collections/speech_collections" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$COLLECTIONS_ID" ]; then
  echo "ERROR: Could not find speech_collections collection ID"
  wait $PB_PID
  exit 1
fi

echo "Speech_collections collection ID: ${COLLECTIONS_ID}"

# Create speeches collection (now relates to collections, not people)
if collection_exists "speeches"; then
  echo "Collection 'speeches' already exists, skipping."
else
  echo "Creating collection 'speeches'..."
  RESP=$(wget -q -O- --post-data="{
    \"name\": \"speeches\",
    \"type\": \"base\",
    \"fields\": [
      {\"name\": \"collection\", \"type\": \"relation\", \"required\": true, \"collectionId\": \"${COLLECTIONS_ID}\", \"cascadeDelete\": true, \"maxSelect\": 1},
      {\"name\": \"title\", \"type\": \"text\", \"required\": true, \"min\": 1, \"max\": 500},
      {\"name\": \"audio\", \"type\": \"file\", \"required\": false, \"maxSelect\": 1, \"maxSize\": 104857600, \"mimeTypes\": [\"audio/mpeg\", \"audio/mp3\", \"audio/wav\", \"audio/ogg\", \"audio/mp4\", \"audio/x-m4a\"]},
      {\"name\": \"description\", \"type\": \"text\", \"required\": false, \"max\": 5000},
      {\"name\": \"duration\", \"type\": \"text\", \"required\": false, \"max\": 50},
      {\"name\": \"date\", \"type\": \"date\", \"required\": false},
      {\"name\": \"order\", \"type\": \"number\", \"required\": false}
    ],
    \"listRule\": \"\",
    \"viewRule\": \"\",
    \"createRule\": null,
    \"updateRule\": null,
    \"deleteRule\": null
  }" \
    --header="Content-Type: application/json" \
    --header="${AUTH}" \
    "${PB_URL}/api/collections" 2>/dev/null)

  if echo "$RESP" | grep -q '"id"'; then
    echo "Created 'speeches' successfully."
  else
    echo "ERROR creating speeches: $RESP"
  fi
fi

echo "Setup complete. Seeding data..."
sh /seed.sh
echo "Seed complete. PocketBase is running."
wait $PB_PID
