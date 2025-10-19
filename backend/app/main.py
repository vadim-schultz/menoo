"""Main application entry point."""
from __future__ import annotations

from litestar import Litestar, get
from litestar.config.cors import CORSConfig
from litestar.contrib.pydantic import PydanticPlugin
from litestar.di import Provide
from litestar.openapi import OpenAPIConfig
from litestar.static_files import create_static_files_router

from app.config import get_settings
from app.controllers import ingredients, recipes, suggestions
from app.dependencies import (
    provide_db_session,
    provide_ingredient_service,
    provide_recipe_service,
    provide_suggestion_service,
)
from app.events import lifespan


@get("/healthz", tags=["health"])
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}


@get("/readiness", tags=["health"])
async def readiness_check() -> dict[str, str]:
    """Readiness check endpoint."""
    return {"status": "ready"}


def create_app() -> Litestar:
    """Create and configure the Litestar application."""
    settings = get_settings()

    # Configure CORS
    cors_config = CORSConfig(
        allow_origins=settings.cors_allowed_origins,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    # Configure OpenAPI documentation
    openapi_config = OpenAPIConfig(
        title="Menoo API",
        version="0.1.0",
        description="Lightweight recipe management system API",
    )

    # Static files router for serving frontend
    static_router = create_static_files_router(
        path="/static",
        directories=["app/static"],
        name="static",
    )

    # SPA router for serving index.html on all frontend routes
    spa_router = create_static_files_router(
        path="/",
        directories=["app/static"],
        html_mode=True,
        name="spa",
    )

    # Create application
    app = Litestar(
        route_handlers=[
            health_check,
            readiness_check,
            ingredients.IngredientController,
            recipes.RecipeController,
            suggestions.SuggestionController,
            static_router,
        ],
        # Note: SPA router should be added last or excluded until frontend is ready
        # spa_router,
        dependencies={
            "db_session": Provide(provide_db_session),
            "ingredient_service": Provide(provide_ingredient_service),
            "recipe_service": Provide(provide_recipe_service),
            "suggestion_service": Provide(provide_suggestion_service),
        },
        cors_config=cors_config,
        openapi_config=openapi_config,
        lifespan=[lifespan],
        plugins=[PydanticPlugin()],
        debug=settings.debug,
    )

    return app


# Application factory
app = create_app()
