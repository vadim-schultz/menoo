import { useState } from 'preact/hooks';
import { useForm } from '../../../shared/hooks';
import type { RecipeCreate, RecipeDetail, RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Textarea } from '../../../shared/components/Input';
import { RecipeIngredientInput } from './RecipeIngredientInput';
import { RecipeAIAssistant } from './RecipeAIAssistant';
import { useRecipeAI } from '../hooks/useRecipeAI';
import type { RecipeGenerationRequest } from '../../../shared/types';

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

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

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

  const { generateRecipe, generating, generationError, convertGeneratedToCreate } = useRecipeAI();

  const validate = (values: RecipeCreate) => {
    const errors: Record<string, string> = {};

    if (!values.name || values.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!values.instructions || values.instructions.trim() === '') {
      errors.instructions = 'Instructions are required';
    }

    if (values.prep_time && values.prep_time < 0) {
      errors.prep_time = 'Prep time must be positive';
    }

    if (values.cook_time && values.cook_time < 0) {
      errors.cook_time = 'Cook time must be positive';
    }

    if (values.servings && values.servings < 1) {
      errors.servings = 'Servings must be at least 1';
    }

    return errors;
  };

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
    validate,
  });

  const handleGenerateRecipe = async () => {
    const ingredientIds = ingredients
      .filter((ing) => ing.ingredient_id > 0)
      .map((ing) => ing.ingredient_id);

    if (ingredientIds.length === 0) {
      alert('Please add at least one ingredient before generating a recipe');
      return;
    }

    try {
      const request: RecipeGenerationRequest = {
        name: form.values.name || null,
        description: form.values.description,
        ingredients: ingredientIds,
        max_prep_time: form.values.prep_time || null,
        max_cook_time: form.values.cook_time || null,
        difficulty: form.values.difficulty || null,
        enhance_existing: false,
      };

      const generated = await generateRecipe(request);
      const recipeCreate = convertGeneratedToCreate(generated);

      // Apply generated recipe to form
      form.setValues({
        name: recipeCreate.name,
        description: recipeCreate.description || null,
        instructions: recipeCreate.instructions,
        prep_time: recipeCreate.prep_time,
        cook_time: recipeCreate.cook_time,
        servings: recipeCreate.servings,
        difficulty: recipeCreate.difficulty,
      });

      setIngredients(recipeCreate.ingredients || []);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    }
  };

  const handleEnhanceRecipe = async () => {
    const ingredientIds = ingredients
      .filter((ing) => ing.ingredient_id > 0)
      .map((ing) => ing.ingredient_id);

    if (ingredientIds.length === 0) {
      alert('Please add at least one ingredient before enhancing a recipe');
      return;
    }

    if (!form.values.name && !form.values.description) {
      alert('Please provide at least a recipe name or description to enhance');
      return;
    }

    try {
      const request: RecipeGenerationRequest = {
        name: form.values.name || null,
        description: form.values.description,
        ingredients: ingredientIds,
        max_prep_time: form.values.prep_time || null,
        max_cook_time: form.values.cook_time || null,
        difficulty: form.values.difficulty || null,
        enhance_existing: true,
      };

      const generated = await generateRecipe(request);
      const recipeCreate = convertGeneratedToCreate(generated);

      // Fill missing fields only
      if (!form.values.name && recipeCreate.name) {
        form.handleChange('name', recipeCreate.name);
      }
      if (!form.values.description && recipeCreate.description) {
        form.handleChange('description', recipeCreate.description);
      }
      if (!form.values.instructions && recipeCreate.instructions) {
        form.handleChange('instructions', recipeCreate.instructions);
      }
      if (!form.values.prep_time && recipeCreate.prep_time) {
        form.handleChange('prep_time', recipeCreate.prep_time);
      }
      if (!form.values.cook_time && recipeCreate.cook_time) {
        form.handleChange('cook_time', recipeCreate.cook_time);
      }
      if (!form.values.servings && recipeCreate.servings) {
        form.handleChange('servings', recipeCreate.servings);
      }
      if (!form.values.difficulty && recipeCreate.difficulty) {
        form.handleChange('difficulty', recipeCreate.difficulty);
      }

      // Update ingredients if generated ones exist
      if (recipeCreate.ingredients && recipeCreate.ingredients.length > 0) {
        setIngredients(recipeCreate.ingredients);
      }
    } catch (error) {
      console.error('Failed to enhance recipe:', error);
      alert('Failed to enhance recipe. Please try again.');
    }
  };

  const hasIngredients = ingredients.some((ing) => ing.ingredient_id > 0);
  const hasPartialRecipe = !!(form.values.name || form.values.description);
  const canGenerate = hasIngredients;
  const canEnhance = hasIngredients && hasPartialRecipe;

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <Input
          label="Recipe Name"
          name="name"
          value={form.values.name}
          onChange={(value) => form.handleChange('name', value)}
          onBlur={() => form.handleBlur('name')}
          error={form.touched.name ? form.errors.name : undefined}
          placeholder="e.g., Spaghetti Carbonara"
          required
        />
        {!form.values.name && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
            💡 Tip: Leave blank to let AI suggest a recipe name based on your ingredients
          </p>
        )}
      </div>

      <Textarea
        label="Description"
        name="description"
        value={form.values.description || ''}
        onChange={(value) => form.handleChange('description', value || null)}
        onBlur={() => form.handleBlur('description')}
        placeholder="Brief description of the recipe (optional)"
        rows={2}
      />

      <div>
        <Textarea
          label="Instructions"
          name="instructions"
          value={form.values.instructions}
          onChange={(value) => form.handleChange('instructions', value)}
          onBlur={() => form.handleBlur('instructions')}
          error={form.touched.instructions ? form.errors.instructions : undefined}
          placeholder="Step-by-step cooking instructions"
          rows={6}
          required
        />
        {!form.values.instructions && hasIngredients && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
            💡 Tip: Click "Fill with AI" below to generate instructions automatically
          </p>
        )}
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

      <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
        <RecipeIngredientInput ingredients={ingredients} onChange={setIngredients} />
      </div>

      <RecipeAIAssistant
        canGenerate={canGenerate}
        canEnhance={canEnhance}
        generating={generating}
        onGenerate={handleGenerateRecipe}
        onEnhance={handleEnhanceRecipe}
        generationError={generationError}
      />

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
