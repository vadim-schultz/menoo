"""Core Ingredient model - fundamental ingredient schema."""

from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, field_serializer

from app.enums import IngredientCategory


class Ingredient(BaseModel):
    """Definitive Ingredient model.

    This single model is used for both partial (draft) and complete (populated) ingredients.
    All fields are optional or have defaults to allow partial population.
    """

    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    category: IngredientCategory = Field(..., description="Ingredient category")
    storage_location: str | None = Field(None, description="Storage location")
    quantity: Decimal | None = Field(None, ge=0, description="Current quantity in stock (grams)")
    expiry_date: date | None = Field(None, description="Expiration date")
    notes: str | None = Field(None, description="Additional notes about ingredient")

    @field_serializer("quantity", when_used="json")
    def serialize_quantity(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None
