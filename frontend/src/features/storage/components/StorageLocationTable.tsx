import type { IngredientRead } from '../../../shared/types/ingredient';
import { StorageLocationTableEmpty } from './StorageLocationTableEmpty';
import { StorageLocationTableContent } from './StorageLocationTableContent';

interface StorageLocationTableProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationTable({ ingredients, onEdit, onDelete }: StorageLocationTableProps) {
  if (ingredients.length === 0) {
    return <StorageLocationTableEmpty />;
  }
  return <StorageLocationTableContent ingredients={ingredients} onEdit={onEdit} onDelete={onDelete} />;
}


