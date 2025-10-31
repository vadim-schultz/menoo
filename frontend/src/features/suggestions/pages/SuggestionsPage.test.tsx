import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { SuggestionsPage } from './SuggestionsPage';
import { server } from '../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('SuggestionsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    server.resetHandlers();

    // Add default ingredients handler for the form
    server.use(
      http.get('/api/v1/ingredients', () => {
        return HttpResponse.json({
          items: [
            { id: 1, name: 'flour', storage_location: 'pantry', quantity: 100, unit: 'g' },
            { id: 2, name: 'sugar', storage_location: 'pantry', quantity: 200, unit: 'g' },
          ],
          total: 2,
          page: 1,
          page_size: 1000,
        });
      })
    );
  });

  // Helper to wait for ingredients to load and select one
  const selectIngredientAndSubmit = async () => {
    await waitFor(() => {
      expect(screen.getByText('flour')).toBeInTheDocument();
    });
    // Get all checkboxes and click the first one (flour ingredient checkbox)
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    await user.click(checkboxes[0]);
    const submitButton = screen.getByRole('button', { name: /get recipe suggestions/i });
    await user.click(submitButton);
  };

  describe('Initial Render', () => {
    it('renders page title', () => {
      render(<SuggestionsPage />);
      expect(screen.getByText('Cooking Suggestions')).toBeInTheDocument();
    });

    it('renders suggestion form', () => {
      render(<SuggestionsPage />);
      expect(screen.getByRole('button', { name: /get recipe suggestions/i })).toBeInTheDocument();
    });

    it('does not show suggestions initially', () => {
      render(<SuggestionsPage />);
      expect(
        screen.queryByRole('heading', { name: /Recipe Suggestions/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Getting Suggestions', () => {
    it('displays suggestions after successful fetch', async () => {
      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: 1,
                recipe_name: 'Spaghetti Carbonara',
                match_score: 0.85,
                reason: 'You have most ingredients',
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

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      });
      expect(screen.getByText(/85% Match/i)).toBeInTheDocument();
    });

    it('displays AI-generated suggestions', async () => {
      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: null,
                recipe_name: 'AI Stir Fry',
                match_score: 0.95,
                reason: 'Created for you',
                matched_ingredients: ['chicken', 'vegetables'],
                missing_ingredients: [],
                is_ai_generated: true,
                generated_recipe: {
                  name: 'AI Stir Fry',
                  description: 'Delicious stir fry',
                  instructions: 'Cook it',
                  ingredients: [{ ingredient_id: 1, name: 'chicken', quantity: 500, unit: 'g' }],
                  prep_time_minutes: 15,
                  cook_time_minutes: 20,
                  servings: 4,
                  difficulty: 'Easy',
                },
              },
            ],
            source: 'ai',
            cache_hit: false,
          });
        })
      );

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('AI Stir Fry')).toBeInTheDocument();
      });
      expect(screen.getByText('🤖 AI Generated')).toBeInTheDocument();
      expect(screen.getByText('💾 Save Recipe')).toBeInTheDocument();
    });

    it('displays empty state when no suggestions found', async () => {
      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({ suggestions: [], source: 'database', cache_hit: false });
        })
      );

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(
          screen.getByText(/No recipes found with your selected ingredients/i)
        ).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
        })
      );

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Failed to get recipe suggestions. Please try again.'
        );
      });

      alertSpy.mockRestore();
    });
  });

  describe('Saving AI Recipes', () => {
    it('saves AI recipe when save button clicked', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: null,
                recipe_name: 'AI Recipe',
                match_score: 0.9,
                reason: 'AI generated',
                matched_ingredients: ['flour'],
                missing_ingredients: [],
                is_ai_generated: true,
                generated_recipe: {
                  name: 'AI Recipe',
                  instructions: 'Cook',
                  ingredients: [{ ingredient_id: 1, name: 'flour', quantity: 100, unit: 'g' }],
                },
              },
            ],
            source: 'ai',
            cache_hit: false,
          });
        }),
        http.post('/api/v1/suggestions/accept', async () => {
          return HttpResponse.json({
            id: 999,
            name: 'AI Recipe',
            description: null,
            instructions: 'Cook',
            prep_time_minutes: null,
            cook_time_minutes: null,
            servings: 4,
            difficulty: 'Easy',
            cuisine_type: null,
            meal_type: null,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
            ingredients: [],
          });
        })
      );

      render(<SuggestionsPage />);

      // Get suggestions
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('AI Recipe')).toBeInTheDocument();
      });

      // Save the AI recipe
      const saveButton = screen.getByText('💾 Save Recipe');
      await user.click(saveButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('Recipe "AI Recipe" saved successfully')
        );
      });

      alertSpy.mockRestore();
    });

    it('handles save errors', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: null,
                recipe_name: 'AI Recipe',
                match_score: 0.9,
                reason: 'AI generated',
                matched_ingredients: ['flour'],
                missing_ingredients: [],
                is_ai_generated: true,
                generated_recipe: {
                  name: 'AI Recipe',
                  instructions: 'Cook',
                  ingredients: [{ ingredient_id: 1, name: 'flour', quantity: 100, unit: 'g' }],
                },
              },
            ],
            source: 'ai',
            cache_hit: false,
          });
        }),
        http.post('/api/v1/suggestions/accept', async () => {
          return HttpResponse.json({ detail: 'Save failed' }, { status: 500 });
        })
      );

      render(<SuggestionsPage />);

      // Get suggestions
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('AI Recipe')).toBeInTheDocument();
      });

      // Try to save the AI recipe
      const saveButton = screen.getByText('💾 Save Recipe');
      await user.click(saveButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to save recipe. Please try again.');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Recipe Selection', () => {
    it('allows selecting traditional recipes', async () => {
      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: 1,
                recipe_name: 'Recipe 1',
                match_score: 0.8,
                reason: 'Good match',
                matched_ingredients: ['flour'],
                missing_ingredients: [],
                is_ai_generated: false,
                generated_recipe: null,
              },
            ],
            source: 'database',
            cache_hit: false,
          });
        })
      );

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('Recipe 1')).toBeInTheDocument();
      });

      const recipeCheckbox = screen.getByRole('checkbox', { name: 'Recipe 1' });
      await user.click(recipeCheckbox);

      const shoppingListButton = await screen.findByText(/Generate Shopping List \(1\)/i);
      expect(shoppingListButton).toBeInTheDocument();
    });

    it('allows selecting multiple recipes', async () => {
      server.use(
        http.post('/api/v1/suggestions/recipes', async () => {
          return HttpResponse.json({
            suggestions: [
              {
                recipe_id: 1,
                recipe_name: 'Recipe 1',
                match_score: 0.8,
                reason: 'Good match',
                matched_ingredients: ['flour'],
                missing_ingredients: [],
                is_ai_generated: false,
                generated_recipe: null,
              },
              {
                recipe_id: 2,
                recipe_name: 'Recipe 2',
                match_score: 0.7,
                reason: 'Okay match',
                matched_ingredients: ['sugar'],
                missing_ingredients: [],
                is_ai_generated: false,
                generated_recipe: null,
              },
            ],
            source: 'database',
            cache_hit: false,
          });
        })
      );

      render(<SuggestionsPage />);
      await selectIngredientAndSubmit();

      await waitFor(() => {
        expect(screen.getByText('Recipe 1')).toBeInTheDocument();
        expect(screen.getByText('Recipe 2')).toBeInTheDocument();
      });

      const recipe1Checkbox = screen.getByRole('checkbox', { name: 'Recipe 1' });
      const recipe2Checkbox = screen.getByRole('checkbox', { name: 'Recipe 2' });

      await user.click(recipe1Checkbox);
      await user.click(recipe2Checkbox);

      const shoppingListButton = await waitFor(() =>
        screen.getByRole('button', { name: /Generate Shopping List \(2\)/i })
      );
      expect(shoppingListButton).toBeInTheDocument();
    });

    it('shows and updates the generate shopping list button', async () => {
      await selectIngredientAndSubmit();

      const recipe1Checkbox = await screen.findByLabelText('Recipe 1');
      await user.click(recipe1Checkbox);

      const shoppingListButton1 = await waitFor(() =>
        screen.getByRole('button', { name: /Generate Shopping List \(1\)/i })
      );
      expect(shoppingListButton1).toBeInTheDocument();

      const recipe2Checkbox = await screen.findByLabelText('Recipe 2');
      await user.click(recipe2Checkbox);

      const shoppingListButton2 = await waitFor(() =>
        screen.getByRole('button', { name: /Generate Shopping List \(2\)/i })
      );
      expect(shoppingListButton2).toBeInTheDocument();
    });

    it('clears selection when getting new suggestions', async () => {
      await selectIngredientAndSubmit();

      const recipeCheckbox = await screen.findByLabelText('Recipe 1');
      await user.click(recipeCheckbox);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Generate Shopping List \(1\)/i })
        ).toBeInTheDocument();
      });

      // Get new suggestions
      const submitButton = screen.getByRole('button', { name: /Get Recipe Suggestions/i });
      await user.click(submitButton);

      // Check that the button is gone
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: /Generate Shopping List/i })
        ).not.toBeInTheDocument();
      });
    });
  });
});
