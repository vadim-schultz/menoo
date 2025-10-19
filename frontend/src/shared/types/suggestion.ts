export interface SuggestionRequest {
  available_ingredients: number[];
  max_prep_time?: number | null;
  max_cook_time?: number | null;
  difficulty?: string | null;
  dietary_restrictions?: string[];
  max_results?: number;
}

export interface RecipeSuggestion {
  recipe_id: number;
  recipe_name: string;
  match_score: number;
  missing_ingredients: string[];
  matched_ingredients: string[];
  reason?: string | null;
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
