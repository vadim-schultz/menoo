# Menoo - Recipe Management System

A lightweight, self-hosted recipe management system designed for resource-constrained hardware like Raspberry Pi. Manage your ingredients, create recipes, and get AI-powered cooking suggestions based on what you have available.

## 🌟 Features

- **Ingredient Management**: Track ingredients with quantities, storage locations, and expiry dates
- **Recipe Management**: Create and organize recipes with detailed instructions and ingredient lists
- **AI Suggestions**: Get cooking suggestions based on available ingredients (heuristic fallback implemented)
- **Shopping Lists**: Generate shopping lists from recipes
- **Lightweight**: Optimized to run efficiently on Raspberry Pi and similar hardware
- **Modern Stack**: Built with Litestar (Python) backend and Preact (TypeScript) frontend

## 🏗️ Technology Stack

### Backend

- **Framework**: [Litestar](https://litestar.dev/) - Modern ASGI framework with async support
- **Database**: SQLite with WAL mode for SD card optimization
- **ORM**: SQLAlchemy (async)
- **Validation**: Pydantic v2
- **Testing**: pytest with async support
- **Code Quality**: ruff, mypy, pre-commit hooks

### Frontend

- **Framework**: [Preact](https://preactjs.com/) - Lightweight 3kb React alternative
- **Build Tool**: Vite for fast development and optimized builds
- **Language**: TypeScript (strict mode)
- **State**: @preact/signals
- **Testing**: Vitest + Playwright
- **Code Quality**: ESLint, Prettier

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Automated Setup (Recommended)

```bash
# Clone and start
git clone <repository-url>
cd menoo
./start.sh
```

Access the application:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/schema

### Manual Setup

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e .
alembic upgrade head
litestar run --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```
menoo/
├── backend/              # Python/Litestar API
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── repositories/ # Data access layer
│   │   ├── services/     # Business logic
│   │   └── controllers/  # API endpoints
│   ├── tests/            # Backend tests
│   └── migrations/       # Alembic migrations
├── frontend/             # TypeScript/Preact UI
│   └── src/
│       ├── features/     # Feature modules
│       ├── shared/       # Reusable components, hooks, services
│       └── styles/       # Global styles
├── start.sh              # Quick start script
└── README.md             # This file
```

## 📖 Documentation

- **[backend/README.md](backend/README.md)** - Backend API documentation, development guide
- **[frontend/README.md](frontend/README.md)** - Frontend architecture, component guide
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Implementation strategy and current status

## 🛠️ Common Commands

### Backend

```bash
cd backend

# Development
litestar run --reload              # Start dev server
pytest                             # Run tests
pytest --cov                       # With coverage

# Code Quality
ruff check .                       # Lint
mypy .                             # Type check
pre-commit run --all-files        # Run all checks

# Database
alembic revision --autogenerate -m "message"  # Create migration
alembic upgrade head                          # Apply migrations
alembic downgrade -1                          # Rollback
```

### Frontend

```bash
cd frontend

# Development
npm run dev                        # Start dev server
npm run build                      # Production build
npm run preview                    # Preview build

# Testing
npm run test                       # Unit tests
npm run test:watch                 # Watch mode
npm run test:coverage              # With coverage
npm run test:e2e                   # E2E tests

# Code Quality
npm run type-check                 # TypeScript
npm run lint                       # ESLint
npm run lint:fix                   # Fix issues
npm run format                     # Prettier
```

## 📊 API Endpoints

### Ingredients

- `GET    /api/ingredients` - List all ingredients (paginated, filterable)
- `GET    /api/ingredients/{id}` - Get single ingredient
- `POST   /api/ingredients` - Create new ingredient
- `PUT    /api/ingredients/{id}` - Update ingredient (full)
- `PATCH  /api/ingredients/{id}` - Update ingredient (partial)
- `DELETE /api/ingredients/{id}` - Delete ingredient

### Recipes

- `GET    /api/recipes` - List all recipes (paginated, filterable)
- `GET    /api/recipes/{id}` - Get single recipe with ingredients
- `POST   /api/recipes` - Create new recipe
- `PUT    /api/recipes/{id}` - Update recipe
- `PATCH  /api/recipes/{id}` - Update recipe (partial)
- `DELETE /api/recipes/{id}` - Delete recipe

### Suggestions

- `POST   /api/suggestions/check` - Get recipe suggestions based on ingredients
- `POST   /api/suggestions/shopping-list` - Generate shopping list

## 🌐 Deployment

The application is designed to run on resource-constrained hardware like Raspberry Pi.

```bash
# Backend deployment with systemd
cd backend
./deploy.sh

# Frontend build
cd frontend
npm run build
# Serve the dist/ folder with the backend or any static server
```

See [backend/README.md](backend/README.md) for detailed deployment instructions.

## 📄 License

See LICENSE file for details.

## 🙏 Built With

- [Litestar](https://litestar.dev/) - Modern Python ASGI framework
- [Preact](https://preactjs.com/) - Fast 3kb React alternative
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL toolkit
- And many other excellent open-source projects
