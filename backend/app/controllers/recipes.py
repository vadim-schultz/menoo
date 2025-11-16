"""Recipes controller."""

from __future__ import annotations

from litestar import Controller, delete, get, patch, post

from app.schemas import (
    Recipe,
    RecipeCreateRequest,
    RecipeDetail,
    RecipeIngredientRead,
    RecipeListResponse,
    RecipeResponse,
    RecipeUpdateRequest,
)
from app.schemas.core.recipe import IngredientPreparation
from app.schemas.requests.recipe import RecipeListRequest
from app.services import RecipeService


class RecipeController(Controller):
    """Controller for recipe endpoints."""

    path = "/api/v1/recipes"
    tags = ["recipes"]

    @get("/")
    async def list_recipes(
        self,
        recipe_service: RecipeService,
        filters: RecipeListRequest | None = None,
    ) -> RecipeListResponse:
        """List all recipes with optional filters."""
        if filters is None:
            filters = RecipeListRequest()
        recipes, total = await recipe_service.list_recipes(filters)

        return RecipeListResponse(
            items=[RecipeResponse.model_validate(recipe) for recipe in recipes],
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            has_next=(filters.page * filters.page_size) < total,
        )

    @post("/")
    async def create_recipe(
        self,
        recipe_service: RecipeService,
        data: RecipeCreateRequest,
    ) -> RecipeDetail:
        """Create a new recipe."""
        recipe = await recipe_service.create_recipe(data.recipe)

        # Build detailed response
        ingredients = await recipe_service.get_recipe_ingredients(recipe.id)

        response = RecipeDetail.model_validate(recipe)
        response.ingredients = ingredients
        response.missing_ingredients = []

        return response

    @get("/{recipe_id:int}")
    async def get_recipe(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
    ) -> RecipeDetail:
        """Get a specific recipe by ID with ingredients."""
        recipe = await recipe_service.get_recipe(recipe_id, load_ingredients=True)
        ingredients = await recipe_service.get_recipe_ingredients(recipe_id)

        response = RecipeDetail.model_validate(recipe)
        response.ingredients = ingredients
        response.missing_ingredients = []

        return response

    @patch("/{recipe_id:int}")
    async def update_recipe(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
        data: RecipeUpdateRequest,
    ) -> RecipeDetail:
        """Partially update a recipe."""
        recipe = await recipe_service.update_recipe(recipe_id, data.recipe)
        ingredients = await recipe_service.get_recipe_ingredients(recipe_id)

        response = RecipeDetail.model_validate(recipe)
        response.ingredients = ingredients
        response.missing_ingredients = []

        return response

    @delete("/{recipe_id:int}", status_code=200)
    async def delete_recipe(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
    ) -> dict[str, str]:
        """Delete a recipe (soft delete)."""
        await recipe_service.delete_recipe(recipe_id)
        return {"message": "Recipe deleted successfully"}

    @get("/{recipe_id:int}/ingredients")
    async def get_recipe_ingredients(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
    ) -> list[RecipeIngredientRead]:
        """Get all ingredients for a recipe."""
        return await recipe_service.get_recipe_ingredients(recipe_id)

    @post("/{recipe_id:int}/ingredients")
    async def add_recipe_ingredients(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
        data: list[IngredientPreparation],
    ) -> list[RecipeIngredientRead]:
        """Add or update ingredients for a recipe."""
        # Use update with just ingredients
        update_data = Recipe(ingredients=data)
        await recipe_service.update_recipe(recipe_id, update_data)
        return await recipe_service.get_recipe_ingredients(recipe_id)
