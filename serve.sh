#!/bin/sh
# Serve the port. Open http://localhost:8123/
#
# The game reads assets by relative path from the repo root, exactly as the
# desktop build does, so the server's root has to be the repo root.
cd "$(dirname "$0")"
exec python3 -m http.server "${1:-8123}"
