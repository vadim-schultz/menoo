import { recipeService } from '../../../shared/services';
import { ingredientService } from '../../ingredients/services/ingredientService';
import type { RecipeDetail, RecipeCreate, RecipeIngredientCreate } from '../../../shared/types';

export async function loadRecipeForEdit(id: number): Promise<RecipeDetail> {
  return recipeService.get(id);
}

export async function saveRecipe(
  editing: RecipeDetail | null,
  data: RecipeCreate,
  create: (d: RecipeCreate) => Promise<any>,
  update: (id: number, d: RecipeCreate) => Promise<any>
) {
  // Resolve any ingredients missing an ID by creating them (0 quantity in inventory)
  if (data.ingredients && data.ingredients.length > 0) {
    const resolved: RecipeIngredientCreate[] = [];
    for (const ing of data.ingredients) {
      if (!ing.ingredient_id && ing.ingredient_name) {
        const created = await ingredientService.create({
          name: ing.ingredient_name,
          quantity: 0,
          unit: ing.unit || 'unit',
          is_spice: false,
          is_allergen: false,
          notes: null,
        } as any);
        resolved.push({
          ingredient_id: created.id,
          quantity: ing.quantity,
          unit: ing.unit,
          is_optional: ing.is_optional ?? false,
          note: ing.note ?? null,
        });
      } else if (ing.ingredient_id) {
        resolved.push(ing);
      }
    }
    data = { ...data, ingredients: resolved };
  }
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


