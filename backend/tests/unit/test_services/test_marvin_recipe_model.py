"""Live Marvin integration test for recipe generation."""

from __future__ import annotations

from decimal import Decimal

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import IngredientCategory
from app.models import Ingredient
from app.services.suggestion_service import SuggestionService


# @pytest.mark.integration
async def test_marvin_populates_recipe_model(db_session: AsyncSession) -> None:
    """Marvin should return a populated recipe when communicating with OpenAI."""
    service = SuggestionService(db_session)

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

    result = await service.complete_recipe([mozzarella.id])

    assert result.name
    assert result.instructions
    assert result.ingredients, "Recipe should include at least one ingredient"

    used_mozzarella = next(
        (ing for ing in result.ingredients if ing.ingredient_id == mozzarella.id),
        None,
    )
    assert used_mozzarella is not None, "Generated recipe must use provided mozzarella"
    assert Decimal(str(used_mozzarella.quantity)) > 0
    assert used_mozzarella.unit