import type { IngredientRead } from '../../../shared/types/ingredient';
import { EmptyState } from './EmptyState';

export interface IngredientListProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function IngredientList({ ingredients, onEdit, onDelete }: IngredientListProps) {
  if (ingredients.length === 0) {
    return <EmptyState />;
  }
  return (
    <ul>
      {ingredients.map((ingredient, idx) => (
        <li key={ingredient.id ?? idx}>
          {ingredient.name}
          <button type="button" onClick={() => onEdit(ingredient)} style={{ marginLeft: '1rem' }}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(ingredient.id)} style={{ marginLeft: '0.5rem' }}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
