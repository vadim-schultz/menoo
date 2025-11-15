"""Recipe request schemas - REST API request wrappers around core Recipe model."""

from __future__ import annotations

from pydantic import BaseModel, Field

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

