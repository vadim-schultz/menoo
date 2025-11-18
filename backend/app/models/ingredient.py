"""Ingredient model."""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, Index, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.enums import IngredientCategory
from app.models.base import Base, IDMixin, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.recipe_ingredient import RecipeIngredient


class Ingredient(Base, IDMixin, TimestampMixin, SoftDeleteMixin):
    """Ingredient model."""

    __tablename__ = "ingredients"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[IngredientCategory] = mapped_column(String(30), nullable=False, index=True)
    storage_location: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    quantity: Mapped[float | None] = mapped_column(Numeric(12, 3), nullable=True)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    recipe_associations: Mapped[list[RecipeIngredient]] = relationship(
        "RecipeIngredient",
        back_populates="ingredient",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<Ingredient(id={self.id}, name={self.name}, category={self.category}, "
            f"location={self.storage_location})>"
        )


# Create composite index for common queries
Index(
    "idx_ingredient_category_location_deleted",
    Ingredient.category,
    Ingredient.storage_location,
    Ingredient.is_deleted,
)
