"""Ingredient service for business logic."""

from __future__ import annotations

from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Ingredient
from app.repositories import IngredientRepository
from app.schemas import IngredientCreate, IngredientFilter, IngredientPatch


class IngredientService:
    """Service for ingredient business logic."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.repository = IngredientRepository(session)

    async def create_ingredient(self, data: IngredientCreate) -> Ingredient:
        """Create a new ingredient or add quantity to existing one."""
        # Check if ingredient with same name already exists
        existing = await self.repository.get_by_name(data.name)
        if existing:
            # Dump both to dicts and merge
            existing_dict = {
                "name": existing.name,
                "storage_location": existing.storage_location,
                "quantity": Decimal(str(existing.quantity)) if existing.quantity is not None else Decimal("0"),
                "expiry_date": existing.expiry_date,
            }
            new_dict = data.model_dump()
            
            # Extract quantities before merging
            existing_quantity = existing_dict.pop("quantity")
            new_quantity = new_dict.pop("quantity", Decimal("0"))
            
            # Merge: new data overrides existing fields
            merged = {**existing_dict, **new_dict}
            
            # Add quantities back (sum them)
            merged["quantity"] = existing_quantity + new_quantity
            
            # Update existing ingredient with merged data
            for key, value in merged.items():
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
