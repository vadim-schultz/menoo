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

export interface RecipeDraftIngredient {
  ingredient_id?: number | null;
  name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
}

export interface RecipeDraft {
  name?: string | null;
  description?: string | null;
  instructions?: string | null;
  cuisine_types?: string[];
  meal_types?: string[];
  dietary_requirements?: string[];
  notes?: string | null;
  tags?: string[];
  ingredients?: RecipeDraftIngredient[];
}

export interface SuggestionRequest {
  recipe?: RecipeDraft;
  prompt?: string | null;
  n_completions?: number;
}

export interface SuggestionResponse {
  recipes: GeneratedRecipe[];
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
