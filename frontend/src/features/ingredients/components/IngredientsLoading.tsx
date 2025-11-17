import { Box, Text, Spinner, Stack } from '@chakra-ui/react';

export function IngredientsLoading() {
  return (
    <Box textAlign="center" p={4}>
      <Stack align="center" gap={2}>
        <Spinner size="lg" />
        <Text>Loading...</Text>
      </Stack>
    </Box>
  );
}


