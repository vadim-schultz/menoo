"""Unit tests for ingredient schemas."""

from datetime import date

import pytest
from pydantic import ValidationError

from app.schemas.ingredient import (
    IngredientCreate,
    IngredientRead,
    IngredientUpdate,
)


class TestIngredientCreate:
    """Test IngredientCreate schema validation."""

    @pytest.mark.unit
    def test_valid_minimal_data(self):
        """Should accept minimal valid data."""
        data = {
            "name": "Tomato",
            "storage_location": "fridge",
        }
        schema = IngredientCreate(**data)

        assert schema.name == "Tomato"
        assert schema.storage_location == "fridge"

    @pytest.mark.unit
    def test_valid_complete_data(self):
        """Should accept all fields."""
        data = {
            "name": "Tomato",
            "storage_location": "fridge",
            "quantity": 500,
            "unit": "g",
            "expiry_date": date.today(),
        }
        schema = IngredientCreate(**data)

        assert schema.quantity == 500
        assert schema.unit == "g"

    @pytest.mark.unit
    def test_missing_required_name(self):
        """Should reject missing required name field."""
        data = {
            "storage_location": "fridge",
        }

        with pytest.raises(ValidationError) as exc_info:
            IngredientCreate(**data)

        assert "name" in str(exc_info.value)

    @pytest.mark.unit
    def test_missing_required_storage_location(self):
        """Should reject missing required storage_location field."""
        data = {
            "name": "Tomato",
        }

        with pytest.raises(ValidationError) as exc_info:
            IngredientCreate(**data)

        assert "storage_location" in str(exc_info.value)

    @pytest.mark.unit
    def test_invalid_storage_location(self):
        """Should reject invalid storage location enum value."""
        data = {
            "name": "Tomato",
            "storage_location": "invalid",
        }

        with pytest.raises(ValidationError):
            IngredientCreate(**data)

    @pytest.mark.unit
    def test_negative_quantity(self):
        """Should reject negative quantity."""
        data = {
            "name": "Tomato",
            "storage_location": "fridge",
            "quantity": -10,
        }

        with pytest.raises(ValidationError):
            IngredientCreate(**data)


class TestIngredientUpdate:
    """Test IngredientUpdate schema validation."""

    @pytest.mark.unit
    def test_all_fields_optional(self):
        """Should allow empty update (all fields optional)."""
        schema = IngredientUpdate()

        assert schema.name is None
        assert schema.storage_location is None

    @pytest.mark.unit
    def test_partial_update(self):
        """Should allow updating only some fields."""
        data = {"name": "New Name"}
        schema = IngredientUpdate(**data)

        assert schema.name == "New Name"
        assert schema.storage_location is None

    @pytest.mark.unit
    def test_invalid_storage_location(self):
        """Should reject invalid storage location."""
        data = {"storage_location": "invalid"}

        with pytest.raises(ValidationError):
            IngredientUpdate(**data)


class TestIngredientRead:
    """Test IngredientRead schema."""

    @pytest.mark.unit
    def test_valid_read_schema(self):
        """Should accept valid read data."""
        data = {
            "id": 1,
            "name": "Tomato",
            "storage_location": "fridge",
            "quantity": 500,
            "unit": "g",
            "expiry_date": date.today(),
            "created_at": date.today(),
            "updated_at": date.today(),
            "is_deleted": False,
        }
        schema = IngredientRead(**data)

        assert schema.id == 1
        assert schema.name == "Tomato"
