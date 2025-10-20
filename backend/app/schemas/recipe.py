"""Pydantic schemas for recipes."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_serializer


class RecipeIngredientBase(BaseModel):
    """Base recipe ingredient schema."""

    ingredient_id: int = Field(..., description="Ingredient ID")
    quantity: Decimal = Field(..., gt=0, description="Quantity required")
    unit: str = Field(..., max_length=20, description="Unit of measurement")
    is_optional: bool = Field(default=False, description="Whether ingredient is optional")
    note: str | None = Field(None, max_length=200, description="Additional notes")


class RecipeIngredientCreate(RecipeIngredientBase):
    """Schema for creating a recipe ingredient association."""

    pass


class RecipeIngredientRead(RecipeIngredientBase):
    """Schema for reading a recipe ingredient."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    ingredient_name: str = Field(..., description="Name of the ingredient")

    @field_serializer("quantity", when_used="json")
    def serialize_quantity(self, value: Decimal) -> float:
        return float(value)


class RecipeBase(BaseModel):
    """Base recipe schema."""

    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    description: str | None = Field(None, description="Recipe description")
    instructions: str = Field(..., min_length=1, description="Cooking instructions")
    prep_time: int | None = Field(None, gt=0, description="Preparation time in minutes")
    cook_time: int | None = Field(None, gt=0, description="Cooking time in minutes")
    servings: int = Field(default=1, gt=0, description="Number of servings")
    difficulty: Literal["easy", "medium", "hard"] | None = Field(
        None, description="Difficulty level"
    )


class RecipeCreate(RecipeBase):
    """Schema for creating a recipe."""

    ingredients: list[RecipeIngredientCreate] = Field(
        default_factory=list, description="List of ingredients"
    )


class RecipeUpdate(BaseModel):
    """Schema for updating a recipe."""

    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    instructions: str | None = Field(None, min_length=1)
    prep_time: int | None = Field(None, gt=0)
    cook_time: int | None = Field(None, gt=0)
    servings: int | None = Field(None, gt=0)
    difficulty: Literal["easy", "medium", "hard"] | None = None
    ingredients: list[RecipeIngredientCreate] | None = None


class RecipeRead(RecipeBase):
    """Schema for reading a recipe."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    @property
    def total_time(self) -> int | None:
        """Calculate total time."""
        if self.prep_time is not None and self.cook_time is not None:
            return self.prep_time + self.cook_time
        elif self.prep_time is not None:
            return self.prep_time
        elif self.cook_time is not None:
            return self.cook_time
        return None


class RecipeDetail(RecipeRead):
    """Detailed recipe schema with ingredients."""

    ingredients: list[RecipeIngredientRead] = Field(default_factory=list)
    missing_ingredients: list[str] = Field(
        default_factory=list, description="List of missing ingredient names"
    )


class RecipeListResponse(BaseModel):
    """Paginated list of recipes."""

    items: list[RecipeRead]
    total: int
    page: int
    page_size: int
    has_next: bool
