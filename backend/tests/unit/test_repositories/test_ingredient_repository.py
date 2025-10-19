"""Unit tests for ingredient repository."""

from datetime import date, timedelta

import pytest

from app.models import Ingredient
from app.repositories.ingredient_repository import IngredientRepository
from tests.fixtures.factories import ingredient_factory


class TestIngredientRepositoryBasicCRUD:
    """Test basic CRUD operations."""

    @pytest.mark.unit
    async def test_create_ingredient(self, db_session):
        """Should create ingredient in database."""
        repo = IngredientRepository(db_session)
        data = ingredient_factory(name="Tomato")
        ingredient = Ingredient(**data)

        result = await repo.create(ingredient)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Tomato"
        assert result.created_at is not None
        assert result.updated_at is not None

    @pytest.mark.unit
    async def test_get_by_id(self, db_session):
        """Should retrieve ingredient by ID."""
        repo = IngredientRepository(db_session)
        data = ingredient_factory(name="Tomato")
        ingredient = Ingredient(**data)
        created = await repo.create(ingredient)
        await db_session.commit()

        result = await repo.get_by_id(created.id)

        assert result is not None
        assert result.id == created.id
        assert result.name == "Tomato"

    @pytest.mark.unit
    async def test_get_by_name(self, db_session):
        """Should retrieve ingredient by name."""
        repo = IngredientRepository(db_session)
        data = ingredient_factory(name="Tomato")
        ingredient = Ingredient(**data)
        await repo.create(ingredient)
        await db_session.commit()

        result = await repo.get_by_name("Tomato")

        assert result is not None
        assert result.name == "Tomato"

    @pytest.mark.unit
    async def test_update_ingredient(self, db_session):
        """Should update ingredient fields."""
        repo = IngredientRepository(db_session)
        data = ingredient_factory(name="Tomato")
        ingredient = Ingredient(**data)
        created = await repo.create(ingredient)
        await db_session.commit()

        created.name = "Cherry Tomato"
        result = await repo.update(created)
        await db_session.commit()

        assert result.name == "Cherry Tomato"

    @pytest.mark.unit
    async def test_soft_delete(self, db_session):
        """Should soft delete ingredient."""
        repo = IngredientRepository(db_session)
        data = ingredient_factory(name="Tomato")
        ingredient = Ingredient(**data)
        created = await repo.create(ingredient)
        await db_session.commit()

        await repo.soft_delete(created)
        await db_session.commit()

        # Should not be retrievable
        result = await repo.get_by_id(created.id)
        assert result is None


class TestIngredientRepositoryFilters:
    """Test query filters."""

    @pytest.mark.unit
    async def test_filter_by_storage_location(self, db_session):
        """Should filter by storage location."""
        repo = IngredientRepository(db_session)

        # Create ingredients in different locations
        ing1 = Ingredient(**ingredient_factory(storage_location="fridge"))
        ing2 = Ingredient(**ingredient_factory(storage_location="cupboard"))
        await repo.create(ing1)
        await repo.create(ing2)
        await db_session.commit()

        result, total = await repo.list(storage_location="fridge")

        assert len(result) == 1
        assert total == 1
        assert result[0].storage_location == "fridge"

    @pytest.mark.unit
    async def test_filter_by_expiring_before(self, db_session):
        """Should filter by expiry date."""
        repo = IngredientRepository(db_session)

        today = date.today()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)

        ing1 = Ingredient(**ingredient_factory(expiry_date=tomorrow))
        ing2 = Ingredient(**ingredient_factory(expiry_date=next_week))
        await repo.create(ing1)
        await repo.create(ing2)
        await db_session.commit()

        result, total = await repo.list(expiring_before=tomorrow + timedelta(days=2))

        assert len(result) == 1
        assert total == 1

    @pytest.mark.unit
    async def test_filter_by_name_contains(self, db_session):
        """Should filter by name substring (case-insensitive)."""
        repo = IngredientRepository(db_session)

        ing1 = Ingredient(**ingredient_factory(name="Cherry Tomato"))
        ing2 = Ingredient(**ingredient_factory(name="Potato"))
        await repo.create(ing1)
        await repo.create(ing2)
        await db_session.commit()

        result, total = await repo.list(name_contains="tomato")

        assert len(result) == 1
        assert total == 1
        assert "tomato" in result[0].name.lower()

    @pytest.mark.unit
    async def test_combined_filters(self, db_session):
        """Should apply multiple filters simultaneously."""
        repo = IngredientRepository(db_session)

        ing1 = Ingredient(
            **ingredient_factory(
                name="Tomato",
                storage_location="fridge",
                expiry_date=date.today() + timedelta(days=1),
            )
        )
        ing2 = Ingredient(**ingredient_factory(name="Potato", storage_location="pantry"))
        await repo.create(ing1)
        await repo.create(ing2)
        await db_session.commit()

        result, total = await repo.list(storage_location="fridge", name_contains="tom")

        assert len(result) == 1
        assert total == 1
        assert result[0].name == "Tomato"


class TestIngredientRepositoryPagination:
    """Test pagination."""

    @pytest.mark.unit
    async def test_pagination_first_page(self, db_session):
        """Should return first page of results."""
        repo = IngredientRepository(db_session)

        # Create 5 ingredients
        for i in range(5):
            ing = Ingredient(**ingredient_factory(name=f"Item{i}"))
            await repo.create(ing)
        await db_session.commit()

        result, total = await repo.list(skip=0, limit=2)

        assert len(result) == 2
        assert total == 5

    @pytest.mark.unit
    async def test_pagination_second_page(self, db_session):
        """Should return second page of results."""
        repo = IngredientRepository(db_session)

        # Create 5 ingredients
        for i in range(5):
            ing = Ingredient(**ingredient_factory(name=f"Item{i}"))
            await repo.create(ing)
        await db_session.commit()

        result, total = await repo.list(skip=2, limit=2)

        assert len(result) == 2
        assert total == 5

    @pytest.mark.unit
    async def test_pagination_last_page_partial(self, db_session):
        """Should return partial results on last page."""
        repo = IngredientRepository(db_session)

        # Create 5 ingredients
        for i in range(5):
            ing = Ingredient(**ingredient_factory(name=f"Item{i}"))
            await repo.create(ing)
        await db_session.commit()

        result, total = await repo.list(skip=4, limit=2)

        assert len(result) == 1
        assert total == 5

    @pytest.mark.unit
    async def test_pagination_beyond_results(self, db_session):
        """Should return empty results beyond last page."""
        repo = IngredientRepository(db_session)

        # Create 3 ingredients
        for i in range(3):
            ing = Ingredient(**ingredient_factory(name=f"Item{i}"))
            await repo.create(ing)
        await db_session.commit()

        result, total = await repo.list(skip=10, limit=2)

        assert len(result) == 0
        assert total == 3


class TestIngredientRepositoryEdgeCases:
    """Test edge cases."""

    @pytest.mark.unit
    async def test_empty_database(self, db_session):
        """Should handle empty database."""
        repo = IngredientRepository(db_session)

        result, total = await repo.list()

        assert len(result) == 0
        assert total == 0

    @pytest.mark.unit
    async def test_all_soft_deleted(self, db_session):
        """Should not return soft-deleted items."""
        repo = IngredientRepository(db_session)

        ing = Ingredient(**ingredient_factory(name="Deleted"))
        created = await repo.create(ing)
        await db_session.commit()

        await repo.soft_delete(created)
        await db_session.commit()

        result, total = await repo.list()

        assert len(result) == 0
        assert total == 0

    @pytest.mark.unit
    async def test_filter_no_matches(self, db_session):
        """Should handle filters with no matches."""
        repo = IngredientRepository(db_session)

        ing = Ingredient(**ingredient_factory(storage_location="fridge"))
        await repo.create(ing)
        await db_session.commit()

        result, total = await repo.list(storage_location="cupboard")

        assert len(result) == 0
        assert total == 0
