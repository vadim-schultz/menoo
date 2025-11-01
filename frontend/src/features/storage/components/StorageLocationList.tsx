import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationListEmpty } from './StorageLocationListEmpty';
import { StorageLocationListContent } from './StorageLocationListContent';

interface StorageLocationListProps {
  orderedLocations: string[];
  grouped: LocationToIngredientsMap;
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationList({ orderedLocations, grouped, onEdit, onDelete }: StorageLocationListProps) {
  if (orderedLocations.length === 0) {
    return <StorageLocationListEmpty />;
  }
  return (
    <StorageLocationListContent
      orderedLocations={orderedLocations}
      grouped={grouped}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}


