import { useApiMutation } from '../../../shared/hooks';
import { suggestionService } from '../../../shared/services';
import type { RecipeCreate, RecipeIngredientCreate } from '../../../shared/types';
import type { SuggestionRequest, SuggestionResponse } from '../../../shared/types';

export function useRecipeAI() {
  const { mutate: generateRecipe, loading: generating, error: generationError } = useApiMutation(
    (request: SuggestionRequest) => suggestionService.getSuggestions(request)
  );

  const convertGeneratedToCreate = (generated: any): RecipeCreate => {
    return {
      name: generated.name,
      description: generated.description || null,
      instructions: generated.instructions,
      prep_time: generated?.timing?.prep_time_minutes ?? null,
      cook_time: generated?.timing?.cook_time_minutes ?? null,
      servings: generated.servings || 4,
      difficulty: null,
      ingredients: (generated.ingredients || [])
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

