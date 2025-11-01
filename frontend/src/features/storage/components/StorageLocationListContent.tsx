import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationCard } from './StorageLocationCard';

interface StorageLocationListContentProps {
  orderedLocations: string[];
  grouped: LocationToIngredientsMap;
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationListContent({
  orderedLocations,
  grouped,
  onEdit,
  onDelete,
}: StorageLocationListContentProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--pico-spacing)',
      }}
    >
      {orderedLocations.map((location) => (
        <StorageLocationCard
          key={location}
          location={location}
          ingredients={grouped[location]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


