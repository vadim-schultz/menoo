"""Unit tests for ingredient service."""

from datetime import date, timedelta

import pytest

from app.schemas.ingredient import IngredientCreate, IngredientUpdate
from app.services.ingredient_service import IngredientService
from tests.fixtures.factories import ingredient_factory


class TestIngredientCreation:
    """Test ingredient creation with various scenarios."""

    @pytest.mark.unit
    async def test_create_valid_ingredient(self, db_session):
        """Should create ingredient with valid data."""
        service = IngredientService(db_session)
        data = IngredientCreate(**ingredient_factory(name="Tomato"))

        result = await service.create_ingredient(data)
        await db_session.commit()

        assert result.id is not None
        assert result.name == "Tomato"
        assert result.created_at is not None

    @pytest.mark.unit
    async def test_create_duplicate_name_fails(self, db_session):
        """Should reject ingredient with duplicate name."""
        service = IngredientService(db_session)

        # Create first ingredient
        data1 = IngredientCreate(**ingredient_factory(name="Tomato"))
        await service.create_ingredient(data1)
        await db_session.commit()

        # Try to create duplicate
        data2 = IngredientCreate(**ingredient_factory(name="Tomato"))
        with pytest.raises(ValueError, match="already exists"):
            await service.create_ingredient(data2)

    @pytest.mark.unit
    async def test_create_case_insensitive_duplicate(self, db_session):
        """Should detect duplicate names case-insensitively."""
        service = IngredientService(db_session)

        data1 = IngredientCreate(**ingredient_factory(name="Tomato"))
        await service.create_ingredient(data1)
        await db_session.commit()

        data2 = IngredientCreate(**ingredient_factory(name="TOMATO"))
        with pytest.raises(ValueError, match="already exists"):
            await service.create_ingredient(data2)


class TestIngredientUpdate:
    """Test ingredient update operations."""

    @pytest.mark.unit
    async def test_update_existing_ingredient(self, db_session):
        """Should update existing ingredient successfully."""
        service = IngredientService(db_session)

        # Create ingredient
        data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await service.create_ingredient(data)
        await db_session.commit()

        # Update it
        update_data = IngredientUpdate(name="Cherry Tomato")
        result = await service.update_ingredient(ingredient.id, update_data)
        await db_session.commit()

        assert result.name == "Cherry Tomato"

    @pytest.mark.unit
    async def test_update_nonexistent_ingredient_fails(self, db_session):
        """Should fail when updating non-existent ingredient."""
        service = IngredientService(db_session)
        data = IngredientUpdate(name="New Name")

        with pytest.raises(ValueError, match="not found"):
            await service.update_ingredient(999, data)

    @pytest.mark.unit
    async def test_update_to_duplicate_name_fails(self, db_session):
        """Should fail when updating name to existing name."""
        service = IngredientService(db_session)

        # Create two ingredients
        data1 = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await service.create_ingredient(data1)

        data2 = IngredientCreate(**ingredient_factory(name="Potato"))
        await service.create_ingredient(data2)
        await db_session.commit()

        # Try to update first to second's name
        update_data = IngredientUpdate(name="Potato")
        with pytest.raises(ValueError, match="already exists"):
            await service.update_ingredient(ing1.id, update_data)


class TestIngredientListing:
    """Test ingredient listing with filters and pagination."""

    @pytest.mark.unit
    async def test_list_without_filters(self, db_session):
        """Should list all ingredients without filters."""
        service = IngredientService(db_session)

        # Create ingredients
        for i in range(3):
            data = IngredientCreate(**ingredient_factory(name=f"Item{i}"))
            await service.create_ingredient(data)
        await db_session.commit()

        result, total = await service.list_ingredients()

        assert len(result) == 3
        assert total == 3

    @pytest.mark.unit
    async def test_list_with_storage_filter(self, db_session):
        """Should filter by storage location."""
        service = IngredientService(db_session)

        # Create ingredients in different locations
        data1 = IngredientCreate(**ingredient_factory(storage_location="fridge"))
        data2 = IngredientCreate(**ingredient_factory(storage_location="cupboard"))
        await service.create_ingredient(data1)
        await service.create_ingredient(data2)
        await db_session.commit()

        result, total = await service.list_ingredients(storage_location="fridge")

        assert len(result) == 1
        assert total == 1
        assert result[0].storage_location == "fridge"

    @pytest.mark.unit
    async def test_list_pagination_invalid_skip(self, db_session):
        """Should reject invalid page number."""
        service = IngredientService(db_session)

        with pytest.raises(ValueError, match="Page"):
            await service.list_ingredients(page=0)

    @pytest.mark.unit
    async def test_list_pagination_invalid_limit(self, db_session):
        """Should reject limit out of bounds (1-1000)."""
        service = IngredientService(db_session)

        with pytest.raises(ValueError, match="Page size"):
            await service.list_ingredients(page_size=0)

        with pytest.raises(ValueError, match="Page size"):
            await service.list_ingredients(page_size=1001)

    @pytest.mark.unit
    async def test_list_with_expiry_filter(self, db_session):
        """Should filter by expiry date."""
        service = IngredientService(db_session)

        today = date.today()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)

        data1 = IngredientCreate(**ingredient_factory(expiry_date=tomorrow))
        data2 = IngredientCreate(**ingredient_factory(expiry_date=next_week))
        await service.create_ingredient(data1)
        await service.create_ingredient(data2)
        await db_session.commit()

        result, total = await service.list_ingredients(expiring_before=tomorrow + timedelta(days=2))

        assert len(result) == 1
        assert total == 1

    @pytest.mark.unit
    async def test_list_with_name_filter(self, db_session):
        """Should filter by name substring."""
        service = IngredientService(db_session)

        data1 = IngredientCreate(**ingredient_factory(name="Cherry Tomato"))
        data2 = IngredientCreate(**ingredient_factory(name="Potato"))
        await service.create_ingredient(data1)
        await service.create_ingredient(data2)
        await db_session.commit()

        result, total = await service.list_ingredients(name_contains="tomato")

        assert len(result) == 1
        assert total == 1
        assert "tomato" in result[0].name.lower()


class TestIngredientDeletion:
    """Test ingredient soft deletion."""

    @pytest.mark.unit
    async def test_delete_existing_ingredient(self, db_session):
        """Should soft delete existing ingredient."""
        service = IngredientService(db_session)

        data = IngredientCreate(**ingredient_factory(name="Tomato"))
        ingredient = await service.create_ingredient(data)
        await db_session.commit()

        await service.delete_ingredient(ingredient.id)
        await db_session.commit()

        # Should not be able to get it
        with pytest.raises(ValueError, match="not found"):
            await service.get_ingredient(ingredient.id)

    @pytest.mark.unit
    async def test_delete_nonexistent_ingredient_fails(self, db_session):
        """Should fail when deleting non-existent ingredient."""
        service = IngredientService(db_session)

        with pytest.raises(ValueError, match="not found"):
            await service.delete_ingredient(999)


class TestIngredientRetrieval:
    """Test single ingredient retrieval."""

    @pytest.mark.unit
    async def test_get_existing_ingredient(self, db_session):
        """Should retrieve existing ingredient by ID."""
        service = IngredientService(db_session)

        data = IngredientCreate(**ingredient_factory(name="Tomato"))
        created = await service.create_ingredient(data)
        await db_session.commit()

        result = await service.get_ingredient(created.id)

        assert result.id == created.id
        assert result.name == "Tomato"

    @pytest.mark.unit
    async def test_get_nonexistent_ingredient_fails(self, db_session):
        """Should fail when ingredient not found."""
        service = IngredientService(db_session)

        with pytest.raises(ValueError, match="not found"):
            await service.get_ingredient(999)
