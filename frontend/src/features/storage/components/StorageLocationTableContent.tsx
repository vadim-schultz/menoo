import type { IngredientRead } from '../../../shared/types/ingredient';
import { Pencil, Trash2 } from 'lucide-preact';
import { Button } from '../../../shared/components';
import { formatDate } from '../services';

interface StorageLocationTableContentProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationTableContent({ ingredients, onEdit, onDelete }: StorageLocationTableContentProps) {
  return (
    <figure style={{ overflowX: 'auto', margin: 0 }}>
      <table role="grid" style={{ fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Expiry</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.quantity}g</td>
              <td>{formatDate(ingredient.expiry_date)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button
                    icon={Pencil}
                    variant="secondary"
                    onClick={() => onEdit(ingredient)}
                    type="button"
                    aria-label="Edit ingredient"
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    onClick={() => onDelete(ingredient.id)}
                    type="button"
                    aria-label="Delete ingredient"
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


