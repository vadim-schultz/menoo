import { useApi } from '../../../shared/hooks';
import { ingredientService } from '../../ingredients/services/ingredientService';
import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { groupIngredientsByLocation } from '../services';

export interface UseHomeIngredientsReturn {
  allIngredients: IngredientRead[];
  grouped: LocationToIngredientsMap;
  loading: boolean;
  error: any;
}

export function useHomeIngredients(): UseHomeIngredientsReturn {
  const { data, loading, error } = useApi(() => ingredientService.list({ page_size: 1000 }), []);
  const allIngredients = (data || []) as IngredientRead[];
  const grouped = groupIngredientsByLocation(allIngredients);
  return { allIngredients, grouped, loading, error };
}



