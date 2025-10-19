import type { RecipeDetail } from '../../../shared/types';
import { Button } from '../../../shared/components';

interface RecipeListProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeList({ recipes, onEdit, onDelete }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
          No recipes yet. Add your first recipe to get started!
        </p>
      </div>
    );
  }

  const formatDifficulty = (difficulty?: string | null) => {
    if (!difficulty) return 'Not specified';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const formatTime = (minutes?: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {recipes.map((recipe) => {
        const totalTime = recipe.total_time ? formatTime(recipe.total_time) : null;
        const prepTime = formatTime(recipe.prep_time);
        const cookTime = formatTime(recipe.cook_time);

        return (
          <div key={recipe.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{recipe.name}</h3>

                {recipe.description && (
                  <p style={{ color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                    {recipe.description}
                  </p>
                )}

                <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <p>
                      <strong>Difficulty:</strong> {formatDifficulty(recipe.difficulty)}
                    </p>

                    {recipe.servings && (
                      <p>
                        <strong>Servings:</strong> {recipe.servings}
                      </p>
                    )}

                    {recipe.ingredients && (
                      <p>
                        <strong>Ingredients:</strong> {recipe.ingredients.length}
                      </p>
                    )}
                  </div>

                  {(prepTime || cookTime || totalTime) && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        marginTop: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {prepTime && (
                        <p>
                          <strong>Prep:</strong> {prepTime}
                        </p>
                      )}
                      {cookTime && (
                        <p>
                          <strong>Cook:</strong> {cookTime}
                        </p>
                      )}
                      {totalTime && (
                        <p>
                          <strong>Total:</strong> {totalTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <Button variant="secondary" onClick={() => onEdit(recipe)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(recipe.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
