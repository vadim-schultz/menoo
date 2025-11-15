"""Pydantic schemas for ingredients."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer

from app.enums import IngredientCategory


class IngredientBase(BaseModel):
    """Base ingredient schema with category information."""

    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    category: IngredientCategory = Field(..., description="Ingredient category")
    storage_location: str | None = Field(None, description="Storage location")
    quantity: Decimal | None = Field(None, ge=0, description="Current quantity in stock")
    unit: str | None = Field(None, description="Unit for current quantity")
    expiry_date: date | None = Field(None, description="Expiration date")
    notes: str | None = Field(None, description="Additional notes about ingredient")

    @field_serializer("quantity", when_used="json")
    def serialize_quantity(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None


class IngredientWrite(IngredientBase):
    """Schema for creating or updating an ingredient (upsert)."""

    pass


# Backward compatibility aliases
IngredientCreate = IngredientWrite
IngredientUpdate = IngredientWrite


class IngredientPatch(BaseModel):
    """Schema for partial updates (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=100)
    category: IngredientCategory | None = None
    storage_location: str | None = None
    quantity: Decimal | None = Field(None, ge=0, description="Current quantity in stock")
    unit: str | None = None
    expiry_date: date | None = None
    notes: str | None = None


class IngredientFilter(BaseModel):
    """Schema for filtering ingredients in list queries."""

    category: IngredientCategory | None = None
    storage_location: str | None = None
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
