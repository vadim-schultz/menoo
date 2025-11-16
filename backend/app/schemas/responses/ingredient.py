"""Ingredient response schemas - REST API response wrappers around core Ingredient model."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.core.ingredient import Ingredient


class IngredientResponse(Ingredient):
    """Response for a single ingredient.

    Extends the core Ingredient model with REST-specific fields (ID, timestamps, etc.).
    The core Ingredient fields remain unchanged - this just adds API metadata.
    """

    model_config = ConfigDict(from_attributes=True)

    # REST-specific fields (not part of core Ingredient model)
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


class IngredientListResponse(BaseModel):
    """Paginated list of ingredients."""

    items: list[IngredientResponse]
    total: int
    page: int
    page_size: int
    has_next: bool
