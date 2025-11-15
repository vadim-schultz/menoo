"""Suggestion response schemas - REST API response wrappers."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.core.recipe import Recipe


class SuggestionResponse(BaseModel):
    """Response with recipe suggestions.
    
    Contains a list of core Recipe models (completed by Marvin).
    """

    recipes: list[Recipe] = Field(
        ...,
        description="AI-completed recipes returned by Marvin",
    )

