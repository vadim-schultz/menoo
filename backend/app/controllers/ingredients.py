"""Ingredients controller."""

from __future__ import annotations

from datetime import date

from litestar import Controller, delete, get, patch, post, put
from litestar.exceptions import HTTPException
from litestar.params import Parameter
from litestar.status_codes import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
)

from app.schemas import IngredientCreate, IngredientRead, IngredientUpdate
from app.services import IngredientService


def _map_error_status(exc: ValueError) -> int:
    """Translate service-level errors into HTTP status codes."""
    message = str(exc).lower()
    if "not found" in message:
        return HTTP_404_NOT_FOUND
    if "already exists" in message:
        return HTTP_409_CONFLICT
    return HTTP_400_BAD_REQUEST


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
            default=None, query="name_contains", description="Search by name"
        ),
        page: int = Parameter(default=1, ge=1, query="page"),
        page_size: int = Parameter(default=100, ge=1, le=1000, query="page_size"),
    ) -> list[IngredientRead]:
        """List all ingredients with optional filters."""
        try:
            ingredients, _ = await ingredient_service.list_ingredients(
                storage_location=storage_location,
                expiring_before=expiring_before,
                name_contains=name_contains,
                page=page,
                page_size=page_size,
            )
        except ValueError as exc:  # pragma: no cover - defensive mapping
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc

        return [IngredientRead.model_validate(ing) for ing in ingredients]

    @post("/", status_code=HTTP_201_CREATED)
    async def create_ingredient(
        self,
        ingredient_service: IngredientService,
        data: IngredientCreate,
    ) -> IngredientRead:
        """Create a new ingredient."""
        try:
            ingredient = await ingredient_service.create_ingredient(data)
        except ValueError as exc:
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc
        return IngredientRead.model_validate(ingredient)

    @get("/{ingredient_id:int}")
    async def get_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> IngredientRead:
        """Get a specific ingredient by ID."""
        try:
            ingredient = await ingredient_service.get_ingredient(ingredient_id)
        except ValueError as exc:
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc
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
        try:
            ingredient = await ingredient_service.update_ingredient(ingredient_id, update_data)
        except ValueError as exc:
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc
        return IngredientRead.model_validate(ingredient)

    @patch("/{ingredient_id:int}")
    async def update_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
        data: IngredientUpdate,
    ) -> IngredientRead:
        """Partially update an ingredient."""
        try:
            ingredient = await ingredient_service.update_ingredient(ingredient_id, data)
        except ValueError as exc:
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc
        return IngredientRead.model_validate(ingredient)

    @delete("/{ingredient_id:int}", status_code=HTTP_204_NO_CONTENT)
    async def delete_ingredient(
        self,
        ingredient_service: IngredientService,
        ingredient_id: int,
    ) -> None:
        """Delete an ingredient (soft delete)."""
        try:
            await ingredient_service.delete_ingredient(ingredient_id)
        except ValueError as exc:
            raise HTTPException(status_code=_map_error_status(exc), detail=str(exc)) from exc

        return None
