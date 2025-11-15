"""Recipes controller."""

from __future__ import annotations

from litestar import Controller, delete, get, patch, post, put
from litestar.params import Parameter

from app.enums import CuisineType
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
from app.schemas.requests.suggestion import SuggestionRequest
from app.services import RecipeService


class RecipeController(Controller):
    """Controller for recipe endpoints."""

    path = "/api/v1/recipes"
    tags = ["recipes"]

    @get("/")
    async def list_recipes(
        self,
        recipe_service: RecipeService,
        cuisine: CuisineType | None = Parameter(
            default=None, query="cuisine", description="Filter by cuisine type"
        ),
        max_prep_time_minutes: int | None = Parameter(
            default=None,
            query="max_prep_time_minutes",
            description="Maximum prep time in minutes",
        ),
        max_cook_time_minutes: int | None = Parameter(
            default=None,
            query="max_cook_time_minutes",
            description="Maximum cook time in minutes",
        ),
        name_contains: str | None = Parameter(
            default=None, query="name", description="Search by name"
        ),
        page: int = Parameter(default=1, ge=1, query="page"),
        page_size: int = Parameter(default=100, ge=1, le=1000, query="page_size"),
    ) -> RecipeListResponse:
        """List all recipes with optional filters."""
        recipes, total = await recipe_service.list_recipes(
            cuisine=cuisine,
            max_prep_time_minutes=max_prep_time_minutes,
            max_cook_time_minutes=max_cook_time_minutes,
            name_contains=name_contains,
            page=page,
            page_size=page_size,
        )

        return RecipeListResponse(
            items=[RecipeResponse.model_validate(recipe) for recipe in recipes],
            total=total,
            page=page,
            page_size=page_size,
            has_next=(page * page_size) < total,
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

    @put("/{recipe_id:int}")
    async def replace_recipe(
        self,
        recipe_service: RecipeService,
        recipe_id: int,
        data: RecipeCreateRequest,
    ) -> RecipeDetail:
        """Replace a recipe (full update)."""
        recipe = await recipe_service.update_recipe(recipe_id, data.recipe)
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

    @post("/generate")
    async def generate_recipe(
        self,
        recipe_service: RecipeService,
        data: SuggestionRequest,
    ) -> Recipe:
        """
        Generate a complete recipe using AI from minimal input.

        Accepts partial recipe information (name, ingredients, preferences) and
        returns a complete AI-generated recipe. The result can be used with
        POST /recipes to create the recipe.
        """
        results = await recipe_service.suggestion_service.complete_recipe(data)
        return results[0] if results else data.recipe

    @post("/suggest")
    async def suggest_recipe(
        self,
        recipe_service: RecipeService,
        data: SuggestionRequest,
    ) -> Recipe:
        """
        Suggest a recipe based on partial information.

        Alias for /generate endpoint. Generates recipe suggestions that can be
        used to create recipes. This endpoint is intended for generating
        suggestions during recipe creation workflow.
        """
        results = await recipe_service.suggestion_service.complete_recipe(data)
        return results[0] if results else data.recipe
