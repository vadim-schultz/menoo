"""Pydantic schemas for AI suggestions."""
from __future__ import annotations

from pydantic import BaseModel, Field


class SuggestionRequest(BaseModel):
    """Request for recipe suggestions."""

    available_ingredients: list[int] = Field(
        ..., description="List of available ingredient IDs"
    )
    max_prep_time: int | None = Field(None, gt=0, description="Maximum prep time in minutes")
    max_cook_time: int | None = Field(None, gt=0, description="Maximum cook time in minutes")
    difficulty: str | None = Field(None, description="Preferred difficulty level")
    dietary_restrictions: list[str] = Field(
        default_factory=list, description="Dietary restrictions or preferences"
    )
    max_results: int = Field(default=5, gt=0, le=20, description="Maximum number of suggestions")


class RecipeSuggestion(BaseModel):
    """Individual recipe suggestion."""

    recipe_id: int
    recipe_name: str
    match_score: float = Field(..., ge=0, le=1, description="How well ingredients match (0-1)")
    missing_ingredients: list[str] = Field(default_factory=list)
    matched_ingredients: list[str] = Field(default_factory=list)
    reason: str | None = Field(None, description="AI-generated reason for suggestion")


class SuggestionResponse(BaseModel):
    """Response with recipe suggestions."""

    suggestions: list[RecipeSuggestion]
    source: str = Field(..., description="Source of suggestions: 'ai' or 'heuristic'")
    cache_hit: bool = Field(default=False, description="Whether result came from cache")


class ShoppingListRequest(BaseModel):
    """Request for shopping list generation."""

    recipe_ids: list[int] = Field(..., description="Recipe IDs to generate shopping list for")


class ShoppingListItem(BaseModel):
    """Individual shopping list item."""

    ingredient_name: str
    total_quantity: float
    unit: str
    storage_location: str
    recipes: list[str] = Field(default_factory=list, description="Recipes requiring this item")


class ShoppingListResponse(BaseModel):
    """Shopping list grouped by storage location."""

    items_by_location: dict[str, list[ShoppingListItem]]
    total_items: int
