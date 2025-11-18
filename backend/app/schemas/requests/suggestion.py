"""Suggestion request schemas - REST API request wrappers."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.core.ingredient import Ingredient
from app.schemas.core.recipe import Recipe


class SuggestionRequest(BaseModel):
    """Request for recipe suggestions.

    Contains the core Recipe model (partial) plus REST-specific fields
    for controlling the suggestion API (prompt, n_completions).
    """

    recipe: Recipe = Field(
        default_factory=Recipe,
        description="Partially completed recipe to be enhanced by the AI",
    )
    prompt: str | None = Field(
        None,
        description="Optional prompt to guide Marvin when completing the recipe",
    )
    n_completions: int = Field(
        default=1,
        ge=1,
        le=5,
        description="Number of recipe variations to request from Marvin",
    )


class IngredientSuggestionRequest(BaseModel):
    """Request for ingredient suggestions.

    Contains the core Ingredient model (partial) plus REST-specific fields
    for controlling the suggestion API (prompt, n_completions).
    """

    ingredient: Ingredient = Field(
        default_factory=Ingredient,
        description="Partially completed ingredient to be enhanced by the AI",
    )
    prompt: str | None = Field(
        None,
        description="Optional prompt to guide Marvin when completing the ingredient",
    )
    n_completions: int = Field(
        default=1,
        ge=1,
        le=5,
        description="Number of ingredient variations to request from Marvin",
    )
