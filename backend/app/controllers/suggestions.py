"""Suggestions controller."""

from __future__ import annotations

from decimal import Decimal

from litestar import Controller, post

from app.schemas import (
    RecipeCreate,
    RecipeDetail,
    RecipeIngredientCreate,
    ShoppingListRequest,
    ShoppingListResponse,
    SuggestionAcceptRequest,
    SuggestionRequest,
    SuggestionResponse,
)
from app.services import RecipeService, SuggestionService


class SuggestionController(Controller):
    """Controller for AI-powered suggestion endpoints."""

    path = "/api/v1/suggestions"
    tags = ["suggestions"]

    @post("/recipes")
    async def get_recipe_suggestions(
        self,
        suggestion_service: SuggestionService,
        data: SuggestionRequest,
    ) -> SuggestionResponse:
        """Get recipe suggestions based on available ingredients."""
        suggestions, source, cache_hit = await suggestion_service.get_suggestions(data)

        return SuggestionResponse(
            suggestions=suggestions,
            source=source,
            cache_hit=cache_hit,
        )

    @post("/accept")
    async def accept_suggestion(
        self,
        recipe_service: RecipeService,
        data: SuggestionAcceptRequest,
    ) -> RecipeDetail:
        """Accept and persist an AI-generated recipe suggestion."""
        generated = data.generated_recipe

        # Map GeneratedRecipe to RecipeCreate
        recipe_ingredients = [
            RecipeIngredientCreate(
                ingredient_id=ing.ingredient_id,
                quantity=Decimal(str(ing.quantity)),
                unit=ing.unit,
                is_optional=False,
                note=None,
            )
            for ing in generated.ingredients
            if ing.ingredient_id > 0  # Only include ingredients from our database
        ]

        recipe_create = RecipeCreate(
            name=generated.name,
            description=generated.description,
            instructions=generated.instructions,
            prep_time=generated.prep_time_minutes,
            cook_time=generated.cook_time_minutes,
            servings=generated.servings or 1,
            difficulty=generated.difficulty,
            ingredients=recipe_ingredients,
        )

        # Create the recipe using RecipeService
        recipe = await recipe_service.create_recipe(recipe_create)

        # Build detailed response with ingredients
        ingredients = await recipe_service.get_recipe_ingredients(recipe.id)

        response = RecipeDetail.model_validate(recipe)
        response.ingredients = ingredients
        response.missing_ingredients = []

        return response

    @post("/shopping-list")
    async def generate_shopping_list(
        self,
        suggestion_service: SuggestionService,
        data: ShoppingListRequest,
    ) -> ShoppingListResponse:
        """Generate shopping list for selected recipes."""
        # TODO: Implement shopping list generation
        # This would calculate missing ingredients across multiple recipes
        # and group them by storage location
        _ = suggestion_service  # TODO: Use for shopping list generation
        _ = data  # TODO: Use recipe IDs to calculate shopping list

        return ShoppingListResponse(
            items_by_location={},
            total_items=0,
        )
