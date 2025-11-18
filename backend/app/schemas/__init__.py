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
    IngredientCreateRequest,
    IngredientListRequest,
    IngredientPatch,
    IngredientSuggestionRequest,
    IngredientUpdateRequest,
    RecipeCreateRequest,
    RecipeListRequest,
    RecipeUpdateRequest,
    SuggestionRequest,
)

# Response schemas - REST API response wrappers
from app.schemas.responses import (
    IngredientListResponse,
    IngredientResponse,
    IngredientSuggestionResponse,
    RecipeDetail,
    RecipeListResponse,
    RecipeResponse,
    SuggestionResponse,
)

# Response sub-types
from app.schemas.responses.recipe import RecipeIngredientRead

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
    "IngredientCreateRequest",
    "IngredientListRequest",
    "IngredientPatch",
    "IngredientSuggestionRequest",
    "IngredientUpdateRequest",
    "RecipeCreateRequest",
    "RecipeListRequest",
    "RecipeUpdateRequest",
    "SuggestionRequest",
    # Response schemas
    "IngredientResponse",
    "IngredientListResponse",
    "IngredientSuggestionResponse",
    "RecipeResponse",
    "RecipeDetail",
    "RecipeListResponse",
    "RecipeIngredientRead",
    "SuggestionResponse",
]
