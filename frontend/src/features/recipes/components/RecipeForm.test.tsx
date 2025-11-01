import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { RecipeForm } from './RecipeForm';
import type { RecipeDetail } from '../../../shared/types';

// Mock the useRecipeAI hook
vi.mock('../hooks/useRecipeAI', () => ({
  useRecipeAI: () => ({
    generateRecipe: vi.fn(),
    generating: false,
    generationError: null,
    convertGeneratedToCreate: vi.fn(),
  }),
}));

// Mock RecipeIngredientInput
vi.mock('./RecipeIngredientInput', () => ({
  RecipeIngredientInput: () => <div data-testid="recipe-ingredient-input">Ingredients</div>,
}));

// Mock RecipeAIAssistant
vi.mock('./RecipeAIAssistant', () => ({
  RecipeAIAssistant: () => <div data-testid="recipe-ai-assistant">AI Assistant</div>,
}));

describe('RecipeForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Compilation', () => {
    it('should compile without duplicate declaration errors', () => {
      // This test verifies that the component can be imported and rendered
      // without TypeScript/Babel errors like "Identifier 'X' has already been declared"
      expect(() => {
        render(
          <RecipeForm
            onSubmit={mockOnSubmit}
            onCancel={mockOnCancel}
            loading={false}
          />
        );
      }).not.toThrow();
    });

    it('should render without errors', () => {
      render(
        <RecipeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('should render form fields correctly', () => {
      render(
        <RecipeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prep time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cook time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
    });

    it('should render AI Assistant component', () => {
      render(
        <RecipeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      expect(screen.getByTestId('recipe-ai-assistant')).toBeInTheDocument();
    });

    it('should render with initial data when provided', () => {
      const initialData = {
        ingredientIds: [1, 2],
        name: 'Test Recipe',
        description: 'Test Description',
      };

      render(
        <RecipeForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          loading={false}
          initialData={initialData}
        />
      );

      const nameInput = screen.getByLabelText(/recipe name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Test Recipe');
    });

    it('should render with recipe data when editing', () => {
      const recipe: RecipeDetail = {
        id: 1,
        name: 'Existing Recipe',
        description: 'Existing Description',
        instructions: 'Existing Instructions',
        prep_time: 10,
        cook_time: 20,
        servings: 4,
        difficulty: 'easy',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_deleted: false,
        ingredients: [],
        missing_ingredients: [],
      };

      render(
        <RecipeForm
          recipe={recipe}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          loading={false}
        />
      );

      const nameInput = screen.getByLabelText(/recipe name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Existing Recipe');
    });
  });

  describe('Form Interaction', () => {
    it('should call onSubmit when form is submitted with valid data', async () => {
      const user = userEvent.setup();
      render(
        <RecipeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      const nameInput = screen.getByLabelText(/recipe name/i);
      const instructionsInput = screen.getByLabelText(/instructions/i);
      const submitButton = screen.getByRole('button', { name: /create recipe/i });

      await user.type(nameInput, 'Test Recipe');
      await user.type(instructionsInput, 'Test Instructions');
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Recipe',
          instructions: 'Test Instructions',
        })
      );
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RecipeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});

