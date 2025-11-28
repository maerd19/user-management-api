#!/bin/sh
set -e

echo "🔄 Running database migrations..."
if node dist/data-source.js; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migration failed, but continuing..."
fi

echo "🚀 Starting application..."
exec dumb-init node dist/main
