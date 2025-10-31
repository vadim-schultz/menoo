import { useApi, useApiMutation } from '../../../shared/hooks';
import { ingredientService } from '../services/ingredientService';
import type {
  IngredientRead,
  IngredientCreate,
  IngredientPatch,
  IngredientFilters,
} from '../../../shared/types/ingredient';

export const useIngredients = (filters?: IngredientFilters) => {
  const stableKey = JSON.stringify(filters || {});
  const { data: ingredients, loading, error, refetch } = useApi(
    () => ingredientService.list(filters),
    [stableKey]
  );

  const { mutate: createMutation, loading: creating } = useApiMutation(ingredientService.create);
  const { mutate: updateMutation, loading: updating } = useApiMutation(
    (id: number, data: IngredientPatch) => ingredientService.update(id, data)
  );
  const { mutate: deleteMutation, loading: deleting } = useApiMutation(ingredientService.delete);

  const create = async (data: IngredientCreate): Promise<IngredientRead> => {
    const result = await createMutation(data);
    await refetch();
    return result;
  };

  const update = async (id: number, data: IngredientPatch): Promise<IngredientRead> => {
    const result = await updateMutation(id, data);
    await refetch();
    return result;
  };

  const remove = async (id: number): Promise<void> => {
    await deleteMutation(id);
    await refetch();
  };

  return {
    ingredients: ingredients || [],
    loading,
    error,
    create,
    update,
    remove,
    isSubmitting: creating || updating || deleting,
  };
};
