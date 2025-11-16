"""Live integration test that exercises Marvin/OpenAI end-to-end."""

from __future__ import annotations

import os
from pathlib import Path
from pprint import pprint

import pytest
from dotenv import load_dotenv

from app.config import BASE_DIR
from app.repositories import SuggestionRepository
from app.schemas.core.recipe import Recipe
from app.schemas.requests.suggestion import SuggestionRequest
from app.services import SuggestionService


def _load_openai_api_key() -> str | None:
    """Load OpenAI API key from .env or environment variables."""
    env_paths = [
        BASE_DIR / ".env",
        BASE_DIR.parent / ".env",
        Path.cwd() / ".env",
    ]

    for env_path in env_paths:
        if env_path.exists():
            load_dotenv(env_path, override=False)

    print(os.getenv("OPENAI_API_KEY"))
    return os.getenv("OPENAI_API_KEY")


@pytest.mark.integration
@pytest.mark.slow
async def test_live_marvin_recipe_completion(db_session):
    """Ensure Marvin can complete a partial recipe using the real OpenAI API."""
    api_key = _load_openai_api_key()
    if not api_key:
        pytest.skip("OPENAI_API_KEY is not configured; skipping live Marvin test.")

    suggestion_repo = SuggestionRepository(db_session)
    service = SuggestionService(suggestion_repo)

    # Create partial Recipe model (draft) - some fields can be None for partial input
    draft = Recipe(
        name="Weeknight Bean Tacos",
        description="Quick vegetarian tacos with pantry staples.",
        # Note: ingredients would need IngredientPreparation which requires ingredient_id,
        # quantity, unit. For a draft, we might leave ingredients empty or provide minimal info
        # Since this is a draft, we can leave instructions and other fields empty
        notes="Keep it under 30 minutes if possible.",
    )

    request = SuggestionRequest(
        recipe=draft,
        prompt=(
            "Complete this partially filled recipe with detailed instructions, ingredient "
            "quantities, timing, and serving size. Make sure the dish stays vegetarian."
        ),
        n_completions=1,
    )

    recipes = await service.complete_recipe(request)

    assert recipes, "Expected Marvin to return at least one recipe."
    completed = recipes[0]

    assert completed.name, "Completed recipe should include a name."
    assert completed.instructions, "Completed recipe should include instructions."
    assert completed.ingredients, "Completed recipe should include ingredients."
    assert completed.servings is None or completed.servings > 0

    pprint(completed.model_dump())
