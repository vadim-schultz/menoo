import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationCard } from './StorageLocationCard';
import { SimpleGrid } from '../../../shared/components/ui/Layout';

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
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
      {orderedLocations.map((location) => (
        <StorageLocationCard
          key={location}
          location={location}
          ingredients={grouped[location]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
}


