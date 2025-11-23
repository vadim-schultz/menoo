import { useApiMutation } from '../../../shared/hooks';
import { suggestionService } from '../../../shared/services';
import type { RecipeCreate, RecipeIngredientCreate, SuggestionRequest } from '../../../shared/types';

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
      ingredients: ((generated.ingredients as Partial<RecipeIngredientCreate>[] | undefined) || [])
        .filter(
          (ing): ing is RecipeIngredientCreate & { ingredient_id: number } =>
            typeof ing.ingredient_id === 'number' && ing.ingredient_id > 0
        )
        .map(
          (ing): RecipeIngredientCreate => ({
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity ?? 1,
            unit: ing.unit ?? 'unit',
            is_optional: ing.is_optional ?? false,
            note: ing.note ?? null,
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

