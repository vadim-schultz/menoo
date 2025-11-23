// UI-friendly recipe types expanded to align with backend core Recipe model.
// We keep simple fields for the UI and map to backend structures in services.

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Timing (UI helpers + room for full backend timing if needed)
export interface RecipeTimingUI {
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  marinating_time_minutes?: number | null;
  resting_time_minutes?: number | null;
  inactive_time_minutes?: number | null;
  total_active_time_minutes?: number | null;
}

// Allow free-form ingredient name for manual entry (will be created if missing)
export interface RecipeIngredientBase {
  ingredient_id?: number; // optional in UI; resolved before save
  ingredient_name?: string; // free-form; used to create missing ingredient
  quantity: number;
  unit: string;
  is_optional?: boolean;
  note?: string | null; // UI field; maps to backend 'notes'
}

export interface RecipeIngredientCreate extends RecipeIngredientBase {}

export interface RecipeIngredientRead {
  id: number;
  ingredient_id: number;
  ingredient_name: string;
  quantity: number;
  unit: string;
  is_optional?: boolean;
  note?: string | null;
}

export interface RecipeBase {
  name: string;
  description?: string | null;
  instructions: string;
  // Simple UI timing fields; mapped into timing.*
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number;
  difficulty?: DifficultyLevel | null;
  // Extended fields (optional in UI)
  author?: string | null;
  source?: string | null;
  cuisine_types?: string[];
  meal_types?: string[];
  cooking_method?: string | null;
  dietary_requirements?: string[];
  contains_allergens?: string[];
  allergen_warnings?: string | null;
  timing_full?: RecipeTimingUI; // optional direct mapping to backend timing
  yield_description?: string | null;
  equipment_requirements?: { name: string; is_essential?: boolean; notes?: string | null }[];
  oven_temperature_celsius?: number | null;
  oven_settings?: string | null;
  nutrition_info?: {
    calories?: number | null;
    protein_grams?: number | null;
    carbohydrates_grams?: number | null;
    fat_grams?: number | null;
    saturated_fat_grams?: number | null;
    fiber_grams?: number | null;
    sugar_grams?: number | null;
    sodium_mg?: number | null;
  } | null;
  storage_instructions?: {
    storage_type?: string | null;
    shelf_life_days?: number | null;
    reheating_instructions?: string | null;
    freezing_instructions?: string | null;
  } | null;
  tags?: string[];
  notes?: string | null;
  variations?: string | null;
  estimated_cost_per_serving?: number | null;
  seasonality?: string[] | null;
}

export interface RecipeCreate extends RecipeBase {
  ingredients?: RecipeIngredientCreate[];
}

export interface RecipeUpdate extends Partial<RecipeCreate> {}

export interface RecipeRead extends RecipeBase {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  // Derived UI fields
  total_time?: number | null;
}

export interface RecipeDetail extends RecipeRead {
  ingredients: RecipeIngredientRead[];
  missing_ingredients: string[];
}

export interface RecipeListResponse {
  items: RecipeRead[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface RecipeFilters {
  // Backend filter names
  cuisine?: string;
  max_prep_time_minutes?: number;
  max_cook_time_minutes?: number;
  name_contains?: string;
  page?: number;
  page_size?: number;
}
