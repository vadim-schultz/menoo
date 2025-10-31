/**
 * Integration tests for the Suggestions feature
 *
 * These tests verify the full flow of fetching suggestions and saving AI recipes
 * using MSW to mock API responses.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { server } from '../../../test/mocks/server';
import { http, HttpResponse } from 'msw';
import { suggestionService } from '../../../shared/services';
import type { SuggestionRequest, GeneratedRecipe } from '../../../shared/types';

describe('Suggestions Integration Tests', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('API Integration - getSuggestions', () => {
    it('returns AI suggestions matching schema from API', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: null,
                recipe_name: 'Test AI Recipe',
                match_score: 0.9,
                reason: 'Test',
                matched_ingredients: ['ingredient1'],
                missing_ingredients: [],
                is_ai_generated: true,
                generated_recipe: {
                  name: 'Test AI Recipe',
                  instructions: 'Test',
                  ingredients: [
                    { ingredient_id: 1, name: 'ingredient1', quantity: 100, unit: 'g' },
                  ],
                },
              },
            ],
            source: 'ai',
            cache_hit: false,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2, 3],
      };

      const response = await suggestionService.getSuggestions(request);

      expect(response).toBeDefined();
      expect(response.suggestions).toBeInstanceOf(Array);
      expect(response.source).toBeDefined();
      expect(response.cache_hit).toBeDefined();

      if (response.suggestions.length > 0) {
        const suggestion = response.suggestions[0];
        expect(suggestion).toHaveProperty('recipe_name');
        expect(suggestion).toHaveProperty('match_score');
        expect(suggestion).toHaveProperty('is_ai_generated');
        expect(suggestion).toHaveProperty('matched_ingredients');
        expect(suggestion).toHaveProperty('missing_ingredients');
      }
    });

    it('handles AI-generated suggestions correctly', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: null,
                recipe_name: 'AI Pasta',
                match_score: 0.95,
                reason: 'AI generated',
                matched_ingredients: ['pasta', 'tomato'],
                missing_ingredients: [],
                is_ai_generated: true,
                generated_recipe: {
                  name: 'AI Pasta',
                  description: 'Delicious pasta',
                  instructions: 'Cook pasta, add sauce',
                  ingredients: [{ ingredient_id: 1, name: 'pasta', quantity: 200, unit: 'g' }],
                  prep_time_minutes: 5,
                  cook_time_minutes: 10,
                  servings: 2,
                  difficulty: 'easy',
                },
              },
            ],
            source: 'ai',
            cache_hit: false,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2],
      };

      const response = await suggestionService.getSuggestions(request);

      expect(response.suggestions).toHaveLength(1);
      expect(response.suggestions[0].is_ai_generated).toBe(true);
      expect(response.suggestions[0].generated_recipe).toBeDefined();
      expect(response.suggestions[0].generated_recipe?.name).toBe('AI Pasta');
      expect(response.source).toBe('ai');
    });

    it('handles traditional (database) suggestions correctly', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: 123,
                recipe_name: 'Spaghetti Carbonara',
                match_score: 0.85,
                reason: 'Good match from database',
                matched_ingredients: ['pasta', 'eggs'],
                missing_ingredients: ['bacon'],
                is_ai_generated: false,
                generated_recipe: null,
              },
            ],
            source: 'database',
            cache_hit: false,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2],
      };

      const response = await suggestionService.getSuggestions(request);

      expect(response.suggestions).toHaveLength(1);
      expect(response.suggestions[0].is_ai_generated).toBe(false);
      expect(response.suggestions[0].recipe_id).toBe(123);
      expect(response.suggestions[0].generated_recipe).toBeNull();
      expect(response.source).toBe('database');
    });

    it('handles API errors gracefully', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({ detail: 'Internal server error' }, { status: 500 });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2],
      };

      await expect(suggestionService.getSuggestions(request)).rejects.toThrow();
    });

    it('handles empty suggestion lists', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({
            suggestions: [],
            source: 'database',
            cache_hit: false,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [999],
      };

      const response = await suggestionService.getSuggestions(request);

      expect(response.suggestions).toHaveLength(0);
      expect(response.source).toBe('database');
    });
  });

  describe('API Integration - acceptSuggestion', () => {
    it('successfully saves AI recipe via accept endpoint', async () => {
      const generatedRecipe: GeneratedRecipe = {
        name: 'AI Chicken Stir Fry',
        description: 'A delicious stir fry',
        instructions: 'Cook and stir',
        ingredients: [
          { ingredient_id: 1, name: 'chicken', quantity: 500, unit: 'g' },
          { ingredient_id: 2, name: 'vegetables', quantity: 200, unit: 'g' },
        ],
        prep_time_minutes: 15,
        cook_time_minutes: 20,
        servings: 4,
        difficulty: 'medium',
      };

      server.use(
        http.post('*/suggestions/accept', async ({ request }) => {
          const body = (await request.json()) as any;
          expect(body.generated_recipe).toBeDefined();
          expect(body.generated_recipe.name).toBe('AI Chicken Stir Fry');

          return HttpResponse.json({
            id: 999,
            name: 'AI Chicken Stir Fry',
            description: 'A delicious stir fry',
            instructions: 'Cook and stir',
            prep_time_minutes: 15,
            cook_time_minutes: 20,
            servings: 4,
            difficulty: 'medium',
            cuisine_type: null,
            meal_type: null,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
            ingredients: [
              {
                id: 1,
                recipe_id: 999,
                ingredient_id: 1,
                quantity: 500,
                unit: 'g',
                ingredient_name: 'chicken',
              },
              {
                id: 2,
                recipe_id: 999,
                ingredient_id: 2,
                quantity: 200,
                unit: 'g',
                ingredient_name: 'vegetables',
              },
            ],
          });
        })
      );

      const result = await suggestionService.acceptSuggestion({
        generated_recipe: generatedRecipe,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(999);
      expect(result.name).toBe('AI Chicken Stir Fry');
      expect(result.ingredients).toHaveLength(2);
    });

    it('handles validation errors from accept endpoint', async () => {
      server.use(
        http.post('*/suggestions/accept', () => {
          return HttpResponse.json(
            { detail: 'Validation error: invalid recipe data' },
            { status: 422 }
          );
        })
      );

      const invalidRecipe: GeneratedRecipe = {
        name: '', // Invalid: empty name
        instructions: 'Cook',
        ingredients: [],
      };

      await expect(
        suggestionService.acceptSuggestion({ generated_recipe: invalidRecipe })
      ).rejects.toThrow();
    });

    it('handles server errors during save', async () => {
      server.use(
        http.post('*/suggestions/accept', () => {
          return HttpResponse.json({ detail: 'Database connection failed' }, { status: 500 });
        })
      );

      const recipe: GeneratedRecipe = {
        name: 'Test Recipe',
        instructions: 'Test',
        ingredients: [{ ingredient_id: 1, name: 'test', quantity: 100, unit: 'g' }],
      };

      await expect(
        suggestionService.acceptSuggestion({ generated_recipe: recipe })
      ).rejects.toThrow();
    });
  });

  describe('Cache Behavior', () => {
    it('indicates cache hits in response', async () => {
      server.use(
        http.post('*/suggestions/recipes', () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: 1,
                recipe_name: 'Cached Recipe',
                match_score: 0.9,
                reason: 'From cache',
                matched_ingredients: ['flour'],
                missing_ingredients: [],
                is_ai_generated: false,
                generated_recipe: null,
              },
            ],
            source: 'cache',
            cache_hit: true,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2, 3],
      };

      const response = await suggestionService.getSuggestions(request);

      expect(response.cache_hit).toBe(true);
      expect(response.source).toBe('cache');
    });
  });

  describe('Request Parameter Handling', () => {
    it('sends all request parameters to API', async () => {
      let capturedRequest: any = null;

      server.use(
        http.post('*/suggestions/recipes', async ({ request }) => {
          capturedRequest = await request.json();
          return HttpResponse.json({
            suggestions: [],
            source: 'database',
            cache_hit: false,
          });
        })
      );

      const request: SuggestionRequest = {
        available_ingredients: [1, 2, 3],
        max_prep_time: 30,
        max_cook_time: 45,
        difficulty: 'easy',
        dietary_restrictions: ['vegetarian'],
      };

      await suggestionService.getSuggestions(request);

      expect(capturedRequest).toEqual(request);
      expect(capturedRequest.available_ingredients).toEqual([1, 2, 3]);
      expect(capturedRequest.max_prep_time).toBe(30);
      expect(capturedRequest.max_cook_time).toBe(45);
      expect(capturedRequest.difficulty).toBe('easy');
      expect(capturedRequest.dietary_restrictions).toEqual(['vegetarian']);
    });
  });
});
