"""Unit tests for suggestion schemas."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.core.recipe import IngredientPreparation, Recipe
from app.schemas.requests.suggestion import SuggestionRequest


class TestRecipe:
    """Test Recipe schema validation.
    
    Recipe is the definitive model used for both partial (draft) and complete (populated) recipes.
    All fields are optional or have defaults to allow partial population.
    """

    def test_partial_recipe(self):
        """Should accept partial recipe data (as input to Marvin)."""
        recipe = Recipe(
            name="Pasta Carbonara",
            # Instructions can be None for partial input
            # Ingredients list can be empty for drafts
        )

        assert recipe.name == "Pasta Carbonara"
        assert recipe.instructions is None  # Not yet filled
        assert recipe.ingredients == []  # Default empty list

    def test_complete_recipe(self):
        """Should accept complete recipe data (as output from Marvin)."""
        recipe = Recipe(
            name="Pasta Carbonara",
            description="Classic Italian pasta dish",
            ingredients=[
                IngredientPreparation(
                    ingredient_id=1,
                    quantity=400.0,
                    unit="g",
                ),
                IngredientPreparation(
                    ingredient_id=2,
                    quantity=4.0,
                    unit="whole",
                ),
            ],
            instructions="1. Boil pasta\n2. Mix eggs\n3. Combine",
        )

        assert recipe.name == "Pasta Carbonara"
        assert recipe.description == "Classic Italian pasta dish"
        assert len(recipe.ingredients) == 2
        assert recipe.instructions is not None

    def test_minimal_partial_recipe(self):
        """Should accept minimal partial recipe data."""
        recipe = Recipe(
            name="Simple Salad",
        )

        assert recipe.name == "Simple Salad"
        assert recipe.ingredients == []
        assert recipe.instructions is None

    def test_invalid_name_too_long(self):
        """Should reject name that's too long."""
        with pytest.raises(ValidationError) as exc_info:
            Recipe(
                name="a" * 201,  # Max is 200
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("name",) for e in errors)

    def test_invalid_negative_time(self):
        """Should reject negative prep/cook time."""
        with pytest.raises(ValidationError):
            recipe = Recipe(name="Test")
            recipe.timing.prep_time_minutes = -5
            recipe.model_validate(recipe.model_dump())

    def test_invalid_zero_time(self):
        """Should reject zero prep/cook time (must be > 0 or None)."""
        with pytest.raises(ValidationError):
            recipe = Recipe(name="Test")
            recipe.timing.cook_time_minutes = 0
            recipe.model_validate(recipe.model_dump())


class TestSuggestionRequest:
    """Test SuggestionRequest schema validation."""

    def test_valid_request(self):
        """Should accept suggestion request with a partial recipe and prompt."""
        draft = Recipe(
            name="Smoky Bean Tacos",
            cuisine_types=[],
            # Ingredients left empty for draft - will be populated by Marvin
        )

        request = SuggestionRequest(
            recipe=draft,
            prompt="Complete this vegan taco recipe with detailed instructions.",
            n_completions=2,
        )

        assert isinstance(request.recipe, Recipe)
        assert request.recipe.name == "Smoky Bean Tacos"
        assert request.prompt is not None
        assert request.n_completions == 2

    def test_minimal_request(self):
        """Should provide defaults when no data is supplied."""
        request = SuggestionRequest()

        assert isinstance(request.recipe, Recipe)
        assert request.recipe.name is None  # Empty Recipe model
        assert request.prompt is None
        assert request.n_completions == 1

    def test_invalid_completion_count(self):
        """Should enforce allowed range for completions."""
        with pytest.raises(ValidationError):
            SuggestionRequest(n_completions=0)
