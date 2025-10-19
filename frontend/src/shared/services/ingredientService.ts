import { apiClient } from './apiClient';
import type {
  IngredientCreate,
  IngredientUpdate,
  IngredientRead,
  IngredientListResponse,
  IngredientFilters,
} from '../types';

export const ingredientService = {
  async list(filters?: IngredientFilters): Promise<IngredientListResponse> {
    return apiClient.get<IngredientListResponse>('/ingredients', filters);
  },

  async get(id: number): Promise<IngredientRead> {
    return apiClient.get<IngredientRead>(`/ingredients/${id}`);
  },

  async create(data: IngredientCreate): Promise<IngredientRead> {
    return apiClient.post<IngredientRead>('/ingredients', data);
  },

  async update(id: number, data: IngredientUpdate): Promise<IngredientRead> {
    return apiClient.patch<IngredientRead>(`/ingredients/${id}`, data);
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/ingredients/${id}`);
  },
};
