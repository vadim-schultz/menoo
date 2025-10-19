"""Ingredient service for business logic."""
from __future__ import annotations

from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Ingredient
from app.repositories import IngredientRepository
from app.schemas import IngredientCreate, IngredientUpdate


class IngredientService:
    """Service for ingredient business logic."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.repository = IngredientRepository(session)

    async def create_ingredient(self, data: IngredientCreate) -> Ingredient:
        """Create a new ingredient after validation."""
        # Check if ingredient with same name already exists
        existing = await self.repository.get_by_name(data.name)
        if existing:
            raise ValueError(f"Ingredient with name '{data.name}' already exists")

        ingredient = Ingredient(
            name=data.name,
            storage_location=data.storage_location,
            quantity=data.quantity,
            unit=data.unit,
            expiry_date=data.expiry_date,
        )

        return await self.repository.create(ingredient)

    async def get_ingredient(self, ingredient_id: int) -> Ingredient:
        """Get ingredient by ID."""
        ingredient = await self.repository.get_by_id(ingredient_id)
        if not ingredient:
            raise ValueError(f"Ingredient with ID {ingredient_id} not found")
        return ingredient

    async def list_ingredients(
        self,
        storage_location: str | None = None,
        expiring_before: date | None = None,
        name_contains: str | None = None,
        page: int = 1,
        page_size: int = 100,
    ) -> tuple[list[Ingredient], int]:
        """List ingredients with filters and pagination."""
        if page < 1:
            raise ValueError("Page must be >= 1")
        if page_size < 1 or page_size > 1000:
            raise ValueError("Page size must be between 1 and 1000")

        skip = (page - 1) * page_size
        ingredients, total = await self.repository.list(
            storage_location=storage_location,
            expiring_before=expiring_before,
            name_contains=name_contains,
            skip=skip,
            limit=page_size,
        )

        return list(ingredients), total

    async def update_ingredient(
        self, ingredient_id: int, data: IngredientUpdate
    ) -> Ingredient:
        """Update an ingredient."""
        ingredient = await self.get_ingredient(ingredient_id)

        # Check name uniqueness if updating name
        if data.name and data.name != ingredient.name:
            existing = await self.repository.get_by_name(data.name)
            if existing:
                raise ValueError(f"Ingredient with name '{data.name}' already exists")

        # Update fields
        if data.name is not None:
            ingredient.name = data.name
        if data.storage_location is not None:
            ingredient.storage_location = data.storage_location
        if data.quantity is not None:
            ingredient.quantity = data.quantity
        if data.unit is not None:
            ingredient.unit = data.unit
        if data.expiry_date is not None:
            ingredient.expiry_date = data.expiry_date

        return await self.repository.update(ingredient)

    async def delete_ingredient(self, ingredient_id: int) -> None:
        """Soft delete an ingredient."""
        ingredient = await self.get_ingredient(ingredient_id)
        await self.repository.soft_delete(ingredient)

    async def get_ingredients_by_ids(self, ingredient_ids: list[int]) -> list[Ingredient]:
        """Get multiple ingredients by their IDs."""
        ingredients = await self.repository.get_by_ids(ingredient_ids)
        return list(ingredients)
