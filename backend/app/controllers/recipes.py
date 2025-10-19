"""Recipes controller."""
from __future__ import annotations

from litestar import Controller, delete, get, patch, post, put
from litestar.di import Provide
from litestar.params import Parameter

from app.dependencies import provide_recipe_service
from app.schemas import (
    RecipeCreate,
    RecipeDetail,
    RecipeIngredientCreate,
    RecipeIngredientRead,
    RecipeListResponse,
    RecipeRead,
    RecipeUpdate,
)
from app.services import RecipeService


class RecipeController(Controller):
    """Controller for recipe endpoints."""

    path = "/api/v1/recipes"
    tags = ["recipes"]

    @get("/")
    async def list_recipes(
        self,
        recipe_service: RecipeService,
        difficulty: str | None = Parameter(
            default=None, query="difficulty", description="Filter by difficulty"
        ),
        max_prep_time: int | None = Parameter(
            default=None, query="max_prep_time", description="Maximum prep time in minutes"
        ),
        max_cook_time: int | None = Parameter(
            default=None, query="max_cook_time", description="Maximum cook time in minutes"
        ),
        name_contains: str | None = Parameter(
            default=None, query="name", description="Search by name"
        ),
        page: int = Parameter(default=1, ge=1, query="page"),
        page_size: int = Parameter(default=100, ge=1, le=1000, query="page_size"),
    ) -> RecipeListResponse:
        """List all recipes with optional filters."""
        recipes, total = await recipe_service.list_recipes(
            difficulty=difficulty,
            max_prep_time=max_prep_time,
            max_cook_time=max_cook_time,
            name_contains=name_contains,
            page=page,
            page_size=page_size,
        )

        return RecipeListResponse(
            items=[RecipeRead.model_validate(recipe) for recipe in recipes],
            total=total,
            page=page,
            page_size=page_size,
            has_next=(page * page_size) < total,
        )

    @post("/")
    async def create_recipe(
        self,
        recipe_service: RecipeService,
        data: RecipeCreate,
    ) -> RecipeDetail:
        """Create a new recipe."""
        recipe = await recipe_service.create_recipe(data)

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
        data: RecipeCreate,
    ) -> RecipeDetail:
        """Replace a recipe (full update)."""
        update_data = RecipeUpdate(**data.model_dump())
        recipe = await recipe_service.update_recipe(recipe_id, update_data)
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
        data: RecipeUpdate,
    ) -> RecipeDetail:
        """Partially update a recipe."""
        recipe = await recipe_service.update_recipe(recipe_id, data)
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
        data: list[RecipeIngredientCreate],
    ) -> list[RecipeIngredientRead]:
        """Add or update ingredients for a recipe."""
        # Use update with just ingredients
        update_data = RecipeUpdate(ingredients=data)
        await recipe_service.update_recipe(recipe_id, update_data)
        return await recipe_service.get_recipe_ingredients(recipe_id)
