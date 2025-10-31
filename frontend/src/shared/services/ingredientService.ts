import { apiClient } from './apiClient';
import type {
  IngredientCreate,
  IngredientPatch,
  IngredientRead,
  IngredientFilters,
} from '../types';

export const ingredientService = {
  async list(filters?: IngredientFilters): Promise<IngredientRead[]> {
    return apiClient.get<IngredientRead[]>('/ingredients', filters);
  },

  async get(id: number): Promise<IngredientRead> {
    return apiClient.get<IngredientRead>(`/ingredients/${id}`);
  },

  async create(data: IngredientCreate): Promise<IngredientRead> {
    return apiClient.post<IngredientRead>('/ingredients', data);
  },

  async update(id: number, data: IngredientPatch): Promise<IngredientRead> {
    return apiClient.patch<IngredientRead>(`/ingredients/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/ingredients/${id}`);
  },
};
