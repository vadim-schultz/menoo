"""Core Recipe model - comprehensive recipe schema with all fields and sub-models.

This definitive Recipe model is used for both partial (draft) and complete (populated) recipes.
All fields are optional or have defaults to allow partial population.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_serializer

from app.enums import (
    AllergenType,
    CookingMethod,
    CuisineType,
    DietaryRequirement,
    MechanicalTreatment,
    MealType,
    StorageType,
    TemperatureLevel,
    ThermalTreatment,
)


# ============================================================================
# Supporting Sub-Models
# ============================================================================


class Marination(BaseModel):
    """Marination specification."""

    duration_minutes: int | None = Field(None, ge=0, description="Marination duration in minutes")
    temperature: Literal["room_temperature", "refrigerated"] = Field(
        default="refrigerated",
        description="Marination temperature",
    )
    marinade_recipe: "Recipe | None" = Field(
        None, description="Nested recipe definition for the marinade"
    )
    description: str | None = Field(None, description="Marinade description")


class Seasoning(BaseModel):
    """Seasoning information."""

    timing: Literal["before_cooking", "during_cooking", "after_cooking"] = Field(
        default="during_cooking",
        description="When seasoning is applied",
    )
    spices: list[int] | None = Field(None, description="Spice ingredient IDs")
    herbs: list[int] | None = Field(None, description="Herb ingredient IDs")
    description: str | None = Field(None, description="Seasoning description")


class Brining(BaseModel):
    """Brining specification."""

    duration_minutes: int | None = Field(None, ge=0, description="Brining duration")
    salt_concentration: Decimal | None = Field(
        None, ge=0, le=100, description="Salt concentration percentage"
    )
    temperature: Literal["room_temperature", "refrigerated"] = Field(
        default="refrigerated",
        description="Brining temperature",
    )

    @field_serializer("salt_concentration", when_used="json")
    def serialize_concentration(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None


class ThermalTreatmentSpec(BaseModel):
    """Specification for a thermal treatment."""

    method: ThermalTreatment = Field(..., description="Thermal treatment method")
    temperature_celsius: float | None = Field(None, ge=0, description="Specific temperature in Celsius")
    temperature_level: TemperatureLevel | None = Field(
        None, description="Temperature level if specific temp not provided"
    )
    duration_minutes: int | None = Field(None, ge=0, description="Duration of thermal treatment")
    internal_temperature_target: float | None = Field(
        None, ge=0, description="Target internal temperature (for meats, etc.)"
    )
    notes: str | None = Field(None, description="Additional notes")


class IngredientPreparation(BaseModel):
    """Complete preparation specification for an ingredient in a recipe."""

    ingredient_id: int = Field(..., description="Ingredient ID")
    quantity: Decimal = Field(..., gt=0, description="Quantity required")
    unit: str = Field(..., max_length=50, description="Unit of measurement")
    is_optional: bool = Field(default=False, description="Whether ingredient is optional")

    mechanical_treatments: list[MechanicalTreatment] = Field(
        default_factory=list,
        description="List of mechanical treatments applied",
    )
    size_specification: str | None = Field(
        None,
        max_length=50,
        description="Size specification (e.g., '1 inch cubes', 'thinly sliced')",
    )

    thermal_treatments: list[ThermalTreatmentSpec] = Field(
        default_factory=list,
        description="List of thermal treatments in sequence",
    )

    marination: Marination | None = Field(None, description="Marination specification")
    brining: Brining | None = Field(None, description="Brining specification")
    seasoning: Seasoning | None = Field(None, description="Seasoning specification")

    preparation_steps: list[str] = Field(
        default_factory=list,
        description="Additional preparation steps (washing, peeling, etc.)",
    )
    resting_time_minutes: int | None = Field(
        None,
        ge=0,
        description="Resting time after preparation, before use",
    )
    temperature_before_use: Literal["room_temperature", "chilled", "warm"] | None = Field(
        None,
        description="Temperature state before use",
    )

    notes: str | None = Field(None, max_length=500, description="Additional notes")
    order_in_recipe: int | None = Field(
        None,
        ge=1,
        description="Order in which this ingredient is prepared (if sequential)",
    )

    @field_serializer("quantity", when_used="json")
    def serialize_quantity(self, value: Decimal) -> float:
        return float(value)


class NutritionInfo(BaseModel):
    """Nutritional information per serving."""

    calories: float | None = Field(None, ge=0, description="Calories per serving")
    protein_grams: float | None = Field(None, ge=0, description="Protein in grams")
    carbohydrates_grams: float | None = Field(None, ge=0, description="Carbs in grams")
    fat_grams: float | None = Field(None, ge=0, description="Fat in grams")
    saturated_fat_grams: float | None = Field(None, ge=0, description="Saturated fat")
    fiber_grams: float | None = Field(None, ge=0, description="Fiber in grams")
    sugar_grams: float | None = Field(None, ge=0, description="Sugar in grams")
    sodium_mg: float | None = Field(None, ge=0, description="Sodium in milligrams")


class EquipmentRequirement(BaseModel):
    """Equipment needed for the recipe."""

    name: str = Field(..., max_length=100, description="Equipment name")
    is_essential: bool = Field(
        default=True,
        description="Whether equipment is essential or optional",
    )
    notes: str | None = Field(None, description="Equipment-specific notes")


class DifficultyMetrics(BaseModel):
    """Objective difficulty metrics."""

    technical_complexity_score: int | None = Field(
        None, ge=1, le=10, description="Complexity based on techniques used (1-10)"
    )
    step_count: int | None = Field(None, ge=1, description="Total number of steps")
    specialized_equipment_count: int | None = Field(
        None, ge=0, description="Number of specialized equipment items needed"
    )
    parallel_processes: int | None = Field(
        None, ge=0, description="Number of parallel processes requiring attention"
    )
    precision_required: Literal["low", "medium", "high"] | None = Field(
        None, description="Level of precision required"
    )


class RecipeTiming(BaseModel):
    """Complete timing breakdown."""

    prep_time_minutes: int | None = Field(None, ge=0, description="Active preparation time")
    cook_time_minutes: int | None = Field(None, ge=0, description="Active cooking time")
    marinating_time_minutes: int | None = Field(
        None, ge=0, description="Marinating time (inactive)"
    )
    resting_time_minutes: int | None = Field(
        None, ge=0, description="Resting time after cooking (inactive)"
    )
    inactive_time_minutes: int | None = Field(None, ge=0, description="Total inactive time")
    total_active_time_minutes: int | None = Field(
        None, ge=0, description="Total active time (prep + cook)"
    )

    @property
    def total_time_minutes(self) -> int | None:
        """Calculate total time including inactive periods."""
        if self.total_active_time_minutes is not None:
            inactive = self.inactive_time_minutes or 0
            return self.total_active_time_minutes + inactive
        return None


class StorageInstructions(BaseModel):
    """Storage information for finished dish."""

    storage_type: StorageType | None = Field(None, description="Storage method")
    shelf_life_days: int | None = Field(None, ge=0, description="How long the dish keeps")
    reheating_instructions: str | None = Field(
        None, description="Best method to reheat"
    )
    freezing_instructions: str | None = Field(
        None, description="Freezing instructions if applicable"
    )


# ============================================================================
# Definitive Recipe Model
# ============================================================================


class Recipe(BaseModel):
    """Definitive Recipe model with all comprehensive fields.
    
    This single model is used for both partial (draft) and complete (populated) recipes.
    All fields are optional or have defaults to allow partial population.
    
    Used for:
    - Draft recipes (partial data before AI completion)
    - Completed recipes (fully populated by Marvin or user)
    - Request payloads (with REST-specific wrappers)
    - Response payloads (with REST-specific wrappers)
    """

    # Core recipe information (optional to allow partial input)
    name: str | None = Field(None, min_length=1, max_length=200, description="Recipe name")
    description: str | None = Field(None, description="Recipe description")
    instructions: str | None = Field(None, min_length=1, description="Cooking instructions")
    author: str | None = Field(None, max_length=100, description="Recipe author/creator")
    source: str | None = Field(None, max_length=200, description="Source/attribution")

    # Classification
    cuisine_types: list[CuisineType] = Field(
        default_factory=list, description="Cuisine classifications"
    )
    meal_types: list[MealType] = Field(
        default_factory=list, description="Meal type classifications"
    )
    cooking_method: CookingMethod | None = Field(
        None, description="Overall cooking method"
    )

    # Dietary information
    dietary_requirements: list[DietaryRequirement] = Field(
        default_factory=list,
        description="Dietary classifications",
    )
    contains_allergens: list[AllergenType] = Field(
        default_factory=list,
        description="Allergens present in the recipe",
    )
    allergen_warnings: str | None = Field(
        None, description="Cross-contamination or other allergen warnings"
    )

    # Timing (always has default to allow partial)
    timing: RecipeTiming = Field(
        default_factory=RecipeTiming,
        description="Complete timing breakdown",
    )

    # Difficulty
    difficulty_metrics: DifficultyMetrics | None = Field(
        None, description="Objective difficulty metrics"
    )

    # Servings and yield
    servings: int | None = Field(None, gt=0, description="Number of servings")
    yield_description: str | None = Field(
        None,
        max_length=100,
        description="Yield description (e.g., 'makes 24 cookies')",
    )

    # Equipment and cooking
    equipment_requirements: list[EquipmentRequirement] = Field(
        default_factory=list,
        description="Equipment needed",
    )
    oven_temperature_celsius: float | None = Field(
        None, ge=0, description="Oven temperature if applicable"
    )
    oven_settings: str | None = Field(
        None, description="Oven settings (convection, top rack, etc.)"
    )

    # Nutrition
    nutrition_info: NutritionInfo | None = Field(
        None, description="Nutritional information per serving"
    )

    # Storage
    storage_instructions: StorageInstructions | None = Field(
        None, description="Storage instructions for finished dish"
    )

    # Additional information
    tags: list[str] = Field(default_factory=list, description="Searchable tags")
    notes: str | None = Field(None, description="Additional notes")
    variations: str | None = Field(
        None, description="Recipe variations or substitutions"
    )
    estimated_cost_per_serving: Decimal | None = Field(
        None, ge=0, description="Estimated cost per serving"
    )
    seasonality: list[str] | None = Field(
        None, description="Best seasons for this recipe (e.g., ['spring', 'summer'])"
    )

    # Ingredients
    ingredients: list[IngredientPreparation] = Field(
        default_factory=list,
        description="List of ingredients with preparation specifications",
    )

    @field_serializer("estimated_cost_per_serving", when_used="json")
    def serialize_cost(self, value: Decimal | None) -> float | None:
        return float(value) if value is not None else None


# Resolve forward references for recursive models
Recipe.model_rebuild()
Marination.model_rebuild()

