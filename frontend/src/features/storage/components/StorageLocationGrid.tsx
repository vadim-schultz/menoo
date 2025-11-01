import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap, StorageLocationKey } from '../types';
import { DEFAULT_LOCATION_ORDER } from '../types';
import { StorageLocationList } from './StorageLocationList';
import { useOrderedLocations } from '../hooks';

interface StorageLocationGridProps {
  grouped: LocationToIngredientsMap;
  locationOrder?: StorageLocationKey[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationGrid({ grouped, locationOrder = DEFAULT_LOCATION_ORDER, onEdit, onDelete }: StorageLocationGridProps) {
  const orderedLocations = useOrderedLocations(grouped, locationOrder);
  return (
    <StorageLocationList orderedLocations={orderedLocations} grouped={grouped} onEdit={onEdit} onDelete={onDelete} />
  );
}


