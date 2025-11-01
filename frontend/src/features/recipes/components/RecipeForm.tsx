import { useState } from 'preact/hooks';
import { useForm } from '../../../shared/hooks';
import type { RecipeCreate, RecipeDetail, RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Textarea } from '../../../shared/components/Input';
import { RecipeIngredientInput } from './RecipeIngredientInput';
// Removed RecipeAIAssistant; field-level generation triggers are used instead
import { useRecipeFormAI } from '../hooks/useRecipeFormAI';
import { difficultyOptions } from '../services/recipeOptions';
import { validateRecipe } from '../services/recipeValidation';

interface RecipeFormInitialData {
  ingredientIds?: number[];
  name?: string;
  description?: string;
}

interface RecipeFormProps {
  recipe?: RecipeDetail | null;
  onSubmit: (data: RecipeCreate) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: RecipeFormInitialData | null;
}

// options moved to services/recipeOptions

export function RecipeForm({
  recipe,
  onSubmit,
  onCancel,
  loading,
  initialData,
}: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<RecipeIngredientCreate[]>(
    recipe?.ingredients?.map((ing) => ({
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
      is_optional: ing.is_optional,
      note: ing.note,
    })) ||
      (initialData?.ingredientIds || []).map((id) => ({
        ingredient_id: id,
        quantity: 1,
        unit: 'unit',
        is_optional: false,
        note: null,
      })) ||
      []
  );

  // AI handlers moved to hook that uses useRecipeAI internally

  const handleSubmit = (values: RecipeCreate) => {
    // Include ingredients in the submission
    const data = {
      ...values,
      ingredients: ingredients.filter((ing) => ing.ingredient_id > 0),
    };
    onSubmit(data);
  };

  const form = useForm<RecipeCreate>({
    initialValues: recipe
      ? {
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
        }
      : {
          name: initialData?.name || '',
          description: initialData?.description || null,
          instructions: '',
          prep_time: null,
          cook_time: null,
          servings: 4,
          difficulty: null,
        },
    onSubmit: handleSubmit,
    validate: validateRecipe,
  });

  const { handleEnhanceRecipe } = useRecipeFormAI(form, ingredients, setIngredients);

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Ingredient selection moved to top */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RecipeIngredientInput ingredients={ingredients} onChange={setIngredients} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Recipe Name</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate recipe with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        <Input
          name="name"
          value={form.values.name}
          onChange={(value) => form.handleChange('name', value)}
          onBlur={() => form.handleBlur('name')}
          error={form.touched.name ? form.errors.name : undefined}
          placeholder="e.g., Spaghetti Carbonara"
          required
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Description</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate description with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        <Textarea
          name="description"
          value={form.values.description || ''}
          onChange={(value) => form.handleChange('description', value || null)}
          onBlur={() => form.handleBlur('description')}
          placeholder="Brief description of the recipe (optional)"
          rows={2}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Instructions</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate instructions with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        <Textarea
          name="instructions"
          value={form.values.instructions}
          onChange={(value) => form.handleChange('instructions', value)}
          onBlur={() => form.handleBlur('instructions')}
          error={form.touched.instructions ? form.errors.instructions : undefined}
          placeholder="Step-by-step cooking instructions"
          rows={6}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          label="Prep Time (minutes)"
          name="prep_time"
          type="number"
          value={form.values.prep_time || ''}
          onChange={(value) => form.handleChange('prep_time', value ? parseInt(value) : null)}
          onBlur={() => form.handleBlur('prep_time')}
          error={form.touched.prep_time ? form.errors.prep_time : undefined}
          placeholder="0"
        />

        <Input
          label="Cook Time (minutes)"
          name="cook_time"
          type="number"
          value={form.values.cook_time || ''}
          onChange={(value) => form.handleChange('cook_time', value ? parseInt(value) : null)}
          onBlur={() => form.handleBlur('cook_time')}
          error={form.touched.cook_time ? form.errors.cook_time : undefined}
          placeholder="0"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          label="Servings"
          name="servings"
          type="number"
          value={form.values.servings || ''}
          onChange={(value) => form.handleChange('servings', value ? parseInt(value) : undefined)}
          onBlur={() => form.handleBlur('servings')}
          error={form.touched.servings ? form.errors.servings : undefined}
          placeholder="4"
        />

        <Select
          label="Difficulty"
          name="difficulty"
          value={form.values.difficulty || ''}
          onChange={(value) => form.handleChange('difficulty', value || null)}
          options={difficultyOptions}
          placeholder="Select difficulty (optional)"
        />
      </div>

      {/* Removed RecipeAIAssistant; generation is triggered via ✨ buttons above */}

      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}
      >
        <Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}
