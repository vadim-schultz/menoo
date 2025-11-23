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
    const timing = {
      prep_time_minutes: data.timing_full?.prep_time_minutes ?? data.prep_time ?? null,
      cook_time_minutes: data.timing_full?.cook_time_minutes ?? data.cook_time ?? null,
      marinating_time_minutes: data.timing_full?.marinating_time_minutes ?? null,
      resting_time_minutes: data.timing_full?.resting_time_minutes ?? null,
      inactive_time_minutes: data.timing_full?.inactive_time_minutes ?? null,
      total_active_time_minutes: data.timing_full?.total_active_time_minutes ?? null,
    };
    const payload = {
      recipe: {
        name: data.name,
        description: data.description ?? null,
        instructions: data.instructions,
        servings: data.servings ?? 1,
        author: data.author ?? null,
        source: data.source ?? null,
        cuisine_types: data.cuisine_types ?? [],
        meal_types: data.meal_types ?? [],
        cooking_method: data.cooking_method ?? null,
        dietary_requirements: data.dietary_requirements ?? [],
        contains_allergens: data.contains_allergens ?? [],
        allergen_warnings: data.allergen_warnings ?? null,
        timing,
        yield_description: data.yield_description ?? null,
        equipment_requirements: data.equipment_requirements ?? [],
        oven_temperature_celsius: data.oven_temperature_celsius ?? null,
        oven_settings: data.oven_settings ?? null,
        nutrition_info: data.nutrition_info ?? null,
        storage_instructions: data.storage_instructions ?? null,
        tags: data.tags ?? [],
        notes: data.notes ?? null,
        variations: data.variations ?? null,
        estimated_cost_per_serving: data.estimated_cost_per_serving ?? null,
        seasonality: data.seasonality ?? null,
        ingredients: (data.ingredients || []).map((ing: RecipeIngredientCreate) => ({
          ingredient_id: ing.ingredient_id,
          // name is only UI-side; missing-ID resolution occurs before calling this
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
    const timing = {
      prep_time_minutes: data.timing_full?.prep_time_minutes ?? data.prep_time ?? null,
      cook_time_minutes: data.timing_full?.cook_time_minutes ?? data.cook_time ?? null,
      marinating_time_minutes: data.timing_full?.marinating_time_minutes ?? null,
      resting_time_minutes: data.timing_full?.resting_time_minutes ?? null,
      inactive_time_minutes: data.timing_full?.inactive_time_minutes ?? null,
      total_active_time_minutes: data.timing_full?.total_active_time_minutes ?? null,
    };
    const payload: any = {
      recipe: {
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        servings: data.servings,
        author: data.author,
        source: data.source,
        cuisine_types: data.cuisine_types,
        meal_types: data.meal_types,
        cooking_method: data.cooking_method,
        dietary_requirements: data.dietary_requirements,
        contains_allergens: data.contains_allergens,
        allergen_warnings: data.allergen_warnings,
        timing,
        yield_description: data.yield_description,
        equipment_requirements: data.equipment_requirements,
        oven_temperature_celsius: data.oven_temperature_celsius,
        oven_settings: data.oven_settings,
        nutrition_info: data.nutrition_info,
        storage_instructions: data.storage_instructions,
        tags: data.tags,
        notes: data.notes,
        variations: data.variations,
        estimated_cost_per_serving: data.estimated_cost_per_serving,
        seasonality: data.seasonality,
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
