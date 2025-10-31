"""Pydantic schemas for ingredients."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.models.ingredient import StorageLocation


class IngredientBase(BaseModel):
    """Base ingredient schema with common fields."""

    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    storage_location: StorageLocation | None = Field(
        None, description="Storage location"
    )
    quantity: Decimal = Field(default=Decimal("0"), ge=0, description="Quantity in grams")
    expiry_date: date | None = Field(None, description="Expiration date")


class IngredientWrite(IngredientBase):
    """Schema for creating or updating an ingredient (upsert)."""

    pass


# Backward compatibility aliases
IngredientCreate = IngredientWrite
IngredientUpdate = IngredientWrite


class IngredientPatch(BaseModel):
    """Schema for partial updates (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=100)
    storage_location: StorageLocation | None = None
    quantity: Decimal | None = Field(None, ge=0, description="Quantity in grams")
    expiry_date: date | None = None


class IngredientFilter(BaseModel):
    """Schema for filtering ingredients in list queries."""

    storage_location: StorageLocation | None = None
    expiring_before: date | None = None
    name_contains: str | None = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=100, ge=1, le=1000)


class IngredientRead(IngredientBase):
    """Schema for reading an ingredient with system fields."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


class IngredientListResponse(BaseModel):
    """Paginated list of ingredients."""

    items: list[IngredientRead]
    total: int
    page: int
    page_size: int
    has_next: bool
