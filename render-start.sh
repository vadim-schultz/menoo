#!/bin/bash
set -e

# Convert postgresql:// to postgresql+asyncpg:// for async SQLAlchemy
export DATABASE_URL=$(echo $DATABASE_URL | sed 's|postgresql://|postgresql+asyncpg://|')

# Start application
cd backend
python -m litestar run --app app.main:app --host 0.0.0.0 --port $PORT

