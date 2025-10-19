import { useState, useEffect } from 'preact/hooks';
import type { RecipeIngredientCreate, IngredientRead } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { ingredientService } from '../../../shared/services';

interface RecipeIngredientInputProps {
  ingredients: RecipeIngredientCreate[];
  onChange: (ingredients: RecipeIngredientCreate[]) => void;
}

export function RecipeIngredientInput({ ingredients, onChange }: RecipeIngredientInputProps) {
  const [availableIngredients, setAvailableIngredients] = useState<IngredientRead[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      setLoading(true);
      try {
        const response = await ingredientService.list({ page_size: 1000 });
        setAvailableIngredients(response.items);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    loadIngredients();
  }, []);

  const addIngredient = () => {
    const newIngredient: RecipeIngredientCreate = {
      ingredient_id: 0,
      quantity: 0,
      unit: '',
      is_optional: false,
      note: null,
    };
    onChange([...ingredients, newIngredient]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredientCreate, value: any) => {
    const updated = ingredients.map((ing, i) => {
      if (i === index) {
        return { ...ing, [field]: value };
      }
      return ing;
    });
    onChange(updated);
  };

  const ingredientOptions = availableIngredients.map((ing) => ({
    value: String(ing.id),
    label: `${ing.name} (${ing.quantity} ${ing.unit})`,
  }));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <label style={{ fontWeight: 500 }}>Ingredients</label>
        <Button variant="secondary" onClick={addIngredient} disabled={loading} type="button">
          + Add Ingredient
        </Button>
      </div>

      {ingredients.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', fontStyle: 'italic' }}>
          No ingredients added yet. Click "Add Ingredient" to get started.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {ingredients.map((ingredient, index) => {
            const selectedIngredient = availableIngredients.find(
              (ing) => ing.id === ingredient.ingredient_id
            );

            return (
              <div
                key={index}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              >
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '0.5rem',
                      alignItems: 'start',
                    }}
                  >
                    <Select
                      label="Ingredient"
                      name={`ingredient-${index}`}
                      value={String(ingredient.ingredient_id || '')}
                      onChange={(value) =>
                        updateIngredient(index, 'ingredient_id', parseInt(value) || 0)
                      }
                      options={ingredientOptions}
                      placeholder="Select ingredient"
                      required
                    />

                    <Input
                      label="Quantity"
                      name={`quantity-${index}`}
                      type="number"
                      value={ingredient.quantity}
                      onChange={(value) =>
                        updateIngredient(index, 'quantity', parseFloat(value) || 0)
                      }
                      required
                    />

                    <Input
                      label="Unit"
                      name={`unit-${index}`}
                      value={ingredient.unit}
                      onChange={(value) => updateIngredient(index, 'unit', value)}
                      placeholder={selectedIngredient?.unit || 'e.g., g, ml'}
                      required
                    />

                    <div style={{ paddingTop: '1.75rem' }}>
                      <Button
                        variant="danger"
                        onClick={() => removeIngredient(index)}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.5rem' }}>
                    <Input
                      label="Note (optional)"
                      name={`note-${index}`}
                      value={ingredient.note || ''}
                      onChange={(value) => updateIngredient(index, 'note', value || null)}
                      placeholder="e.g., finely chopped"
                    />

                    <div style={{ paddingTop: '1.75rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={ingredient.is_optional || false}
                          onChange={(e) =>
                            updateIngredient(
                              index,
                              'is_optional',
                              (e.target as HTMLInputElement).checked
                            )
                          }
                        />
                        Optional
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
