"""Ingredient service for business logic."""

from __future__ import annotations

from decimal import Decimal

from app.models import Ingredient
from app.repositories import IngredientRepository
from app.schemas import IngredientCreate, IngredientFilter, IngredientPatch
from app.schemas.core.ingredient import Ingredient as IngredientSchema


class IngredientService:
    """Service for ingredient business logic."""

    def __init__(self, repository: IngredientRepository) -> None:
        """Initialize service with ingredient repository."""
        self.repository = repository

    async def create_ingredient(self, data: IngredientCreate) -> Ingredient:
        """Create a new ingredient or add quantity to existing one."""
        # Check if ingredient with same name already exists
        existing = await self.repository.get_by_name(data.name)
        if existing:
            # Convert SQLAlchemy model to Pydantic model
            existing_schema = IngredientSchema.model_validate(existing)
            
            # Merge with new data using model_copy
            merged = existing_schema.model_copy(
                update=data.model_dump(exclude_unset=True)
            )
            
            # Handle quantity addition
            existing_quantity = existing_schema.quantity or Decimal("0")
            new_quantity = data.quantity or Decimal("0")
            merged.quantity = existing_quantity + new_quantity
            
            # Apply merged data back to SQLAlchemy model
            for key, value in merged.model_dump(exclude_unset=True).items():
                setattr(existing, key, value)

            return await self.repository.update(existing)

        # Create ingredient from Pydantic model
        ingredient = Ingredient(**data.model_dump())
        return await self.repository.create(ingredient)

    async def get_ingredient(self, ingredient_id: int) -> Ingredient:
        """Get ingredient by ID."""
        ingredient = await self.repository.get_by_id(ingredient_id)
        if not ingredient:
            raise ValueError(f"Ingredient with ID {ingredient_id} not found")
        return ingredient

    async def list_ingredients(
        self,
        filters: IngredientFilter | None = None,
    ) -> list[Ingredient]:
        """List ingredients with filters and pagination."""
        if filters is None:
            filters = IngredientFilter()
        
        skip = (filters.page - 1) * filters.page_size
        
        # Get filter data and convert pagination params
        filter_data = filters.model_dump(exclude={"page", "page_size"})
        
        ingredients, _ = await self.repository.list(
            **filter_data,
            skip=skip,
            limit=filters.page_size,
        )

        return list(ingredients)

    async def update_ingredient(self, ingredient_id: int, data: IngredientPatch) -> Ingredient:
        """Update an ingredient with partial data."""
        ingredient = await self.get_ingredient(ingredient_id)

        # Update fields with provided data
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(ingredient, field, value)

        return await self.repository.update(ingredient)

    async def delete_ingredient(self, ingredient_id: int) -> None:
        """Soft delete an ingredient."""
        ingredient = await self.get_ingredient(ingredient_id)
        await self.repository.soft_delete(ingredient)
