"""Recipe response schemas - REST API response wrappers around core Recipe model."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.core.recipe import IngredientPreparation, Recipe


class RecipeResponse(Recipe):
    """Response for a single recipe.
    
    Extends the core Recipe model with REST-specific fields (ID, timestamps, etc.).
    The core Recipe fields remain unchanged - this just adds API metadata.
    """

    model_config = ConfigDict(from_attributes=True)

    # REST-specific fields (not part of core Recipe model)
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


class RecipeIngredientRead(IngredientPreparation):
    """Schema for reading a recipe ingredient with ingredient metadata."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    ingredient_name: str = Field(..., description="Name of the ingredient")


class RecipeDetail(RecipeResponse):
    """Detailed recipe response with expanded ingredients.
    
    Extends RecipeResponse with ingredient details and missing ingredients list.
    """

    ingredients: list[RecipeIngredientRead] = Field(
        default_factory=list,
        description="Ingredients with preparation details and ingredient metadata",
    )
    missing_ingredients: list[str] = Field(
        default_factory=list, description="List of missing ingredient names"
    )


class RecipeListResponse(BaseModel):
    """Paginated list of recipes."""

    items: list[RecipeResponse]
    total: int
    page: int
    page_size: int
    has_next: bool

