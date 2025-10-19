# Menoo - Implementation Guide

**Last Updated**: October 19, 2025  
**Overall Completion**: ~95%

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Strategy](#architecture-strategy)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Implementation Status](#implementation-status)
6. [Next Steps](#next-steps)
7. [Testing Strategy](#testing-strategy)
8. [Deployment](#deployment)

## Project Overview

Menoo is a resource-efficient full-stack web application that catalogs ingredients, stores recipes, and suggests dishes based on available pantry items. The solution runs comfortably on constrained hardware such as older Raspberry Pi devices, avoiding containers while keeping storage and runtime footprints minimal.

### Core Technology Stack

- **Backend**: Litestar (Python ASGI framework)
- **Frontend**: Vite + TypeScript + Preact
- **Database**: SQLite via SQLAlchemy ORM with Alembic migrations
- **AI Services**: Marvin + OpenAI API (with heuristic fallbacks)
- **Deployment**: Single-process deployment with systemd

### Design Principles

- **Low Resource Footprint**: Shared AsyncSession factory, lazy imports, HTTP client reuse
- **Clear Separation**: Controller → Service → Repository pattern throughout
- **Domain Alignment**: Frontend features mirror backend domains for consistent contracts
- **Static Bundling**: Frontend assets served directly by Litestar

## Architecture Strategy

### Backend Architecture (Litestar)

#### Project Layout

```
backend/
├── app/
│   ├── main.py                 # Litestar app factory
│   ├── config.py               # Pydantic settings with env overrides
│   ├── database.py             # AsyncSession factory, lifespan hooks
│   ├── dependencies.py         # Dependency injection providers
│   ├── events.py               # Startup/shutdown hooks
│   ├── logging.py              # Structured logging (structlog)
│   ├── controllers/
│   │   ├── ingredients.py      # Ingredient CRUD endpoints
│   │   ├── recipes.py          # Recipe CRUD + ingredient management
│   │   └── suggestions.py      # AI-powered suggestions
│   ├── services/
│   │   ├── ingredient_service.py
│   │   ├── recipe_service.py
│   │   └── suggestion_service.py  # Marvin/OpenAI + heuristic fallback
│   ├── repositories/
│   │   ├── ingredient_repository.py
│   │   ├── recipe_repository.py
│   │   └── recipe_ingredient_repository.py
│   ├── models/
│   │   ├── base.py             # Mixins: ID, timestamps, soft delete
│   │   ├── ingredient.py
│   │   ├── recipe.py
│   │   └── recipe_ingredient.py
│   ├── schemas/
│   │   ├── ingredient.py       # Pydantic request/response models
│   │   ├── recipe.py
│   │   └── suggestion.py
│   └── static/                 # Bundled frontend assets
├── tests/
├── migrations/                 # Alembic migrations
└── pyproject.toml             # Dependencies + tool config
```

#### API Endpoints

**Ingredients** (`/api/ingredients`)

- `GET /` - Paginated list with filters (storage_location, expiry_date, name)
- `POST /` - Create ingredient with duplicate validation
- `GET /{id}` - Get ingredient details
- `PUT /{id}` - Full update
- `PATCH /{id}` - Partial update
- `DELETE /{id}` - Soft delete

**Recipes** (`/api/recipes`)

- `GET /` - Paginated list with filters (difficulty, prep_time, has_ingredients)
- `POST /` - Create recipe with nested ingredients in one transaction
- `GET /{id}` - Get recipe with ingredient details
- `PUT /{id}` - Update recipe and ingredients atomically
- `PATCH /{id}` - Partial update
- `DELETE /{id}` - Soft delete with cascade

**Suggestions** (`/api/suggestions`)

- `POST /check` - Get recipe suggestions based on available ingredients
- `POST /shopping-list` - Generate shopping list for selected recipes

#### Data Model

**Ingredient**

- `id`, `name`, `storage_location` (fridge/freezer/pantry/counter)
- `quantity`, `unit`, `expiry_date`
- `created_at`, `updated_at`, `is_deleted`

**Recipe**

- `id`, `name`, `description`, `instructions`
- `prep_time`, `cook_time`, `servings`, `difficulty` (easy/medium/hard)
- `created_at`, `updated_at`, `is_deleted`

**RecipeIngredient** (junction table)

- `id`, `recipe_id`, `ingredient_id`
- `quantity`, `unit`, `is_optional`, `note`

**Database Optimizations**

- SQLite WAL mode for SD card performance
- Indices on name, storage_location, difficulty
- Soft deletes to preserve history

### Frontend Architecture (Vite + TypeScript + Preact)

#### Project Layout

```
frontend/
├── src/
│   ├── main.tsx                # App bootstrap and hydration
│   ├── app.tsx                 # Router and layout shell
│   ├── features/
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   ├── ingredients/
│   │   │   ├── pages/
│   │   │   │   └── IngredientsPage.tsx
│   │   │   └── components/
│   │   │       ├── IngredientList.tsx
│   │   │       └── IngredientForm.tsx
│   │   ├── recipes/
│   │   │   └── pages/
│   │   │       └── RecipesPage.tsx
│   │   └── suggestions/
│   │       └── pages/
│   │           └── SuggestionsPage.tsx
│   ├── shared/
│   │   ├── components/        # Layout, Navigation, Button, Input, Modal
│   │   ├── hooks/             # useApi, useForm, usePagination
│   │   ├── services/          # API client and service modules
│   │   ├── types/             # TypeScript interfaces (match Pydantic)
│   │   └── utils/
│   └── styles/
│       └── main.css          # Design system with CSS variables
├── public/
├── package.json
├── tsconfig.json             # TypeScript strict mode
├── vite.config.ts            # Vite with Preact plugin
└── vitest.config.ts
```

#### Key Patterns

- **State Management**: @preact/signals for lightweight reactive state
- **Type Safety**: TypeScript types mirror backend Pydantic schemas exactly
- **API Layer**: Generic HTTP client with error handling, typed service modules
- **Custom Hooks**: `useApi` for fetching, `useApiMutation` for mutations, `useForm` for forms
- **Component Architecture**: Feature-based organization, presentational vs container components
- **Optimistic Updates**: Immediate UI feedback with rollback on error

## Implementation Status

### ✅ Completed (Backend - 95%)

- [x] Complete project structure following strategy
- [x] Configuration with pydantic-settings
- [x] Async SQLAlchemy setup with SQLite WAL mode
- [x] All database models with mixins (ID, timestamps, soft delete)
- [x] All Pydantic schemas with validation
- [x] Repository layer with async queries, filtering, pagination
- [x] Service layer with business logic and validation
- [x] All controllers with full CRUD operations
- [x] Dependency injection system
- [x] Structured logging with structlog
- [x] Health endpoints (/healthz, /readiness)
- [x] OpenAPI documentation auto-generated
- [x] Alembic migration system configured
- [x] pytest test framework with async support
- [x] Pre-commit hooks (ruff, mypy, pyupgrade, pytest)
- [x] Deployment script with systemd service generation
- [x] Comprehensive backend README

**What Works**: The backend is fully functional. All API endpoints operational, database migrations working, OpenAPI docs available at `/schema`.

### ✅ Completed (Frontend - 95%)

- [x] Vite + Preact + TypeScript project setup
- [x] TypeScript strict mode configuration
- [x] Vite configuration with API proxy
- [x] Vitest and Playwright test configurations
- [x] ESLint and Prettier setup
- [x] Complete type system matching backend schemas
- [x] Generic API client with error handling
- [x] Service modules for all endpoints (ingredients, recipes, suggestions)
- [x] Custom hooks (useApi, useApiMutation, useForm, usePagination)
- [x] Shared UI components (Layout, Navigation, Button, Input, Textarea, Select, Modal)
- [x] Global CSS with design system (colors, spacing, typography)
- [x] Main app entry points (main.tsx, app.tsx)
- [x] Routing configured with preact-router
- [x] Home page
- [x] **Full ingredients feature** - Complete CRUD UI
  - IngredientsPage with list/create/edit/delete
  - IngredientList component
  - IngredientForm with validation
  - Modal-based editing
  - Loading and error states
- [x] **Full recipes feature** - Complete CRUD UI
  - RecipesPage with full CRUD operations
  - RecipeList component with formatted time display
  - RecipeForm with all fields and validation
  - RecipeIngredientInput for nested ingredient management
  - Dynamic ingredient selector with quantity/unit inputs
  - Modal-based create/edit flow
  - Loading and error states
- [x] **Full suggestions feature** - Complete UI
  - SuggestionsPage with full workflow
  - SuggestionForm with ingredient multi-select
  - Optional filters (prep/cook time, difficulty, max results)
  - SuggestionList with match scores and ingredient breakdown
  - Recipe selection for shopping list
  - ShoppingList component grouped by storage location
  - Copy to clipboard and print functionality
- [x] Dependencies installed (npm install successful)
- [x] TypeScript compilation successful (0 errors)
- [x] Production build successful (31.1kb JS + 4.1kb CSS, 8.4kb gzipped)

**What Works**: All three main features are fully functional end-to-end:

- **Ingredients**: Complete CRUD with real-time updates
- **Recipes**: Create/edit recipes with nested ingredients, view with all details
- **Suggestions**: Get recipe suggestions based on available ingredients, generate shopping lists grouped by location

### 🚧 In Progress

- [ ] Comprehensive test coverage (~3 hours)
  - Backend integration tests
  - Frontend component tests
  - E2E tests with Playwright
- [ ] CI/CD pipeline (~2 hours)
  - GitHub Actions workflows
  - Automated testing and build

### 📋 Future Enhancements

- [ ] AI Integration (Marvin/OpenAI)
  - Replace heuristic fallback with actual AI
  - Implement caching strategy
  - Add rate limiting
- [ ] Advanced Features
  - Search and filtering
  - Recipe tags and categories
  - Meal planning calendar
  - Nutrition information
- [ ] UX Improvements
  - Responsive design polish
  - Dark mode
  - Offline support
  - Loading skeletons
  - Toast notifications
- [ ] Production Hardening
  - Performance profiling on target hardware
  - Monitoring and alerting
  - Backup automation
  - User authentication (optional)

## Next Steps

### ✅ Completed Features

**Recipes Feature** - ✓ Complete

- ✓ RecipeList component with formatted times and difficulty
- ✓ RecipeForm with all fields and validation
- ✓ RecipeIngredientInput for dynamic ingredient management
- ✓ RecipesPage with full CRUD and modal-based editing
- ✓ TypeScript compilation: 0 errors
- ✓ Production build: successful

**Suggestions Feature** - ✓ Complete

- ✓ SuggestionForm with ingredient multi-select and filters
- ✓ SuggestionList with match scores and selection
- ✓ ShoppingList grouped by storage location
- ✓ SuggestionsPage with complete workflow
- ✓ Copy to clipboard and print functionality
- ✓ TypeScript compilation: 0 errors
- ✓ Production build: successful (31.1kb JS gzipped)

### 1. Add Test Coverage (HIGH PRIORITY)

### 1. Add Test Coverage (HIGH PRIORITY)

**Backend Tests** (~2 hours):

- Integration tests for all API endpoints
- Test edge cases and validation
- Aim for 70%+ coverage

**Frontend Tests** (~2 hours):

- Component tests for shared components
- Hook tests (useApi, useForm, usePagination)
- Service tests for API client

**E2E Tests** (~1 hour):

- User flow: Create ingredient → Create recipe → Get suggestions
- Critical paths with real API

### 2. Setup CI/CD (MEDIUM PRIORITY)

**GitHub Actions** (~2 hours):

- Backend workflow: pytest, ruff, mypy, coverage
- Frontend workflow: vitest, type-check, build, e2e
- Deploy workflow (optional)

**Husky Setup** (~30 minutes):

- Pre-commit: lint, format, type-check
- Pre-push: tests

## Testing Strategy

### Backend Testing - Comprehensive Suite

**Complete testing infrastructure with unit tests, integration tests, property-based testing, and CI/CD automation.**

#### Test Architecture

**Test Organization**:

```
tests/
├── conftest.py                      # Shared fixtures (in-memory SQLite)
├── unit/
│   ├── test_services/               # Service layer business logic
│   │   ├── test_ingredient_service.py
│   │   └── test_recipe_service.py
│   ├── test_repositories/           # Data access layer
│   │   ├── test_ingredient_repository.py
│   │   └── test_recipe_repository.py
│   └── test_schemas/                # Pydantic validation
│       └── test_ingredient_schemas.py
├── integration/                     # Full stack endpoint tests
│   └── test_ingredient_api.py
└── fixtures/
    └── factories.py                 # Test data generation with Faker
```

**Coverage Targets**:

- Overall: ≥80%
- Service Layer: ≥90% (business logic critical)
- Repository Layer: ≥85% (data access patterns)
- Controllers: ≥75% (covered by integration tests)
- Schemas: ≥85% (input validation critical)

#### Current Status (October 19, 2025)

- Test suite contains 81 passing tests across 9 files (~2,200 LOC) covering services, repositories, schemas, and integration flows.
- Local coverage sits at 80% overall, with service and repository layers meeting or exceeding their 90%/85% targets respectively.
- Factories (`tests/fixtures/factories.py`) generate realistic payloads while keeping ORM objects usable, ensuring integration and unit tests share data builders.
- In-memory SQLite fixtures and async clients in `tests/conftest.py` provide fast, isolated runs; transaction rollbacks keep the database clean between cases.
- CI mirrors local execution via tox, so `tox -e test` and `pytest tests -q` both validate identical behaviour before pushes.

#### Test Categories

**Unit Tests (Service Layer)**:

- CRUD operations with validation
- Business logic: duplicate detection, pagination validation (1-1000), soft deletes
- Error handling: not found, validation errors, conflicts
- Edge cases: empty data, boundary conditions, combined filters

**Unit Tests (Repository Layer)**:

- Basic CRUD with in-memory SQLite
- Query filters: storage_location, expiring_before, name_contains (case-insensitive)
- Pagination: skip/limit with edge cases (empty results, partial pages)
- Soft delete verification

**Unit Tests (Schemas)**:

- Pydantic validation: required fields, field types, enums
- Constraints: string lengths, numeric ranges, date formats
- Error messages for invalid data

**Integration Tests**:

- Full request/response cycle (Controller → Service → Repository → DB)
- All HTTP methods: GET, POST, PUT, PATCH, DELETE
- Status codes: 200, 201, 204, 404, 409, 422
- Request validation and error responses
- Data integrity after operations

**Property-Based Tests (Hypothesis)** - Planned:

- Pagination with random valid skip/limit values
- String input validation with random lengths
- Date range testing
- Filter combinations

#### Tools & Configuration

**Testing Stack**:

- `pytest` + `pytest-asyncio`: Async test support
- `pytest-cov`: Coverage reporting
- `pytest-xdist`: Parallel test execution
- `httpx.AsyncClient`: Integration test HTTP client
- `faker`: Realistic test data generation
- `hypothesis`: Property-based testing (planned)
- `respx`: HTTP mocking for AI services

**Tox Configuration (`backend/tox.ini`)**:

Available environments:

- `format` / `format-check`: Code formatting with ruff
- `lint` / `lint-fix`: Linting with ruff
- `type`: Type checking with mypy (strict mode)
- `test`: Run unit + integration tests (exclude slow)
- `test-all`: Run all tests including slow tests
- `test-unit`: Unit tests only
- `test-integration`: Integration tests only
- `test-parallel`: Parallel execution with pytest-xdist
- `coverage`: Generate coverage reports (minimum 80%)
- `security`: Security scanning with bandit
- `deps-check`: Dependency vulnerability scanning with pip-audit
- `clean`: Remove build artifacts and cache
- `dev`: Setup development environment

**Quick Reference**:

```bash
# Code quality checks
tox -e format,lint,type

# Fast test feedback loop
tox -e test-unit

# Full local validation
tox -e format,lint,type,coverage

# Run specific test file
tox -e test -- tests/unit/test_services/test_ingredient_service.py

# Run tests in parallel (faster)
tox -e test-parallel

# Security checks
tox -e security

# Check for vulnerable dependencies
tox -e deps-check
```

#### CI/CD with GitHub Actions

**Workflow Configuration** (`.github/workflows/backend-ci.yml`):

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when `backend/**` files change

**Jobs**:

1. **quality-checks** (parallel execution):

   - Format check (ruff format --check)
   - Lint (ruff check)
   - Type check (mypy with strict mode)
   - Security scan (bandit)

2. **test** (matrix strategy):

   - Python 3.11, 3.12, 3.13
   - Run full test suite on each version
   - Upload test results as artifacts

3. **coverage**:

   - Generate coverage reports (term, HTML, XML)
   - Upload to Codecov
   - Comment on PRs with coverage info
   - Enforce minimum thresholds (70% orange, 90% green)
   - Fail if coverage < 80%

4. **dependency-check**:

   - Scan for vulnerable dependencies with pip-audit
   - Continue on error (informational)

5. **build**:
   - Build Python package with `python -m build`
   - Only runs if all previous jobs pass
   - Upload dist artifacts

**Caching**:

- Pip packages cached based on `pyproject.toml` hash
- Speeds up CI runs significantly

**Status Badges** (add to README):

```markdown
![CI](https://github.com/vadim-schultz/menoo/workflows/Backend%20CI/badge.svg)
![Coverage](https://codecov.io/gh/vadim-schultz/menoo/branch/main/graph/badge.svg)
```

#### Test Fixtures & Factories

**Database Fixtures (`conftest.py`)**:

- In-memory SQLite engine per test function
- Automatic table creation/teardown
- Transaction rollback for test isolation
- Async session support

**Test Data Factories (`tests/fixtures/factories.py`)**:

- `ingredient_factory()`: Generate random ingredient data
- `recipe_factory()`: Generate random recipe data
- `expiring_ingredient_factory(days)`: Ingredient expiring in N days
- `batch_ingredient_factory(count)`: Generate multiple ingredients
- Specialized factories: `refrigerator_ingredient_factory()`, `easy_recipe_factory()`
- All use Faker for realistic data

**Example Usage**:

```python
from tests.fixtures.factories import ingredient_factory

# In tests
data = ingredient_factory(name="Custom", storage_location="freezer")
ingredients = batch_ingredient_factory(10, storage_location="pantry")
```

#### Running Tests

**Local Development Workflow**:

```bash
# Before committing
tox -e format,lint,test-unit

# Before pushing
tox -e coverage

# Full pre-merge check
tox -e format,lint,type,coverage,security
```

**CI Pipeline Flow**:

```
Push/PR → quality-checks (parallel)
       → test (Python 3.11, 3.12, 3.13 matrix)
       → coverage (with Codecov upload)
       → dependency-check
       → build (if all pass)
```

#### Coverage Reports

**Viewing Coverage**:

```bash
# Terminal output with missing lines
tox -e coverage

# Generate HTML report
tox -e coverage-report
# Open htmlcov/index.html in browser

# CI uploads to Codecov automatically
# View at: https://codecov.io/gh/vadim-schultz/menoo
```

#### Best Practices

1. **Test Independence**: Each test runs in isolation with clean database
2. **Fast Tests**: Unit tests complete in milliseconds
3. **Clear Names**: Test names describe what they verify
4. **Arrange-Act-Assert**: Consistent test structure
5. **Realistic Data**: Use factories for realistic test scenarios
6. **Mock External**: Mock AI services and external APIs
7. **Edge Cases**: Test boundaries, empty data, error paths
8. **CI First**: All tests pass in CI before merge

**CI/CD**: GitHub Actions workflow ([`.github/workflows/backend-ci.yml`](.github/workflows/backend-ci.yml))

- Quality checks: format, lint, type, security
- Test matrix: Python 3.11, 3.12, 3.13
- Coverage reporting to Codecov
- Dependency vulnerability scanning
- Automated PR comments with coverage

### Frontend Testing

**Unit/Component Tests** (vitest + @testing-library/preact):

- Components in isolation with mocked hooks
- Snapshot tests for critical UI
- Hook behavior tests

**Integration Tests**:

- Feature-level tests with mocked API
- Data flow validation
- Optimistic update behavior

**E2E Tests** (Playwright):

- Full user journeys
- Cross-browser testing
- Accessibility checks

### Cross-Cutting

- **Contract Testing**: Validate frontend types against OpenAPI spec
- **Static Analysis**: mypy (backend), TypeScript strict mode (frontend)
- **Code Quality**: ruff, ESLint with max-warnings=0
- **CI Pipeline**: Lint → Type Check → Test → Build

## Deployment

### Build Process

1. **Frontend Build**:

   ```bash
   cd frontend
   npm run build  # Outputs to dist/
   ```

2. **Backend Preparation**:

   ```bash
   cd backend
   # Copy frontend assets (optional - can serve separately)
   cp -r ../frontend/dist/* app/static/
   pip install -e .
   ```

3. **Database Setup**:

   ```bash
   alembic upgrade head
   ```

4. **Start Application**:
   ```bash
   litestar run --host 0.0.0.0 --port 8000
   ```

### Production Deployment

**Using systemd** (recommended for Raspberry Pi):

```bash
cd backend
./deploy.sh
```

This script:

- Creates Python virtual environment
- Installs dependencies
- Sets up systemd service
- Configures environment variables
- Enables auto-start on boot

**Manual systemd unit** (`/etc/systemd/system/menoo.service`):

```ini
[Unit]
Description=Menoo Recipe Management System
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/menoo/backend
Environment=PATH=/home/pi/menoo/backend/.venv/bin
EnvironmentFile=/home/pi/menoo/backend/.env
ExecStart=/home/pi/menoo/backend/.venv/bin/litestar run --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### Configuration

**Environment Variables** (`.env`):

```env
DATABASE_URL=sqlite+aiosqlite:///./menoo.db
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173"]
OPENAI_API_KEY=your-key-here  # For AI features
```

### Static File Serving

Litestar serves:

- API routes: `/api/*`
- Static assets: `/static/*`
- SPA fallback: `index.html` for all other routes

### Monitoring

- Health check: `http://localhost:8000/healthz`
- Readiness check: `http://localhost:8000/readiness`
- API docs: `http://localhost:8000/schema`
- Logs: Structured JSON logging to file with rotation

### Backup Strategy

SQLite database backup:

```bash
sqlite3 menoo.db ".backup 'menoo-backup.db'"
```

Automated backups via cron:

```bash
# Daily backup at 2 AM
0 2 * * * sqlite3 /path/to/menoo.db ".backup '/path/to/backups/menoo-$(date +\%Y\%m\%d).db'"
```

## Development Workflow

### Local Development

1. **Start Backend**:

   ```bash
   cd backend
   source .venv/bin/activate
   litestar run --reload
   ```

2. **Start Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/schema

### Code Quality

**Backend**:

```bash
ruff check .        # Lint
ruff format .       # Format
mypy .              # Type check
pytest              # Run tests
pre-commit run --all-files  # All checks
```

**Frontend**:

```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Vitest
```

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1

# View history
alembic history
```

## Automation & Tooling

### Pre-commit Hooks (Backend)

Configured in `.pre-commit-config.yaml`:

- ruff (lint + format)
- pyupgrade (Python syntax modernization)
- mypy (type checking)
- pytest (run tests on staged files)

Install: `pre-commit install`

### Husky (Frontend) - TODO

Planned configuration:

- Pre-commit: prettier, eslint, type-check
- Pre-push: vitest, build

### GitHub Actions

Workflow: `.github/workflows/backend-ci.yml`

- **quality-checks** job runs ruff format-check, ruff lint, mypy (strict), and bandit in parallel.
- **test** job executes `tox -e test-all` across Python 3.11, 3.12, and 3.13, uploading `.pytest_cache` artifacts on completion.
- **coverage** job runs `tox -e coverage`, uploads HTML/XML reports, pushes metrics to Codecov, and comments on PRs (90% green / 70% orange thresholds, hard fail below 80%).
- **dependency-check** job invokes `tox -e deps-check`; it surfaces issues without blocking the pipeline.
- **build** job packages the backend with `python -m build` once prior checks succeed and retains artifacts for download.
- All jobs cache pip installs keyed by `backend/pyproject.toml` for faster reruns.

## Performance Considerations

### Resource Optimization

- **Memory**: Async session pooling, lazy imports, connection reuse
- **Storage**: SQLite WAL mode, soft deletes with periodic cleanup
- **CPU**: Indexed queries, pagination, efficient serialization
- **Network**: gzip compression, asset caching, API response caching

### Target Hardware

Designed for Raspberry Pi 3B+ or newer:

- RAM: ~100MB backend + ~50MB frontend build
- Storage: ~50MB application + database growth
- CPU: Single process, async I/O for concurrency

## Security Considerations

- **Input Validation**: Pydantic schemas for all requests
- **SQL Injection**: SQLAlchemy ORM prevents raw SQL
- **CORS**: Configured origins in environment
- **Rate Limiting**: TODO - Add to suggestions endpoint
- **Secrets**: Environment variables, never in code
- **Authentication**: TODO - Optional JWT-based auth

## Troubleshooting

### Common Issues

1. **Port Already in Use**:

   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **Database Locked**:

   - Ensure only one backend instance running
   - Check for orphaned SQLite connections

3. **Module Not Found**:

   ```bash
   # Backend
   cd backend && pip install -e .

   # Frontend
   cd frontend && npm install
   ```

4. **Type Errors**:

   ```bash
   # Backend
   mypy .

   # Frontend
   npm run type-check
   ```

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=DEBUG
```

View structured logs:

```bash
tail -f backend/logs/app.log | jq
```

## Resources

- **Litestar Docs**: https://litestar.dev
- **Preact Docs**: https://preactjs.com
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org
- **Alembic Docs**: https://alembic.sqlalchemy.org
- **Playwright Docs**: https://playwright.dev

---

**Last Updated**: October 19, 2025
**Maintained By**: Menoo Development Team
