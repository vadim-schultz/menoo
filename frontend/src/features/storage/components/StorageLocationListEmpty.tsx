import { Box, Text } from '@chakra-ui/react';

export function StorageLocationListEmpty() {
  return (
    <Box textAlign="center" p={4}>
      <Text>No ingredients found. Add some ingredients to get started!</Text>
    </Box>
  );
}


