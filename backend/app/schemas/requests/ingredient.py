"""Ingredient request schemas - REST API request wrappers around core Ingredient model."""

from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field

from app.enums import IngredientCategory
from app.schemas.core.ingredient import Ingredient


class IngredientCreateRequest(BaseModel):
    """Request to create an ingredient.

    Wraps the core Ingredient model. The ingredient field contains the ingredient data.
    REST-specific fields (if any) would go here, not in the Ingredient model.
    """

    ingredient: Ingredient = Field(..., description="Ingredient data to create")


class IngredientUpdateRequest(BaseModel):
    """Request to update an ingredient.

    Wraps the core Ingredient model. The ingredient field contains partial ingredient data.
    REST-specific fields (if any) would go here, not in the Ingredient model.
    """

    ingredient: Ingredient = Field(..., description="Partial ingredient data for update")


class IngredientPatch(BaseModel):
    """Schema for partial updates (all fields optional).

    Used for PATCH operations where any field can be updated independently.
    """

    name: str | None = Field(None, min_length=1, max_length=100)
    category: IngredientCategory | None = None
    storage_location: str | None = None
    quantity: Decimal | None = Field(None, ge=0, description="Current quantity in stock")
    unit: str | None = None
    expiry_date: date | None = None
    notes: str | None = None


class IngredientListRequest(BaseModel):
    """Request to list ingredients with optional filters and pagination."""

    category: IngredientCategory | None = Field(
        default=None, description="Filter by ingredient category"
    )
    storage_location: str | None = Field(default=None, description="Filter by storage location")
    expiring_before: date | None = Field(
        default=None, description="Filter by expiry date (before this date)"
    )
    name_contains: str | None = Field(default=None, description="Search by name (partial match)")
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=100, ge=1, le=1000, description="Number of items per page")
