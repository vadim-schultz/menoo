"""Recipe service for business logic."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Recipe, RecipeIngredient
from app.repositories import (
    IngredientRepository,
    RecipeIngredientRepository,
    RecipeRepository,
)
from app.schemas import RecipeCreate, RecipeIngredientRead, RecipeUpdate


class RecipeService:
    """Service for recipe business logic."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.recipe_repo = RecipeRepository(session)
        self.recipe_ingredient_repo = RecipeIngredientRepository(session)
        self.ingredient_repo = IngredientRepository(session)

    async def create_recipe(self, data: RecipeCreate) -> Recipe:
        """Create a new recipe with ingredients."""
        # Validate ingredients exist
        if data.ingredients:
            ingredient_ids = [ing.ingredient_id for ing in data.ingredients]
            existing_ingredients = await self.ingredient_repo.get_by_ids(ingredient_ids)
            if len(existing_ingredients) != len(set(ingredient_ids)):
                raise ValueError("One or more ingredient IDs are invalid")

        # Create recipe
        recipe = Recipe(
            name=data.name,
            description=data.description,
            instructions=data.instructions,
            prep_time=data.prep_time,
            cook_time=data.cook_time,
            servings=data.servings,
            difficulty=data.difficulty,
        )

        recipe = await self.recipe_repo.create(recipe)

        # Add ingredient associations
        if data.ingredients:
            for ing_data in data.ingredients:
                association = RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ing_data.ingredient_id,
                    quantity=ing_data.quantity,
                    unit=ing_data.unit,
                    is_optional=ing_data.is_optional,
                    note=ing_data.note,
                )
                await self.recipe_ingredient_repo.create(association)

        # Reload recipe with associations
        return await self.recipe_repo.get_by_id(recipe.id, load_ingredients=True) or recipe

    async def get_recipe(self, recipe_id: int, load_ingredients: bool = True) -> Recipe:
        """Get recipe by ID."""
        recipe = await self.recipe_repo.get_by_id(recipe_id, load_ingredients=load_ingredients)
        if not recipe:
            raise ValueError(f"Recipe with ID {recipe_id} not found")
        return recipe

    async def list_recipes(
        self,
        difficulty: str | None = None,
        max_prep_time: int | None = None,
        max_cook_time: int | None = None,
        name_contains: str | None = None,
        page: int = 1,
        page_size: int = 100,
    ) -> tuple[list[Recipe], int]:
        """List recipes with filters and pagination."""
        if page < 1:
            raise ValueError("Page must be >= 1")
        if page_size < 1 or page_size > 1000:
            raise ValueError("Page size must be between 1 and 1000")

        skip = (page - 1) * page_size
        recipes, total = await self.recipe_repo.list(
            difficulty=difficulty,
            max_prep_time=max_prep_time,
            max_cook_time=max_cook_time,
            name_contains=name_contains,
            skip=skip,
            limit=page_size,
        )

        return list(recipes), total

    async def update_recipe(self, recipe_id: int, data: RecipeUpdate) -> Recipe:
        """Update a recipe and optionally its ingredients."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=False)

        # Update basic fields
        if data.name is not None:
            recipe.name = data.name
        if data.description is not None:
            recipe.description = data.description
        if data.instructions is not None:
            recipe.instructions = data.instructions
        if data.prep_time is not None:
            recipe.prep_time = data.prep_time
        if data.cook_time is not None:
            recipe.cook_time = data.cook_time
        if data.servings is not None:
            recipe.servings = data.servings
        if data.difficulty is not None:
            recipe.difficulty = data.difficulty

        recipe = await self.recipe_repo.update(recipe)

        # Update ingredients if provided
        if data.ingredients is not None:
            # Validate ingredients exist
            ingredient_ids = [ing.ingredient_id for ing in data.ingredients]
            existing_ingredients = await self.ingredient_repo.get_by_ids(ingredient_ids)
            if len(existing_ingredients) != len(set(ingredient_ids)):
                raise ValueError("One or more ingredient IDs are invalid")

            # Upsert ingredients
            ingredient_data = [ing.model_dump() for ing in data.ingredients]
            await self.recipe_ingredient_repo.upsert_recipe_ingredients(recipe.id, ingredient_data)

        # Reload with associations
        return await self.recipe_repo.get_by_id(recipe.id, load_ingredients=True) or recipe

    async def delete_recipe(self, recipe_id: int) -> None:
        """Soft delete a recipe."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=False)
        await self.recipe_repo.soft_delete(recipe)

    async def get_recipe_ingredients(self, recipe_id: int) -> list[RecipeIngredientRead]:
        """Get all ingredients for a recipe with details."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=True)

        result = []
        for assoc in recipe.ingredient_associations:
            result.append(
                RecipeIngredientRead(
                    id=assoc.id,
                    ingredient_id=assoc.ingredient_id,
                    ingredient_name=assoc.ingredient.name,
                    quantity=assoc.quantity,
                    unit=assoc.unit,
                    is_optional=assoc.is_optional,
                    note=assoc.note,
                )
            )

        return result

    async def calculate_missing_ingredients(
        self, recipe_id: int, available_ingredient_ids: list[int]
    ) -> list[str]:
        """Calculate which ingredients are missing for a recipe."""
        recipe = await self.get_recipe(recipe_id, load_ingredients=True)

        required_ids = {
            assoc.ingredient_id for assoc in recipe.ingredient_associations if not assoc.is_optional
        }

        available_set = set(available_ingredient_ids)
        missing_ids = required_ids - available_set

        if not missing_ids:
            return []

        missing_ingredients = await self.ingredient_repo.get_by_ids(list(missing_ids))
        return [ing.name for ing in missing_ingredients]
