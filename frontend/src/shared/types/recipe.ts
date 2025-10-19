export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface RecipeIngredientBase {
  ingredient_id: number;
  quantity: number;
  unit: string;
  is_optional?: boolean;
  note?: string | null;
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
  prep_time?: number | null;
  cook_time?: number | null;
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
  difficulty?: DifficultyLevel;
  max_prep_time?: number;
  max_cook_time?: number;
  name?: string;
  page?: number;
  page_size?: number;
}
