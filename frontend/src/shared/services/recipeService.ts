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
    return apiClient.get<RecipeListResponse>('/recipes', filters);
  },

  async get(id: number): Promise<RecipeDetail> {
    return apiClient.get<RecipeDetail>(`/recipes/${id}`);
  },

  async create(data: RecipeCreate): Promise<RecipeDetail> {
    return apiClient.post<RecipeDetail>('/recipes', data);
  },

  async update(id: number, data: RecipeUpdate): Promise<RecipeDetail> {
    return apiClient.patch<RecipeDetail>(`/recipes/${id}`, data);
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
