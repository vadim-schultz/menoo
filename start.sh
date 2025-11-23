#!/bin/bash

# Menoo Quick Start Script
# Builds frontend and starts backend server that serves both API and static frontend files

set -e

echo "🚀 Starting Menoo Application..."
echo ""

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check backend dependencies
echo "📦 Checking backend dependencies..."
cd backend
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate
echo "Installing backend dependencies..."
pip install -e . > /dev/null 2>&1
cd ..

# Check frontend dependencies
echo "📦 Checking frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
fi

# Build frontend for production
echo "🔨 Building frontend..."
npm run build

# Create static directory in backend if it doesn't exist
cd ..
mkdir -p backend/app/static

# Copy built frontend files to backend static directory
echo "📋 Copying frontend build to backend..."
rm -rf backend/app/static/*
cp -r frontend/dist/* backend/app/static/

# Initialize database
echo "🗄️  Initializing database..."
cd backend
if [ ! -f "menoo.db" ]; then
    python -c "
from app.config import get_settings
from app.database import get_db_manager
import asyncio

async def init_db():
    settings = get_settings()
    db_manager = get_db_manager(settings)
    await db_manager.init_db()

asyncio.run(init_db())
print('Database initialized')
" || echo "Note: Database initialization can also be done via alembic migrations"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting backend server..."
echo "  - Full Stack App: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/schema"
echo "  - API Endpoints: http://localhost:8000/api/v1"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start backend (serves both API and frontend)
source .venv/bin/activate
litestar --app app.main:app run --host 0.0.0.0 --port 8000 --reload
