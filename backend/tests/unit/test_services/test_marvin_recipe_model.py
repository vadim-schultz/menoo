"""Live Marvin integration test for recipe generation."""

from __future__ import annotations

from decimal import Decimal

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import IngredientCategory
from app.models import Ingredient
from app.schemas import Recipe
from app.schemas.requests.suggestion import SuggestionRequest


# @pytest.mark.integration
async def test_marvin_populates_recipe_model(suggestion_service, db_session: AsyncSession) -> None:
    """Marvin should return a populated recipe when communicating with OpenAI."""

    mozzarella = Ingredient(
        name="Mozzarella",
        category=IngredientCategory.DAIRY,
        storage_location="Fridge",
        quantity=Decimal("1000"),
        unit="g",
        notes=None,
    )
    db_session.add(mozzarella)
    await db_session.flush()

    # Create a proper suggestion request
    request = SuggestionRequest(
        recipe=Recipe(name="Mozzarella recipe"),
        prompt="Create a recipe using mozzarella",
        n_completions=1
    )
    
    results = await suggestion_service.complete_recipe(request)
    
    assert len(results) > 0
    result = results[0]
    
    assert result.name
    assert result.instructions
    assert result.ingredients, "Recipe should include at least one ingredient"