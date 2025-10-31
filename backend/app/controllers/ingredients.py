"""Ingredients controller."""

from __future__ import annotations

from litestar import Controller, delete, get, patch, post
from litestar.status_codes import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from app.schemas import (
    IngredientCreate,
    IngredientFilter,
    IngredientPatch,
    IngredientRead,
)
from app.services import IngredientService


class IngredientController(Controller):
    """Controller for ingredient endpoints."""

    path = "/api/v1/ingredients"
    tags = ["ingredients"]

    @get("/")
    async def list_ingredients(
        self,
        ingredient_service: IngredientService,
        filters: IngredientFilter | None = None,
    ) -> list[IngredientRead]:
        """List all ingredients with optional filters."""
        if filters is None:
            filters = IngredientFilter()
        ingredients = await ingredient_service.list_ingredients(filters)
        return [IngredientRead.model_validate(ing) for ing in ingredients]

    @post("/", status_code=HTTP_201_CREATED)
    async def create_ingredient(
        self,
        ingredient_service: IngredientService,
        data: IngredientCreate,
    ) -> IngredientRead:
        """Create a new ingredient or add quantity to existing one."""
        ingredient = await ingredient_service.create_ingredient(data)
        return IngredientRead.model_validate(ingredient)

    @get("/{ingredient_id:int}")
    async def get_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> IngredientRead:
        """Get a specific ingredient by ID."""
        ingredient = await ingredient_service.get_ingredient(ingredient_id)
        return IngredientRead.model_validate(ingredient)

    @patch("/{ingredient_id:int}")
    async def patch_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
        data: IngredientPatch,
    ) -> IngredientRead:
        """Partially update an ingredient."""
        ingredient = await ingredient_service.update_ingredient(ingredient_id, data)
        return IngredientRead.model_validate(ingredient)

    @delete("/{ingredient_id:int}", status_code=HTTP_204_NO_CONTENT)
    async def delete_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> None:
        """Delete an ingredient (soft delete)."""
        await ingredient_service.delete_ingredient(ingredient_id)
        return None
