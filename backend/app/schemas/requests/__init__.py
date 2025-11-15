"""Request schemas - REST API request wrappers."""

from app.schemas.requests.recipe import RecipeCreateRequest, RecipeUpdateRequest
from app.schemas.requests.suggestion import SuggestionRequest

__all__ = [
    "RecipeCreateRequest",
    "RecipeUpdateRequest",
    "SuggestionRequest",
]

