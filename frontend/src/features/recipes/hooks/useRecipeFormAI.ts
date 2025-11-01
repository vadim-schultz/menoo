import type { RecipeIngredientCreate } from '../../../shared/types';
import type { UseFormReturn } from '../../../shared/hooks';
import type { RecipeCreate, RecipeGenerationRequest } from '../../../shared/types';
import { useRecipeAI } from './useRecipeAI';

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

    if (recipeCreate.ingredients && recipeCreate.ingredients.length > 0) {
      setIngredients(recipeCreate.ingredients);
    }
  };

  return { handleGenerateRecipe, handleEnhanceRecipe };
}


