/**
 * MSW (Mock Service Worker) handlers for API mocking in tests
 *
 * These handlers intercept API calls and return mock responses
 * for testing without hitting the real backend.
 */

import { http, HttpResponse } from 'msw';
import type {
  SuggestionResponse,
} from '@/shared/types/suggestion';
import type { RecipeDetail } from '@/shared/types/recipe';
import type { IngredientRead } from '@/shared/types/ingredient';

const API_BASE = 'http://localhost:8000/api/v1';

// Mock data factories
export const createMockGeneratedRecipe = (
  overrides?: any
) => ({
  name: 'AI-Generated Pasta Carbonara',
  description: 'A creamy Italian pasta dish with eggs, bacon, and parmesan cheese.',
  timing: { prep_time_minutes: 10, cook_time_minutes: 15 },
  ingredients: [
    { ingredient_id: 1, quantity: 400, unit: 'g' },
    { ingredient_id: 2, quantity: 4, unit: 'whole' },
    { ingredient_id: 3, quantity: 200, unit: 'g' },
    { ingredient_id: 4, quantity: 100, unit: 'g' },
  ] as any[],
  instructions: '1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all',
  servings: 4,
  ...overrides,
});

export const createMockRecipeDetail = (overrides?: Partial<RecipeDetail>): RecipeDetail => ({
  id: 1,
  name: 'Saved AI Recipe',
  description: 'A delicious AI-generated recipe',
  instructions: 'Step-by-step instructions here',
  prep_time: 10,
  cook_time: 20,
  servings: 4,
  difficulty: null as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
  ingredients: [
    {
      id: 1,
      ingredient_id: 1,
      ingredient_name: 'Pasta',
      quantity: 400,
      unit: 'g',
      is_optional: false,
      note: null,
    },
  ],
  missing_ingredients: [],
  ...overrides,
});

export const createMockIngredient = (overrides?: Partial<IngredientRead>): IngredientRead => ({
  id: 1,
  name: 'Pasta',
  quantity: 2,
  unit: 'packages',
  storage_location: 'pantry',
  expiry_date: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
  ...overrides,
});

// MSW Request Handlers
export const handlers = [
  // GET /suggestions/recipes - Get recipe suggestions
  http.post(`${API_BASE}/suggestions/recipes`, async ({ request }) => {
    return HttpResponse.json<SuggestionResponse>(
      {
        recipes: [createMockGeneratedRecipe()],
      },
      { status: 201 }
    );
  }),

  // Relative URL handlers matching client
  http.post(`/api/v1/suggestions/recipes`, async ({ request }) => {
    return HttpResponse.json<SuggestionResponse>(
      {
        recipes: [createMockGeneratedRecipe()],
      },
      { status: 201 }
    );
  }),

  // GET /ingredients - List ingredients
  http.get(`${API_BASE}/ingredients`, () => {
    return HttpResponse.json<IngredientRead[]>(
      [
        createMockIngredient({ id: 1, name: 'Pasta' }),
        createMockIngredient({ id: 2, name: 'Eggs' }),
        createMockIngredient({ id: 3, name: 'Bacon' }),
      ],
      { status: 200 }
    );
  }),
  // Also handle relative URL used by client
  http.get(`/api/v1/ingredients/`, () => {
    return HttpResponse.json<IngredientRead[]>(
      [
        createMockIngredient({ id: 1, name: 'flour', quantity: 100 }),
        createMockIngredient({ id: 2, name: 'sugar', quantity: 200 }),
      ],
      { status: 200 }
    );
  }),

  // GET /recipes - List recipes
  http.get(`${API_BASE}/recipes`, () => {
    return HttpResponse.json(
      {
        items: [createMockRecipeDetail()],
        total: 1,
        page: 1,
        page_size: 100,
        has_next: false,
      },
      { status: 200 }
    );
  }),
];

// Error handlers for testing error states
export const errorHandlers = {
  suggestionsFetchError: http.post(`${API_BASE}/suggestions/recipes`, () => {
    return HttpResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }),
  networkError: http.post(`${API_BASE}/suggestions/recipes`, () => {
    return HttpResponse.error();
  }),
};
