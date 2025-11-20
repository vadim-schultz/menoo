import { useState } from 'react';
import { useRecipeAI } from './useRecipeAI';
import type { RecipeCreate } from '../../../shared/types';
import type { SuggestionRequest } from '../../../shared/types';

interface CreationPayload {
  ingredientIds: number[];
  cuisine?: string;
  dietaryRequirements: string[];
}

export function useRecipeCreation() {
  const { generateRecipe, generating, generationError, convertGeneratedToCreate } = useRecipeAI();
  const [suggestion, setSuggestion] = useState<RecipeCreate | null>(null);

  const generateFromPayload = async (payload: CreationPayload): Promise<RecipeCreate | null> => {
    const request: SuggestionRequest = {
      recipe: {
        ingredients: payload.ingredientIds.map((id) => ({
          ingredient_id: id,
          quantity: 1,
          unit: 'unit',
          is_optional: false,
          notes: null,
        })),
        cuisine_types: payload.cuisine ? [payload.cuisine as any] : [],
        dietary_requirements: payload.dietaryRequirements as any[],
      },
      n_completions: 1,
    };

    try {
      const response = await generateRecipe(request);
      const first = (response as any)?.recipes?.[0] || null;
      if (!first) {
        return null;
      }
      const recipeCreate = convertGeneratedToCreate(first);
      // Also include cuisine and dietary requirements in the result
      recipeCreate.cuisine_types = payload.cuisine ? [payload.cuisine] : [];
      recipeCreate.dietary_requirements = payload.dietaryRequirements;
      setSuggestion(recipeCreate);
      return recipeCreate;
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      return null;
    }
  };

  const clearSuggestion = () => {
    setSuggestion(null);
  };

  return {
    generateFromPayload,
    suggestion,
    generating,
    generationError,
    clearSuggestion,
  };
}

