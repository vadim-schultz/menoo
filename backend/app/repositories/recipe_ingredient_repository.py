"""Recipe-Ingredient repository for junction table operations."""
from __future__ import annotations

from typing import Sequence

from sqlalchemy import and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import RecipeIngredient


class RecipeIngredientRepository:
    """Repository for recipe-ingredient associations."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with database session."""
        self.session = session

    async def create(self, recipe_ingredient: RecipeIngredient) -> RecipeIngredient:
        """Create a new recipe-ingredient association."""
        self.session.add(recipe_ingredient)
        await self.session.flush()
        await self.session.refresh(recipe_ingredient)
        return recipe_ingredient

    async def get_by_id(self, association_id: int) -> RecipeIngredient | None:
        """Get association by ID."""
        result = await self.session.execute(
            select(RecipeIngredient).where(RecipeIngredient.id == association_id)
        )
        return result.scalar_one_or_none()

    async def get_by_recipe_and_ingredient(
        self, recipe_id: int, ingredient_id: int
    ) -> RecipeIngredient | None:
        """Get association by recipe and ingredient IDs."""
        result = await self.session.execute(
            select(RecipeIngredient).where(
                and_(
                    RecipeIngredient.recipe_id == recipe_id,
                    RecipeIngredient.ingredient_id == ingredient_id,
                )
            )
        )
        return result.scalar_one_or_none()

    async def list_by_recipe(self, recipe_id: int) -> Sequence[RecipeIngredient]:
        """Get all ingredients for a recipe."""
        result = await self.session.execute(
            select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
        )
        return result.scalars().all()

    async def list_by_ingredient(self, ingredient_id: int) -> Sequence[RecipeIngredient]:
        """Get all recipes using an ingredient."""
        result = await self.session.execute(
            select(RecipeIngredient).where(RecipeIngredient.ingredient_id == ingredient_id)
        )
        return result.scalars().all()

    async def update(self, association: RecipeIngredient) -> RecipeIngredient:
        """Update an association."""
        await self.session.flush()
        await self.session.refresh(association)
        return association

    async def delete(self, association: RecipeIngredient) -> None:
        """Delete an association."""
        await self.session.delete(association)
        await self.session.flush()

    async def delete_by_recipe(self, recipe_id: int) -> None:
        """Delete all associations for a recipe."""
        await self.session.execute(
            delete(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe_id)
        )
        await self.session.flush()

    async def upsert_recipe_ingredients(
        self, recipe_id: int, ingredient_data: list[dict]
    ) -> list[RecipeIngredient]:
        """
        Upsert recipe ingredients.
        
        Removes existing associations and creates new ones based on provided data.
        """
        # Delete existing associations
        await self.delete_by_recipe(recipe_id)

        # Create new associations
        associations = []
        for data in ingredient_data:
            association = RecipeIngredient(recipe_id=recipe_id, **data)
            self.session.add(association)
            associations.append(association)

        await self.session.flush()

        # Refresh all associations
        for association in associations:
            await self.session.refresh(association)

        return associations
