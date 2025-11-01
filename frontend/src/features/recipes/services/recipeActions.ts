import { recipeService } from '../../../shared/services';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';

export async function loadRecipeForEdit(id: number): Promise<RecipeDetail> {
  return recipeService.get(id);
}

export async function saveRecipe(
  editing: RecipeDetail | null,
  data: RecipeCreate,
  create: (d: RecipeCreate) => Promise<any>,
  update: (id: number, d: RecipeCreate) => Promise<any>
) {
  if (editing) {
    await update(editing.id, data);
  } else {
    await create(data);
  }
}

export async function confirmAndDeleteRecipe(
  id: number,
  remove: (id: number) => Promise<any>,
  confirmFn: (msg: string) => boolean = (msg) => (typeof window !== 'undefined' ? window.confirm(msg) : true)
) {
  if (!confirmFn('Are you sure you want to delete this recipe?')) return;
  await remove(id);
}


