import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap, StorageLocationKey } from '../types/home';

export function groupIngredientsByLocation(allIngredients: IngredientRead[]): LocationToIngredientsMap {
  const groups: LocationToIngredientsMap = {};
  for (const ing of allIngredients) {
    const key = ing.storage_location || 'unspecified';
    if (!groups[key]) groups[key] = [];
    groups[key].push(ing);
  }
  return groups;
}

export function getOrderedLocations(
  grouped: LocationToIngredientsMap,
  locationOrder: StorageLocationKey[]
): string[] {
  return [
    ...locationOrder.filter((loc) => grouped[loc] && grouped[loc].length > 0),
    ...Object.keys(grouped).filter((loc) => !locationOrder.includes(loc as StorageLocationKey)),
  ];
}


