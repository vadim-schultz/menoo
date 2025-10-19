#!/bin/bash

# Menoo Quick Start Script
# Starts both backend and frontend servers

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
cd ..

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
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting servers..."
echo "  - Backend: http://localhost:8000"
echo "  - Frontend: http://localhost:5173"
echo "  - API Docs: http://localhost:8000/schema"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend
source .venv/bin/activate
litestar --app app.main:app run --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
