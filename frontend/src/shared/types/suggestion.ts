export interface GeneratedRecipeIngredient {
  ingredient_id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface GeneratedRecipe {
  name: string;
  description?: string | null;
  ingredients: GeneratedRecipeIngredient[];
  instructions: string;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  cuisine_type?: string | null;
  meal_type?: string | null;
}

export interface SuggestionAcceptRequest {
  generated_recipe: GeneratedRecipe;
}

export interface SuggestionRequest {
  available_ingredients: number[];
  max_prep_time?: number | null;
  max_cook_time?: number | null;
  difficulty?: string | null;
  dietary_restrictions?: string[];
  max_results?: number;
}

export interface RecipeSuggestion {
  recipe_id: number | null;
  recipe_name: string;
  match_score: number;
  missing_ingredients: string[];
  matched_ingredients: string[];
  reason?: string | null;
  is_ai_generated: boolean;
  generated_recipe?: GeneratedRecipe | null;
}

export interface SuggestionResponse {
  suggestions: RecipeSuggestion[];
  source: string;
  cache_hit: boolean;
}

export interface ShoppingListRequest {
  recipe_ids: number[];
}

export interface ShoppingListItem {
  ingredient_name: string;
  total_quantity: number;
  unit: string;
  storage_location: string;
  recipes: string[];
}

export interface ShoppingListResponse {
  items_by_location: Record<string, ShoppingListItem[]>;
  total_items: number;
}
