import type { RecipeDetail } from '../../../shared/types';
import { Button } from '../../../shared/components';
import { Pencil, Trash2 } from 'lucide-preact';
import { formatTime } from '../services/recipeFormatting';

interface RecipeCardProps {
  recipe: RecipeDetail;
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const totalIngredients = recipe.ingredients?.length || 0;

  return (
    <article style={{ border: '1px solid var(--pico-border-color)', borderRadius: 'var(--pico-border-radius)', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>{recipe.name}</h3>
          {recipe.description && <p style={{ marginTop: '0.25rem', color: 'var(--pico-muted-color)' }}>{recipe.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button icon={Pencil} variant="secondary" onClick={() => onEdit(recipe)} aria-label="Edit recipe" />
          <Button icon={Trash2} variant="danger" onClick={() => onDelete(recipe.id)} aria-label="Delete recipe" />
        </div>
      </header>

      <section style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        <div>
          <small style={{ color: 'var(--pico-muted-color)' }}>Prep</small>
          <div>{formatTime((recipe as any).prep_time)}</div>
        </div>
        <div>
          <small style={{ color: 'var(--pico-muted-color)' }}>Cook</small>
          <div>{formatTime((recipe as any).cook_time)}</div>
        </div>
        <div>
          <small style={{ color: 'var(--pico-muted-color)' }}>Servings</small>
          <div>{recipe.servings || '-'}</div>
        </div>
        <div>
          <small style={{ color: 'var(--pico-muted-color)' }}>Ingredients</small>
          <div>{totalIngredients}</div>
        </div>
      </section>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section style={{ marginTop: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Ingredients</h4>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.ingredient_name}: {ing.quantity} {ing.unit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.instructions && (
        <section style={{ marginTop: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Preparation</h4>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{recipe.instructions}</pre>
        </section>
      )}
    </article>
  );
}


