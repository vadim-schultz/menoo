import type { RecipeDetail } from '../../../shared/types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeList({ recipes, onEdit, onDelete }: RecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return <p style={{ color: '#4A5568' }}>No recipes yet.</p>;
  }
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}


