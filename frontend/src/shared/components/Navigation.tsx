import { Utensils, Package } from 'lucide-react';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <Box borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.lg" py={2}>
        <Flex align="center" gap={3}>
          <Text as="b" fontSize="md">
            <Link to="/" style={{ textDecoration: 'none' }}>
              Menoo
            </Link>
          </Text>
          <HStack gap={4} ml="auto">
            <Link to="/ingredients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={16} />
              Ingredients
            </Link>
            <Link to="/recipes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={16} />
              Recipes
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
