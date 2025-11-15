"""Recipe service for business logic."""

from __future__ import annotations

from decimal import Decimal
from typing import Iterable

from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import CuisineType
from app.models import Recipe as RecipeModel, RecipeIngredient
from app.repositories import (
    IngredientRepository,
    RecipeIngredientRepository,
    RecipeRepository,
)
from app.services.suggestion_service import SuggestionService
from app.schemas import (
    Recipe,
    RecipeIngredientRead,
)
from app.schemas.core.recipe import IngredientPreparation
from app.schemas.requests.suggestion import SuggestionRequest


class RecipeService:
    """Service for recipe business logic."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.recipe_repo = RecipeRepository(session)
        self.recipe_ingredient_repo = RecipeIngredientRepository(session)
        self.ingredient_repo = IngredientRepository(session)
        self._session = session
        self._suggestion_service: SuggestionService | None = None

    @property
    def suggestion_service(self) -> SuggestionService:
        """Lazily initialize suggestion service."""
        if self._suggestion_service is None:
            self._suggestion_service = SuggestionService(self._session)
        return self._suggestion_service

    async def create_recipe(self, data: Recipe) -> RecipeModel:
        """Create a new recipe with ingredients."""
        await self._validate_ingredients_exist(data.ingredients)

        # Use model_dump to serialize Pydantic model to dict, excluding ingredients
        recipe_dict = data.model_dump(mode="json", exclude={"ingredients"})
        
        # Extract timing fields to top-level columns for SQLAlchemy model
        timing = recipe_dict.pop("timing", {})
        recipe_dict.update({
            "prep_time_minutes": timing.get("prep_time_minutes"),
            "cook_time_minutes": timing.get("cook_time_minutes"),
            "marinating_time_minutes": timing.get("marinating_time_minutes"),
            "resting_time_minutes": timing.get("resting_time_minutes"),
            "inactive_time_minutes": timing.get("inactive_time_minutes"),
            "total_active_time_minutes": timing.get("total_active_time_minutes"),
            "timing": timing,  # Keep full timing dict for JSON column
        })
        
        # Ensure required fields have defaults
        recipe_dict.setdefault("servings", 1)
        recipe_dict.setdefault("cuisine_types", [])
        recipe_dict.setdefault("meal_types", [])
        recipe_dict.setdefault("dietary_requirements", [])
        recipe_dict.setdefault("contains_allergens", [])
        recipe_dict.setdefault("equipment_requirements", [])
        recipe_dict.setdefault("tags", [])
        
        recipe = await self.recipe_repo.create(RecipeModel(**recipe_dict))

        if data.ingredients:
            await self._persist_ingredients(recipe.id, data.ingredients)

        return await self.recipe_repo.get_by_id(recipe.id, load_ingredients=True) or recipe

    async def get_recipe(self, recipe_id: int, load_ingredients: bool = True) -> RecipeModel:
        """Get recipe by ID."""
        recipe = await self.recipe_repo.get_by_id(recipe_id, load_ingredients=load_ingredients)
        if not recipe:
            raise ValueError(f"Recipe with ID {recipe_id} not found")
        return recipe

    async def list_recipes(
        self,
        *,
        max_prep_time_minutes: int | None = None,
        max_cook_time_minutes: int | None = None,
        cuisine: CuisineType | None = None,
        name_contains: str | None = None,
        page: int = 1,
        page_size: int = 100,
    ) -> tuple[list[RecipeModel], int]:
        """List recipes with filters and pagination."""
        if page < 1:
            raise ValueError("Page must be >= 1")
        if page_size < 1 or page_size > 1000:
            raise ValueError("Page size must be between 1 and 1000")

        skip = (page - 1) * page_size
        recipes, total = await self.recipe_repo.list(
            max_prep_time_minutes=max_prep_time_minutes,
            max_cook_time_minutes=max_cook_time_minutes,
            cuisine=cuisine.value if cuisine else None,
            name_contains=name_contains,
            skip=skip,
            limit=page_size,
        )
        return list(recipes), total

    async def update_recipe(self, recipe_id: int, data: Recipe) -> RecipeModel:
        """Update a recipe and optionally its ingredients."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=False)

        self._apply_recipe_updates(recipe, data)
        recipe = await self.recipe_repo.update(recipe)

        if data.ingredients is not None:
            await self._validate_ingredients_exist(data.ingredients)
            serialized = [self._serialize_ingredient_payload(ing) for ing in data.ingredients]
            await self.recipe_ingredient_repo.upsert_recipe_ingredients(recipe.id, serialized)

        return await self.recipe_repo.get_by_id(recipe.id, load_ingredients=True) or recipe

    async def delete_recipe(self, recipe_id: int) -> None:
        """Soft delete a recipe."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=False)
        await self.recipe_repo.soft_delete(recipe)

    async def get_recipe_ingredients(self, recipe_id: int) -> list[RecipeIngredientRead]:
        """Get all ingredients for a recipe with details."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=True)

        ingredients: list[RecipeIngredientRead] = []
        for assoc in recipe.ingredient_associations:
            payload = dict(assoc.preparation_details or {})
            payload.update(
                {
                    "id": assoc.id,
                    "ingredient_id": assoc.ingredient_id,
                    "ingredient_name": assoc.ingredient.name,
                }
            )
            payload.setdefault("order_in_recipe", assoc.order_in_recipe)
            payload.setdefault("is_optional", assoc.is_optional)
            if "quantity" not in payload and assoc.quantity is not None:
                payload["quantity"] = float(assoc.quantity)
            if "unit" not in payload:
                payload["unit"] = assoc.unit
            ingredients.append(RecipeIngredientRead.model_validate(payload))
        return ingredients

    async def calculate_missing_ingredients(
        self,
        recipe_id: int,
        available_ingredient_ids: list[int],
    ) -> list[str]:
        """Calculate which ingredients are missing for a recipe."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=True)

        required_ids = {
            assoc.ingredient_id for assoc in recipe.ingredient_associations if not assoc.is_optional
        }
        missing_ids = required_ids - set(available_ingredient_ids)
        if not missing_ids:
            return []

        missing_ingredients = await self.ingredient_repo.get_by_ids(list(missing_ids))
        return [ing.name for ing in missing_ingredients]


    async def _validate_ingredients_exist(
        self,
        ingredients: Iterable[IngredientPreparation] | None,
    ) -> None:
        if not ingredients:
            return
        ingredient_ids = [ing.ingredient_id for ing in ingredients]
        existing_ingredients = await self.ingredient_repo.get_by_ids(ingredient_ids)
        if len(existing_ingredients) != len(set(ingredient_ids)):
            raise ValueError("One or more ingredient IDs are invalid")


    def _apply_recipe_updates(self, recipe: RecipeModel, data: Recipe) -> None:
        """Apply partial updates to recipe instance."""
        # Get non-None fields from Pydantic model, excluding ingredients
        updates = data.model_dump(mode="json", exclude_unset=True, exclude={"ingredients"})
        
        if not updates:
            return
        
        # Handle timing extraction to top-level columns
        if "timing" in updates:
            timing = updates.pop("timing")
            recipe.timing = timing
            recipe.prep_time_minutes = timing.get("prep_time_minutes")
            recipe.cook_time_minutes = timing.get("cook_time_minutes")
            recipe.marinating_time_minutes = timing.get("marinating_time_minutes")
            recipe.resting_time_minutes = timing.get("resting_time_minutes")
            recipe.inactive_time_minutes = timing.get("inactive_time_minutes")
            recipe.total_active_time_minutes = timing.get("total_active_time_minutes")
        
        # Apply all other updates directly
        for key, value in updates.items():
            setattr(recipe, key, value)

    async def _persist_ingredients(
        self,
        recipe_id: int,
        ingredients: Iterable[IngredientPreparation],
    ) -> None:
        """Persist ingredient associations for a recipe."""
        for ing in ingredients:
            payload = self._serialize_ingredient_payload(ing)
            association = RecipeIngredient(recipe_id=recipe_id, **payload)
            await self.recipe_ingredient_repo.create(association)

    def _serialize_ingredient_payload(self, ingredient: IngredientPreparation) -> dict:
        """Convert an ingredient preparation into persistence payload."""
        detail_json = ingredient.model_dump(mode="json")
        detail_json.setdefault("ingredient_id", ingredient.ingredient_id)
        detail_json.setdefault("order_in_recipe", ingredient.order_in_recipe)
        return {
            "ingredient_id": ingredient.ingredient_id,
            "quantity": ingredient.quantity,
            "unit": ingredient.unit,
            "is_optional": ingredient.is_optional,
            "note": ingredient.notes,
            "order_in_recipe": ingredient.order_in_recipe,
            "preparation_details": detail_json,
        }
