import { useState } from 'preact/hooks';
import { useForm } from '../../../shared/hooks';
import type { RecipeCreate, RecipeDetail, RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Textarea } from '../../../shared/components/Input';
import { RecipeIngredientInput } from './RecipeIngredientInput';

interface RecipeFormProps {
  recipe?: RecipeDetail | null;
  onSubmit: (data: RecipeCreate) => void;
  onCancel: () => void;
  loading: boolean;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function RecipeForm({ recipe, onSubmit, onCancel, loading }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<RecipeIngredientCreate[]>(
    recipe?.ingredients?.map((ing) => ({
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
      is_optional: ing.is_optional,
      note: ing.note,
    })) || []
  );

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
          name: '',
          description: null,
          instructions: '',
          prep_time: null,
          cook_time: null,
          servings: 4,
          difficulty: null,
        },
    onSubmit: handleSubmit,
    validate,
  });

  return (
    <form onSubmit={form.handleSubmit}>
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

      <Textarea
        label="Description"
        name="description"
        value={form.values.description || ''}
        onChange={(value) => form.handleChange('description', value || null)}
        onBlur={() => form.handleBlur('description')}
        placeholder="Brief description of the recipe (optional)"
        rows={2}
      />

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
