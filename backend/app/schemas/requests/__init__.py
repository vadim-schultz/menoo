"""Request schemas - REST API request wrappers."""

from app.schemas.requests.ingredient import (
    IngredientCreateRequest,
    IngredientListRequest,
    IngredientPatch,
    IngredientUpdateRequest,
)
from app.schemas.requests.recipe import (
    RecipeCreateRequest,
    RecipeListRequest,
    RecipeUpdateRequest,
)
from app.schemas.requests.suggestion import (
    IngredientSuggestionRequest,
    SuggestionRequest,
)

__all__ = [
    "IngredientCreateRequest",
    "IngredientListRequest",
    "IngredientPatch",
    "IngredientUpdateRequest",
    "IngredientSuggestionRequest",
    "RecipeCreateRequest",
    "RecipeListRequest",
    "RecipeUpdateRequest",
    "SuggestionRequest",
]
