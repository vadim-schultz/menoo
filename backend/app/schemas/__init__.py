"""Schemas package - organized by core models, requests, and responses."""

# Core models - definitive domain models
from app.schemas.core import Ingredient, Recipe
from app.schemas.core.recipe import (
    DifficultyMetrics,
    EquipmentRequirement,
    IngredientPreparation,
    NutritionInfo,
    RecipeTiming,
    StorageInstructions,
)

# Request schemas - REST API request wrappers
from app.schemas.requests import (
    RecipeCreateRequest,
    RecipeListRequest,
    RecipeUpdateRequest,
    SuggestionRequest,
)

# Response schemas - REST API response wrappers
from app.schemas.responses import (
    RecipeDetail,
    RecipeListResponse,
    RecipeResponse,
    SuggestionResponse,
)

# Response sub-types
from app.schemas.responses.recipe import RecipeIngredientRead

# Legacy ingredient schemas (from old structure)
from app.schemas.ingredient import (
    IngredientCreate,
    IngredientFilter,
    IngredientListResponse,
    IngredientPatch,
    IngredientRead,
    IngredientUpdate,
    IngredientWrite,
)

__all__ = [
    # Core models
    "Recipe",
    "Ingredient",
    "DifficultyMetrics",
    "EquipmentRequirement",
    "IngredientPreparation",
    "NutritionInfo",
    "RecipeTiming",
    "StorageInstructions",
    # Request schemas
    "RecipeCreateRequest",
    "RecipeListRequest",
    "RecipeUpdateRequest",
    "SuggestionRequest",
    # Response schemas
    "RecipeResponse",
    "RecipeDetail",
    "RecipeListResponse",
    "RecipeIngredientRead",
    "SuggestionResponse",
    # Legacy ingredient schemas
    "IngredientCreate",
    "IngredientUpdate",
    "IngredientWrite",
    "IngredientPatch",
    "IngredientRead",
    "IngredientFilter",
    "IngredientListResponse",
]
