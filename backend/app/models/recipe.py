"""Recipe model."""

from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, IDMixin, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.recipe_ingredient import RecipeIngredient


class DifficultyLevel(str, Enum):
    """Recipe difficulty levels."""

    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Recipe(Base, IDMixin, TimestampMixin, SoftDeleteMixin):
    """Recipe model."""

    __tablename__ = "recipes"

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)
    prep_time: Mapped[int | None] = mapped_column(nullable=True)  # minutes
    cook_time: Mapped[int | None] = mapped_column(nullable=True)  # minutes
    servings: Mapped[int] = mapped_column(default=1, nullable=False)
    difficulty: Mapped[str | None] = mapped_column(String(20), nullable=True, index=True)

    # Relationships
    ingredient_associations: Mapped[list[RecipeIngredient]] = relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
    )

    @property
    def total_time(self) -> int | None:
        """Calculate total time (prep + cook)."""
        if self.prep_time is not None and self.cook_time is not None:
            return self.prep_time + self.cook_time
        elif self.prep_time is not None:
            return self.prep_time
        elif self.cook_time is not None:
            return self.cook_time
        return None

    def __repr__(self) -> str:
        """String representation."""
        return f"<Recipe(id={self.id}, name={self.name}, difficulty={self.difficulty})>"


# Indexes for common queries
Index("idx_recipe_difficulty_deleted", Recipe.difficulty, Recipe.is_deleted)
