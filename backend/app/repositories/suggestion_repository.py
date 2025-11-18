"""Suggestion repository for Marvin API communication."""

from __future__ import annotations

import marvin
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.marvin_config import configure_marvin
from app.schemas.core.ingredient import Ingredient
from app.schemas.core.recipe import Recipe


class SuggestionRepository:
    """Repository for Marvin API communication."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with database session and configure Marvin."""
        self.session = session
        configure_marvin()

    async def generate_recipe(self, prompt: str, n_completions: int, draft: Recipe) -> list[Recipe]:
        """Generate recipe completions using Marvin API.

        Accepts a partial Recipe model and returns completed Recipe instances populated by Marvin.
        The same Recipe model is used for both partial (draft) and complete (populated) data.
        """
        return await marvin.generate_async(
            target=Recipe,
            n=n_completions,
            instructions=prompt,
            context=draft.model_dump(),
        )

    async def generate_ingredient(
        self, prompt: str, n_completions: int, draft: Ingredient
    ) -> list[Ingredient]:
        """Generate ingredient completions using Marvin API.

        Accepts a partial Ingredient model and returns completed Ingredient instances populated by Marvin.
        The same Ingredient model is used for both partial (draft) and complete (populated) data.
        Only name and quantity fields are populated - no additional hydration.
        """
        return await marvin.generate_async(
            target=Ingredient,
            n=n_completions,
            instructions=prompt,
            context=draft.model_dump(),
        )
