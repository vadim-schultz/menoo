import type { IngredientRead } from '../../../shared/types';
import { Button } from '../../../shared/components';

interface IngredientListProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function IngredientList({ ingredients, onEdit, onDelete }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
          No ingredients yet. Add your first ingredient to get started!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {ingredients.map((ingredient) => (
        <div key={ingredient.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{ingredient.name}</h3>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                <p>
                  <strong>Quantity:</strong> {ingredient.quantity} {ingredient.unit}
                </p>
                {ingredient.storage_location && (
                  <p>
                    <strong>Location:</strong> {ingredient.storage_location}
                  </p>
                )}
                {ingredient.expiry_date && (
                  <p>
                    <strong>Expires:</strong>{' '}
                    {new Date(ingredient.expiry_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => onEdit(ingredient)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(ingredient.id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
