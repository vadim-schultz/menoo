"""Recipe repository for data access."""
from __future__ import annotations

from typing import Sequence

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Recipe, RecipeIngredient


class RecipeRepository:
    """Repository for recipe data access."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with database session."""
        self.session = session

    async def create(self, recipe: Recipe) -> Recipe:
        """Create a new recipe."""
        self.session.add(recipe)
        await self.session.flush()
        await self.session.refresh(recipe)
        return recipe

    async def get_by_id(self, recipe_id: int, load_ingredients: bool = False) -> Recipe | None:
        """Get recipe by ID, optionally loading ingredients."""
        query = select(Recipe).where(
            and_(Recipe.id == recipe_id, Recipe.is_deleted == False)
        )

        if load_ingredients:
            query = query.options(
                selectinload(Recipe.ingredient_associations).selectinload(
                    RecipeIngredient.ingredient
                )
            )

        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        difficulty: str | None = None,
        max_prep_time: int | None = None,
        max_cook_time: int | None = None,
        name_contains: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[Sequence[Recipe], int]:
        """List recipes with optional filters and pagination."""
        # Build query conditions
        conditions = [Recipe.is_deleted == False]

        if difficulty:
            conditions.append(Recipe.difficulty == difficulty)

        if max_prep_time is not None:
            conditions.append(Recipe.prep_time <= max_prep_time)

        if max_cook_time is not None:
            conditions.append(Recipe.cook_time <= max_cook_time)

        if name_contains:
            conditions.append(Recipe.name.ilike(f"%{name_contains}%"))

        # Count total
        count_query = select(func.count()).select_from(Recipe).where(and_(*conditions))
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        # Get paginated results
        query = (
            select(Recipe)
            .where(and_(*conditions))
            .order_by(Recipe.name)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        recipes = result.scalars().all()

        return recipes, total

    async def update(self, recipe: Recipe) -> Recipe:
        """Update a recipe."""
        await self.session.flush()
        await self.session.refresh(recipe)
        return recipe

    async def soft_delete(self, recipe: Recipe) -> None:
        """Soft delete a recipe."""
        recipe.is_deleted = True
        await self.session.flush()

    async def hard_delete(self, recipe: Recipe) -> None:
        """Permanently delete a recipe."""
        await self.session.delete(recipe)
        await self.session.flush()

    async def get_recipes_with_ingredients(
        self, ingredient_ids: list[int], min_match_count: int = 1
    ) -> Sequence[Recipe]:
        """Get recipes that contain at least min_match_count of the given ingredients."""
        # This query finds recipes that have at least min_match_count matching ingredients
        query = (
            select(Recipe)
            .join(RecipeIngredient)
            .where(
                and_(
                    Recipe.is_deleted == False,
                    RecipeIngredient.ingredient_id.in_(ingredient_ids),
                )
            )
            .group_by(Recipe.id)
            .having(func.count(RecipeIngredient.ingredient_id) >= min_match_count)
            .options(
                selectinload(Recipe.ingredient_associations).selectinload(
                    RecipeIngredient.ingredient
                )
            )
        )

        result = await self.session.execute(query)
        return result.unique().scalars().all()
