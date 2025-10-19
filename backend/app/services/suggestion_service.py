"""Suggestion service for AI-powered recipe recommendations."""

from __future__ import annotations

import hashlib
import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import IngredientRepository, RecipeRepository
from app.schemas import RecipeSuggestion, SuggestionRequest


class SuggestionService:
    """Service for generating recipe suggestions."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize service with database session."""
        self.recipe_repo = RecipeRepository(session)
        self.ingredient_repo = IngredientRepository(session)
        self._cache: dict[str, tuple[list[RecipeSuggestion], float]] = {}

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
                )
            )

        # Sort by match score and limit results
        suggestions.sort(key=lambda x: x.match_score, reverse=True)
        return suggestions[: request.max_results]

    async def get_suggestions_ai(self, request: SuggestionRequest) -> list[RecipeSuggestion]:
        """
        Get recipe suggestions using Marvin/OpenAI.

        TODO: Implement actual AI integration with Marvin.
        For now, falls back to heuristic method.
        """
        # Placeholder for AI integration
        # This would use Marvin to generate creative suggestions
        # For now, use heuristic fallback
        return await self.get_suggestions_heuristic(request)

    async def get_suggestions(
        self, request: SuggestionRequest, use_ai: bool = True
    ) -> tuple[list[RecipeSuggestion], str, bool]:
        """
        Get recipe suggestions with caching.

        Returns: (suggestions, source, cache_hit)
        """
        # Check cache
        cache_key = self._generate_cache_key(request)
        if cache_key in self._cache:
            cached_suggestions, _timestamp = self._cache[cache_key]
            # TODO: Check TTL and expire old entries
            return cached_suggestions, "heuristic", True

        # Generate suggestions
        try:
            if use_ai:
                suggestions = await self.get_suggestions_ai(request)
                source = "ai"
            else:
                suggestions = await self.get_suggestions_heuristic(request)
                source = "heuristic"
        except Exception:
            # Fallback to heuristic on any error
            suggestions = await self.get_suggestions_heuristic(request)
            source = "heuristic"

        # Cache results
        import time

        self._cache[cache_key] = (suggestions, time.time())

        return suggestions, source, False
