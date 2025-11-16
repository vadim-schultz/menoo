"""Integration tests for suggestion endpoints."""

import pytest

SUGGESTIONS_URL = "/api/v1/suggestions"


@pytest.fixture
def mock_marvin_recipe():
    """Create a mock recipe that Marvin would generate."""
    from decimal import Decimal

    from app.schemas.core.recipe import IngredientPreparation, Recipe

    return Recipe(
        name="Quick Pasta Primavera",
        description="A light and fresh vegetable pasta dish",
        instructions=(
            "1. Cook pasta according to package directions.\n"
            "2. Sauté vegetables in olive oil until tender.\n"
            "3. Toss pasta with vegetables and serve."
        ),
        servings=4,
        ingredients=[
            IngredientPreparation(
                ingredient_id=1,
                quantity=Decimal("454.0"),
                unit="g",
            ),
            IngredientPreparation(
                ingredient_id=2,
                quantity=Decimal("2.0"),
                unit="whole",
            ),
            IngredientPreparation(
                ingredient_id=3,
                quantity=Decimal("30.0"),
                unit="ml",
            ),
        ],
    )
