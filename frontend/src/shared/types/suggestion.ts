// Backend-aligned suggestion types (minimal surface)
// Define a minimal Recipe shape sufficient for suggestion requests/responses
export interface RecipeTiming {
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
}
export interface RecipeIngredient {
  ingredient_id: number;
  quantity: number;
  unit: string;
  is_optional?: boolean;
  notes?: string | null;
}
export interface Recipe {
  name?: string | null;
  description?: string | null;
  instructions?: string | null;
  timing?: RecipeTiming;
  servings?: number | null;
  ingredients?: RecipeIngredient[];
}
export interface SuggestionRequest {
  recipe?: Recipe; // partial Recipe allowed
  prompt?: string | null;
  n_completions?: number;
}

export interface SuggestionResponse {
  recipes: Recipe[];
}
