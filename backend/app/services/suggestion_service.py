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

    @staticmethod
    def _compose_prompt(request: SuggestionRequest, draft: Recipe) -> str:
        """Compose prompt from request or build from draft fields."""
        if request.prompt:
            return request.prompt

        prompt_parts: list[str] = [DEFAULT_COMPLETION_PROMPT]

        if draft.name:
            prompt_parts.append(f"The recipe is titled '{draft.name}'.")
        if draft.cuisine_types:
            cuisines = ", ".join(str(c.value) for c in draft.cuisine_types)
            prompt_parts.append(f"Maintain a {cuisines} flavor profile.")
        if draft.meal_types:
            meal_types = ", ".join(str(m.value) for m in draft.meal_types)
            prompt_parts.append(f"It should be suitable for {meal_types}.")
        if draft.dietary_requirements:
            restrictions = ", ".join(str(r.value).replace("_", " ") for r in draft.dietary_requirements)
            prompt_parts.append(f"Ensure the recipe satisfies: {restrictions}.")
        if draft.notes:
            prompt_parts.append(f"Keep this note in mind: {draft.notes}.")

        return " ".join(prompt_parts)

    async def complete_recipe(self, request: SuggestionRequest) -> list[Recipe]:
        """Complete a recipe draft using Marvin.
        
        Accepts a partial Recipe model and passes it to Marvin for completion.
        The same Recipe model is used for both partial (draft) and complete (populated) data.
        """
        # The recipe field is already a Recipe model, use it directly
        draft = request.recipe
        prompt = self._compose_prompt(request, draft)

        return await self.suggestion_repo.generate_recipe(
            prompt=prompt,
            n_completions=request.n_completions,
            draft=draft,
        )
