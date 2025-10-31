"""Ingredient repository for data access."""

from __future__ import annotations

from collections.abc import Sequence
from datetime import date

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Ingredient
from app.models.ingredient import StorageLocation


class IngredientRepository:
    """Repository for ingredient data access."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with database session."""
        self.session = session

    async def create(self, ingredient: Ingredient) -> Ingredient:
        """Create a new ingredient."""
        self.session.add(ingredient)
        await self.session.flush()
        await self.session.refresh(ingredient)
        return ingredient

    async def get_by_id(self, ingredient_id: int) -> Ingredient | None:
        """Get ingredient by ID."""
        result = await self.session.execute(
            select(Ingredient).where(
                and_(Ingredient.id == ingredient_id, Ingredient.is_deleted.is_(False))
            )
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Ingredient | None:
        """Get ingredient by name."""
        result = await self.session.execute(
            select(Ingredient).where(
                and_(
                    func.lower(Ingredient.name) == name.lower(),
                    Ingredient.is_deleted.is_(False),
                )
            )
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        storage_location: StorageLocation | None = None,
        expiring_before: date | None = None,
        name_contains: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[Sequence[Ingredient], int]:
        """List ingredients with optional filters and pagination."""
        # Build query conditions
        conditions = [Ingredient.is_deleted.is_(False)]

        if storage_location:
            conditions.append(Ingredient.storage_location == storage_location)

        if expiring_before:
            conditions.append(Ingredient.expiry_date <= expiring_before)

        if name_contains:
            conditions.append(Ingredient.name.ilike(f"%{name_contains}%"))

        # Count total
        count_query = select(func.count()).select_from(Ingredient).where(and_(*conditions))
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        # Get paginated results
        query = (
            select(Ingredient)
            .where(and_(*conditions))
            .order_by(Ingredient.name)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        ingredients = result.scalars().all()

        return ingredients, total

    async def update(self, ingredient: Ingredient) -> Ingredient:
        """Update an ingredient."""
        await self.session.flush()
        await self.session.refresh(ingredient)
        return ingredient

    async def soft_delete(self, ingredient: Ingredient) -> None:
        """Soft delete an ingredient."""
        ingredient.is_deleted = True
        await self.session.flush()

    async def get_by_ids(self, ingredient_ids: list[int]) -> Sequence[Ingredient]:
        """Get multiple ingredients by IDs."""
        result = await self.session.execute(
            select(Ingredient).where(
                and_(
                    Ingredient.id.in_(ingredient_ids),
                    Ingredient.is_deleted.is_(False),
                )
            )
        )
        return result.scalars().all()
