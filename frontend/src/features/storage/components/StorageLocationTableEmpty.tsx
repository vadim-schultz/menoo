import { Text } from '@chakra-ui/react';

export function StorageLocationTableEmpty() {
  return (
    <Text textAlign="center" p={4} fontSize="sm" color="gray.600">
      No ingredients in this location
    </Text>
  );
}


