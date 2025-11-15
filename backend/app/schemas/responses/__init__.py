"""Response schemas - REST API response wrappers."""

from app.schemas.responses.recipe import RecipeDetail, RecipeListResponse, RecipeResponse
from app.schemas.responses.suggestion import SuggestionResponse

__all__ = [
    "RecipeResponse",
    "RecipeDetail",
    "RecipeListResponse",
    "SuggestionResponse",
]

