"""Suggestions controller."""
from __future__ import annotations

from litestar import Controller, post
from litestar.di import Provide

from app.dependencies import provide_suggestion_service
from app.schemas import (
    ShoppingListRequest,
    ShoppingListResponse,
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
        suggestions, source, cache_hit = await suggestion_service.get_suggestions(data)

        return SuggestionResponse(
            suggestions=suggestions,
            source=source,
            cache_hit=cache_hit,
        )

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

        return ShoppingListResponse(
            items_by_location={},
            total_items=0,
        )
