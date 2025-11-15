"""Unit tests for recipe service."""

from decimal import Decimal

import pytest

from app.enums import CuisineType
from app.schemas import (
    IngredientCreate,
    Recipe,
)
from app.schemas.core.recipe import IngredientPreparation
from tests.fixtures.factories import (
    ingredient_factory,
    recipe_factory,
    recipe_ingredient_factory,
)


class TestRecipeCreation:
    """Test recipe creation with various scenarios."""

    @pytest.mark.unit
    async def test_create_recipe_without_ingredients(self, recipe_service, db_session):
        """Should create recipe without ingredients."""
        data = Recipe(**recipe_factory(name="Simple Recipe"), ingredients=[])

        result = await recipe_service.create_recipe(data)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Simple Recipe"
        assert len(result.ingredient_associations) == 0

    @pytest.mark.unit
    async def test_create_recipe_with_ingredients(self, ingredient_service, recipe_service, db_session):
        """Should create recipe with ingredients."""
        # Create an ingredient first
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ingredient_service.create_ingredient(ing_data)
        await db_session.commit()

        # Create recipe with ingredient
        recipe_data = Recipe(
            **recipe_factory(name="Tomato Soup"),
            ingredients=[
                IngredientPreparation(
                    **recipe_ingredient_factory(ingredient_id=ingredient.id)
                )
            ],
        )
        result = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Tomato Soup"
        assert len(result.ingredient_associations) == 1
        assert result.ingredient_associations[0].ingredient_id == ingredient.id

    @pytest.mark.unit
    async def test_create_recipe_with_invalid_ingredient(self, recipe_service, db_session):
        """Should fail when creating recipe with non-existent ingredient."""
        recipe_data = Recipe(
            **recipe_factory(name="Invalid Recipe"),
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=999))
            ],
        )

        with pytest.raises(ValueError, match="invalid"):
            await recipe_service.create_recipe(recipe_data)


class TestRecipeUpdate:
    """Test recipe update operations."""

    @pytest.mark.unit
    async def test_update_recipe_metadata(self, recipe_service, db_session):
        """Should update recipe metadata without touching ingredients."""
        # Create recipe
        recipe_data = Recipe(**recipe_factory(name="Original"), ingredients=[])
        recipe = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        # Update metadata
        update_data = Recipe(name="Updated Name")
        result = await recipe_service.update_recipe(recipe.id, update_data)
        await db_session.commit()

        assert result.name == "Updated Name"

    @pytest.mark.unit
    async def test_update_recipe_ingredients(self, ingredient_service, recipe_service, db_session):
        """Should update recipe ingredients."""
        # Create ingredients
        ing1_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await ingredient_service.create_ingredient(ing1_data)

        ing2_data = IngredientCreate(**ingredient_factory(name="Onion"))
        ing2 = await ingredient_service.create_ingredient(ing2_data)
        await db_session.commit()

        # Create recipe with first ingredient
        recipe_data = Recipe(
            **recipe_factory(name="Recipe"),
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ing1.id))
            ],
        )
        recipe = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        # Update to use second ingredient
        update_data = Recipe(
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ing2.id))
            ]
        )
        result = await recipe_service.update_recipe(recipe.id, update_data)
        await db_session.commit()

        assert len(result.ingredient_associations) == 1
        assert result.ingredient_associations[0].ingredient_id == ing2.id

    @pytest.mark.unit
    async def test_update_nonexistent_recipe(self, recipe_service, db_session):
        """Should fail when updating non-existent recipe."""
        update_data = Recipe(name="New Name")

        with pytest.raises(ValueError, match="not found"):
            await recipe_service.update_recipe(999, update_data)


class TestRecipeListing:
    """Test recipe listing with filters and pagination."""

    @pytest.mark.unit
    async def test_list_recipes_no_filters(self, recipe_service, db_session):
        """Should list all recipes without filters."""
        # Create recipes
        for i in range(3):
            data = Recipe(**recipe_factory(name=f"Recipe{i}"), ingredients=[])
            await recipe_service.create_recipe(data)
        await db_session.commit()

        recipes, total = await recipe_service.list_recipes()

        assert len(recipes) == 3
        assert total == 3

    @pytest.mark.unit
    async def test_list_recipes_filter_by_cuisine(self, recipe_service, db_session):
        """Should filter recipes by cuisine type."""
        # Create recipes with different cuisines
        data1 = Recipe(**recipe_factory(cuisine_types=[CuisineType.ITALIAN]), ingredients=[])
        data2 = Recipe(**recipe_factory(cuisine_types=[CuisineType.CHINESE]), ingredients=[])
        await recipe_service.create_recipe(data1)
        await recipe_service.create_recipe(data2)
        await db_session.commit()

        recipes, total = await recipe_service.list_recipes(cuisine=CuisineType.ITALIAN)

        assert len(recipes) == 1
        assert total == 1
        assert CuisineType.ITALIAN in recipes[0].cuisine_types

    @pytest.mark.unit
    async def test_list_recipes_pagination(self, recipe_service, db_session):
        """Should paginate recipes correctly."""
        # Create recipes
        for i in range(5):
            data = Recipe(**recipe_factory(name=f"Recipe{i}"), ingredients=[])
            await recipe_service.create_recipe(data)
        await db_session.commit()

        # Get first page
        recipes, total = await recipe_service.list_recipes(page=1, page_size=2)
        assert len(recipes) == 2
        assert total == 5

        # Get second page
        recipes, total = await recipe_service.list_recipes(page=2, page_size=2)
        assert len(recipes) == 2
        assert total == 5

    @pytest.mark.unit
    async def test_list_recipes_invalid_pagination(self, recipe_service, db_session):
        """Should reject invalid pagination parameters."""
        with pytest.raises(ValueError, match="Page must be"):
            await recipe_service.list_recipes(page=0)

        with pytest.raises(ValueError, match="Page size must be"):
            await recipe_service.list_recipes(page_size=0)


class TestRecipeDeletion:
    """Test recipe soft deletion."""

    @pytest.mark.unit
    async def test_delete_recipe(self, recipe_service, db_session):
        """Should soft delete a recipe."""
        # Create recipe
        data = Recipe(**recipe_factory(name="To Delete"), ingredients=[])
        recipe = await recipe_service.create_recipe(data)
        await db_session.commit()

        # Delete it
        await recipe_service.delete_recipe(recipe.id)
        await db_session.commit()

        # Should not be able to get it
        with pytest.raises(ValueError, match="not found"):
            await recipe_service.get_recipe(recipe.id)

    @pytest.mark.unit
    async def test_delete_nonexistent_recipe(self, recipe_service, db_session):
        """Should fail when deleting non-existent recipe."""
        with pytest.raises(ValueError, match="not found"):
            await recipe_service.delete_recipe(999)


class TestRecipeRetrieval:
    """Test single recipe retrieval."""

    @pytest.mark.unit
    async def test_get_recipe_with_ingredients(self, ingredient_service, recipe_service, db_session):
        """Should retrieve recipe with ingredients loaded."""
        # Create ingredient
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ingredient_service.create_ingredient(ing_data)
        await db_session.commit()

        # Create recipe
        recipe_data = Recipe(
            **recipe_factory(name="Recipe"),
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ingredient.id))
            ],
        )
        recipe = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        # Get it
        result = await recipe_service.get_recipe(recipe.id, load_ingredients=True)

        assert result.id == recipe.id
        assert len(result.ingredient_associations) == 1

    @pytest.mark.unit
    async def test_get_nonexistent_recipe(self, recipe_service, db_session):
        """Should fail when recipe not found."""
        with pytest.raises(ValueError, match="not found"):
            await recipe_service.get_recipe(999)


class TestRecipeIngredientCalculations:
    """Test recipe ingredient calculations."""

    @pytest.mark.unit
    async def test_calculate_missing_ingredients(self, ingredient_service, recipe_service, db_session):
        """Should calculate which ingredients are missing."""
        # Create ingredients
        ing1_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await ingredient_service.create_ingredient(ing1_data)

        ing2_data = IngredientCreate(**ingredient_factory(name="Onion"))
        ing2 = await ingredient_service.create_ingredient(ing2_data)
        await db_session.commit()

        # Create recipe with both ingredients
        recipe_data = Recipe(
            **recipe_factory(name="Recipe"),
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ing1.id)),
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ing2.id)),
            ],
        )
        recipe = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        # Check missing ingredients (only have first one)
        missing = await recipe_service.calculate_missing_ingredients(
            recipe.id, [ing1.id]
        )

        assert len(missing) == 1
        assert "Onion" in missing

    @pytest.mark.unit
    async def test_calculate_missing_ingredients_all_available(
        self, ingredient_service, recipe_service, db_session
    ):
        """Should return empty list when all ingredients are available."""
        # Create ingredient
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ingredient_service.create_ingredient(ing_data)
        await db_session.commit()

        # Create recipe
        recipe_data = Recipe(
            **recipe_factory(name="Recipe"),
            ingredients=[
                IngredientPreparation(**recipe_ingredient_factory(ingredient_id=ingredient.id))
            ],
        )
        recipe = await recipe_service.create_recipe(recipe_data)
        await db_session.commit()

        # Check missing ingredients (have all of them)
        missing = await recipe_service.calculate_missing_ingredients(
            recipe.id, [ingredient.id]
        )

        assert len(missing) == 0
