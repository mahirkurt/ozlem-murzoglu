#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-4000}"

echo "Starting Dr. Ozlem Murzoglu Dev Server on Port ${PORT}..."

if command -v lsof >/dev/null 2>&1; then
  PID=$(lsof -t -i ":${PORT}" || true)
  if [ -n "${PID}" ]; then
    echo "Port ${PORT} is in use. Attempting to clear..."
    kill -9 "${PID}" || true
    echo "Port cleared."
  fi
fi

if [ -d ".angular" ]; then
  echo "Cleaning .angular cache..."
  rm -rf ".angular"
fi

echo "Launching Angular Server..."
echo "Access at: http://localhost:${PORT}"
echo "----------------------------------------"

npx ng serve --port "${PORT}" --host 0.0.0.0 --disable-host-check
