import { useMemo } from 'react';
import type { IngredientFilters, IngredientRead } from '../../../shared/types/ingredient';
import { useIngredients } from './useIngredients';
import type { SortColumn, SortDirection } from './useIngredientFilters';
import { sortIngredients } from '../services/ingredientSorting';

export interface UseIngredientListReturn {
  ingredients: IngredientRead[];
  loading: boolean;
  error: any;
  create: ReturnType<typeof useIngredients>['create'];
  remove: ReturnType<typeof useIngredients>['remove'];
  isSubmitting: boolean;
}

export function useIngredientList(
  appliedFilters: IngredientFilters,
  sortColumn: SortColumn,
  sortDirection: SortDirection
): UseIngredientListReturn {
  const { ingredients: rawIngredients, loading, error, create, remove, isSubmitting } =
    useIngredients(appliedFilters);

  const ingredients = useMemo(
    () => sortIngredients(rawIngredients || [], sortColumn, sortDirection),
    [rawIngredients, sortColumn, sortDirection]
  );

  return { ingredients, loading, error, create, remove, isSubmitting };
}


