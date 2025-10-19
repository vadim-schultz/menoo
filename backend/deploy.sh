#!/usr/bin/env bash
# Deployment script for Menoo backend

set -e

echo "🚀 Menoo Deployment Script"
echo "=========================="

# Configuration
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="menoo"
APP_USER="${APP_USER:-menoo}"
PYTHON_VERSION="3.11"
VENV_DIR="${APP_DIR}/venv"
DB_PATH="${APP_DIR}/menoo.db"

# Colors for output
GREEN='\033[0.32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check Python version
check_python() {
    info "Checking Python version..."
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is not installed"
    fi

    PYTHON_VER=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    if [[ "$PYTHON_VER" != "$PYTHON_VERSION" ]]; then
        warn "Python $PYTHON_VERSION recommended, found $PYTHON_VER"
    fi
}

# Setup virtual environment
setup_venv() {
    info "Setting up virtual environment..."
    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
    fi
    source "$VENV_DIR/bin/activate"
}

# Install dependencies
install_deps() {
    info "Installing dependencies..."
    pip install --upgrade pip
    pip install -e .
}

# Setup database
setup_database() {
    info "Setting up database..."
    if [ ! -f "$DB_PATH" ]; then
        info "Creating new database..."
        alembic upgrade head
    else
        info "Database exists, running migrations..."
        alembic upgrade head
    fi
}

# Create systemd service
create_systemd_service() {
    info "Creating systemd service..."

    SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"

    if [ "$EUID" -ne 0 ]; then
        warn "Run with sudo to create systemd service"
        info "Service file template:"
        cat << EOF
[Unit]
Description=Menoo Recipe Management System
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment="PATH=${VENV_DIR}/bin"
EnvironmentFile=${APP_DIR}/.env
ExecStart=${VENV_DIR}/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        return
    fi

    cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Menoo Recipe Management System
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment="PATH=${VENV_DIR}/bin"
EnvironmentFile=${APP_DIR}/.env
ExecStart=${VENV_DIR}/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    info "Systemd service created at $SERVICE_FILE"
    info "Enable with: sudo systemctl enable ${APP_NAME}"
    info "Start with: sudo systemctl start ${APP_NAME}"
}

# Main deployment
main() {
    info "Starting deployment..."

    check_python
    setup_venv
    install_deps
    setup_database

    if [ "$1" = "--systemd" ]; then
        create_systemd_service
    fi

    info "✅ Deployment complete!"
    info ""
    info "To start the application:"
    info "  source ${VENV_DIR}/bin/activate"
    info "  uvicorn app.main:app --host 0.0.0.0 --port 8000"
    info ""
    info "Or with systemd:"
    info "  sudo systemctl start ${APP_NAME}"
}

main "$@"
