import type { RecipeCreate } from '../../../shared/types';

export function validateRecipe(values: RecipeCreate) {
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
}


