#!/bin/bash
set -e

echo "Building Menoo for Render..."

# Install backend dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -e backend/.

# Build frontend
echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Copy frontend build to backend static
echo "Copying frontend build to backend..."
cp -r frontend/dist/* backend/app/static/

echo "Build complete!"

