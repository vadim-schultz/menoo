import type { IngredientRead } from '../../../shared/types/ingredient';
import { IngredientCard } from './IngredientCard';
import { EmptyState } from './EmptyState';

interface Props {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export const IngredientGrid = ({ ingredients, onEdit, onDelete }: Props) => {
  if (ingredients.length === 0) return <EmptyState />;

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {ingredients.map((ingredient) => (
        <IngredientCard
          key={ingredient.id}
          ingredient={ingredient}
          onEdit={() => onEdit(ingredient)}
          onDelete={() => onDelete(ingredient.id)}
        />
      ))}
    </div>
  );
};
