"""Unit tests for SuggestionService with Marvin integration."""

from __future__ import annotations

import time
from decimal import Decimal
from unittest.mock import AsyncMock, Mock, patch

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Ingredient
from app.schemas import GeneratedRecipe, GeneratedRecipeIngredient, RecipeSuggestion, SuggestionRequest
from app.services.suggestion_service import SuggestionService


@pytest.fixture
def mock_ingredients():
    """Create mock ingredients for testing."""
    return [
        Ingredient(id=1, name="Tomato", quantity=Decimal("500"), storage_location="Fridge"),
        Ingredient(id=2, name="Basil", quantity=Decimal("50"), storage_location="Fridge"),
        Ingredient(id=3, name="Mozzarella", quantity=Decimal("200"), storage_location="Fridge"),
    ]


@pytest.fixture
def mock_generated_recipe():
    """Create a mock generated recipe for testing."""
    return GeneratedRecipe(
        name="Caprese Salad",
        description="A fresh Italian salad with tomatoes, mozzarella, and basil",
        instructions="1. Slice tomatoes and mozzarella\n2. Arrange with basil\n3. Drizzle with olive oil",
        ingredients=[
            GeneratedRecipeIngredient(
                name="Tomato",
                quantity=2.0,
                unit="whole",
                ingredient_id=1,
            ),
            GeneratedRecipeIngredient(
                name="Mozzarella",
                quantity=200.0,
                unit="g",
                ingredient_id=3,
            ),
            GeneratedRecipeIngredient(
                name="Basil",
                quantity=10.0,
                unit="leaves",
                ingredient_id=2,
            ),
        ],
        prep_time_minutes=10,
        cook_time_minutes=None,  # None for no cook time (salad)
        servings=2,
        difficulty="easy",
    )


@pytest.fixture
def suggestion_service(db_session: AsyncSession):
    """Create a SuggestionService instance for testing."""
    return SuggestionService(db_session)


class TestSuggestionServiceInit:
    """Test SuggestionService initialization."""

    async def test_init_creates_cache(self, suggestion_service):
        """Should initialize with empty cache."""
        assert suggestion_service._cache == {}
        assert suggestion_service._marvin_configured is False

    async def test_init_creates_repositories(self, suggestion_service):
        """Should create ingredient and recipe repositories."""
        assert suggestion_service.ingredient_repo is not None
        assert suggestion_service.recipe_repo is not None


class TestCacheKeyGeneration:
    """Test cache key generation logic."""

    async def test_generate_cache_key_consistent(self, suggestion_service):
        """Should generate same key for same request parameters."""
        request1 = SuggestionRequest(
            available_ingredients=[1, 2, 3],
            max_prep_time=30,
            max_cook_time=60,
            difficulty="easy",
            dietary_restrictions=["vegetarian"],
        )
        request2 = SuggestionRequest(
            available_ingredients=[1, 2, 3],
            max_prep_time=30,
            max_cook_time=60,
            difficulty="easy",
            dietary_restrictions=["vegetarian"],
        )

        key1 = suggestion_service._generate_cache_key(request1)
        key2 = suggestion_service._generate_cache_key(request2)

        assert key1 == key2

    async def test_generate_cache_key_order_independent(self, suggestion_service):
        """Should generate same key regardless of ingredient order."""
        request1 = SuggestionRequest(available_ingredients=[1, 2, 3])
        request2 = SuggestionRequest(available_ingredients=[3, 2, 1])

        key1 = suggestion_service._generate_cache_key(request1)
        key2 = suggestion_service._generate_cache_key(request2)

        assert key1 == key2

    async def test_generate_cache_key_different_params(self, suggestion_service):
        """Should generate different keys for different parameters."""
        request1 = SuggestionRequest(available_ingredients=[1, 2, 3])
        request2 = SuggestionRequest(available_ingredients=[1, 2, 4])

        key1 = suggestion_service._generate_cache_key(request1)
        key2 = suggestion_service._generate_cache_key(request2)

        assert key1 != key2


class TestMarvinConfiguration:
    """Test Marvin configuration logic."""

    async def test_ensure_marvin_configured_success(self, suggestion_service):
        """Should configure Marvin successfully."""
        with patch("app.services.suggestion_service.configure_marvin") as mock_configure:
            suggestion_service._ensure_marvin_configured()

            mock_configure.assert_called_once()
            assert suggestion_service._marvin_configured is True

    async def test_ensure_marvin_configured_only_once(self, suggestion_service):
        """Should only configure Marvin once."""
        with patch("app.services.suggestion_service.configure_marvin") as mock_configure:
            suggestion_service._ensure_marvin_configured()
            suggestion_service._ensure_marvin_configured()

            mock_configure.assert_called_once()

    async def test_ensure_marvin_configured_failure(self, suggestion_service):
        """Should raise error when Marvin configuration fails."""
        with patch(
            "app.services.suggestion_service.configure_marvin",
            side_effect=ValueError("API key not set"),
        ):
            with pytest.raises(ValueError, match="API key not set"):
                suggestion_service._ensure_marvin_configured()

            assert suggestion_service._marvin_configured is False


class TestGenerateRecipeWithMarvin:
    """Test Marvin AI recipe generation."""

    async def test_generate_recipe_success(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should generate recipe successfully with valid ingredients."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                # Setup mock to return our generated recipe
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return mock_generated_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                result = await suggestion_service.generate_recipe_with_marvin([1, 2, 3])

                assert result.name == "Caprese Salad"
                assert len(result.ingredients) == 3
                assert result.difficulty == "easy"

    async def test_generate_recipe_no_ingredients(self, suggestion_service):
        """Should raise error when no ingredients provided."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=[])

        with patch("app.services.suggestion_service.configure_marvin"):
            with pytest.raises(ValueError, match="At least one ingredient is required"):
                await suggestion_service.generate_recipe_with_marvin([])

    async def test_generate_recipe_validates_ingredient_usage(
        self, suggestion_service, mock_ingredients
    ):
        """Should validate that generated recipe uses requested ingredients."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)

        # Create recipe with ingredients NOT in the available list
        bad_recipe = GeneratedRecipe(
            name="Pizza",
            description="Test",
            instructions="Test",
            ingredients=[
                GeneratedRecipeIngredient(name="Flour", quantity=500.0, unit="g", ingredient_id=0),
                GeneratedRecipeIngredient(name="Yeast", quantity=10.0, unit="g", ingredient_id=0),
            ],
            prep_time_minutes=10,
            cook_time_minutes=20,
            servings=4,
        )

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                # Create a callable that returns bad_recipe
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return bad_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                with pytest.raises(ValueError, match="must use at least one requested ingredient"):
                    await suggestion_service.generate_recipe_with_marvin([1, 2, 3])

    async def test_generate_recipe_marvin_api_error(self, suggestion_service, mock_ingredients):
        """Should handle Marvin API errors gracefully."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        raise Exception("API rate limit exceeded")
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                with pytest.raises(ValueError, match="Failed to generate recipe"):
                    await suggestion_service.generate_recipe_with_marvin([1, 2, 3])

    async def test_generate_recipe_maps_ingredient_ids(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should map ingredient names to IDs correctly."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return mock_generated_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                result = await suggestion_service.generate_recipe_with_marvin([1, 2, 3])

                # Check that ingredient IDs are mapped
                for ing in result.ingredients:
                    assert ing.ingredient_id > 0


class TestGetSuggestionsAI:
    """Test AI-powered suggestion generation."""

    async def test_get_suggestions_ai_cache_miss(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should generate new suggestion on cache miss."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return mock_generated_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                request = SuggestionRequest(available_ingredients=[1, 2, 3], max_results=5)
                suggestions = await suggestion_service.get_suggestions_ai(request)

                assert len(suggestions) > 0
                assert suggestions[0].is_ai_generated is True
                assert suggestions[0].generated_recipe is not None
                assert suggestions[0].recipe_id is None

    async def test_get_suggestions_ai_cache_hit(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should return cached suggestion on cache hit (via get_suggestions wrapper)."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)
        suggestion_service.recipe_repo.get_recipes_with_ingredients = AsyncMock(return_value=[])

        call_count = 0
        
        def create_recipe_wrapper(func):
            def inner(*args, **kwargs):
                nonlocal call_count
                call_count += 1
                return mock_generated_recipe
            return inner

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                mock_marvin_fn.side_effect = create_recipe_wrapper

                request = SuggestionRequest(available_ingredients=[1, 2, 3], max_results=5)

                # First call - cache miss
                suggestions1, source1, cache_hit1 = await suggestion_service.get_suggestions(request)

                # Second call - should hit cache
                suggestions2, source2, cache_hit2 = await suggestion_service.get_suggestions(request)

                assert cache_hit1 is False
                assert cache_hit2 is True
                # Marvin should only be called once
                assert call_count == 1

    async def test_get_suggestions_ai_cache_ttl_expired(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should regenerate when cache TTL expires (via get_suggestions wrapper)."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)
        suggestion_service.recipe_repo.get_recipes_with_ingredients = AsyncMock(return_value=[])

        call_count = 0
        
        def create_recipe_wrapper(func):
            def inner(*args, **kwargs):
                nonlocal call_count
                call_count += 1
                return mock_generated_recipe
            return inner

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                mock_marvin_fn.side_effect = create_recipe_wrapper

                request = SuggestionRequest(available_ingredients=[1, 2, 3], max_results=5)

                # First call
                await suggestion_service.get_suggestions(request)

                # Manually expire the cache
                cache_key = suggestion_service._generate_cache_key(request)
                if cache_key in suggestion_service._cache:
                    cached_suggestions, _ = suggestion_service._cache[cache_key]
                    # Set cache time to past (expired)
                    suggestion_service._cache[cache_key] = (
                        cached_suggestions,
                        time.time() - suggestion_service.settings.marvin_cache_ttl_seconds - 1,
                    )

                # Second call - cache expired, should regenerate
                _, _, cache_hit = await suggestion_service.get_suggestions(request)

                assert cache_hit is False
                # Marvin should be called twice
                assert call_count == 2

    async def test_get_suggestions_ai_fallback_on_error(
        self, suggestion_service, mock_ingredients
    ):
        """Should fallback to heuristic when Marvin fails."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)
        suggestion_service.get_suggestions_heuristic = AsyncMock(
            return_value=[
                RecipeSuggestion(
                    recipe_id=1,
                    recipe_name="Fallback Recipe",
                    match_score=0.8,
                    missing_ingredients=[],
                    matched_ingredients=["Tomato", "Basil"],
                    reason="Fallback logic",
                    is_ai_generated=False,
                    generated_recipe=None,
                )
            ]
        )

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                mock_fn = Mock(side_effect=Exception("Marvin error"))
                mock_marvin_fn.return_value = lambda func: mock_fn

                request = SuggestionRequest(available_ingredients=[1, 2, 3], max_results=5)
                suggestions = await suggestion_service.get_suggestions_ai(request)

                # Should return heuristic suggestions
                assert len(suggestions) > 0
                assert suggestions[0].is_ai_generated is False
                suggestion_service.get_suggestions_heuristic.assert_called_once()


class TestGetSuggestionsHeuristic:
    """Test heuristic suggestion logic (fallback)."""

    async def test_get_suggestions_heuristic_basic(self, suggestion_service):
        """Should generate suggestions using heuristic logic."""
        # This is a basic test - more detailed tests exist in integration tests
        request = SuggestionRequest(available_ingredients=[1, 2], max_results=5)

        # Mock repository methods
        suggestion_service.recipe_repo.get_recipes_with_ingredients = AsyncMock(return_value=[])
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=[])

        suggestions = await suggestion_service.get_suggestions_heuristic(request)

        # Should not crash, return empty list when no recipes
        assert isinstance(suggestions, list)


class TestCacheBehavior:
    """Test caching behavior in detail."""

    async def test_cache_stores_timestamp(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should store timestamp with cached suggestions."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)
        suggestion_service.recipe_repo.get_recipes_with_ingredients = AsyncMock(return_value=[])

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return mock_generated_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                request = SuggestionRequest(available_ingredients=[1, 2, 3], max_results=5)
                cache_key = suggestion_service._generate_cache_key(request)

                before_time = time.time()
                await suggestion_service.get_suggestions(request)
                after_time = time.time()

                # Check cache entry exists with timestamp
                assert cache_key in suggestion_service._cache
                suggestions, timestamp = suggestion_service._cache[cache_key]
                assert before_time <= timestamp <= after_time

    async def test_cache_different_requests(
        self, suggestion_service, mock_ingredients, mock_generated_recipe
    ):
        """Should cache different requests separately."""
        suggestion_service.ingredient_repo.get_by_ids = AsyncMock(return_value=mock_ingredients)
        suggestion_service.recipe_repo.get_recipes_with_ingredients = AsyncMock(return_value=[])

        with patch("app.services.suggestion_service.configure_marvin"):
            with patch("marvin.fn") as mock_marvin_fn:
                def create_recipe_wrapper(func):
                    def inner(*args, **kwargs):
                        return mock_generated_recipe
                    return inner
                
                mock_marvin_fn.side_effect = create_recipe_wrapper

                request1 = SuggestionRequest(available_ingredients=[1, 2], max_results=5)
                request2 = SuggestionRequest(available_ingredients=[2, 3], max_results=5)

                await suggestion_service.get_suggestions(request1)
                await suggestion_service.get_suggestions(request2)

                # Should have 2 cache entries
                assert len(suggestion_service._cache) == 2
