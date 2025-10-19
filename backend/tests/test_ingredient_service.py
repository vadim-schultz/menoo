"""Test ingredient service."""
import pytest
from datetime import date
from decimal import Decimal

from app.models import Ingredient
from app.schemas import IngredientCreate, IngredientUpdate
from app.services import IngredientService


@pytest.mark.unit
async def test_create_ingredient(db_session):
    """Test creating an ingredient."""
    service = IngredientService(db_session)

    data = IngredientCreate(
        name="Tomato",
        storage_location="fridge",
        quantity=Decimal("5"),
        unit="pieces",
        expiry_date=date(2025, 10, 30),
    )

    ingredient = await service.create_ingredient(data)

    assert ingredient.id is not None
    assert ingredient.name == "Tomato"
    assert ingredient.storage_location == "fridge"
    assert ingredient.quantity == Decimal("5")
    assert ingredient.unit == "pieces"


@pytest.mark.unit
async def test_create_duplicate_ingredient_fails(db_session):
    """Test that creating duplicate ingredient fails."""
    service = IngredientService(db_session)

    data = IngredientCreate(
        name="Tomato",
        storage_location="fridge",
    )

    await service.create_ingredient(data)

    with pytest.raises(ValueError, match="already exists"):
        await service.create_ingredient(data)


@pytest.mark.unit
async def test_get_ingredient(db_session):
    """Test getting an ingredient."""
    service = IngredientService(db_session)

    data = IngredientCreate(name="Onion", storage_location="pantry")
    created = await service.create_ingredient(data)

    fetched = await service.get_ingredient(created.id)

    assert fetched.id == created.id
    assert fetched.name == "Onion"


@pytest.mark.unit
async def test_list_ingredients(db_session):
    """Test listing ingredients."""
    service = IngredientService(db_session)

    # Create test ingredients
    await service.create_ingredient(IngredientCreate(name="Apple", storage_location="fridge"))
    await service.create_ingredient(IngredientCreate(name="Banana", storage_location="pantry"))
    await service.create_ingredient(IngredientCreate(name="Carrot", storage_location="fridge"))

    # List all
    ingredients, total = await service.list_ingredients()
    assert total == 3
    assert len(ingredients) == 3

    # Filter by location
    fridge_items, fridge_total = await service.list_ingredients(storage_location="fridge")
    assert fridge_total == 2
    assert all(ing.storage_location == "fridge" for ing in fridge_items)


@pytest.mark.unit
async def test_update_ingredient(db_session):
    """Test updating an ingredient."""
    service = IngredientService(db_session)

    data = IngredientCreate(name="Milk", storage_location="fridge", quantity=Decimal("1"), unit="l")
    created = await service.create_ingredient(data)

    update_data = IngredientUpdate(quantity=Decimal("2"))
    updated = await service.update_ingredient(created.id, update_data)

    assert updated.quantity == Decimal("2")
    assert updated.name == "Milk"  # Unchanged


@pytest.mark.unit
async def test_delete_ingredient(db_session):
    """Test soft deleting an ingredient."""
    service = IngredientService(db_session)

    data = IngredientCreate(name="Cheese", storage_location="fridge")
    created = await service.create_ingredient(data)

    await service.delete_ingredient(created.id)

    # Should not be found after deletion
    with pytest.raises(ValueError, match="not found"):
        await service.get_ingredient(created.id)
