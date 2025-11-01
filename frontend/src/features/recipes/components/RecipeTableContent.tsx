import type { RecipeDetail } from '../../../shared/types';
import { Pencil, Trash2 } from 'lucide-preact';
import { Button } from '../../../shared/components';
import { formatDifficulty, formatTime, truncateText } from '../services/recipeFormatting';

interface RecipeTableContentProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeTableContent({ recipes, onEdit, onDelete }: RecipeTableContentProps) {
  return (
    <figure style={{ overflowX: 'auto', margin: 0 }}>
      <table role="grid">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Prep Time</th>
            <th scope="col">Cook Time</th>
            <th scope="col">Servings</th>
            <th scope="col">Ingredients</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{truncateText(recipe.description)}</td>
              <td>{formatDifficulty(recipe.difficulty)}</td>
              <td>{formatTime(recipe.prep_time)}</td>
              <td>{formatTime(recipe.cook_time)}</td>
              <td>{recipe.servings || '-'}</td>
              <td>{recipe.ingredients?.length || 0}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    icon={Pencil}
                    variant="secondary"
                    onClick={() => onEdit(recipe)}
                    type="button"
                    aria-label="Edit recipe"
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    onClick={() => onDelete(recipe.id)}
                    type="button"
                    aria-label="Delete recipe"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}


