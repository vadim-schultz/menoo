import type { RecipeDetail } from '../../../shared/types';
import { RecipeTable } from './RecipeTable';

interface RecipeListProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeList({ recipes, onEdit, onDelete }: RecipeListProps) {
  return <RecipeTable recipes={recipes} onEdit={onEdit} onDelete={onDelete} />;
}


