import type { RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Check } from 'lucide-preact';
import { useRecipeIngredientInput } from '../hooks/useRecipeIngredientInput';
import { RecipeIngredientListEmpty } from './RecipeIngredientListEmpty';
import { RecipeIngredientListContent } from './RecipeIngredientListContent';

interface RecipeIngredientInputProps {
  ingredients: RecipeIngredientCreate[];
  onChange: (ingredients: RecipeIngredientCreate[]) => void;
}

export function RecipeIngredientInput({ ingredients, onChange }: RecipeIngredientInputProps) {
  const {
    ingredientOptions,
    loading,
    entryIngredientId,
    entryIngredientName,
    setEntryIngredientId,
    setEntryIngredientName,
    entryQuantity,
    setEntryQuantity,
    confirmEntryAdd,
    removeIngredient,
    updateIngredient,
  } = useRecipeIngredientInput();

  return (
    <div>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontWeight: 500 }}>Ingredients</label>
      </div>

      {/* Entry form row (select existing or type a new name) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr auto',
          gap: '0.5rem',
          alignItems: 'end',
          marginBottom: '1rem',
        }}
      >
        <Select
          name={`entry-ingredient`}
          value={String(entryIngredientId || '')}
          onChange={(value) => setEntryIngredientId(parseInt(value) || 0)}
          options={ingredientOptions}
          placeholder="Select ingredient"
        />

        <Input
          name={`entry-ingredient-name`}
          value={entryIngredientName}
          onChange={(value) => setEntryIngredientName(value)}
          placeholder="Or type a new ingredient name"
        />

        <Input
          name={`entry-quantity`}
          type="number"
          value={entryQuantity}
          onChange={(value) => setEntryQuantity(parseFloat(value) || 0)}
          placeholder="Qty"
        />

        <div>
          <Button
            icon={Check}
            type="button"
            onClick={() => confirmEntryAdd(ingredients, onChange)}
            aria-label="Add ingredient"
            disabled={loading}
          />
        </div>
      </div>

      {ingredients.length === 0 ? (
        <RecipeIngredientListEmpty />
      ) : (
        <RecipeIngredientListContent
          ingredients={ingredients}
          ingredientOptions={ingredientOptions}
          onUpdate={(idx, field, value) => updateIngredient(ingredients, idx, field, value, onChange)}
          onRemove={(idx) => removeIngredient(ingredients, idx, onChange)}
        />
      )}
    </div>
  );
}
