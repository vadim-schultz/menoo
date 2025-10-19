"""Ingredients controller."""
from __future__ import annotations

from datetime import date

from litestar import Controller, delete, get, patch, post, put
from litestar.di import Provide
from litestar.params import Parameter

from app.dependencies import provide_ingredient_service
from app.schemas import (
    IngredientCreate,
    IngredientDetail,
    IngredientListResponse,
    IngredientRead,
    IngredientUpdate,
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
        storage_location: str | None = Parameter(
            default=None, query="storage_location", description="Filter by storage location"
        ),
        expiring_before: date | None = Parameter(
            default=None, query="expiring_before", description="Filter by expiry date"
        ),
        name_contains: str | None = Parameter(
            default=None, query="name", description="Search by name"
        ),
        page: int = Parameter(default=1, ge=1, query="page"),
        page_size: int = Parameter(default=100, ge=1, le=1000, query="page_size"),
    ) -> IngredientListResponse:
        """List all ingredients with optional filters."""
        ingredients, total = await ingredient_service.list_ingredients(
            storage_location=storage_location,
            expiring_before=expiring_before,
            name_contains=name_contains,
            page=page,
            page_size=page_size,
        )

        return IngredientListResponse(
            items=[IngredientRead.model_validate(ing) for ing in ingredients],
            total=total,
            page=page,
            page_size=page_size,
            has_next=(page * page_size) < total,
        )

    @post("/")
    async def create_ingredient(
        self,
        ingredient_service: IngredientService,
        data: IngredientCreate,
    ) -> IngredientRead:
        """Create a new ingredient."""
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

    @put("/{ingredient_id:int}")
    async def replace_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
        data: IngredientCreate,
    ) -> IngredientRead:
        """Replace an ingredient (full update)."""
        update_data = IngredientUpdate(**data.model_dump())
        ingredient = await ingredient_service.update_ingredient(ingredient_id, update_data)
        return IngredientRead.model_validate(ingredient)

    @patch("/{ingredient_id:int}")
    async def update_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
        data: IngredientUpdate,
    ) -> IngredientRead:
        """Partially update an ingredient."""
        ingredient = await ingredient_service.update_ingredient(ingredient_id, data)
        return IngredientRead.model_validate(ingredient)

    @delete("/{ingredient_id:int}", status_code=200)
    async def delete_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> dict[str, str]:
        """Delete an ingredient (soft delete)."""
        await ingredient_service.delete_ingredient(ingredient_id)
        return {"message": "Ingredient deleted successfully"}
