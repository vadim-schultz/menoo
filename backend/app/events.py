"""Application lifecycle events."""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from litestar import Litestar
from litestar.datastructures import State

from app.config import get_settings
from app.database import get_db_manager
from app.logging import configure_logging, get_logger

# Import models to register them with Base.metadata
from app.models import ingredient, recipe, recipe_ingredient  # noqa: F401

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: Litestar) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    settings = get_settings()

    # Configure logging
    configure_logging(log_level=settings.log_level, use_json=settings.log_json)
    logger.info("starting_application", environment=settings.environment)

    # Initialize database
    db_manager = get_db_manager(settings)
    await db_manager.init_db()

    # Store session factory in app state
    app.state.session_factory = db_manager.get_session_factory()

    logger.info("application_started")

    try:
        yield
    finally:
        # Cleanup
        logger.info("shutting_down_application")
        await db_manager.close()
        logger.info("application_stopped")
