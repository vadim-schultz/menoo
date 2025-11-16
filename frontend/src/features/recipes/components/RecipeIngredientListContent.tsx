import type { RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Trash2 } from 'lucide-preact';

interface Props {
  ingredients: RecipeIngredientCreate[];
  ingredientOptions: { value: string; label: string }[];
  onUpdate: (index: number, field: keyof RecipeIngredientCreate, value: any) => void;
  onRemove: (index: number) => void;
}

export function RecipeIngredientListContent({ ingredients, ingredientOptions, onUpdate, onRemove }: Props) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'transparent',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr auto',
              gap: '0.5rem',
              alignItems: 'end',
            }}
          >
            <Select
              name={`ingredient-${index}`}
              value={String(ingredient.ingredient_id || '')}
              onChange={(value) => onUpdate(index, 'ingredient_id', parseInt(value) || 0)}
              options={ingredientOptions}
              placeholder="Ingredient"
            />

            <Input
              name={`quantity-${index}`}
              type="number"
              value={ingredient.quantity}
              onChange={(value) => onUpdate(index, 'quantity', parseFloat(value) || 0)}
              placeholder="Qty"
            />

            <div>
              <Button
                icon={Trash2}
                variant="danger"
                onClick={() => onRemove(index)}
                type="button"
                aria-label="Remove ingredient"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


