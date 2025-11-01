import { useEffect, useMemo, useState, useCallback } from 'preact/hooks';
import type { IngredientRead } from '../../../shared/types/ingredient';
import type { RecipeIngredientCreate } from '../../../shared/types';
import { ingredientService } from '../../ingredients/services/ingredientService';

export interface UseRecipeIngredientInputReturn {
  availableIngredients: IngredientRead[];
  ingredientOptions: { value: string; label: string }[];
  loading: boolean;
  entryIngredientId: number;
  setEntryIngredientId: (id: number) => void;
  entryQuantity: number;
  setEntryQuantity: (qty: number) => void;
  confirmEntryAdd: (ingredients: RecipeIngredientCreate[], onChange: (ings: RecipeIngredientCreate[]) => void) => void;
  removeIngredient: (ingredients: RecipeIngredientCreate[], index: number, onChange: (ings: RecipeIngredientCreate[]) => void) => void;
  updateIngredient: (
    ingredients: RecipeIngredientCreate[],
    index: number,
    field: keyof RecipeIngredientCreate,
    value: any,
    onChange: (ings: RecipeIngredientCreate[]) => void
  ) => void;
}

export function useRecipeIngredientInput(): UseRecipeIngredientInputReturn {
  const [availableIngredients, setAvailableIngredients] = useState<IngredientRead[]>([]);
  const [loading, setLoading] = useState(false);

  // Entry form state (top row)
  const [entryIngredientId, setEntryIngredientId] = useState<number>(0);
  const [entryQuantity, setEntryQuantity] = useState<number>(0);

  useEffect(() => {
    const loadIngredients = async () => {
      setLoading(true);
      try {
        const response = await ingredientService.list({ page_size: 1000 });
        setAvailableIngredients(response);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    loadIngredients();
  }, []);

  const ingredientOptions = useMemo(
    () =>
      availableIngredients.map((ing) => ({
        value: String(ing.id),
        label: `${ing.name} (${ing.quantity || 0})`,
      })),
    [availableIngredients]
  );

  const confirmEntryAdd = useCallback(
    (ingredients: RecipeIngredientCreate[], onChange: (ings: RecipeIngredientCreate[]) => void) => {
      if (!entryIngredientId || entryQuantity <= 0) return;
      const newIngredient: RecipeIngredientCreate = {
        ingredient_id: entryIngredientId,
        quantity: entryQuantity,
        unit: 'unit',
        is_optional: false,
        note: null,
      };
      onChange([...ingredients, newIngredient]);
      setEntryQuantity(0);
    },
    [entryIngredientId, entryQuantity]
  );

  const removeIngredient = useCallback(
    (ingredients: RecipeIngredientCreate[], index: number, onChange: (ings: RecipeIngredientCreate[]) => void) => {
      onChange(ingredients.filter((_, i) => i !== index));
    },
    []
  );

  const updateIngredient = useCallback(
    (
      ingredients: RecipeIngredientCreate[],
      index: number,
      field: keyof RecipeIngredientCreate,
      value: any,
      onChange: (ings: RecipeIngredientCreate[]) => void
    ) => {
      const updated = ingredients.map((ing, i) => {
        if (i === index) {
          return { ...(ing as any), [field]: value } as RecipeIngredientCreate;
        }
        return ing;
      });
      onChange(updated);
    },
    []
  );

  return {
    availableIngredients,
    ingredientOptions,
    loading,
    entryIngredientId,
    setEntryIngredientId,
    entryQuantity,
    setEntryQuantity,
    confirmEntryAdd,
    removeIngredient,
    updateIngredient,
  };
}


