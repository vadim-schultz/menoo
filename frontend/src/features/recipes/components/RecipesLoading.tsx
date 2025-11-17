import { Box, Text, Spinner, Stack } from '@chakra-ui/react';

export function RecipesLoading() {
  return (
    <Box textAlign="center" py={8}>
      <Stack align="center" gap={4}>
        <Spinner size="lg" />
        <Text>Loading recipes...</Text>
      </Stack>
    </Box>
  );
}


