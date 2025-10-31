import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import '@testing-library/jest-dom/vitest';
import { SuggestionList } from './SuggestionList';
import type { RecipeSuggestion } from '../../../shared/types';

describe('SuggestionList', () => {
  const mockOnToggleRecipe = vi.fn();
  const mockOnGenerateShoppingList = vi.fn();
  const mockOnSaveAIRecipe = vi.fn();

  const traditionalSuggestion: RecipeSuggestion = {
    recipe_id: 1,
    recipe_name: 'Spaghetti Carbonara',
    match_score: 0.85,
    reason: 'You have most of the ingredients',
    matched_ingredients: ['pasta', 'eggs', 'cheese'],
    missing_ingredients: ['bacon'],
    is_ai_generated: false,
    generated_recipe: null,
  };

  const aiSuggestion: RecipeSuggestion = {
    recipe_id: null,
    recipe_name: 'AI Chicken Stir Fry',
    match_score: 0.95,
    reason: 'Created based on your available ingredients',
    matched_ingredients: ['chicken', 'vegetables', 'soy sauce'],
    missing_ingredients: [],
    is_ai_generated: true,
    generated_recipe: {
      name: 'AI Chicken Stir Fry',
      description: 'A delicious stir fry',
      instructions: 'Step 1: Cook chicken\nStep 2: Add vegetables',
      ingredients: [
        { ingredient_id: 1, name: 'chicken', quantity: 500, unit: 'g' },
        { ingredient_id: 2, name: 'vegetables', quantity: 2, unit: 'cups' },
      ],
      prep_time_minutes: 15,
      cook_time_minutes: 20,
      servings: 4,
      difficulty: 'Easy',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state message when no suggestions', () => {
      render(
        <SuggestionList
          suggestions={[]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText(/No recipe suggestions yet/i)).toBeInTheDocument();
    });
  });

  describe('Traditional Recipe Suggestions', () => {
    it('renders traditional recipe correctly', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText(/85% Match/i)).toBeInTheDocument();
      expect(screen.getByText(/You have most of the ingredients/i)).toBeInTheDocument();
    });

    it('displays matched ingredients in green', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText(/pasta, eggs, cheese/i)).toBeInTheDocument();
    });

    it('displays missing ingredients in red', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText(/bacon/i)).toBeInTheDocument();
    });

    it('toggles recipe selection when clicked', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      const card = screen.getByText('Spaghetti Carbonara').closest('.card');
      fireEvent.click(card!);

      expect(mockOnToggleRecipe).toHaveBeenCalledWith(1);
    });

    it('toggles recipe selection via checkbox', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      fireEvent.change(checkbox, { target: { checked: true } });

      expect(mockOnToggleRecipe).toHaveBeenCalledWith(1);
    });

    it('highlights selected recipes', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[1]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('shows match score with correct color coding', () => {
      const lowMatch = { ...traditionalSuggestion, match_score: 0.3 };
      const mediumMatch = { ...traditionalSuggestion, match_score: 0.6 };
      const highMatch = { ...traditionalSuggestion, match_score: 0.9 };

      const { rerender } = render(
        <SuggestionList
          suggestions={[highMatch]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );
      expect(screen.getByText(/90% Match/i)).toBeInTheDocument();

      rerender(
        <SuggestionList
          suggestions={[mediumMatch]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );
      expect(screen.getByText(/60% Match/i)).toBeInTheDocument();

      rerender(
        <SuggestionList
          suggestions={[lowMatch]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );
      expect(screen.getByText(/30% Match/i)).toBeInTheDocument();
    });
  });

  describe('AI-Generated Recipe Suggestions', () => {
    it('renders AI badge for AI-generated recipes', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText('🤖 AI Generated')).toBeInTheDocument();
    });

    it('displays AI recipe description', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText('A delicious stir fry')).toBeInTheDocument();
    });

    it('displays AI recipe metadata', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText(/Prep:/i)).toBeInTheDocument();
      expect(screen.getByText(/15 min/i)).toBeInTheDocument();
      expect(screen.getByText(/Cook:/i)).toBeInTheDocument();
      expect(screen.getByText(/20 min/i)).toBeInTheDocument();
      expect(screen.getByText(/Servings:/i)).toBeInTheDocument();
      expect(screen.getByText(/4/i)).toBeInTheDocument();
      expect(screen.getByText(/Difficulty:/i)).toBeInTheDocument();
      expect(screen.getByText(/Easy/i)).toBeInTheDocument();
    });

    it('shows Save Recipe button for AI recipes', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText('💾 Save Recipe')).toBeInTheDocument();
    });

    it('calls onSaveAIRecipe when save button clicked', async () => {
      mockOnSaveAIRecipe.mockResolvedValue(undefined);

      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      const saveButton = screen.getByText('💾 Save Recipe');
      fireEvent.click(saveButton);

      expect(mockOnSaveAIRecipe).toHaveBeenCalledWith(aiSuggestion);
    });

    it('shows loading state when saving AI recipe', async () => {
      let resolveSave: () => void;
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve;
      });
      mockOnSaveAIRecipe.mockReturnValue(savePromise);

      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      const saveButton = screen.getByText('💾 Save Recipe');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });

      resolveSave!();
    });

    it('does not show checkbox for AI recipes', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('expands recipe details on details click', () => {
      render(
        <SuggestionList
          suggestions={[aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      const summary = screen.getByText('View Full Recipe');
      fireEvent.click(summary);

      expect(screen.getByText('Ingredients:')).toBeInTheDocument();
      expect(screen.getAllByText(/chicken/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Instructions:')).toBeInTheDocument();
    });
  });

  describe('Shopping List Generation', () => {
    it('shows shopping list button when recipes selected', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[1]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText('Generate Shopping List (1)')).toBeInTheDocument();
    });

    it('hides shopping list button when no recipes selected', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.queryByText(/Generate Shopping List/i)).not.toBeInTheDocument();
    });

    it('calls onGenerateShoppingList when button clicked', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[1]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      const button = screen.getByText('Generate Shopping List (1)');
      fireEvent.click(button);

      expect(mockOnGenerateShoppingList).toHaveBeenCalled();
    });

    it('disables shopping list button when loading', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion]}
          selectedRecipes={[1]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          loading={true}
        />
      );

      const button = screen.getByText('Generate Shopping List (1)') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('updates count when multiple recipes selected', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion, { ...traditionalSuggestion, recipe_id: 2 }]}
          selectedRecipes={[1, 2]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
        />
      );

      expect(screen.getByText('Generate Shopping List (2)')).toBeInTheDocument();
    });
  });

  describe('Mixed Suggestions', () => {
    it('renders both traditional and AI suggestions together', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion, aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('AI Chicken Stir Fry')).toBeInTheDocument();
      expect(screen.getByText('🤖 AI Generated')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('💾 Save Recipe')).toBeInTheDocument();
    });

    it('displays correct total count', () => {
      render(
        <SuggestionList
          suggestions={[traditionalSuggestion, aiSuggestion]}
          selectedRecipes={[]}
          onToggleRecipe={mockOnToggleRecipe}
          onGenerateShoppingList={mockOnGenerateShoppingList}
          onSaveAIRecipe={mockOnSaveAIRecipe}
        />
      );

      expect(screen.getByText('Recipe Suggestions (2)')).toBeInTheDocument();
    });
  });
});
