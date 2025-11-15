"""Dependency injection providers for Litestar."""

from __future__ import annotations

from collections.abc import AsyncGenerator

from litestar.datastructures import State
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import (
    IngredientRepository,
    RecipeIngredientRepository,
    RecipeRepository,
    SuggestionRepository,
)
from app.services import IngredientService, RecipeService, SuggestionService


# Layer 1: Database Session
async def provide_db_session(state: State) -> AsyncGenerator[AsyncSession, None]:
    """Provide database session as dependency."""
    async with state.session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# Layer 2: Repositories
async def provide_ingredient_repository(db_session: AsyncSession) -> IngredientRepository:
    """Provide ingredient repository."""
    return IngredientRepository(db_session)


async def provide_recipe_repository(db_session: AsyncSession) -> RecipeRepository:
    """Provide recipe repository."""
    return RecipeRepository(db_session)


async def provide_recipe_ingredient_repository(
    db_session: AsyncSession,
) -> RecipeIngredientRepository:
    """Provide recipe ingredient repository."""
    return RecipeIngredientRepository(db_session)


async def provide_suggestion_repository(db_session: AsyncSession) -> SuggestionRepository:
    """Provide suggestion repository."""
    return SuggestionRepository(db_session)


# Layer 3: Services
async def provide_ingredient_service(
    ingredient_repository: IngredientRepository,
) -> IngredientService:
    """Provide ingredient service."""
    return IngredientService(ingredient_repository)


async def provide_suggestion_service(
    suggestion_repository: SuggestionRepository,
) -> SuggestionService:
    """Provide suggestion service."""
    return SuggestionService(suggestion_repository)


async def provide_recipe_service(
    recipe_repository: RecipeRepository,
    recipe_ingredient_repository: RecipeIngredientRepository,
    ingredient_repository: IngredientRepository,
) -> RecipeService:
    """Provide recipe service."""
    return RecipeService(
        recipe_repository,
        recipe_ingredient_repository,
        ingredient_repository,
    )
