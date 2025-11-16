"""Test data factories for generating realistic test data.

This module provides factory functions to create test data using Faker
for realistic data generation. These factories are used across unit and
integration tests to create consistent, realistic test scenarios.
"""

from datetime import date, timedelta
from decimal import Decimal
from typing import Any

from faker import Faker

from app.enums import (
    AllergenType,
    CookingMethod,
    CuisineType,
    DietaryRequirement,
    IngredientCategory,
    MealType,
    MechanicalTreatment,
    StorageType,
    TemperatureLevel,
    ThermalTreatment,
)

fake = Faker()


def ingredient_factory(**overrides: Any) -> dict[str, Any]:
    """Generate random ingredient data.

    Args:
        **overrides: Override default values with specific values.

    Returns:
        Dictionary with ingredient data suitable for core Ingredient schema.

    Example:
        >>> data = ingredient_factory(name="Custom Tomato")
        >>> data["name"]
        'Custom Tomato'
    """
    defaults = {
        "name": fake.word().capitalize(),
        "category": fake.random_element(list(IngredientCategory)).value,
        "storage_location": fake.random_element(["fridge", "cupboard", "pantry", "counter"]),
        "quantity": Decimal(str(round(fake.random.uniform(10, 1000), 2))),
        "unit": fake.random_element(["g", "kg", "ml", "l", "cup", "tbsp", "tsp"]),
        "expiry_date": fake.date_between(start_date="today", end_date="+30d"),
        "notes": fake.sentence(nb_words=6) if fake.boolean(chance_of_getting_true=25) else None,
    }
    return {**defaults, **overrides}


def ingredient_payload_factory(**overrides: Any) -> dict[str, Any]:
    """Generate JSON-serializable ingredient payload data."""
    data = ingredient_factory(**overrides)
    expiry_date = data.get("expiry_date")
    quantity = data.get("quantity")
    if isinstance(quantity, Decimal):
        data["quantity"] = float(quantity)
    if isinstance(expiry_date, date):
        data["expiry_date"] = expiry_date.isoformat()
    return data


def recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate random recipe data.

    Args:
        **overrides: Override default values with specific values.

    Returns:
        Dictionary with recipe data suitable for Recipe schema.

    Example:
        >>> data = recipe_factory(difficulty="easy")
        >>> data["difficulty"]
        'easy'
    """
    prep_time = fake.random_int(min=5, max=60)
    cook_time = fake.random_int(min=10, max=120)
    total_active = prep_time + cook_time
    defaults = {
        "name": f"{fake.word()} {fake.word()}".title(),
        "description": fake.sentence(),
        "instructions": fake.paragraph(nb_sentences=5),
        "author": fake.name(),
        "source": fake.url(),
        "cuisine_types": [fake.random_element(list(CuisineType)).value],
        "meal_types": [fake.random_element(list(MealType)).value],
        "cooking_method": fake.random_element(list(CookingMethod)).value,
        "dietary_requirements": [
            fake.random_element(list(DietaryRequirement)).value
            for _ in range(fake.random_int(min=0, max=2))
        ],
        "contains_allergens": [
            fake.random_element(list(AllergenType)).value
            for _ in range(fake.random_int(min=0, max=1))
        ],
        "allergen_warnings": fake.sentence() if fake.boolean(chance_of_getting_true=20) else None,
        "timing": {
            "prep_time_minutes": prep_time,
            "cook_time_minutes": cook_time,
            "total_active_time_minutes": total_active,
        },
        "difficulty_metrics": {
            "technical_complexity_score": fake.random_int(min=1, max=10),
            "step_count": fake.random_int(min=1, max=20),
        },
        "servings": fake.random_int(min=1, max=12),
        "yield_description": fake.sentence(nb_words=4),
        "equipment_requirements": [
            {
                "name": fake.random_element(["Mixing Bowl", "Saucepan", "Skillet"]),
                "is_essential": True,
                "notes": None,
            }
        ],
        "oven_temperature_celsius": round(fake.random.uniform(160, 220), 1),
        "oven_settings": fake.random_element(["convection", "conventional", "fan"]),
        "nutrition_info": {
            "calories": round(fake.random.uniform(200, 800), 1),
            "protein_grams": round(fake.random.uniform(5, 40), 1),
        },
        "storage_instructions": {
            "storage_type": StorageType.REFRIGERATE.value,
            "shelf_life_days": fake.random_int(min=1, max=5),
        },
        "tags": [fake.word() for _ in range(2)],
        "notes": fake.sentence(nb_words=6),
        "variations": fake.sentence(nb_words=6),
        "estimated_cost_per_serving": Decimal(str(round(fake.random.uniform(1, 15), 2))),
        "seasonality": [fake.random_element(["spring", "summer", "autumn", "winter"])],
        "ingredients": [],
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
        "quantity": Decimal(str(round(fake.random.uniform(5, 500), 2))),
        "unit": fake.random_element(["g", "kg", "ml", "l", "cup", "tbsp", "tsp"]),
        "is_optional": fake.boolean(chance_of_getting_true=20),
        "mechanical_treatments": [fake.random_element(list(MechanicalTreatment)).value],
        "size_specification": None,
        "thermal_treatments": [
            {
                "method": fake.random_element(list(ThermalTreatment)).value,
                "temperature_level": fake.random_element(list(TemperatureLevel)).value,
                "duration_minutes": fake.random_int(min=1, max=30),
            }
        ],
        "marination": None,
        "brining": None,
        "seasoning": None,
        "preparation_steps": [fake.sentence(nb_words=5)],
        "resting_time_minutes": fake.random_int(min=0, max=15),
        "temperature_before_use": fake.random_element(["room_temperature", "chilled", "warm"]),
        "notes": fake.sentence() if fake.boolean(chance_of_getting_true=30) else None,
        "order_in_recipe": fake.random_int(min=1, max=5),
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


# Difficulty-specific recipe factories (based on timing and metrics)
def easy_recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate easy recipe with short prep/cook times."""
    prep_time = fake.random_int(min=5, max=20)
    cook_time = fake.random_int(min=10, max=30)
    return recipe_factory(
        timing={
            "prep_time_minutes": prep_time,
            "cook_time_minutes": cook_time,
            "total_active_time_minutes": prep_time + cook_time,
        },
        difficulty_metrics={
            "technical_complexity_score": 2,
            "step_count": fake.random_int(min=3, max=6),
        },
        **overrides,
    )


def hard_recipe_factory(**overrides: Any) -> dict[str, Any]:
    """Generate hard recipe with longer prep/cook times."""
    prep_time = fake.random_int(min=30, max=60)
    cook_time = fake.random_int(min=60, max=120)
    return recipe_factory(
        timing={
            "prep_time_minutes": prep_time,
            "cook_time_minutes": cook_time,
            "total_active_time_minutes": prep_time + cook_time,
        },
        difficulty_metrics={
            "technical_complexity_score": 8,
            "step_count": fake.random_int(min=10, max=20),
        },
        **overrides,
    )
