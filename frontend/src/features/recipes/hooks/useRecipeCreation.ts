import { useState } from 'react';
import { useRecipeAI } from './useRecipeAI';
import type { RecipeCreate, RecipeIngredientCreate } from '../../../shared/types';
import type { SuggestionRequest } from '../../../shared/types';
import { ingredientService } from '../../ingredients/services/ingredientService';

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
      
      // Hydrate ingredient names
      if (recipeCreate.ingredients && recipeCreate.ingredients.length > 0) {
        const uniqueIngredientIds = [...new Set(
          recipeCreate.ingredients
            .map(ing => ing.ingredient_id)
            .filter((id): id is number => id !== undefined && id > 0)
        )];
        
        if (uniqueIngredientIds.length > 0) {
          try {
            const ingredientMap = new Map<number, string>();
            await Promise.all(
              uniqueIngredientIds.map(async (id) => {
                try {
                  const ingredient = await ingredientService.get(id);
                  ingredientMap.set(id, ingredient.name);
                } catch (err) {
                  console.warn(`Failed to fetch ingredient ${id}:`, err);
                }
              })
            );
            
            // Inject ingredient_name into each ingredient
            recipeCreate.ingredients = recipeCreate.ingredients.map((ing) => ({
              ...ing,
              ingredient_name: ing.ingredient_id && ingredientMap.has(ing.ingredient_id)
                ? ingredientMap.get(ing.ingredient_id)!
                : ing.ingredient_name,
            })) as RecipeIngredientCreate[];
          } catch (err) {
            console.warn('Failed to hydrate ingredient names:', err);
            // Continue with fallback names
          }
        }
      }
      
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

