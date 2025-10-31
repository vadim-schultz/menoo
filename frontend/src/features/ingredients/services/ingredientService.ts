import { apiClient } from '../../../shared/services/apiClient';
import type {
  IngredientCreate,
  IngredientPatch,
  IngredientRead,
  IngredientFilters,
} from '../../../shared/types';

function normalizeIngredient(item: any): IngredientRead {
  return {
    ...item,
    quantity: typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity,
  } as IngredientRead;
}

function normalizeList(items: any[]): IngredientRead[] {
  return (items || []).map(normalizeIngredient);
}

export const ingredientService = {
  async list(filters?: IngredientFilters): Promise<IngredientRead[]> {
    // Send filters sparsely populated (only defined fields) or no params at all
    const params = filters
      ? Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        )
      : undefined;
    const res = await apiClient.get<IngredientRead[]>('/ingredients/', params);
    return normalizeList(res);
  },

  async get(id: number): Promise<IngredientRead> {
    const res = await apiClient.get<IngredientRead>(`/ingredients/${id}`);
    return normalizeIngredient(res);
  },

  async create(data: IngredientCreate): Promise<IngredientRead> {
    const res = await apiClient.post<IngredientRead>('/ingredients/', data);
    return normalizeIngredient(res);
  },

  async update(id: number, data: IngredientPatch): Promise<IngredientRead> {
    const res = await apiClient.patch<IngredientRead>(`/ingredients/${id}`, data);
    return normalizeIngredient(res);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/ingredients/${id}`);
  },
};

