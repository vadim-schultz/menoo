import { Box, Text, Spinner, Stack } from '@chakra-ui/react';

export function RecipesLoading() {
  return (
    <Box textAlign="center" p={4}>
      <Stack align="center" gap={2}>
        <Spinner size="lg" />
        <Text>Loading recipes...</Text>
      </Stack>
    </Box>
  );
}


