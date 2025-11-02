# Comprehensive Recipe Model Hierarchy

This document describes a complete Pydantic model hierarchy for representing recipes, ingredients, and their preparation methods.

## Table of Contents

1. [Ingredient Preparation](#ingredient-preparation)
2. [Recipe Properties](#recipe-properties)
3. [Model Definitions](#model-definitions)
4. [Design Decisions](#design-decisions)
5. [Open Questions](#open-questions)

---

## Ingredient Preparation

Each ingredient in a recipe has multiple preparation dimensions:

### Mechanical Treatments
Physical transformations of ingredients:
- **Cutting techniques**: slicing, chopping, dicing, mincing, julienning, brunoise, chiffonade, etc.
- **Size specifications**: coarse, medium, fine, minced
- **Shape requirements**: cubes, strips, rounds, wedges
- **Processing**: crushing, grinding, pounding, pureeing, blending, shredding, grating

### Thermal Treatments
Cooking methods applied to ingredients:
- **Moist heat**: boiling, steaming, poaching, simmering, braising
- **Dry heat**: roasting, baking, broiling, grilling
- **Fat-based**: frying (deep/shallow), sautéing, pan-frying, stir-frying
- **Specialized**: sous vide, confit, smoking
- **Temperature ranges**: low, medium, high (with specific temperatures if applicable)
- **Duration**: time under each thermal treatment

### Marination & Seasoning
- **Marination**: duration, marinade composition, temperature (room temp vs. refrigerated)
- **Seasoning timing**: before cooking, during cooking, after cooking (finishing)
- **Brining**: duration, salt concentration
- **Dry rubs**: spice blend composition, application time

### Other Preparation
- **Preparation steps**: washing, peeling, trimming, deveining, deboning
- **Resting time**: letting ingredients rest before/after preparation
- **Temperature treatment**: bringing to room temperature, chilling

---

## Recipe Properties

### Basic Information
- Name, description, instructions
- Author/creator, source/attribution
- Version/history tracking

### Classification

#### Cuisine Types
Italian, Indian, Japanese, Chinese, French, Mexican, Thai, Mediterranean, American, Middle Eastern, Korean, Vietnamese, Greek, Spanish, etc.

#### Meal Types
Breakfast, brunch, lunch, dinner, snack, appetizer, side dish, main course, dessert, beverage

#### Cooking Methods (Recipe-Level)
These apply to the entire dish:
- Soup, stew, casserole, braise, roast, bake, grill, stir-fry, sauté, deep-fry, steam, poach, sous vide, slow-cook, pressure-cook, etc.

### Dietary & Health

#### Dietary Requirements
- Vegetarian, vegan, pescatarian
- Gluten-free, dairy-free, nut-free, soy-free, egg-free
- Kosher, halal
- Low-carb, keto, paleo, whole30
- Low-sodium, low-fat, low-calorie

#### Allergen Information
- Contains: nuts, dairy, shellfish, eggs, soy, wheat, etc.
- Cross-contamination warnings

### Timing

#### Time Breakdown
- **Prep time**: Active preparation time (mechanical treatments, chopping, etc.)
- **Cook time**: Active cooking time (thermal treatments)
- **Marinating time**: Time for marination (usually inactive)
- **Resting time**: Time for dishes to rest after cooking (often passive)
- **Total time**: Sum of all active times
- **Inactive time**: Time where no action is needed

#### Time Complexity
Prep time and cook time can be broken down by:
- Complexity of mechanical treatments
- Number of steps requiring attention
- Multi-stage cooking processes

### Difficulty Assessment

Difficulty can be **objective** based on:
- **Technical complexity**: Number of distinct techniques used
- **Step count**: Total number of preparation steps
- **Equipment complexity**: Specialized equipment required
- **Multi-tasking**: Parallel processes requiring attention
- **Precision requirements**: Temperature accuracy, timing precision
- **Skill prerequisites**: Knife skills, temperature control, etc.

Or it can remain **subjective** as a single field (easy/medium/hard).

### Nutritional Information
- Calories per serving
- Macronutrients: protein, carbs, fats (with saturated/unsaturated breakdown)
- Micronutrients: vitamins, minerals
- Fiber, sugar, sodium content

### Equipment Requirements
- **Basic**: knife, cutting board, pots, pans, bowls
- **Specialized**: stand mixer, food processor, immersion circulator, pressure cooker, etc.
- **Oven settings**: temperature, convection vs. conventional
- **Stovetop requirements**: number of burners needed

### Yield & Servings
- Number of servings
- Total yield (e.g., "makes 24 cookies")
- Scaling factor support (2x, 0.5x recipe)

### Storage & Shelf Life
- **Storage instructions**: refrigerate, freeze, room temperature
- **Shelf life**: how long the finished dish keeps
- **Reheating instructions**: best method to reheat

### Cost & Sourcing
- Estimated cost per serving
- Ingredient availability (common vs. specialty)
- Seasonal availability

### Metadata
- Rating/quality scores
- Popularity metrics
- Tags for searchability
- Notes and variations
- Related recipes

---

## Model Definitions

```python
from enum import Enum
from typing import Optional, List, Literal
from decimal import Decimal
from datetime import date, datetime, timedelta
from pydantic import BaseModel, Field, ConfigDict

# ============================================================================
# Enumerations
# ============================================================================

class MechanicalTreatment(str, Enum):
    """Mechanical preparation methods."""
    SLICE = "slice"
    CHOP = "chop"
    DICE = "dice"
    MINCE = "mince"
    JULIENNE = "julienne"
    BRUNOISE = "brunoise"
    CHIFFONADE = "chiffonade"
    CRUSH = "crush"
    GRIND = "grind"
    POUND = "pound"
    PUREE = "puree"
    BLEND = "blend"
    SHRED = "shred"
    GRATE = "grate"
    CHOPPED_COARSE = "chopped_coarse"
    CHOPPED_FINE = "chopped_fine"
    WHOLE = "whole"
    HALVED = "halved"
    QUARTERED = "quartered"
    WEDGED = "wedged"
    CUBED = "cubed"
    STRIPPED = "stripped"
    PEELED = "peeled"
    TRIMMED = "trimmed"


class ThermalTreatment(str, Enum):
    """Cooking/thermal methods."""
    BOIL = "boil"
    SIMMER = "simmer"
    STEAM = "steam"
    POACH = "poach"
    BRAISE = "braise"
    ROAST = "roast"
    BAKE = "bake"
    BROIL = "broil"
    GRILL = "grill"
    FRY_DEEP = "fry_deep"
    FRY_SHALLOW = "fry_shallow"
    SAUTE = "sauté"
    PAN_FRY = "pan_fry"
    STIR_FRY = "stir_fry"
    SOUS_VIDE = "sous_vide"
    CONFIT = "confit"
    SMOKE = "smoke"
    RAW = "raw"  # No thermal treatment
    WARM = "warm"  # Gentle heating


class TemperatureLevel(str, Enum):
    """Temperature intensity levels."""
    LOW = "low"
    MEDIUM_LOW = "medium_low"
    MEDIUM = "medium"
    MEDIUM_HIGH = "medium_high"
    HIGH = "high"


class CuisineType(str, Enum):
    """Cuisine classifications."""
    ITALIAN = "italian"
    INDIAN = "indian"
    JAPANESE = "japanese"
    CHINESE = "chinese"
    FRENCH = "french"
    MEXICAN = "mexican"
    THAI = "thai"
    MEDITERRANEAN = "mediterranean"
    AMERICAN = "american"
    MIDDLE_EASTERN = "middle_eastern"
    KOREAN = "korean"
    VIETNAMESE = "vietnamese"
    GREEK = "greek"
    SPANISH = "spanish"
    TURKISH = "turkish"
    MOROCCAN = "moroccan"
    ETHIOPIAN = "ethiopian"
    FUSION = "fusion"
    OTHER = "other"


class MealType(str, Enum):
    """Meal type classifications."""
    BREAKFAST = "breakfast"
    BRUNCH = "brunch"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
    APPETIZER = "appetizer"
    SIDE_DISH = "side_dish"
    MAIN_COURSE = "main_course"
    DESSERT = "dessert"
    BEVERAGE = "beverage"


class CookingMethod(str, Enum):
    """Overall cooking method for the recipe."""
    SOUP = "soup"
    STEW = "stew"
    CASSEROLE = "casserole"
    BRAISE = "braise"
    ROAST = "roast"
    BAKE = "bake"
    GRILL = "grill"
    STIR_FRY = "stir_fry"
    SAUTE = "sauté"
    DEEP_FRY = "deep_fry"
    STEAM = "steam"
    POACH = "poach"
    SOUS_VIDE = "sous_vide"
    SLOW_COOK = "slow_cook"
    PRESSURE_COOK = "pressure_cook"
    RAW = "raw"
    NO_COOK = "no_cook"


class DietaryRequirement(str, Enum):
    """Dietary classifications."""
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    PESCATARIAN = "pescatarian"
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    NUT_FREE = "nut_free"
    SOY_FREE = "soy_free"
    EGG_FREE = "egg_free"
    KOSHER = "kosher"
    HALAL = "halal"
    LOW_CARB = "low_carb"
    KETO = "keto"
    PALEO = "paleo"
    WHOLE30 = "whole30"
    LOW_SODIUM = "low_sodium"
    LOW_FAT = "low_fat"
    LOW_CALORIE = "low_calorie"


class AllergenType(str, Enum):
    """Common allergens."""
    NUTS = "nuts"
    DAIRY = "dairy"
    SHELLFISH = "shellfish"
    FISH = "fish"
    EGGS = "eggs"
    SOY = "soy"
    WHEAT = "wheat"
    SESAME = "sesame"


class IngredientCategory(str, Enum):
    """Ingredient classification."""
    PROTEIN = "protein"  # Meat, fish, eggs, legumes
    VEGETABLE = "vegetable"
    FRUIT = "fruit"
    GRAIN = "grain"
    DAIRY = "dairy"
    SPICE = "spice"
    HERB = "herb"
    SAUCE = "sauce"
    CONDIMENT = "condiment"
    FLAVOR_ENHANCER = "flavor_enhancer"  # MSG, umami pastes, etc.
    OIL_FAT = "oil_fat"
    SWEETENER = "sweetener"
    LIQUID = "liquid"  # Broths, stocks, water, wine
    OTHER = "other"


class DifficultyLevel(str, Enum):
    """Recipe difficulty levels."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class StorageType(str, Enum):
    """Storage requirements."""
    REFRIGERATE = "refrigerate"
    FREEZE = "freeze"
    ROOM_TEMPERATURE = "room_temperature"
    COOL_DRY_PLACE = "cool_dry_place"


# ============================================================================
# Ingredient Preparation Models
# ============================================================================

class Marination(BaseModel):
    """Marination specification."""
    duration_minutes: Optional[int] = Field(None, ge=0, description="Marination duration in minutes")
    temperature: Literal["room_temperature", "refrigerated"] = Field(
        default="refrigerated",
        description="Marination temperature"
    )
    marinade_ingredients: Optional[List[int]] = Field(
        None,
        description="List of ingredient IDs used in the marinade (if complex)"
    )
    description: Optional[str] = Field(None, description="Marinade description")


class Seasoning(BaseModel):
    """Seasoning information."""
    timing: Literal["before_cooking", "during_cooking", "after_cooking"] = Field(
        default="during_cooking",
        description="When seasoning is applied"
    )
    spices: Optional[List[int]] = Field(None, description="Spice ingredient IDs")
    herbs: Optional[List[int]] = Field(None, description="Herb ingredient IDs")
    description: Optional[str] = Field(None, description="Seasoning description")


class Brining(BaseModel):
    """Brining specification."""
    duration_minutes: Optional[int] = Field(None, ge=0, description="Brining duration")
    salt_concentration: Optional[Decimal] = Field(
        None,
        ge=0,
        le=100,
        description="Salt concentration percentage"
    )
    temperature: Literal["room_temperature", "refrigerated"] = Field(
        default="refrigerated"
    )


class ThermalTreatmentSpec(BaseModel):
    """Specification for a thermal treatment."""
    method: ThermalTreatment = Field(..., description="Thermal treatment method")
    temperature_celsius: Optional[float] = Field(
        None,
        ge=0,
        description="Specific temperature in Celsius"
    )
    temperature_level: Optional[TemperatureLevel] = Field(
        None,
        description="Temperature level if specific temp not provided"
    )
    duration_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Duration of thermal treatment"
    )
    internal_temperature_target: Optional[float] = Field(
        None,
        ge=0,
        description="Target internal temperature (for meats, etc.)"
    )
    notes: Optional[str] = Field(None, description="Additional notes")


class IngredientPreparation(BaseModel):
    """Complete preparation specification for an ingredient in a recipe."""
    
    # Basic info
    ingredient_id: int = Field(..., description="Ingredient ID")
    quantity: Decimal = Field(..., gt=0, description="Quantity required")
    unit: str = Field(..., max_length=50, description="Unit of measurement")
    is_optional: bool = Field(default=False, description="Whether ingredient is optional")
    
    # Mechanical treatments
    mechanical_treatments: Optional[List[MechanicalTreatment]] = Field(
        default_factory=list,
        description="List of mechanical treatments applied"
    )
    size_specification: Optional[str] = Field(
        None,
        max_length=50,
        description="Size specification (e.g., '1 inch cubes', 'thinly sliced')"
    )
    
    # Thermal treatments
    thermal_treatments: Optional[List[ThermalTreatmentSpec]] = Field(
        default_factory=list,
        description="List of thermal treatments in sequence"
    )
    
    # Marination & seasoning
    marination: Optional[Marination] = Field(None, description="Marination specification")
    brining: Optional[Brining] = Field(None, description="Brining specification")
    seasoning: Optional[Seasoning] = Field(None, description="Seasoning specification")
    
    # Other preparation
    preparation_steps: Optional[List[str]] = Field(
        default_factory=list,
        description="Additional preparation steps (washing, peeling, etc.)"
    )
    resting_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Resting time after preparation, before use"
    )
    temperature_before_use: Optional[Literal["room_temperature", "chilled", "warm"]] = Field(
        None,
        description="Temperature state before use"
    )
    
    # Notes
    notes: Optional[str] = Field(None, max_length=500, description="Additional notes")
    order_in_recipe: Optional[int] = Field(
        None,
        ge=1,
        description="Order in which this ingredient is prepared (if sequential)"
    )


# ============================================================================
# Recipe Models
# ============================================================================

class NutritionInfo(BaseModel):
    """Nutritional information per serving."""
    calories: Optional[float] = Field(None, ge=0, description="Calories per serving")
    protein_grams: Optional[float] = Field(None, ge=0, description="Protein in grams")
    carbohydrates_grams: Optional[float] = Field(None, ge=0, description="Carbs in grams")
    fat_grams: Optional[float] = Field(None, ge=0, description="Fat in grams")
    saturated_fat_grams: Optional[float] = Field(None, ge=0, description="Saturated fat")
    fiber_grams: Optional[float] = Field(None, ge=0, description="Fiber in grams")
    sugar_grams: Optional[float] = Field(None, ge=0, description="Sugar in grams")
    sodium_mg: Optional[float] = Field(None, ge=0, description="Sodium in milligrams")


class EquipmentRequirement(BaseModel):
    """Equipment needed for the recipe."""
    name: str = Field(..., max_length=100, description="Equipment name")
    is_essential: bool = Field(
        default=True,
        description="Whether equipment is essential or optional"
    )
    notes: Optional[str] = Field(None, description="Equipment-specific notes")


class DifficultyMetrics(BaseModel):
    """Objective difficulty metrics."""
    technical_complexity_score: Optional[int] = Field(
        None,
        ge=1,
        le=10,
        description="Complexity based on techniques used (1-10)"
    )
    step_count: Optional[int] = Field(None, ge=1, description="Total number of steps")
    specialized_equipment_count: Optional[int] = Field(
        None,
        ge=0,
        description="Number of specialized equipment items needed"
    )
    parallel_processes: Optional[int] = Field(
        None,
        ge=0,
        description="Number of parallel processes requiring attention"
    )
    precision_required: Optional[Literal["low", "medium", "high"]] = Field(
        None,
        description="Level of precision required"
    )


class RecipeTiming(BaseModel):
    """Complete timing breakdown."""
    prep_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Active preparation time"
    )
    cook_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Active cooking time"
    )
    marinating_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Marinating time (inactive)"
    )
    resting_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Resting time after cooking (inactive)"
    )
    inactive_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Total inactive time"
    )
    total_active_time_minutes: Optional[int] = Field(
        None,
        ge=0,
        description="Total active time (prep + cook)"
    )
    
    @property
    def total_time_minutes(self) -> Optional[int]:
        """Calculate total time including inactive periods."""
        if self.total_active_time_minutes is not None:
            inactive = self.inactive_time_minutes or 0
            return self.total_active_time_minutes + inactive
        return None


class StorageInstructions(BaseModel):
    """Storage information for finished dish."""
    storage_type: StorageType = Field(..., description="Storage method")
    shelf_life_days: Optional[int] = Field(
        None,
        ge=0,
        description="How long the dish keeps"
    )
    reheating_instructions: Optional[str] = Field(
        None,
        description="Best method to reheat"
    )
    freezing_instructions: Optional[str] = Field(
        None,
        description="Freezing instructions if applicable"
    )


class RecipeBase(BaseModel):
    """Base recipe model with comprehensive properties."""
    
    # Basic information
    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    description: Optional[str] = Field(None, description="Recipe description")
    instructions: str = Field(..., min_length=1, description="Cooking instructions")
    author: Optional[str] = Field(None, max_length=100, description="Recipe author/creator")
    source: Optional[str] = Field(None, max_length=200, description="Source/attribution")
    
    # Classification
    cuisine_types: List[CuisineType] = Field(
        default_factory=list,
        description="Cuisine classifications"
    )
    meal_types: List[MealType] = Field(
        default_factory=list,
        description="Meal type classifications"
    )
    cooking_method: Optional[CookingMethod] = Field(
        None,
        description="Overall cooking method"
    )
    
    # Dietary & health
    dietary_requirements: List[DietaryRequirement] = Field(
        default_factory=list,
        description="Dietary classifications"
    )
    contains_allergens: List[AllergenType] = Field(
        default_factory=list,
        description="Allergens present in the recipe"
    )
    allergen_warnings: Optional[str] = Field(
        None,
        description="Cross-contamination or other allergen warnings"
    )
    
    # Timing
    timing: RecipeTiming = Field(
        default_factory=RecipeTiming,
        description="Complete timing breakdown"
    )
    
    # Difficulty
    difficulty: Optional[DifficultyLevel] = Field(
        None,
        description="Subjective difficulty level"
    )
    difficulty_metrics: Optional[DifficultyMetrics] = Field(
        None,
        description="Objective difficulty metrics"
    )
    
    # Yield & servings
    servings: int = Field(default=1, gt=0, description="Number of servings")
    yield_description: Optional[str] = Field(
        None,
        max_length=100,
        description="Yield description (e.g., 'makes 24 cookies')"
    )
    
    # Equipment
    equipment_requirements: List[EquipmentRequirement] = Field(
        default_factory=list,
        description="Equipment needed"
    )
    oven_temperature_celsius: Optional[float] = Field(
        None,
        ge=0,
        description="Oven temperature if applicable"
    )
    oven_settings: Optional[str] = Field(
        None,
        description="Oven settings (convection, top rack, etc.)"
    )
    
    # Nutritional information
    nutrition_info: Optional[NutritionInfo] = Field(
        None,
        description="Nutritional information per serving"
    )
    
    # Storage
    storage_instructions: Optional[StorageInstructions] = Field(
        None,
        description="Storage instructions for finished dish"
    )
    
    # Metadata
    tags: List[str] = Field(
        default_factory=list,
        description="Searchable tags"
    )
    notes: Optional[str] = Field(None, description="Additional notes")
    variations: Optional[str] = Field(
        None,
        description="Recipe variations or substitutions"
    )
    estimated_cost_per_serving: Optional[Decimal] = Field(
        None,
        ge=0,
        description="Estimated cost per serving"
    )
    seasonality: Optional[List[str]] = Field(
        None,
        description="Best seasons for this recipe (e.g., ['spring', 'summer'])"
    )
    
    # Ingredients
    ingredients: List[IngredientPreparation] = Field(
        default_factory=list,
        description="List of ingredients with preparation specifications"
    )


class RecipeCreate(RecipeBase):
    """Schema for creating a recipe."""
    pass


class RecipeRead(RecipeBase):
    """Schema for reading a recipe."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


# ============================================================================
# Enhanced Ingredient Model
# ============================================================================

class IngredientBase(BaseModel):
    """Base ingredient model with category information."""
    name: str = Field(..., min_length=1, max_length=100, description="Ingredient name")
    category: IngredientCategory = Field(..., description="Ingredient category")
    storage_location: Optional[str] = Field(None, description="Storage location")
    quantity: Optional[Decimal] = Field(None, ge=0, description="Current quantity in stock")
    unit: Optional[str] = Field(None, description="Unit for current quantity")
    expiry_date: Optional[date] = Field(None, description="Expiration date")
    notes: Optional[str] = Field(None, description="Additional notes about ingredient")


class IngredientRead(IngredientBase):
    """Schema for reading an ingredient."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

```

---

## Design Decisions

### 1. **Ingredient Preparation vs. Recipe-Level Properties**

- **Cooking Method**: Placed at recipe level because it describes the overall dish (e.g., "this is a soup recipe"). Individual ingredients may undergo different thermal treatments, but the final dish has a primary cooking method.

- **Spices, Herbs, Sauces**: Treated as regular ingredients with a `category` field distinguishing them. This allows flexibility:
  - They can be tracked in inventory like other ingredients
  - The `IngredientPreparation` model captures how they're used (seasoning timing, marinade composition)
  - The `IngredientCategory` enum allows filtering and special handling

### 2. **Difficulty Assessment**

Two approaches are provided:
- **Subjective**: Simple `easy/medium/hard` field
- **Objective**: `DifficultyMetrics` with calculated scores based on:
  - Technical complexity (number of distinct techniques)
  - Step count
  - Equipment requirements
  - Parallel processes
  - Precision requirements

A recipe can use both, with the objective metrics potentially used to suggest or validate the subjective rating.

### 3. **Time Breakdown**

Separated into:
- **Prep time**: Active mechanical preparation
- **Cook time**: Active thermal treatment
- **Marinating time**: Inactive but recipe-blocking
- **Resting time**: Inactive but necessary
- **Total active time**: Sum of prep + cook
- **Total time**: Includes inactive periods

This gives flexibility for recipes where marination or resting is significant (e.g., "10 minutes prep, 2 hours marinating, 20 minutes cooking").

### 4. **Thermal Treatment Sequence**

Ingredients can have multiple thermal treatments in sequence (e.g., "boil, then roast"). The `thermal_treatments` field is a list, allowing ordering.

### 5. **Ingredient Categories**

Categories help distinguish:
- **Structural ingredients** (proteins, vegetables, grains) vs.
- **Flavoring ingredients** (spices, herbs, sauces, condiments)

This allows for special handling in recipe generation (e.g., "find recipes that use these proteins and vegetables, and suggest spices/sauces to pair").

---

## Open Questions

### 1. **Recipe Steps vs. Single Instructions Field**

Should instructions be:
- A single text field (current approach)?
- A structured list of steps with timing, equipment, and ingredient references?

A structured step model could enable:
- Better recipe parsing and AI generation
- Step-by-step cooking assistance apps
- Timing synchronization for multi-stage recipes

**Example structured approach:**
```python
class RecipeStep(BaseModel):
    step_number: int
    description: str
    duration_minutes: Optional[int]
    temperature: Optional[float]
    ingredients_referenced: List[int]
    equipment_needed: List[str]
    notes: Optional[str]
```

### 2. **Multi-Stage Recipes**

Some recipes have distinct stages (e.g., "make the sauce separately, then combine"). Should we support:
- Separate sub-recipes?
- Recipe groups/composites?
- Stage markers within instructions?

### 3. **Ingredient Substitutions**

Should substitutions be:
- Listed in the `variations` text field?
- Structured with ingredient mappings?
- Separate recipe variants?

### 4. **Scaling Recipes**

How to handle recipe scaling:
- Simple multiplication factors (2x, 0.5x)?
- Proportional adjustments with notes about nonlinear scaling (e.g., baking)?
- Separate scaled recipe versions?

### 5. **Temperature Precision**

For thermal treatments, should we always use:
- Specific temperatures (Celsius/Fahrenheit)?
- Relative levels (low/medium/high)?
- Both with conversion support?

### 6. **Video/Media Support**

Should recipes include:
- Video links?
- Step-by-step images?
- Embedded media in instructions?

### 7. **Recipe Testing & Validation**

Should we track:
- Recipe testing status (untested, tested, verified)?
- Tester ratings/feedback?
- Modification history (what was changed and why)?

### 8. **Portion Size Flexibility**

Some ingredients scale better than others when changing serving sizes. Should we flag:
- Which ingredients scale linearly?
- Which need special handling (e.g., spices might need less than 2x for 2x servings)?

### 9. **Equipment Substitutions**

Should we track:
- Equipment alternatives (e.g., "food processor OR blender")?
- Equipment requirements by serving size (e.g., "need larger pot for 4x recipe")?

### 10. **Ingredient Preparation Dependencies**

Some ingredients must be prepared in a specific order or with specific timing relative to others. Should we model:
- Preparation dependencies (ingredient A must be ready before starting ingredient B)?
- Parallel vs. sequential preparation?
- Critical timing windows?

---

## Summary

This model hierarchy provides:

1. **Comprehensive ingredient preparation** covering mechanical, thermal, and other treatments
2. **Rich recipe metadata** including cuisine, dietary, timing, difficulty, and nutritional information
3. **Flexible classification** allowing multiple tags and categories
4. **Objective and subjective metrics** for difficulty and quality assessment
5. **Storage and lifecycle management** for both ingredients and finished dishes
6. **Extensibility** through optional fields and open-ended design

The model balances completeness with practicality, providing structure where needed while maintaining flexibility for edge cases through optional fields and text notes.

