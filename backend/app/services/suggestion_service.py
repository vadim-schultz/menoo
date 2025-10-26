"""Suggestion service for AI-powered recipe recommendations."""

from __future__ import annotations

import hashlib
import json
import logging
import time

import marvin
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.core.marvin_config import configure_marvin
from app.repositories import IngredientRepository, RecipeRepository
from app.schemas import GeneratedRecipe, RecipeSuggestion, SuggestionRequest

logger = logging.getLogger(__name__)


class SuggestionService:
    """Service for generating recipe suggestions."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.recipe_repo = RecipeRepository(session)
        self.ingredient_repo = IngredientRepository(session)
        self._cache: dict[str, tuple[list[RecipeSuggestion], float]] = {}
        self._marvin_configured = False
        self.settings = get_settings()

    def _ensure_marvin_configured(self) -> None:
        """Lazily configure Marvin on first use."""
        if not self._marvin_configured:
            try:
                configure_marvin()
                self._marvin_configured = True
            except ValueError as e:
                logger.warning("Marvin configuration failed: %s", e)
                raise

    def _generate_cache_key(self, request: SuggestionRequest) -> str:
        """Generate cache key from request parameters."""
        # Sort ingredient IDs for consistent key
        sorted_ingredients = sorted(request.available_ingredients)
        key_data = {
            "ingredients": sorted_ingredients,
            "max_prep_time": request.max_prep_time,
            "max_cook_time": request.max_cook_time,
            "difficulty": request.difficulty,
            "dietary_restrictions": sorted(request.dietary_restrictions),
        }
        key_string = json.dumps(key_data, sort_keys=True)
        # nosec B324 - MD5 used only for cache keys, not security
        return hashlib.md5(key_string.encode(), usedforsecurity=False).hexdigest()

    async def get_suggestions_heuristic(self, request: SuggestionRequest) -> list[RecipeSuggestion]:
        """
        Get recipe suggestions using heuristic matching.

        This is the fallback when AI is unavailable.
        """
        # Get recipes that use any of the available ingredients
        recipes = await self.recipe_repo.get_recipes_with_ingredients(
            request.available_ingredients, min_match_count=1
        )

        # Get available ingredients
        available_ingredients = await self.ingredient_repo.get_by_ids(request.available_ingredients)
        available_names = {ing.name for ing in available_ingredients}

        suggestions = []
        for recipe in recipes:
            # Calculate match score
            total_ingredients = len(recipe.ingredient_associations)
            required_ingredients = [
                assoc for assoc in recipe.ingredient_associations if not assoc.is_optional
            ]

            matched = sum(
                1 for assoc in required_ingredients if assoc.ingredient.name in available_names
            )

            if total_ingredients == 0:
                continue

            match_score = matched / len(required_ingredients) if required_ingredients else 0

            # Get missing ingredients
            missing = [
                assoc.ingredient.name
                for assoc in required_ingredients
                if assoc.ingredient.name not in available_names
            ]

            # Get matched ingredients
            matched_ingredients = [
                assoc.ingredient.name
                for assoc in required_ingredients
                if assoc.ingredient.name in available_names
            ]

            # Apply filters
            if (
                request.max_prep_time
                and recipe.prep_time
                and recipe.prep_time > request.max_prep_time
            ):
                continue

            if (
                request.max_cook_time
                and recipe.cook_time
                and recipe.cook_time > request.max_cook_time
            ):
                continue

            if request.difficulty and recipe.difficulty and recipe.difficulty != request.difficulty:
                continue

            suggestions.append(
                RecipeSuggestion(
                    recipe_id=recipe.id,
                    recipe_name=recipe.name,
                    match_score=match_score,
                    missing_ingredients=missing,
                    matched_ingredients=matched_ingredients,
                    reason=f"Matches {matched}/{len(required_ingredients)} required ingredients",
                    is_ai_generated=False,
                    generated_recipe=None,
                )
            )

        # Sort by match score and limit results
        suggestions.sort(key=lambda x: x.match_score, reverse=True)
        return suggestions[: request.max_results]

    async def generate_recipe_with_marvin(
        self, ingredient_ids: list[int]
    ) -> GeneratedRecipe:
        """
        Generate a recipe using Marvin AI based on available ingredients.

        Args:
            ingredient_ids: List of available ingredient IDs

        Returns:
            GeneratedRecipe with structured data

        Raises:
            ValueError: If Marvin is not configured or generation fails
        """
        self._ensure_marvin_configured()

        # Fetch ingredient details
        ingredients = await self.ingredient_repo.get_by_ids(ingredient_ids)
        ingredient_names = [ing.name for ing in ingredients]

        if not ingredient_names:
            raise ValueError("At least one ingredient is required")

        try:
            # Use Marvin to generate structured recipe
            # Marvin will automatically parse the response into our GeneratedRecipe schema
            @marvin.fn  # type: ignore[misc]
            def create_recipe(available_ingredients: list[str]) -> GeneratedRecipe:
                """Generate a creative recipe using the available ingredients."""
                return GeneratedRecipe(  # type: ignore[return-value]
                    name="",
                    ingredients=[],
                    instructions="",
                )

            recipe = create_recipe(ingredient_names)  # type: ignore[assignment]

            # Validate that at least one ingredient is used
            used_ingredient_names = {ing.name.lower() for ing in recipe.ingredients}
            available_ingredient_names = {name.lower() for name in ingredient_names}

            if not used_ingredient_names.intersection(available_ingredient_names):
                logger.warning(
                    "Generated recipe does not use any requested ingredients"
                )
                raise ValueError("Recipe must use at least one requested ingredient")

            # Map ingredient names to IDs
            ingredient_name_to_id = {ing.name.lower(): ing.id for ing in ingredients}
            for recipe_ing in recipe.ingredients:
                ing_name_lower = recipe_ing.name.lower()
                recipe_ing.ingredient_id = ingredient_name_to_id.get(ing_name_lower, 0)

            return recipe

        except Exception as e:
            logger.error("Marvin recipe generation failed: %s", e, exc_info=True)
            raise ValueError(f"Failed to generate recipe: {e}") from e

    async def get_suggestions_ai(self, request: SuggestionRequest) -> list[RecipeSuggestion]:
        """
        Get recipe suggestions using Marvin/OpenAI.

        Combines heuristic matches from database with AI-generated creative options.
        """
        # Get heuristic suggestions first
        heuristic_suggestions = await self.get_suggestions_heuristic(request)

        # Try to generate one AI-powered creative recipe
        ai_suggestions: list[RecipeSuggestion] = []
        try:
            generated_recipe = await self.generate_recipe_with_marvin(
                request.available_ingredients
            )

            # Get ingredient details to calculate match
            ingredients = await self.ingredient_repo.get_by_ids(request.available_ingredients)
            available_names = {ing.name.lower() for ing in ingredients}

            matched_ingredients = [
                ing.name
                for ing in generated_recipe.ingredients
                if ing.name.lower() in available_names
            ]

            missing_ingredients = [
                ing.name
                for ing in generated_recipe.ingredients
                if ing.name.lower() not in available_names
            ]

            match_score = (
                len(matched_ingredients) / len(generated_recipe.ingredients)
                if generated_recipe.ingredients
                else 0
            )

            ai_suggestions.append(
                RecipeSuggestion(
                    recipe_id=None,
                    recipe_name=generated_recipe.name,
                    match_score=match_score,
                    missing_ingredients=missing_ingredients,
                    matched_ingredients=matched_ingredients,
                    reason="AI-generated creative recipe based on your ingredients",
                    is_ai_generated=True,
                    generated_recipe=generated_recipe,
                )
            )
        except Exception as e:
            logger.warning("Failed to generate AI suggestion: %s", e)

        # Combine and limit results
        all_suggestions = ai_suggestions + heuristic_suggestions
        return all_suggestions[: request.max_results]

    async def get_suggestions(
        self, request: SuggestionRequest, use_ai: bool = True
    ) -> tuple[list[RecipeSuggestion], str, bool]:
        """
        Get recipe suggestions with caching.

        Returns: (suggestions, source, cache_hit)
        """
        # Check cache with TTL
        cache_key = self._generate_cache_key(request)
        if cache_key in self._cache:
            cached_suggestions, cached_time = self._cache[cache_key]
            cache_age = time.time() - cached_time

            # Check if cache entry is still valid
            if (
                self.settings.marvin_cache_enabled
                and cache_age < self.settings.marvin_cache_ttl_seconds
            ):
                return cached_suggestions, "heuristic", True
            else:
                # Remove expired entry
                del self._cache[cache_key]

        # Generate suggestions
        try:
            if use_ai:
                suggestions = await self.get_suggestions_ai(request)
                source = "ai"
            else:
                suggestions = await self.get_suggestions_heuristic(request)
                source = "heuristic"
        except Exception as e:
            # Fallback to heuristic on any error
            logger.warning("AI suggestions failed, falling back to heuristic: %s", e)
            suggestions = await self.get_suggestions_heuristic(request)
            source = "heuristic"

        # Cache results if enabled
        if self.settings.marvin_cache_enabled:
            self._cache[cache_key] = (suggestions, time.time())

        return suggestions, source, False
