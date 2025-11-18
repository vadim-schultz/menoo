"""Suggestion service for AI-powered recipe completion."""

from __future__ import annotations

from app.repositories import SuggestionRepository
from app.schemas.core.ingredient import Ingredient
from app.schemas.core.recipe import Recipe
from app.schemas.requests.suggestion import IngredientSuggestionRequest, SuggestionRequest

DEFAULT_COMPLETION_PROMPT = (
    "Complete this partially specified recipe with coherent instructions, ingredient quantities, "
    "timings, and serving information. Respect any fields that are already provided and fill in "
    "the remaining attributes with consistent, high-quality values."
)

DEFAULT_INGREDIENT_COMPLETION_PROMPT = (
    "Complete this partially specified ingredient with name and quantity in grams. "
    "Respect any fields that are already provided and fill in the remaining attributes."
)


class SuggestionService:
    """Service for generating Marvin-powered recipe completions."""

    def __init__(self, suggestion_repo: SuggestionRepository) -> None:
        """Initialize service with suggestion repository."""
        self.suggestion_repo = suggestion_repo

    async def complete_recipe(self, request: SuggestionRequest) -> list[Recipe]:
        """Complete a recipe draft using Marvin.

        Accepts a partial Recipe model and passes it to Marvin for completion.
        The same Recipe model is used for both partial (draft) and complete (populated) data.
        Marvin will extract necessary context from the Recipe model itself.
        """
        # Use provided prompt or default, and pass the draft recipe directly to Marvin
        prompt = request.prompt or DEFAULT_COMPLETION_PROMPT

        return await self.suggestion_repo.generate_recipe(
            prompt=prompt,
            n_completions=request.n_completions,
            draft=request.recipe,
        )

    async def complete_ingredient(
        self, request: IngredientSuggestionRequest
    ) -> list[Ingredient]:
        """Complete an ingredient draft using Marvin.

        Accepts a partial Ingredient model and passes it to Marvin for completion.
        The same Ingredient model is used for both partial (draft) and complete (populated) data.
        Only name and quantity (in grams) fields are populated - no additional hydration.
        """
        # Use provided prompt or default, and pass the draft ingredient directly to Marvin
        prompt = request.prompt or DEFAULT_INGREDIENT_COMPLETION_PROMPT

        return await self.suggestion_repo.generate_ingredient(
            prompt=prompt,
            n_completions=request.n_completions,
            draft=request.ingredient,
        )
