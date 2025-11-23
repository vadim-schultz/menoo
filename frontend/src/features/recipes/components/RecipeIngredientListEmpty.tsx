import { Text } from '@chakra-ui/react';

export function RecipeIngredientListEmpty() {
  return (
    <Text color="fg.muted" fontSize="sm" fontStyle="italic">
      No ingredients added yet. Select an ingredient and click confirm to add.
    </Text>
  );
}


