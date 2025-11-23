import { Box, Text } from '@chakra-ui/react';

export function RecipeTableEmpty() {
  return (
    <Box textAlign="center" py={8}>
      <Text>No recipes yet. Add your first recipe to get started!</Text>
    </Box>
  );
}


