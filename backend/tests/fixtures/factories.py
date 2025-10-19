"""Test data factories for generating realistic test data.

This module provides factory functions to create test data using Faker
for realistic data generation. These factories are used across unit and
integration tests to create consistent, realistic test scenarios.
"""

from datetime import date, timedelta
from typing import Any

from faker import Faker

fake = Faker()


def ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate random ingredient data.

    Args:
        **overrides: Override default values with specific values.

    Returns:
        Dictionary with ingredient data suitable for IngredientCreate schema.

    Example:
        >>> data = ingredient_factory(name="Custom Tomato")
        >>> data["name"]
        'Custom Tomato'
    """
    defaults = {
        "name": fake.word().capitalize(),
        "storage_location": fake.random_element(["fridge", "cupboard", "pantry"]),
        "quantity": fake.random_int(min=1, max=1000),
        "unit": fake.random_element(["g", "kg", "ml", "l", "piece", "cup"]),
        "expiry_date": fake.date_between(start_date="today", end_date="+30d"),
    }
    return {**defaults, **overrides}


def ingredient_payload_factory(**overrides: Any) -> dict[str, Any]:
    """Generate JSON-serializable ingredient payload data."""
    data = ingredient_factory(**overrides)
    expiry_date = data.get("expiry_date")
    if isinstance(expiry_date, date):
        data["expiry_date"] = expiry_date.isoformat()
    return data


def recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate random recipe data.

    Args:
        **overrides: Override default values with specific values.

    Returns:
        Dictionary with recipe data suitable for RecipeCreate schema.

    Example:
        >>> data = recipe_factory(difficulty="easy")
        >>> data["difficulty"]
        'easy'
    """
    defaults = {
        "name": f"{fake.word()} {fake.word()}".title(),
        "description": fake.sentence(),
        "instructions": fake.paragraph(nb_sentences=5),
        "difficulty": fake.random_element(["easy", "medium", "hard"]),
        "prep_time": fake.random_int(min=5, max=60),
        "cook_time": fake.random_int(min=10, max=180),
        "servings": fake.random_int(min=1, max=12),
    }
    return {**defaults, **overrides}


def recipe_ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate random recipe-ingredient association data.

    Args:
        **overrides: Override default values with specific values.

    Returns:
        Dictionary with recipe-ingredient association data.

    Example:
        >>> data = recipe_ingredient_factory(ingredient_id=1, quantity=500)
        >>> data["quantity"]
        500.0
    """
    defaults = {
        "ingredient_id": fake.random_int(min=1, max=100),
        "quantity": round(fake.random.uniform(0.1, 1000), 2),
        "unit": fake.random_element(["g", "kg", "ml", "l", "cup", "tbsp", "tsp"]),
        "is_optional": fake.boolean(chance_of_getting_true=20),
        "note": fake.sentence() if fake.boolean(chance_of_getting_true=30) else None,
    }
    return {**defaults, **overrides}


def expiring_ingredient_factory(days_until_expiry: int = 7, **overrides: Any) -> dict[str, Any]:
    """Generate ingredient data with specific expiry date.

    Args:
        days_until_expiry: Number of days until ingredient expires.
        **overrides: Override default values.

    Returns:
        Dictionary with ingredient data expiring in specified days.

    Example:
        >>> data = expiring_ingredient_factory(days_until_expiry=3)
        >>> # Ingredient will expire in 3 days
    """
    expiry_date = date.today() + timedelta(days=days_until_expiry)
    return ingredient_factory(
        expiry_date=expiry_date,
        **overrides,
    )


def expired_ingredient_factory(days_expired: int = 3, **overrides: Any) -> dict[str, Any]:
    """Generate expired ingredient data.

    Args:
        days_expired: Number of days since expiry.
        **overrides: Override default values.

    Returns:
        Dictionary with expired ingredient data.

    Example:
        >>> data = expired_ingredient_factory(days_expired=2)
        >>> # Ingredient expired 2 days ago
    """
    expiry_date = date.today() - timedelta(days=days_expired)
    return ingredient_factory(
        expiry_date=expiry_date,
        **overrides,
    )


def batch_ingredient_factory(count: int, **overrides: Any) -> list[dict[str, Any]]:
    """Generate multiple ingredient data items.

    Args:
        count: Number of ingredients to generate.
        **overrides: Override default values for all items.

    Returns:
        List of ingredient data dictionaries.

    Example:
        >>> items = batch_ingredient_factory(5, storage_location="fridge")
        >>> len(items)
        5
    """
    return [ingredient_factory(**overrides) for _ in range(count)]


def batch_recipe_factory(count: int, **overrides: Any) -> list[dict[str, Any]]:
    """Generate multiple recipe data items.

    Args:
        count: Number of recipes to generate.
        **overrides: Override default values for all items.

    Returns:
        List of recipe data dictionaries.

    Example:
        >>> items = batch_recipe_factory(3, difficulty="easy")
        >>> len(items)
        3
    """
    return [recipe_factory(**overrides) for _ in range(count)]


def recipe_with_ingredients_factory(ingredient_count: int = 5, **overrides: Any) -> dict[str, Any]:
    """Generate recipe data with nested ingredients.

    Args:
        ingredient_count: Number of ingredients to include.
        **overrides: Override default recipe values.

    Returns:
        Dictionary with recipe data including ingredients list.

    Example:
        >>> data = recipe_with_ingredients_factory(ingredient_count=3)
        >>> len(data["ingredients"])
        3
    """
    recipe_data = recipe_factory(**overrides)
    ingredients = [recipe_ingredient_factory() for _ in range(ingredient_count)]
    recipe_data["ingredients"] = ingredients
    return recipe_data


# Storage location-specific factories
def fridge_ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate ingredient stored in fridge."""
    return ingredient_factory(storage_location="fridge", **overrides)


def cupboard_ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate ingredient stored in cupboard."""
    return ingredient_factory(storage_location="cupboard", **overrides)


def pantry_ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate ingredient stored in pantry."""
    return ingredient_factory(storage_location="pantry", **overrides)


# Difficulty-specific recipe factories
def easy_recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate easy recipe with short prep/cook times."""
    return recipe_factory(
        difficulty="easy",
        prep_time=fake.random_int(min=5, max=20),
        cook_time=fake.random_int(min=10, max=30),
        **overrides,
    )


def hard_recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate hard recipe with longer prep/cook times."""
    return recipe_factory(
        difficulty="hard",
        prep_time=fake.random_int(min=30, max=60),
        cook_time=fake.random_int(min=60, max=180),
        **overrides,
    )
