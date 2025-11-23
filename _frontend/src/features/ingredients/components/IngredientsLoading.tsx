import { Box, Text, Spinner, Stack } from '@chakra-ui/react';

export function IngredientsLoading() {
  return (
    <Box textAlign="center" py={8}>
      <Stack align="center" gap={4}>
        <Spinner size="lg" />
        <Text>Loading...</Text>
      </Stack>
    </Box>
  );
}


