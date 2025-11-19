"""Core Ingredient model - fundamental ingredient schema."""

from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, field_serializer

from app.enums import IngredientCategory


class Ingredient(BaseModel):
    """Definitive Ingredient model.

    This single model is used for both partial (draft) and complete (populated) ingredients.
    Only name and quantity are required; other fields are optional and can be populated by Marvin.
    """

    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    quantity: Decimal = Field(..., ge=0, description="Current quantity in stock (grams)")
    category: IngredientCategory | None = Field(None, description="Ingredient category")
    storage_location: str | None = Field(None, description="Storage location")
    expiry_date: date | None = Field(None, description="Expiration date")
    notes: str | None = Field(None, description="Additional notes about ingredient")

    @field_serializer("quantity", when_used="json")
    def serialize_quantity(self, value: Decimal) -> float:
        return float(value)
