"""Suggestions controller."""

from __future__ import annotations

from litestar import Controller, post

from app.schemas import (
    IngredientSuggestionRequest,
    IngredientSuggestionResponse,
    SuggestionRequest,
    SuggestionResponse,
)
from app.services import SuggestionService


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
        recipes = await suggestion_service.complete_recipe(data)
        return SuggestionResponse(recipes=recipes)

    @post("/ingredient")
    async def get_ingredient_suggestions(
        self,
        suggestion_service: SuggestionService,
        data: IngredientSuggestionRequest,
    ) -> IngredientSuggestionResponse:
        """Get ingredient suggestions based on prompt."""
        ingredients = await suggestion_service.complete_ingredient(data)
        return IngredientSuggestionResponse(ingredients=ingredients)
