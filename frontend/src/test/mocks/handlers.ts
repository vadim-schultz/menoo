/**
 * MSW (Mock Service Worker) handlers for API mocking in tests
 *
 * These handlers intercept API calls and return mock responses
 * for testing without hitting the real backend.
 */

import { http, HttpResponse } from 'msw';
import type {
  RecipeSuggestion,
  SuggestionResponse,
  SuggestionAcceptRequest,
} from '@/shared/types/suggestion';
import type { RecipeDetail } from '@/shared/types/recipe';
import type { IngredientRead } from '@/shared/types/ingredient';

const API_BASE = 'http://localhost:8000/api/v1';

// Mock data factories
export const createMockAISuggestion = (
  overrides?: Partial<RecipeSuggestion>
): RecipeSuggestion => ({
  recipe_id: null,
  recipe_name: 'AI-Generated Pasta Carbonara',
  match_score: 0.95,
  missing_ingredients: [],
  matched_ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
  reason: 'Great match! You have all the ingredients for a classic Italian dish.',
  is_ai_generated: true,
  generated_recipe: {
    name: 'AI-Generated Pasta Carbonara',
    description: 'A creamy Italian pasta dish with eggs, bacon, and parmesan cheese.',
    ingredients: [
      { ingredient_id: 1, name: 'Pasta', quantity: 400, unit: 'g' },
      { ingredient_id: 2, name: 'Eggs', quantity: 4, unit: 'whole' },
      { ingredient_id: 3, name: 'Bacon', quantity: 200, unit: 'g' },
      { ingredient_id: 4, name: 'Parmesan', quantity: 100, unit: 'g' },
    ],
    instructions: '1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    servings: 4,
    difficulty: 'easy',
    cuisine_type: 'Italian',
    meal_type: 'dinner',
  },
  ...overrides,
});

export const createMockTraditionalSuggestion = (
  overrides?: Partial<RecipeSuggestion>
): RecipeSuggestion => ({
  recipe_id: 100,
  recipe_name: 'Traditional Spaghetti Bolognese',
  match_score: 0.8,
  missing_ingredients: ['Ground Beef'],
  matched_ingredients: ['Pasta', 'Tomato Sauce', 'Onion'],
  reason: null,
  is_ai_generated: false,
  generated_recipe: null,
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
  difficulty: 'easy',
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
    const body = (await request.json()) as { available_ingredients: number[] };

    if (!body.available_ingredients || body.available_ingredients.length === 0) {
      return HttpResponse.json<SuggestionResponse>(
        {
          suggestions: [createMockAISuggestion()],
          source: 'ai',
          cache_hit: false,
        },
        { status: 201 }
      );
    }

    return HttpResponse.json<SuggestionResponse>(
      {
        suggestions: [createMockAISuggestion(), createMockTraditionalSuggestion()],
        source: 'ai',
        cache_hit: false,
      },
      { status: 201 }
    );
  }),

  // POST /suggestions/accept - Accept and save AI suggestion
  http.post(`${API_BASE}/suggestions/accept`, async ({ request }) => {
    const body = (await request.json()) as SuggestionAcceptRequest;

    if (!body.generated_recipe) {
      return HttpResponse.json({ detail: 'Missing generated_recipe' }, { status: 422 });
    }

    return HttpResponse.json<RecipeDetail>(
      createMockRecipeDetail({
        name: body.generated_recipe.name,
        description: body.generated_recipe.description,
        instructions: body.generated_recipe.instructions,
        prep_time: body.generated_recipe.prep_time_minutes ?? undefined,
        cook_time: body.generated_recipe.cook_time_minutes ?? undefined,
        servings: body.generated_recipe.servings ?? undefined,
        difficulty: (body.generated_recipe.difficulty ?? 'easy') as any,
      }),
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

  suggestionsSaveError: http.post(`${API_BASE}/suggestions/accept`, () => {
    return HttpResponse.json({ detail: 'Failed to save recipe' }, { status: 500 });
  }),

  networkError: http.post(`${API_BASE}/suggestions/recipes`, () => {
    return HttpResponse.error();
  }),
};
