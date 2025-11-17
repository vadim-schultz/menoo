import type { RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Trash2 } from 'lucide-react';
import { Stack, Box, SimpleGrid } from '@chakra-ui/react';

interface Props {
  ingredients: RecipeIngredientCreate[];
  ingredientOptions: { value: string; label: string }[];
  onUpdate: (index: number, field: keyof RecipeIngredientCreate, value: any) => void;
  onRemove: (index: number) => void;
}

export function RecipeIngredientListContent({ ingredients, ingredientOptions, onUpdate, onRemove }: Props) {
  return (
    <Stack gap={2}>
      {ingredients.map((ingredient, index) => (
        <Box
          key={index}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="transparent"
          p={4}
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} alignItems="end" gap={4}>
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

            <Box>
              <Button
                icon={Trash2}
                variant="danger"
                onClick={() => onRemove(index)}
                type="button"
                aria-label="Remove ingredient"
              />
            </Box>
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  );
}


