export type CuisineType =
  | 'italian'
  | 'indian'
  | 'japanese'
  | 'chinese'
  | 'french'
  | 'mexican'
  | 'thai'
  | 'mediterranean'
  | 'american'
  | 'middle_eastern'
  | 'korean'
  | 'vietnamese'
  | 'greek'
  | 'spanish'
  | 'turkish'
  | 'moroccan'
  | 'ethiopian'
  | 'fusion'
  | 'other'

export type MealType =
  | 'breakfast'
  | 'brunch'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'appetizer'
  | 'side_dish'
  | 'main_course'
  | 'dessert'
  | 'beverage'

export type DietaryRequirement =
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'soy_free'
  | 'egg_free'
  | 'kosher'
  | 'halal'
  | 'low_carb'
  | 'keto'
  | 'paleo'
  | 'whole30'
  | 'low_sodium'
  | 'low_fat'
  | 'low_calorie'

export interface RecipeTiming {
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  total_time_minutes?: number | null
  resting_time_minutes?: number | null
  marination_time_minutes?: number | null
}

export interface IngredientPreparation {
  ingredient_id: number
  quantity: number
  unit: string
  is_optional?: boolean
  mechanical_treatments?: string[]
  size_specification?: string | null
  thermal_treatments?: any[]
  marination?: any | null
  brining?: any | null
  seasoning?: any | null
  preparation_steps?: string[]
  resting_time_minutes?: number | null
  temperature_before_use?: 'room_temperature' | 'chilled' | 'warm' | null
  notes?: string | null
  order_in_recipe?: number | null
}

export interface Recipe {
  name?: string | null
  description?: string | null
  instructions?: string | null
  author?: string | null
  source?: string | null
  cuisine_types?: CuisineType[]
  meal_types?: MealType[]
  cooking_method?: string | null
  dietary_requirements?: DietaryRequirement[]
  contains_allergens?: string[]
  allergen_warnings?: string | null
  timing?: RecipeTiming
  difficulty_metrics?: any | null
  servings?: number
  yield_description?: string | null
  equipment_requirements?: any[]
  oven_temperature_celsius?: number | null
  oven_settings?: string | null
  nutrition_info?: any | null
  storage_instructions?: any | null
  tags?: string[]
  notes?: string | null
  variations?: string | null
  estimated_cost_per_serving?: number | null
  seasonality?: string[] | null
  ingredients?: IngredientPreparation[]
}

export interface RecipeResponse extends Recipe {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface RecipeIngredientRead extends IngredientPreparation {
  id: number
  ingredient_name: string
}

export interface RecipeDetail extends RecipeResponse {
  ingredients: RecipeIngredientRead[]
  missing_ingredients: string[]
}

export interface RecipeListResponse {
  items: RecipeResponse[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

export interface RecipeCreateRequest {
  recipe: Recipe
}

export interface SuggestionRequest {
  recipe: Recipe
  prompt?: string | null
  n_completions?: number
}

export interface SuggestionResponse {
  recipes: RecipeResponse[]
}

