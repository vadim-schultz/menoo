"""Marvin-backed recipe generation test with controlled output."""

from __future__ import annotations

from decimal import Decimal
from unittest.mock import AsyncMock

from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import IngredientCategory
from app.models import Ingredient
from app.schemas import IngredientPreparation, Recipe
from app.schemas.core.recipe import ThermalTreatment, ThermalTreatmentSpec
from app.schemas.requests.suggestion import SuggestionRequest


async def test_marvin_populates_recipe_model(suggestion_service, db_session: AsyncSession) -> None:
    """Service should return a populated recipe using repository output."""

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
        n_completions=1,
    )

    # Mock repository to return a deterministic, schema-valid recipe
    valid_recipe = Recipe(
        name="Caprese Salad",
        description="Fresh mozzarella, tomatoes, and basil.",
        instructions="Slice and assemble.",
        ingredients=[
            IngredientPreparation(
                ingredient_id=1,
                quantity=Decimal("8"),
                unit="oz",
                thermal_treatments=[
                    ThermalTreatmentSpec(method=ThermalTreatment.RAW, duration_minutes=2)
                ],
                preparation_steps=["Slice the mozzarella"],
            )
        ],
    )
    suggestion_service.suggestion_repo.generate_recipe = AsyncMock(return_value=[valid_recipe])

    results = await suggestion_service.complete_recipe(request)

    assert len(results) > 0
    result = results[0]

    assert result.name
    assert result.instructions
    assert result.ingredients, "Recipe should include at least one ingredient"
