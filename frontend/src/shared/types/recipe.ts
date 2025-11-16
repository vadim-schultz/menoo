// UI-friendly recipe types with minimal fields, plus backend-aligned response structures.
// We keep existing UI fields and map them to backend structures inside services.

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface RecipeIngredientBase {
  ingredient_id: number;
  quantity: number;
  unit: string;
  is_optional?: boolean;
  note?: string | null; // UI field; maps to backend 'notes'
}

export interface RecipeIngredientCreate extends RecipeIngredientBase {}

export interface RecipeIngredientRead extends RecipeIngredientBase {
  id: number;
  ingredient_name: string;
}

export interface RecipeBase {
  name: string;
  description?: string | null;
  instructions: string;
  prep_time?: number | null; // UI field; maps to timing.prep_time_minutes
  cook_time?: number | null; // UI field; maps to timing.cook_time_minutes
  servings?: number;
  difficulty?: DifficultyLevel | null;
}

export interface RecipeCreate extends RecipeBase {
  ingredients?: RecipeIngredientCreate[];
}

export interface RecipeUpdate {
  name?: string;
  description?: string | null;
  instructions?: string;
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number;
  difficulty?: DifficultyLevel | null;
  ingredients?: RecipeIngredientCreate[];
}

export interface RecipeRead extends RecipeBase {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface RecipeDetail extends RecipeRead {
  ingredients: RecipeIngredientRead[];
  missing_ingredients: string[];
  total_time?: number | null;
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
