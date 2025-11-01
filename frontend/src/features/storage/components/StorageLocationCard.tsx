import type { IngredientRead } from '../../../shared/types/ingredient';
import { StorageLocationTable } from './StorageLocationTable';
import { formatLocationName } from '../services';

interface StorageLocationCardProps {
  location: string;
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationCard({ location, ingredients, onEdit, onDelete }: StorageLocationCardProps) {
  return (
    <article>
      <header>
        <h3 style={{ margin: 0 }}>{formatLocationName(location)}</h3>
        <small style={{ color: 'var(--pico-muted-color)' }}>{ingredients.length} items</small>
      </header>
      <StorageLocationTable ingredients={ingredients} onEdit={onEdit} onDelete={onDelete} />
    </article>
  );
}


