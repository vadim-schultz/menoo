import { Utensils, Package, Refrigerator } from 'lucide-react';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <Box borderBottom="1px" borderColor="gray.200" py={4}>
      <Container maxW="container.lg">
        <Flex align="center">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <Refrigerator size={20} />
          </Link>
          <HStack ml="auto" gap={4}>
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
