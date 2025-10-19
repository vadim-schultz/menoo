"""Pydantic schemas for ingredients."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class IngredientBase(BaseModel):
    """Base ingredient schema."""

    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    storage_location: Literal["fridge", "cupboard", "pantry"] = Field(
        ..., description="Storage location"
    )
    quantity: Decimal | None = Field(None, gt=0, description="Quantity amount")
    unit: str | None = Field(None, max_length=20, description="Unit of measurement")
    expiry_date: date | None = Field(None, description="Expiration date")


class IngredientCreate(IngredientBase):
    """Schema for creating an ingredient."""

    pass


class IngredientUpdate(BaseModel):
    """Schema for updating an ingredient."""

    name: str | None = Field(None, min_length=1, max_length=100)
    storage_location: Literal["fridge", "cupboard", "pantry"] | None = None
    quantity: Decimal | None = Field(None, gt=0)
    unit: str | None = Field(None, max_length=20)
    expiry_date: date | None = None


class IngredientRead(IngredientBase):
    """Schema for reading an ingredient."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


class IngredientDetail(IngredientRead):
    """Detailed ingredient schema with related recipes."""

    recipe_count: int = Field(default=0, description="Number of recipes using this ingredient")


class IngredientListResponse(BaseModel):
    """Paginated list of ingredients."""

    items: list[IngredientRead]
    total: int
    page: int
    page_size: int
    has_next: bool
