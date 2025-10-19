"""Unit tests for recipe service."""

import pytest

from app.schemas.ingredient import IngredientCreate
from app.schemas.recipe import RecipeCreate, RecipeIngredientCreate, RecipeUpdate
from app.services.ingredient_service import IngredientService
from app.services.recipe_service import RecipeService
from tests.fixtures.factories import ingredient_factory, recipe_factory


class TestRecipeCreation:
    """Test recipe creation with various scenarios."""

    @pytest.mark.unit
    async def test_create_recipe_without_ingredients(self, db_session):
        """Should create recipe without ingredients."""
        service = RecipeService(db_session)
        data = RecipeCreate(**recipe_factory(name="Simple Recipe"), ingredients=[])

        result = await service.create_recipe(data)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Simple Recipe"
        assert len(result.ingredient_associations) == 0

    @pytest.mark.unit
    async def test_create_recipe_with_ingredients(self, db_session):
        """Should create recipe with ingredients."""
        # Create an ingredient first
        ing_service = IngredientService(db_session)
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ing_service.create_ingredient(ing_data)
        await db_session.commit()

        # Create recipe with ingredient
        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Tomato Soup"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ingredient.id,
                    quantity=500,
                    unit="g",
                    is_optional=False,
                )
            ],
        )

        result = await service.create_recipe(recipe_data)
        await db_session.commit()

        assert result.id is not None
        assert len(result.ingredient_associations) == 1
        assert result.ingredient_associations[0].ingredient_id == ingredient.id

    @pytest.mark.unit
    async def test_create_recipe_with_invalid_ingredient(self, db_session):
        """Should fail with invalid ingredient ID."""
        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Invalid Recipe"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=999,
                    quantity=500,
                    unit="g",
                )
            ],
        )

        with pytest.raises(ValueError, match="invalid"):
            await service.create_recipe(recipe_data)


class TestRecipeUpdate:
    """Test recipe update operations."""

    @pytest.mark.unit
    async def test_update_recipe_metadata(self, db_session):
        """Should update recipe metadata fields."""
        service = RecipeService(db_session)
        data = RecipeCreate(**recipe_factory(name="Original"), ingredients=[])
        recipe = await service.create_recipe(data)
        await db_session.commit()

        update_data = RecipeUpdate(name="Updated", difficulty="hard")
        result = await service.update_recipe(recipe.id, update_data)
        await db_session.commit()

        assert result.name == "Updated"
        assert result.difficulty == "hard"

    @pytest.mark.unit
    async def test_update_recipe_ingredients(self, db_session):
        """Should update recipe ingredients."""
        # Create ingredients
        ing_service = IngredientService(db_session)
        ing1_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await ing_service.create_ingredient(ing1_data)
        ing2_data = IngredientCreate(**ingredient_factory(name="Onion"))
        ing2 = await ing_service.create_ingredient(ing2_data)
        await db_session.commit()

        # Create recipe with first ingredient
        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Test Recipe"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ing1.id,
                    quantity=500,
                    unit="g",
                )
            ],
        )
        recipe = await service.create_recipe(recipe_data)
        await db_session.commit()

        # Update to use second ingredient
        update_data = RecipeUpdate(
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ing2.id,
                    quantity=300,
                    unit="g",
                )
            ]
        )
        result = await service.update_recipe(recipe.id, update_data)
        await db_session.commit()

        assert len(result.ingredient_associations) == 1
        assert result.ingredient_associations[0].ingredient_id == ing2.id

    @pytest.mark.unit
    async def test_update_nonexistent_recipe(self, db_session):
        """Should fail when updating non-existent recipe."""
        service = RecipeService(db_session)
        update_data = RecipeUpdate(name="New Name")

        with pytest.raises(ValueError, match="not found"):
            await service.update_recipe(999, update_data)


class TestRecipeListing:
    """Test recipe listing with filters and pagination."""

    @pytest.mark.unit
    async def test_list_recipes_no_filters(self, db_session):
        """Should list all recipes."""
        service = RecipeService(db_session)

        for i in range(3):
            data = RecipeCreate(**recipe_factory(name=f"Recipe{i}"), ingredients=[])
            await service.create_recipe(data)
        await db_session.commit()

        result, total = await service.list_recipes()

        assert len(result) == 3
        assert total == 3

    @pytest.mark.unit
    async def test_list_recipes_filter_by_difficulty(self, db_session):
        """Should filter recipes by difficulty."""
        service = RecipeService(db_session)

        data1 = RecipeCreate(**recipe_factory(difficulty="easy"), ingredients=[])
        data2 = RecipeCreate(**recipe_factory(difficulty="hard"), ingredients=[])
        await service.create_recipe(data1)
        await service.create_recipe(data2)
        await db_session.commit()

        result, total = await service.list_recipes(difficulty="easy")

        assert len(result) == 1
        assert total == 1
        assert result[0].difficulty == "easy"

    @pytest.mark.unit
    async def test_list_recipes_pagination(self, db_session):
        """Should paginate recipe results."""
        service = RecipeService(db_session)

        for i in range(5):
            data = RecipeCreate(**recipe_factory(name=f"Recipe{i}"), ingredients=[])
            await service.create_recipe(data)
        await db_session.commit()

        # Page 1
        result1, total1 = await service.list_recipes(page=1, page_size=2)
        assert len(result1) == 2
        assert total1 == 5

        # Page 2
        result2, total2 = await service.list_recipes(page=2, page_size=2)
        assert len(result2) == 2
        assert total2 == 5

    @pytest.mark.unit
    async def test_list_recipes_invalid_pagination(self, db_session):
        """Should reject invalid pagination parameters."""
        service = RecipeService(db_session)

        with pytest.raises(ValueError):
            await service.list_recipes(page=0)

        with pytest.raises(ValueError):
            await service.list_recipes(page_size=0)


class TestRecipeDeletion:
    """Test recipe deletion."""

    @pytest.mark.unit
    async def test_delete_recipe(self, db_session):
        """Should soft delete recipe."""
        service = RecipeService(db_session)
        data = RecipeCreate(**recipe_factory(name="To Delete"), ingredients=[])
        recipe = await service.create_recipe(data)
        await db_session.commit()

        await service.delete_recipe(recipe.id)
        await db_session.commit()

        with pytest.raises(ValueError, match="not found"):
            await service.get_recipe(recipe.id)

    @pytest.mark.unit
    async def test_delete_nonexistent_recipe(self, db_session):
        """Should fail when deleting non-existent recipe."""
        service = RecipeService(db_session)

        with pytest.raises(ValueError, match="not found"):
            await service.delete_recipe(999)


class TestRecipeRetrieval:
    """Test recipe retrieval."""

    @pytest.mark.unit
    async def test_get_recipe_with_ingredients(self, db_session):
        """Should get recipe with ingredient details."""
        # Create ingredient and recipe
        ing_service = IngredientService(db_session)
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ing_service.create_ingredient(ing_data)
        await db_session.commit()

        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Test"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ingredient.id,
                    quantity=500,
                    unit="g",
                )
            ],
        )
        recipe = await service.create_recipe(recipe_data)
        await db_session.commit()

        result = await service.get_recipe(recipe.id)

        assert result.id == recipe.id
        assert len(result.ingredient_associations) == 1

    @pytest.mark.unit
    async def test_get_nonexistent_recipe(self, db_session):
        """Should fail when recipe not found."""
        service = RecipeService(db_session)

        with pytest.raises(ValueError, match="not found"):
            await service.get_recipe(999)


class TestRecipeIngredientCalculations:
    """Test recipe ingredient calculations."""

    @pytest.mark.unit
    async def test_calculate_missing_ingredients(self, db_session):
        """Should calculate missing ingredients for recipe."""
        # Create ingredients
        ing_service = IngredientService(db_session)
        ing1_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await ing_service.create_ingredient(ing1_data)
        ing2_data = IngredientCreate(**ingredient_factory(name="Onion"))
        ing2 = await ing_service.create_ingredient(ing2_data)
        await db_session.commit()

        # Create recipe requiring both
        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Test"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ing1.id,
                    quantity=500,
                    unit="g",
                    is_optional=False,
                ),
                RecipeIngredientCreate(
                    ingredient_id=ing2.id,
                    quantity=300,
                    unit="g",
                    is_optional=False,
                ),
            ],
        )
        recipe = await service.create_recipe(recipe_data)
        await db_session.commit()

        # Check with only one ingredient available
        missing = await service.calculate_missing_ingredients(recipe.id, [ing1.id])

        assert len(missing) == 1
        assert "Onion" in missing

    @pytest.mark.unit
    async def test_calculate_missing_ingredients_all_available(self, db_session):
        """Should return empty list when all ingredients available."""
        # Create ingredient and recipe
        ing_service = IngredientService(db_session)
        ing_data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await ing_service.create_ingredient(ing_data)
        await db_session.commit()

        service = RecipeService(db_session)
        recipe_data = RecipeCreate(
            **recipe_factory(name="Test"),
            ingredients=[
                RecipeIngredientCreate(
                    ingredient_id=ingredient.id,
                    quantity=500,
                    unit="g",
                    is_optional=False,
                )
            ],
        )
        recipe = await service.create_recipe(recipe_data)
        await db_session.commit()

        missing = await service.calculate_missing_ingredients(recipe.id, [ingredient.id])

        assert len(missing) == 0
