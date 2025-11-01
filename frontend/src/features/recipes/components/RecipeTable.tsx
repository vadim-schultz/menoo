import type { RecipeDetail } from '../../../shared/types';
import { RecipeTableEmpty } from './RecipeTableEmpty';
import { RecipeTableContent } from './RecipeTableContent';

interface RecipeTableProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeTable({ recipes, onEdit, onDelete }: RecipeTableProps) {
  if (recipes.length === 0) {
    return <RecipeTableEmpty />;
  }
  return <RecipeTableContent recipes={recipes} onEdit={onEdit} onDelete={onDelete} />;
}

