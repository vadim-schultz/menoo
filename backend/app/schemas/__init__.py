"""Schemas package."""

from app.schemas.ingredient import (
    IngredientCreate,  # Backward compatibility alias
    IngredientFilter,
    IngredientListResponse,
    IngredientPatch,
    IngredientRead,
    IngredientUpdate,  # Backward compatibility alias
    IngredientWrite,
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
    "IngredientCreate",  # Backward compatibility
    "IngredientUpdate",  # Backward compatibility
    "IngredientWrite",
    "IngredientPatch",
    "IngredientRead",
    "IngredientFilter",
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
