"""Unit tests for ingredient service."""

from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from app.schemas.ingredient import IngredientCreate, IngredientFilter, IngredientPatch
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
    async def test_create_duplicate_name_adds_quantity(self, db_session):
        """Should add quantity to existing ingredient with same name."""
        service = IngredientService(db_session)

        # Create first ingredient with quantity 100
        data1 = IngredientCreate(**ingredient_factory(name="Tomato", quantity=100))
        result1 = await service.create_ingredient(data1)
        await db_session.commit()

        # Create duplicate with quantity 50 - should add to existing
        data2 = IngredientCreate(**ingredient_factory(name="Tomato", quantity=50))
        result2 = await service.create_ingredient(data2)
        await db_session.commit()

        # Should return the same ingredient with updated quantity
        assert result2.id == result1.id
        assert float(result2.quantity) == 150.0

    @pytest.mark.unit
    async def test_create_case_insensitive_duplicate_adds_quantity(self, db_session):
        """Should detect duplicate names case-insensitively and add quantity."""
        service = IngredientService(db_session)

        data1 = IngredientCreate(**ingredient_factory(name="Tomato", quantity=100))
        result1 = await service.create_ingredient(data1)
        await db_session.commit()

        data2 = IngredientCreate(**ingredient_factory(name="TOMATO", quantity=25))
        result2 = await service.create_ingredient(data2)
        await db_session.commit()

        # Should return the same ingredient with updated quantity
        assert result2.id == result1.id
        assert float(result2.quantity) == 125.0

    @pytest.mark.unit
    async def test_create_duplicate_updates_other_fields(self, db_session):
        """Should update storage_location and expiry_date when creating duplicate."""
        from datetime import date, timedelta
        
        service = IngredientService(db_session)

        # Create first ingredient
        data1 = IngredientCreate(**ingredient_factory(
            name="Tomato",
            quantity=100,
            storage_location="fridge"
        ))
        result1 = await service.create_ingredient(data1)
        await db_session.commit()

        # Create duplicate with different fields
        tomorrow = date.today() + timedelta(days=1)
        data2 = IngredientCreate(**ingredient_factory(
            name="Tomato",
            quantity=50,
            storage_location="counter",
            expiry_date=tomorrow
        ))
        result2 = await service.create_ingredient(data2)
        await db_session.commit()

        # Should update fields and add quantity
        assert result2.id == result1.id
        assert float(result2.quantity) == 150.0
        assert result2.storage_location == "counter"
        assert result2.expiry_date == tomorrow

    @pytest.mark.unit
    async def test_create_duplicate_with_none_quantity(self, db_session):
        """Should handle None quantities correctly."""
        service = IngredientService(db_session)

        # Create first ingredient with None quantity
        data1 = IngredientCreate(**ingredient_factory(name="Tomato", quantity=None))
        result1 = await service.create_ingredient(data1)
        await db_session.commit()
        # When quantity is None, it defaults to 0
        initial_qty = float(result1.quantity) if result1.quantity is not None else 0.0

        # Create duplicate with quantity 50
        data2 = IngredientCreate(**ingredient_factory(name="Tomato", quantity=50))
        result2 = await service.create_ingredient(data2)
        await db_session.commit()

        # Should add quantity correctly (0 + 50 = 50)
        assert result2.id == result1.id
        assert float(result2.quantity) == initial_qty + 50.0


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
        update_data = IngredientPatch(name="Cherry Tomato")
        result = await service.update_ingredient(ingredient.id, update_data)
        await db_session.commit()

        assert result.name == "Cherry Tomato"

    @pytest.mark.unit
    async def test_update_nonexistent_ingredient_fails(self, db_session):
        """Should fail when updating non-existent ingredient."""
        service = IngredientService(db_session)
        data = IngredientPatch(name="New Name")

        with pytest.raises(ValueError, match="not found"):
            await service.update_ingredient(999, data)

    @pytest.mark.unit
    async def test_update_to_duplicate_name_fails(self, db_session):
        """Should fail when updating name to existing name (database constraint)."""
        from sqlalchemy.exc import IntegrityError
        
        service = IngredientService(db_session)

        # Create two ingredients
        data1 = IngredientCreate(**ingredient_factory(name="Tomato"))
        ing1 = await service.create_ingredient(data1)

        data2 = IngredientCreate(**ingredient_factory(name="Potato"))
        await service.create_ingredient(data2)
        await db_session.commit()

        # Try to update first to second's name - should raise IntegrityError from database
        update_data = IngredientPatch(name="Potato")
        with pytest.raises(IntegrityError, match="UNIQUE constraint failed"):
            await service.update_ingredient(ing1.id, update_data)
            await db_session.flush()


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

        filters = IngredientFilter()
        result = await service.list_ingredients(filters)

        assert len(result) == 3

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

        filters = IngredientFilter(storage_location="fridge")
        result = await service.list_ingredients(filters)

        assert len(result) == 1
        assert result[0].storage_location == "fridge"

    @pytest.mark.unit
    async def test_list_pagination_invalid_skip(self, db_session):
        """Should reject invalid page number."""
        service = IngredientService(db_session)

        with pytest.raises(ValidationError, match="greater than or equal to 1"):
            IngredientFilter(page=0)

    @pytest.mark.unit
    async def test_list_pagination_invalid_limit(self, db_session):
        """Should reject limit out of bounds (1-1000)."""
        service = IngredientService(db_session)

        with pytest.raises(ValidationError, match="greater than or equal to 1"):
            IngredientFilter(page_size=0)

        with pytest.raises(ValidationError, match="less than or equal to 1000"):
            IngredientFilter(page_size=1001)

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

        filters = IngredientFilter(expiring_before=tomorrow + timedelta(days=2))
        result = await service.list_ingredients(filters)

        assert len(result) == 1

    @pytest.mark.unit
    async def test_list_with_name_filter(self, db_session):
        """Should filter by name substring."""
        service = IngredientService(db_session)

        data1 = IngredientCreate(**ingredient_factory(name="Cherry Tomato"))
        data2 = IngredientCreate(**ingredient_factory(name="Potato"))
        await service.create_ingredient(data1)
        await service.create_ingredient(data2)
        await db_session.commit()

        filters = IngredientFilter(name_contains="tomato")
        result = await service.list_ingredients(filters)

        assert len(result) == 1
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
