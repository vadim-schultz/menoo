import { useForm } from '../../../shared/hooks';
import type { IngredientCreate, IngredientRead } from '../../../shared/types/ingredient';
import { validateIngredient } from '../services/validation';

export const useIngredientForm = (
  ingredient: IngredientRead | null,
  onSubmit: (data: IngredientCreate) => Promise<void>
) => {
  return useForm<IngredientCreate>({
    initialValues: ingredient
      ? {
          name: ingredient.name,
          quantity: ingredient.quantity ?? null,
          unit: ingredient.unit || null,
          category: ingredient.category,
          storage_location: ingredient.storage_location,
          expiry_date: ingredient.expiry_date,
          notes: ingredient.notes || null,
        }
      : {
          name: '',
          quantity: null,
          unit: null,
          category: undefined,
          storage_location: null,
          expiry_date: null,
          notes: null,
        },
    validate: validateIngredient,
    onSubmit,
  });
};
