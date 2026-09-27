#!/usr/bin/env bash
set -euo pipefail

echo "Running smoke check..."

REQUIRED_VARS=("DATABASE_URL" "CMS_DATABASE_URL" "PAYLOAD_SECRET")

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR:-}" ]; then
    echo "Error: Required environment variable '$VAR' is not set."
    exit 1
  fi
done

echo "Environment variables look good."

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}"

cleanup() {
  if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting Next.js server..."
npm run start -- -H "$HOST" -p "$PORT" &
SERVER_PID=$!

for _ in {1..30}; do
  if curl --fail --silent --show-error "$URL/" >/dev/null; then
    echo "Smoke check passed: $URL responded successfully."
    exit 0
  fi

  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Error: Next.js server exited before becoming ready."
    exit 1
  fi

  sleep 1
done

echo "Error: Next.js server did not become ready within 30 seconds."
exit 1
