"""Recipe-Ingredient junction model."""
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, IDMixin

if TYPE_CHECKING:
    from app.models.ingredient import Ingredient
    from app.models.recipe import Recipe


class RecipeIngredient(Base, IDMixin):
    """Junction table linking recipes and ingredients with quantities."""

    __tablename__ = "recipe_ingredients"

    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    quantity: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    is_optional: Mapped[bool] = mapped_column(default=False, nullable=False)
    note: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Relationships
    recipe: Mapped["Recipe"] = relationship("Recipe", back_populates="ingredient_associations")
    ingredient: Mapped["Ingredient"] = relationship(
        "Ingredient", back_populates="recipe_associations"
    )

    __table_args__ = (
        UniqueConstraint("recipe_id", "ingredient_id", name="uq_recipe_ingredient"),
        Index("idx_recipe_ingredient_pair", "recipe_id", "ingredient_id"),
    )

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<RecipeIngredient(recipe_id={self.recipe_id}, "
            f"ingredient_id={self.ingredient_id}, "
            f"quantity={self.quantity} {self.unit})>"
        )
