import type { IngredientCreate, IngredientRead } from '../../../shared/types/ingredient';

export type CreateIngredientFn = (data: IngredientCreate) => Promise<IngredientRead>;
export type UpdateIngredientFn = (id: number, data: IngredientCreate) => Promise<IngredientRead>;
export type RemoveIngredientFn = (id: number) => Promise<void>;

export async function saveIngredient(
  editing: IngredientRead | null,
  data: IngredientCreate,
  create: CreateIngredientFn,
  update: UpdateIngredientFn,
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): Promise<void> {
  try {
    if (editing) {
      await update(editing.id, data);
    } else {
      await create(data);
    }
    onSuccess && onSuccess();
  } catch (err) {
    onError && onError(err);
    throw err;
  }
}

export async function confirmAndDelete(
  id: number,
  remove: RemoveIngredientFn,
  confirmFn: (message: string) => boolean = (message) => (typeof window !== 'undefined' ? window.confirm(message) : true),
  onError?: (error: unknown) => void
): Promise<void> {
  if (!confirmFn('Delete this ingredient?')) return;
  try {
    await remove(id);
  } catch (err) {
    onError && onError(err);
    throw err;
  }
}


