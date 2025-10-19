# Menoo Backend

Lightweight recipe management system backend built with Litestar.

## Quick Start

### Prerequisites

- Python 3.11+
- pip or uv

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
.\venv\Scripts\activate  # On Windows

# Install dependencies
pip install -e ".[dev]"

# Copy environment file
cp .env.example .env

# Edit .env and add your OpenAI API key if using AI features
```

### Database Setup

```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

### Running the Application

```bash
# Development mode with auto-reload
litestar --app app.main:app run --reload --host 0.0.0.0 --port 8000

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/schema/swagger
- ReDoc: http://localhost:8000/schema/redoc
- OpenAPI JSON: http://localhost:8000/schema/openapi.json

## Development

### Code Quality

```bash
# Format code
ruff format .

# Lint code
ruff check . --fix

# Type check
mypy app/

# Run all checks
ruff check . && ruff format --check . && mypy app/
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_ingredient_service.py

# Run unit tests only
pytest -m unit

# Run integration tests only
pytest -m integration
```

### Pre-commit Hooks

```bash
# Install pre-commit hooks
pre-commit install

# Run hooks manually
pre-commit run --all-files
```

## Project Structure

```
backend/
├── app/
│   ├── controllers/      # HTTP route handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # SQLAlchemy ORM models
│   ├── schemas/          # Pydantic request/response models
│   ├── config.py         # Application configuration
│   ├── database.py       # Database setup
│   ├── dependencies.py   # Dependency injection
│   ├── events.py         # Lifecycle events
│   ├── logging.py        # Logging configuration
│   └── main.py           # Application entry point
├── tests/                # Test files
├── migrations/           # Alembic migrations
└── pyproject.toml        # Project configuration
```

## API Endpoints

### Health

- `GET /healthz` - Health check
- `GET /readiness` - Readiness check

### Ingredients (`/api/v1/ingredients`)

- `GET /` - List ingredients with filters
- `POST /` - Create ingredient
- `GET /{id}` - Get ingredient
- `PUT /{id}` - Update ingredient (full)
- `PATCH /{id}` - Update ingredient (partial)
- `DELETE /{id}` - Delete ingredient (soft)

### Recipes (`/api/v1/recipes`)

- `GET /` - List recipes with filters
- `POST /` - Create recipe
- `GET /{id}` - Get recipe with ingredients
- `PUT /{id}` - Update recipe (full)
- `PATCH /{id}` - Update recipe (partial)
- `DELETE /{id}` - Delete recipe (soft)
- `GET /{id}/ingredients` - Get recipe ingredients
- `POST /{id}/ingredients` - Add/update ingredients

### Suggestions (`/api/v1/suggestions`)

- `POST /recipes` - Get recipe suggestions based on ingredients
- `POST /shopping-list` - Generate shopping list

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:

- `DATABASE_URL` - SQLite database location
- `OPENAI_API_KEY` - OpenAI API key for suggestions
- `DEBUG` - Enable debug mode
- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)

## Deployment

### Production Setup

```bash
# Install production dependencies only
pip install .

# Set production environment
export ENVIRONMENT=production
export DEBUG=false
export LOG_JSON=true

# Run with Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

### Systemd Service

See `deploy.sh` for systemd service configuration example.

## License

MIT
