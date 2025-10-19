"""Dependency injection providers for Litestar."""
from __future__ import annotations

from collections.abc import AsyncGenerator

from litestar.datastructures import State
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import IngredientService, RecipeService, SuggestionService


async def provide_db_session(state: State) -> AsyncGenerator[AsyncSession, None]:
    """Provide database session as dependency."""
    async with state.session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def provide_ingredient_service(db_session: AsyncSession) -> IngredientService:
    """Provide ingredient service."""
    return IngredientService(db_session)


async def provide_recipe_service(db_session: AsyncSession) -> RecipeService:
    """Provide recipe service."""
    return RecipeService(db_session)


async def provide_suggestion_service(db_session: AsyncSession) -> SuggestionService:
    """Provide suggestion service."""
    return SuggestionService(db_session)
