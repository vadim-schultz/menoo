"""Recipe model."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import JSON, Float, Index, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, IDMixin, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.recipe_ingredient import RecipeIngredient


class Recipe(Base, IDMixin, TimestampMixin, SoftDeleteMixin):
    """Recipe model."""

    __tablename__ = "recipes"

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    source: Mapped[str | None] = mapped_column(String(200), nullable=True)

    cuisine_types: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    meal_types: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    cooking_method: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)

    dietary_requirements: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    contains_allergens: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    allergen_warnings: Mapped[str | None] = mapped_column(Text, nullable=True)

    timing: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    prep_time_minutes: Mapped[int | None] = mapped_column(nullable=True)
    cook_time_minutes: Mapped[int | None] = mapped_column(nullable=True)
    marinating_time_minutes: Mapped[int | None] = mapped_column(nullable=True)
    resting_time_minutes: Mapped[int | None] = mapped_column(nullable=True)
    inactive_time_minutes: Mapped[int | None] = mapped_column(nullable=True)
    total_active_time_minutes: Mapped[int | None] = mapped_column(nullable=True)

    difficulty_metrics: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    servings: Mapped[int] = mapped_column(default=1, nullable=False)
    yield_description: Mapped[str | None] = mapped_column(String(100), nullable=True)

    equipment_requirements: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    oven_temperature_celsius: Mapped[float | None] = mapped_column(Float, nullable=True)
    oven_settings: Mapped[str | None] = mapped_column(String(100), nullable=True)

    nutrition_info: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    storage_instructions: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    variations: Mapped[str | None] = mapped_column(Text, nullable=True)
    estimated_cost_per_serving: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    seasonality: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    # Relationships
    ingredient_associations: Mapped[list[RecipeIngredient]] = relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @property
    def ingredients(self) -> list[dict]:
        """Return full ingredient preparation specs for serialization."""
        if not self.ingredient_associations:
            return []
        normalized: list[dict] = []
        for assoc in self.ingredient_associations:
            details = dict(assoc.preparation_details or {})
            details.setdefault("ingredient_id", assoc.ingredient_id)
            details.setdefault("quantity", float(assoc.quantity))
            details.setdefault("unit", assoc.unit)
            details.setdefault("is_optional", assoc.is_optional)
            details.setdefault("order_in_recipe", assoc.order_in_recipe)
            normalized.append(details)
        return normalized

    @property
    def total_time_minutes(self) -> int | None:
        """Calculate total time including inactive periods."""
        if self.total_active_time_minutes is not None:
            inactive = self.inactive_time_minutes or 0
            return self.total_active_time_minutes + inactive
        return None

    def __repr__(self) -> str:
        """String representation."""
        return f"<Recipe(id={self.id}, name={self.name})>"


# Indexes for common queries
Index("idx_recipe_method_deleted", Recipe.cooking_method, Recipe.is_deleted)
Index("idx_recipe_author_deleted", Recipe.author, Recipe.is_deleted)
