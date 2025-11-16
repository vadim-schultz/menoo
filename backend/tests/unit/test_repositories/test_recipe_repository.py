"""Unit tests for recipe repository."""

import pytest

from app.models import Recipe
from app.repositories.recipe_repository import RecipeRepository
from tests.fixtures.factories import recipe_factory


class TestRecipeRepositoryBasicCRUD:
    """Test basic CRUD operations."""

    @pytest.mark.unit
    async def test_create_recipe(self, db_session):
        """Should create recipe in database."""
        repo = RecipeRepository(db_session)
        data = recipe_factory(name="Tomato Soup")
        # Remove ingredients since it's a read-only property from ingredient_associations
        data.pop("ingredients", None)
        recipe = Recipe(**data)

        result = await repo.create(recipe)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Tomato Soup"
        assert result.created_at is not None

    @pytest.mark.unit
    async def test_get_by_id(self, db_session):
        """Should retrieve recipe by ID."""
        repo = RecipeRepository(db_session)
        data = recipe_factory(name="Test Recipe")
        # Remove ingredients since it's a read-only property from ingredient_associations
        data.pop("ingredients", None)
        recipe = Recipe(**data)
        created = await repo.create(recipe)
        await db_session.commit()

        result = await repo.get_by_id(created.id)

        assert result is not None
        assert result.id == created.id
        assert result.name == "Test Recipe"

    @pytest.mark.unit
    async def test_update_recipe(self, db_session):
        """Should update recipe fields."""
        repo = RecipeRepository(db_session)
        data = recipe_factory(name="Original")
        # Remove ingredients since it's a read-only property from ingredient_associations
        data.pop("ingredients", None)
        recipe = Recipe(**data)
        created = await repo.create(recipe)
        await db_session.commit()

        created.name = "Updated"
        result = await repo.update(created)
        await db_session.commit()

        assert result.name == "Updated"

    @pytest.mark.unit
    async def test_soft_delete(self, db_session):
        """Should soft delete recipe."""
        repo = RecipeRepository(db_session)
        data = recipe_factory(name="To Delete")
        # Remove ingredients since it's a read-only property from ingredient_associations
        data.pop("ingredients", None)
        recipe = Recipe(**data)
        created = await repo.create(recipe)
        await db_session.commit()

        await repo.soft_delete(created)
        await db_session.commit()

        # Should not be retrievable
        result = await repo.get_by_id(created.id)
        assert result is None


class TestRecipeRepositoryFilters:
    """Test query filters."""

    @pytest.mark.unit
    async def test_filter_by_name_contains(self, db_session):
        """Should filter by name substring."""
        repo = RecipeRepository(db_session)

        data1 = recipe_factory(name="Tomato Soup")
        data1.pop("ingredients", None)
        data2 = recipe_factory(name="Potato Salad")
        data2.pop("ingredients", None)
        recipe1 = Recipe(**data1)
        recipe2 = Recipe(**data2)
        await repo.create(recipe1)
        await repo.create(recipe2)
        await db_session.commit()

        result, total = await repo.list(name_contains="soup")

        assert len(result) == 1
        assert total == 1
        assert "soup" in result[0].name.lower()


class TestRecipeRepositoryPagination:
    """Test pagination."""

    @pytest.mark.unit
    async def test_pagination(self, db_session):
        """Should paginate results."""
        repo = RecipeRepository(db_session)

        for i in range(5):
            data = recipe_factory(name=f"Recipe{i}")
            data.pop("ingredients", None)
            recipe = Recipe(**data)
            await repo.create(recipe)
        await db_session.commit()

        # First page
        result1, total1 = await repo.list(skip=0, limit=2)
        assert len(result1) == 2
        assert total1 == 5

        # Second page
        result2, total2 = await repo.list(skip=2, limit=2)
        assert len(result2) == 2
        assert total2 == 5
