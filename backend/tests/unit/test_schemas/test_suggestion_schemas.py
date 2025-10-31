"""Unit tests for suggestion schemas."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.suggestion import (
    GeneratedRecipe,
    GeneratedRecipeIngredient,
    RecipeSuggestion,
    SuggestionAcceptRequest,
    SuggestionRequest,
)


class TestGeneratedRecipeIngredient:
    """Test GeneratedRecipeIngredient schema validation."""

    def test_valid_ingredient(self):
        """Should accept valid ingredient data."""
        ingredient = GeneratedRecipeIngredient(
            ingredient_id=1,
            name="Tomato",
            quantity=2.5,
            unit="whole",
        )

        assert ingredient.ingredient_id == 1
        assert ingredient.name == "Tomato"
        assert ingredient.quantity == 2.5
        assert ingredient.unit == "whole"

    def test_invalid_quantity_negative(self):
        """Should reject negative quantity."""
        with pytest.raises(ValidationError) as exc_info:
            GeneratedRecipeIngredient(
                ingredient_id=1,
                name="Tomato",
                quantity=-1.0,
                unit="whole",
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("quantity",) for e in errors)

    def test_invalid_quantity_zero(self):
        """Should reject zero quantity."""
        with pytest.raises(ValidationError) as exc_info:
            GeneratedRecipeIngredient(
                ingredient_id=1,
                name="Tomato",
                quantity=0.0,
                unit="whole",
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("quantity",) for e in errors)

    def test_missing_required_field(self):
        """Should reject missing required fields."""
        with pytest.raises(ValidationError) as exc_info:
            GeneratedRecipeIngredient(
                ingredient_id=1,
                name="Tomato",
                # Missing quantity and unit
            )

        errors = exc_info.value.errors()
        assert len(errors) == 2


class TestGeneratedRecipe:
    """Test GeneratedRecipe schema validation."""

    def test_valid_recipe(self):
        """Should accept valid recipe data."""
        recipe = GeneratedRecipe(
            name="Pasta Carbonara",
            description="Classic Italian pasta dish",
            ingredients=[
                GeneratedRecipeIngredient(
                    ingredient_id=1, name="Pasta", quantity=400.0, unit="g"
                ),
                GeneratedRecipeIngredient(
                    ingredient_id=2, name="Eggs", quantity=4.0, unit="whole"
                ),
            ],
            instructions="1. Boil pasta\n2. Mix eggs\n3. Combine",
            prep_time_minutes=10,
            cook_time_minutes=15,
            servings=4,
            difficulty="medium",
            cuisine_type="Italian",
            meal_type="dinner",
        )

        assert recipe.name == "Pasta Carbonara"
        assert len(recipe.ingredients) == 2
        assert recipe.prep_time_minutes == 10

    def test_minimal_valid_recipe(self):
        """Should accept recipe with only required fields."""
        recipe = GeneratedRecipe(
            name="Simple Salad",
            ingredients=[
                GeneratedRecipeIngredient(
                    ingredient_id=1, name="Lettuce", quantity=1.0, unit="head"
                ),
            ],
            instructions="1. Wash lettuce\n2. Tear into pieces",
        )

        assert recipe.name == "Simple Salad"
        assert recipe.description is None
        assert recipe.prep_time_minutes is None
        assert recipe.cook_time_minutes is None

    def test_invalid_name_too_long(self):
        """Should reject name that's too long."""
        with pytest.raises(ValidationError) as exc_info:
            GeneratedRecipe(
                name="a" * 201,  # Max is 200
                ingredients=[
                    GeneratedRecipeIngredient(
                        ingredient_id=1, name="Test", quantity=1.0, unit="unit"
                    ),
                ],
                instructions="Test",
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("name",) for e in errors)

    def test_invalid_empty_ingredients(self):
        """Should reject recipe with no ingredients."""
        with pytest.raises(ValidationError) as exc_info:
            GeneratedRecipe(
                name="Empty Recipe",
                ingredients=[],
                instructions="Test",
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("ingredients",) for e in errors)

    def test_invalid_negative_time(self):
        """Should reject negative prep/cook time."""
        with pytest.raises(ValidationError):
            GeneratedRecipe(
                name="Test",
                ingredients=[
                    GeneratedRecipeIngredient(
                        ingredient_id=1, name="Test", quantity=1.0, unit="unit"
                    ),
                ],
                instructions="Test",
                prep_time_minutes=-5,
            )

    def test_invalid_zero_time(self):
        """Should reject zero prep/cook time (must be > 0 or None)."""
        with pytest.raises(ValidationError):
            GeneratedRecipe(
                name="Test",
                ingredients=[
                    GeneratedRecipeIngredient(
                        ingredient_id=1, name="Test", quantity=1.0, unit="unit"
                    ),
                ],
                instructions="Test",
                cook_time_minutes=0,
            )


class TestSuggestionAcceptRequest:
    """Test SuggestionAcceptRequest schema validation."""

    def test_valid_request(self):
        """Should accept valid accept request."""
        recipe = GeneratedRecipe(
            name="Test Recipe",
            ingredients=[
                GeneratedRecipeIngredient(
                    ingredient_id=1, name="Test", quantity=1.0, unit="unit"
                ),
            ],
            instructions="Test",
        )

        request = SuggestionAcceptRequest(generated_recipe=recipe)

        assert request.generated_recipe.name == "Test Recipe"


class TestRecipeSuggestion:
    """Test RecipeSuggestion schema validation."""

    def test_traditional_suggestion(self):
        """Should accept traditional (non-AI) suggestion."""
        suggestion = RecipeSuggestion(
            recipe_id=123,
            recipe_name="Existing Recipe",
            match_score=0.85,
            missing_ingredients=["Salt"],
            matched_ingredients=["Pepper", "Garlic"],
            reason="Good match",
            is_ai_generated=False,
            generated_recipe=None,
        )

        assert suggestion.recipe_id == 123
        assert suggestion.is_ai_generated is False
        assert suggestion.generated_recipe is None

    def test_ai_generated_suggestion(self):
        """Should accept AI-generated suggestion."""
        generated_recipe = GeneratedRecipe(
            name="AI Recipe",
            ingredients=[
                GeneratedRecipeIngredient(
                    ingredient_id=1, name="Test", quantity=1.0, unit="unit"
                ),
            ],
            instructions="Test",
        )

        suggestion = RecipeSuggestion(
            recipe_id=None,
            recipe_name="AI Recipe",
            match_score=0.95,
            missing_ingredients=[],
            matched_ingredients=["Test"],
            reason="AI-generated creative recipe",
            is_ai_generated=True,
            generated_recipe=generated_recipe,
        )

        assert suggestion.recipe_id is None
        assert suggestion.is_ai_generated is True
        assert suggestion.generated_recipe is not None
        assert suggestion.generated_recipe.name == "AI Recipe"

    def test_invalid_match_score_too_high(self):
        """Should reject match score > 1.0."""
        with pytest.raises(ValidationError) as exc_info:
            RecipeSuggestion(
                recipe_id=1,
                recipe_name="Test",
                match_score=1.5,
                missing_ingredients=[],
                matched_ingredients=[],
                reason="Test",
                is_ai_generated=False,
                generated_recipe=None,
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("match_score",) for e in errors)

    def test_invalid_match_score_negative(self):
        """Should reject negative match score."""
        with pytest.raises(ValidationError) as exc_info:
            RecipeSuggestion(
                recipe_id=1,
                recipe_name="Test",
                match_score=-0.1,
                missing_ingredients=[],
                matched_ingredients=[],
                reason="Test",
                is_ai_generated=False,
                generated_recipe=None,
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("match_score",) for e in errors)


class TestSuggestionRequest:
    """Test SuggestionRequest schema validation."""

    def test_valid_request(self):
        """Should accept valid suggestion request."""
        request = SuggestionRequest(
            available_ingredients=[1, 2, 3],
            max_prep_time=30,
            max_cook_time=60,
            difficulty="easy",
            dietary_restrictions=["vegetarian", "gluten-free"],
            max_results=10,
        )

        assert request.available_ingredients == [1, 2, 3]
        assert request.max_results == 10

    def test_minimal_request(self):
        """Should accept request with only required fields."""
        request = SuggestionRequest(available_ingredients=[1, 2])

        assert request.available_ingredients == [1, 2]
        assert request.max_results == 5  # Default
        assert request.dietary_restrictions == []  # Default

    def test_invalid_max_results_too_high(self):
        """Should reject max_results > 20."""
        with pytest.raises(ValidationError) as exc_info:
            SuggestionRequest(
                available_ingredients=[1],
                max_results=25,
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("max_results",) for e in errors)

    def test_invalid_max_results_zero(self):
        """Should reject max_results = 0."""
        with pytest.raises(ValidationError) as exc_info:
            SuggestionRequest(
                available_ingredients=[1],
                max_results=0,
            )

        errors = exc_info.value.errors()
        assert any(e["loc"] == ("max_results",) for e in errors)

    def test_invalid_negative_time(self):
        """Should reject negative time values."""
        with pytest.raises(ValidationError):
            SuggestionRequest(
                available_ingredients=[1],
                max_prep_time=-10,
            )
