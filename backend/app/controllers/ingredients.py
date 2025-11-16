"""Ingredients controller."""

from __future__ import annotations

from litestar import Controller, Request, delete, get, patch, post
from litestar.status_codes import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from app.schemas.requests.ingredient import (
    IngredientCreateRequest,
    IngredientListRequest,
    IngredientPatch,
)
from app.schemas.responses.ingredient import IngredientResponse
from app.services import IngredientService


class IngredientController(Controller):
    """Controller for ingredient endpoints."""

    path = "/api/v1/ingredients"
    tags = ["ingredients"]

    @get("/")
    async def list_ingredients(
        self,
        ingredient_service: IngredientService,
        request: Request,
    ) -> list[IngredientResponse]:
        """List all ingredients with optional filters."""
        # Build filters from query parameters explicitly to ensure correct parsing
        qp = request.query_params
        filters = IngredientListRequest(
            category=qp.get("category") or None,
            storage_location=qp.get("storage_location") or None,
            expiring_before=qp.get("expiring_before") or None,  # Pydantic will parse date
            name_contains=qp.get("name_contains") or None,
            page=int(qp.get("page")) if qp.get("page") is not None else 1,
            page_size=int(qp.get("page_size")) if qp.get("page_size") is not None else 100,
        )
        ingredients = await ingredient_service.list_ingredients(filters)
        return [IngredientResponse.model_validate(ing) for ing in ingredients]

    @post("/", status_code=HTTP_201_CREATED)
    async def create_ingredient(
        self,
        ingredient_service: IngredientService,
        data: IngredientCreateRequest,
    ) -> IngredientResponse:
        """Create a new ingredient or add quantity to existing one."""
        ingredient = await ingredient_service.create_ingredient(data.ingredient)
        return IngredientResponse.model_validate(ingredient)

    @get("/{ingredient_id:int}")
    async def get_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> IngredientResponse:
        """Get a specific ingredient by ID."""
        ingredient = await ingredient_service.get_ingredient(ingredient_id)
        return IngredientResponse.model_validate(ingredient)

    @patch("/{ingredient_id:int}")
    async def patch_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
        data: IngredientPatch,
    ) -> IngredientResponse:
        """Partially update an ingredient."""
        ingredient = await ingredient_service.update_ingredient(ingredient_id, data)
        return IngredientResponse.model_validate(ingredient)

    @delete("/{ingredient_id:int}", status_code=HTTP_204_NO_CONTENT)
    async def delete_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> None:
        """Delete an ingredient (soft delete)."""
        await ingredient_service.delete_ingredient(ingredient_id)
        return None
