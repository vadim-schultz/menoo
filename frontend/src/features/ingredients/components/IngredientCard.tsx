import type { IngredientRead } from '../../../shared/types/ingredient';
import { Button } from '../../../shared/components';

interface Props {
  ingredient: IngredientRead;
  onEdit: () => void;
  onDelete: () => void;
}

export const IngredientCard = ({ ingredient, onEdit, onDelete }: Props) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{ingredient.name}</h3>
        <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
          <p>
            <strong>Quantity:</strong> {ingredient.quantity}g
          </p>
          {ingredient.storage_location && (
            <p>
              <strong>Location:</strong> {ingredient.storage_location}
            </p>
          )}
          {ingredient.expiry_date && (
            <p>
              <strong>Expires:</strong> {new Date(ingredient.expiry_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  </div>
);
