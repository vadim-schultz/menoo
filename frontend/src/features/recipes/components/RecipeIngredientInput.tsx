import type { RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Check } from 'lucide-react';
import { useRecipeIngredientInput } from '../hooks/useRecipeIngredientInput';
import { RecipeIngredientListEmpty } from './RecipeIngredientListEmpty';
import { RecipeIngredientListContent } from './RecipeIngredientListContent';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

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
    <Box>
      <Text fontWeight={500} mb={2}>
        Ingredients
      </Text>

      {/* Entry form row (select existing or type a new name) */}
      <SimpleGrid columns={{ base: 1, md: 4 }} alignItems="end" gap={4} mb={4}>
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

        <Box>
          <Button
            icon={Check}
            type="button"
            onClick={() => confirmEntryAdd(ingredients, onChange)}
            aria-label="Add ingredient"
            disabled={loading}
          />
        </Box>
      </SimpleGrid>

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
    </Box>
  );
}
