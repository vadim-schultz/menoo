"""Suggestion service for AI-powered recipe completion."""

from __future__ import annotations

from app.repositories import SuggestionRepository
from app.schemas.core.recipe import Recipe
from app.schemas.requests.suggestion import SuggestionRequest

DEFAULT_COMPLETION_PROMPT = (
    "Complete this partially specified recipe with coherent instructions, ingredient quantities, "
    "timings, and serving information. Respect any fields that are already provided and fill in "
    "the remaining attributes with consistent, high-quality values."
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
