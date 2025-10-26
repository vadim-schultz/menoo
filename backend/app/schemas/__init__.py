"""Schemas package."""

from app.schemas.ingredient import (
    IngredientCreate,
    IngredientDetail,
    IngredientListResponse,
    IngredientRead,
    IngredientUpdate,
)
from app.schemas.recipe import (
    RecipeCreate,
    RecipeDetail,
    RecipeIngredientCreate,
    RecipeIngredientRead,
    RecipeListResponse,
    RecipeRead,
    RecipeUpdate,
)
from app.schemas.suggestion import (
    GeneratedRecipe,
    GeneratedRecipeIngredient,
    RecipeSuggestion,
    ShoppingListItem,
    ShoppingListRequest,
    ShoppingListResponse,
    SuggestionAcceptRequest,
    SuggestionRequest,
    SuggestionResponse,
)

__all__ = [
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientRead",
    "IngredientDetail",
    "IngredientListResponse",
    "RecipeCreate",
    "RecipeUpdate",
    "RecipeRead",
    "RecipeDetail",
    "RecipeListResponse",
    "RecipeIngredientCreate",
    "RecipeIngredientRead",
    "SuggestionRequest",
    "SuggestionResponse",
    "SuggestionAcceptRequest",
    "RecipeSuggestion",
    "GeneratedRecipe",
    "GeneratedRecipeIngredient",
    "ShoppingListRequest",
    "ShoppingListResponse",
    "ShoppingListItem",
]
