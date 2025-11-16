import type { RecipeIngredientCreate } from '../../../shared/types';
import type { UseFormReturn } from '../../../shared/hooks';
import type { RecipeCreate } from '../../../shared/types';
import { useRecipeAI } from './useRecipeAI';
import type { SuggestionRequest } from '../../../shared/types';

export function useRecipeFormAI(
  form: UseFormReturn<RecipeCreate>,
  ingredients: RecipeIngredientCreate[],
  setIngredients: (ings: RecipeIngredientCreate[]) => void
) {
  const { generateRecipe, convertGeneratedToCreate } = useRecipeAI();

  const handleGenerateRecipe = async () => {
    const ingredientIds = ingredients
      .filter((ing) => ing.ingredient_id > 0)
      .map((ing) => ing.ingredient_id);

    if (ingredientIds.length === 0) {
      alert('Please add at least one ingredient before generating a recipe');
      return;
    }

    const request: SuggestionRequest = {
      recipe: {
        name: form.values.name || null,
        description: form.values.description || null,
        instructions: form.values.instructions || null,
        servings: form.values.servings || null,
        timing: {
          prep_time_minutes: form.values.prep_time || null,
          cook_time_minutes: form.values.cook_time || null,
        },
        ingredients: ingredientIds.map((id) => ({
          ingredient_id: id,
          quantity: 1,
          unit: 'unit',
          is_optional: false,
          notes: null,
        })),
      },
      n_completions: 1,
    };

    const response = await generateRecipe(request);
    const first = (response as any)?.recipes?.[0] || null;
    if (!first) return;
    const recipeCreate = convertGeneratedToCreate(first);

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

    const request: SuggestionRequest = {
      recipe: {
        name: form.values.name || null,
        description: form.values.description || null,
        instructions: form.values.instructions || null,
        servings: form.values.servings || null,
        timing: {
          prep_time_minutes: form.values.prep_time || null,
          cook_time_minutes: form.values.cook_time || null,
        },
        ingredients: ingredientIds.map((id) => ({
          ingredient_id: id,
          quantity: 1,
          unit: 'unit',
          is_optional: false,
          notes: null,
        })),
      },
      n_completions: 1,
    };

    const response = await generateRecipe(request);
    const first = (response as any)?.recipes?.[0] || null;
    if (!first) return;
    const recipeCreate = convertGeneratedToCreate(first);

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
    // difficulty is not provided by backend; leave unchanged

    if (recipeCreate.ingredients && recipeCreate.ingredients.length > 0) {
      setIngredients(recipeCreate.ingredients);
    }
  };

  return { handleGenerateRecipe, handleEnhanceRecipe };
}


