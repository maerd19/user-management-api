#!/bin/sh
set -e

echo "🔄 Running database migrations..."
if npm run migration:run; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migration failed, but continuing..."
fi

echo "🚀 Starting application..."
exec dumb-init node dist/main
