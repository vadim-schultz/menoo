"""Pydantic schemas for AI suggestions."""

from __future__ import annotations

from pydantic import BaseModel, Field


class GeneratedRecipeIngredient(BaseModel):
    """Ingredient in an AI-generated recipe."""

    ingredient_id: int = Field(..., description="ID of the ingredient from the database")
    name: str = Field(..., description="Ingredient name")
    quantity: float = Field(..., gt=0, description="Quantity of ingredient")
    unit: str = Field(..., description="Unit of measurement")


class GeneratedRecipe(BaseModel):
    """AI-generated recipe structure."""

    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    description: str | None = Field(None, description="Recipe description")
    ingredients: list[GeneratedRecipeIngredient] = Field(
        ..., min_length=1, description="List of ingredients with quantities"
    )
    instructions: str = Field(..., min_length=1, description="Cooking instructions")
    prep_time_minutes: int | None = Field(None, gt=0, description="Preparation time in minutes")
    cook_time_minutes: int | None = Field(None, gt=0, description="Cooking time in minutes")
    servings: int | None = Field(None, gt=0, description="Number of servings")
    difficulty: str | None = Field(
        None, description="Difficulty level: easy, medium, or hard"
    )
    cuisine_type: str | None = Field(None, description="Type of cuisine")
    meal_type: str | None = Field(None, description="Meal type: breakfast, lunch, dinner, etc.")


class SuggestionAcceptRequest(BaseModel):
    """Request to accept and persist an AI-generated recipe."""

    generated_recipe: GeneratedRecipe = Field(..., description="The AI-generated recipe to save")


class SuggestionRequest(BaseModel):
    """Request for recipe suggestions."""

    available_ingredients: list[int] = Field(..., description="List of available ingredient IDs")
    max_prep_time: int | None = Field(None, gt=0, description="Maximum prep time in minutes")
    max_cook_time: int | None = Field(None, gt=0, description="Maximum cook time in minutes")
    difficulty: str | None = Field(None, description="Preferred difficulty level")
    dietary_restrictions: list[str] = Field(
        default_factory=list, description="Dietary restrictions or preferences"
    )
    max_results: int = Field(default=5, gt=0, le=20, description="Maximum number of suggestions")


class RecipeSuggestion(BaseModel):
    """Individual recipe suggestion."""

    recipe_id: int | None = Field(None, description="Existing recipe ID (null for AI-generated)")
    recipe_name: str
    match_score: float = Field(..., ge=0, le=1, description="How well ingredients match (0-1)")
    missing_ingredients: list[str] = Field(default_factory=list)
    matched_ingredients: list[str] = Field(default_factory=list)
    reason: str | None = Field(None, description="AI-generated reason for suggestion")
    is_ai_generated: bool = Field(default=False, description="Whether this is an AI-generated recipe")
    generated_recipe: GeneratedRecipe | None = Field(
        None, description="Full AI-generated recipe data if is_ai_generated=True"
    )


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
