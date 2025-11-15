"""Recipe request schemas - REST API request wrappers around core Recipe model."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.enums import CuisineType
from app.schemas.core.recipe import Recipe


class RecipeCreateRequest(BaseModel):
    """Request to create a recipe.
    
    Wraps the core Recipe model. The recipe field contains the recipe data.
    REST-specific fields (if any) would go here, not in the Recipe model.
    """

    recipe: Recipe = Field(..., description="Recipe data to create")


class RecipeUpdateRequest(BaseModel):
    """Request to update a recipe.
    
    Wraps the core Recipe model. The recipe field contains partial recipe data.
    REST-specific fields (if any) would go here, not in the Recipe model.
    """

    recipe: Recipe = Field(..., description="Partial recipe data for update")


class RecipeListRequest(BaseModel):
    """Request to list recipes with optional filters and pagination."""

    cuisine: CuisineType | None = Field(
        default=None, description="Filter by cuisine type"
    )
    max_prep_time_minutes: int | None = Field(
        default=None, ge=0, description="Maximum prep time in minutes"
    )
    max_cook_time_minutes: int | None = Field(
        default=None, ge=0, description="Maximum cook time in minutes"
    )
    name_contains: str | None = Field(
        default=None, description="Search by name (partial match)"
    )
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(
        default=100, ge=1, le=1000, description="Number of items per page"
    )

