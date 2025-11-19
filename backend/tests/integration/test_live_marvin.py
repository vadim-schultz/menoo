"""Live integration test that exercises Marvin/OpenAI end-to-end."""

from __future__ import annotations

from decimal import Decimal
from pprint import pprint

import pytest

from app.enums import IngredientCategory
from app.schemas.core.ingredient import Ingredient
from app.schemas.core.recipe import Recipe
from app.schemas.requests.suggestion import IngredientSuggestionRequest, SuggestionRequest


@pytest.mark.integration
@pytest.mark.slow
async def test_live_marvin_recipe_completion(live_suggestion_service):
    """Ensure Marvin can complete a partial recipe using the real OpenAI API."""
    service = live_suggestion_service

    # Create partial Recipe model (draft) - some fields can be None for partial input
    draft = Recipe(
        name="Weeknight Bean Tacos",
        description="Quick vegetarian tacos with pantry staples.",
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


@pytest.mark.integration
@pytest.mark.slow
async def test_live_marvin_ingredient_completion(live_suggestion_service):
    """Ensure Marvin can complete a partial ingredient using the real OpenAI API."""
    service = live_suggestion_service

    # Create partial Ingredient model (draft) - only provide required fields (name and quantity)
    # Marvin should populate optional fields like category, storage_location, notes, etc.
    draft = Ingredient(
        name="Frozen potato chunks",
        quantity=Decimal("100"),  # 100 grams
    )

    request = IngredientSuggestionRequest(
        ingredient=draft,
        prompt=(
            "Complete this ingredient with appropriate category, storage location, expiry date "
            "based on the storage location (must be in the future), "
            "and any relevant notes. Ensure the information is accurate and useful."
        ),
        n_completions=1,
    )

    ingredients = await service.complete_ingredient(request)

    assert ingredients, "Expected Marvin to return at least one ingredient."
    completed = ingredients[0]

    pprint(completed.model_dump())
