import { apiClient } from './apiClient';
import type {
  RecipeCreate,
  RecipeUpdate,
  RecipeDetail,
  RecipeListResponse,
  RecipeFilters,
  RecipeIngredientCreate,
  RecipeIngredientRead,
} from '../types';

export const recipeService = {
  async list(filters?: RecipeFilters): Promise<RecipeListResponse> {
    return apiClient.get<RecipeListResponse>('/recipes/', filters);
  },

  async get(id: number): Promise<RecipeDetail> {
    return apiClient.get<RecipeDetail>(`/recipes/${id}`);
  },

  async create(data: RecipeCreate): Promise<RecipeDetail> {
    // Map UI fields to backend Recipe model wrapped in { recipe }
    const payload = {
      recipe: {
        name: data.name,
        description: data.description ?? null,
        instructions: data.instructions,
        servings: data.servings ?? 1,
        timing: {
          prep_time_minutes: data.prep_time ?? null,
          cook_time_minutes: data.cook_time ?? null,
        },
        ingredients: (data.ingredients || []).map((ing: RecipeIngredientCreate) => ({
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
          unit: ing.unit,
          is_optional: ing.is_optional ?? false,
          notes: ing.note ?? null,
        })),
      },
    };
    return apiClient.post<RecipeDetail>('/recipes/', payload);
  },

  async update(id: number, data: RecipeUpdate): Promise<RecipeDetail> {
    const payload = {
      recipe: {
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        servings: data.servings,
        timing: {
          prep_time_minutes: data.prep_time ?? null,
          cook_time_minutes: data.cook_time ?? null,
        },
        ingredients:
          data.ingredients?.map((ing: RecipeIngredientCreate) => ({
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
            is_optional: ing.is_optional ?? false,
            notes: ing.note ?? null,
          })) ?? undefined,
      },
    };
    return apiClient.patch<RecipeDetail>(`/recipes/${id}`, payload);
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/recipes/${id}`);
  },

  async getIngredients(id: number): Promise<RecipeIngredientRead[]> {
    return apiClient.get<RecipeIngredientRead[]>(`/recipes/${id}/ingredients`);
  },

  async updateIngredients(
    id: number,
    ingredients: RecipeIngredientCreate[]
  ): Promise<RecipeIngredientRead[]> {
    return apiClient.post<RecipeIngredientRead[]>(`/recipes/${id}/ingredients`, ingredients);
  },
};
