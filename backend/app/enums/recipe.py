"""Enumerations for recipe and ingredient modelling."""

from __future__ import annotations

from enum import Enum


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
    """Cooking / thermal methods."""

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
    RAW = "raw"
    WARM = "warm"


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

    PROTEIN = "protein"
    VEGETABLE = "vegetable"
    FRUIT = "fruit"
    GRAIN = "grain"
    DAIRY = "dairy"
    SPICE = "spice"
    HERB = "herb"
    SAUCE = "sauce"
    CONDIMENT = "condiment"
    FLAVOR_ENHANCER = "flavor_enhancer"
    OIL_FAT = "oil_fat"
    SWEETENER = "sweetener"
    LIQUID = "liquid"
    OTHER = "other"


class StorageType(str, Enum):
    """Storage requirements."""

    REFRIGERATE = "refrigerate"
    FREEZE = "freeze"
    ROOM_TEMPERATURE = "room_temperature"
    COOL_DRY_PLACE = "cool_dry_place"

