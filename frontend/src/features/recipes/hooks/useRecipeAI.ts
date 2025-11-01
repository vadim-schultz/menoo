import { useApiMutation } from '../../../shared/hooks';
import { recipeService } from '../../../shared/services';
import type { RecipeGenerationRequest, RecipeCreate, RecipeIngredientCreate } from '../../../shared/types';
import type { GeneratedRecipe } from '../../../shared/types/suggestion';

export function useRecipeAI() {
  const { mutate: generateRecipe, loading: generating, error: generationError } =
    useApiMutation((request: RecipeGenerationRequest) => recipeService.generateRecipe(request));

  const convertGeneratedToCreate = (generated: GeneratedRecipe): RecipeCreate => {
    return {
      name: generated.name,
      description: generated.description || null,
      instructions: generated.instructions,
      prep_time: generated.prep_time_minutes || null,
      cook_time: generated.cook_time_minutes || null,
      servings: generated.servings || 4,
      difficulty: (generated.difficulty as 'easy' | 'medium' | 'hard') || null,
      ingredients: generated.ingredients
        .filter((ing) => ing.ingredient_id > 0)
        .map(
          (ing): RecipeIngredientCreate => ({
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
            is_optional: false,
            note: null,
          })
        ),
    };
  };

  return {
    generateRecipe,
    generating,
    generationError,
    convertGeneratedToCreate,
  };
}

