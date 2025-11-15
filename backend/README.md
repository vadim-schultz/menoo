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

- `POST /recipes` - Get recipe suggestions based on ingredients (AI + heuristic)
- `POST /accept` - Accept and save an AI-generated recipe
- `POST /shopping-list` - Generate shopping list

## Marvin AI Integration

### Overview

The backend uses [Marvin](https://www.askmarvin.ai/) to generate creative AI-powered recipes. Marvin provides structured AI interactions with OpenAI's GPT models, ensuring reliable and validated outputs.

### Configuration

Required environment variables in `.env`:

```bash
# Required for AI features
OPENAI_API_KEY=sk-your-api-key-here

# Optional - AI configuration
MARVIN_CACHE_ENABLED=true           # Cache AI responses (recommended)
MARVIN_CACHE_TTL_SECONDS=3600       # Cache time-to-live (1 hour)
SUGGESTION_RATE_LIMIT=10            # Max requests per period
SUGGESTION_RATE_PERIOD=60           # Rate limit period (seconds)
```

### Architecture

- **Lazy Initialization**: Marvin is configured only when needed via `configure_marvin()`
- **Service Layer**: `SuggestionService` handles AI generation with caching and fallbacks
- **Validation**: All AI outputs are validated against Pydantic schemas
- **Fallback**: Automatically falls back to heuristic matching if AI fails
- **Caching**: In-memory cache with TTL to reduce API costs

### Testing with Mocks

Always mock Marvin calls in tests to avoid API costs:

```python
# Unit test example
@pytest.fixture
def mock_marvin(monkeypatch):
    async def mock_generate(*args, **kwargs):
        return Recipe(
            name="Test Recipe",
            ingredients=[...],
            instructions="Test instructions"
        )

    monkeypatch.setattr(
        "app.services.suggestion_service.SuggestionService.generate_recipe_with_marvin",
        mock_generate
    )
```

### Cost Management

**Best Practices:**

1. **Enable Caching**: Set `MARVIN_CACHE_ENABLED=true` to cache identical requests
2. **Rate Limiting**: Configure appropriate limits to prevent abuse
3. **Monitor Usage**: Regularly check OpenAI usage dashboard
4. **Set Alerts**: Configure billing alerts in OpenAI dashboard
5. **Feature Flags**: Consider adding a `MARVIN_ENABLED` flag for easy toggle

**Expected Costs:**

- GPT-4 generation: ~$0.01-0.03 per recipe (varies by prompt complexity)
- Caching can reduce costs by 80-90% for repeated ingredient combinations
- Rate limiting prevents runaway costs from automated requests

### Troubleshooting

**Marvin not generating recipes:**

1. Verify `OPENAI_API_KEY` is set and valid
2. Check logs for specific error messages
3. Ensure OpenAI account has available credits
4. Verify GPT-4 API access is enabled

**Slow response times:**

- AI generation typically takes 5-15 seconds
- Check OpenAI API status
- Consider implementing async job queue for production
- Increase cache TTL to reduce regeneration

**Validation errors:**

- Review Marvin output in logs
- Ensure prompts are clear and specific
- Check Pydantic schema matches expected output
- Fallback will activate automatically

### Environment Variables

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
