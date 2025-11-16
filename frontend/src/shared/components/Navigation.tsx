import { Utensils, Package } from 'lucide-preact';
import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react';

export function Navigation() {
  return (
    <Box borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.lg" py={2}>
        <Flex align="center" gap={3}>
          <Text as="b" fontSize="md">
            <Link href="/" textDecoration="none">
              Menoo
            </Link>
          </Text>
          <HStack spacing={4} ml="auto">
            <Link href="/ingredients" display="inline-flex" alignItems="center" gap="0.5rem">
              <Package size={16} />
              Ingredients
            </Link>
            <Link href="/recipes" display="inline-flex" alignItems="center" gap="0.5rem">
              <Utensils size={16} />
              Recipes
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
