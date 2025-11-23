import React from 'react';
import { Utensils, Package, Refrigerator } from 'lucide-react';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
      }}
      {...props}
    >
      <Box
        display="inline-flex"
        alignItems="center"
        gap={2}
        color="fg.muted"
        fontWeight="500"
        px={3}
        py={2}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{
          color: 'fg.default',
          bg: 'bg.subtle',
        }}
        {...props}
      >
        {children}
      </Box>
    </Link>
  );
};

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <Box bg="bg.surface" borderBottomWidth="1px" borderBottomColor="border.subtle">
      <Container maxW="7xl" px={4}>
        <Flex align="center" py={4}>
          <NavLink
            to="/"
            color={isActive('/') ? 'fg.default' : 'fg.muted'}
            bg={isActive('/') ? 'bg.subtle' : 'transparent'}
          >
            <Refrigerator size={20} />
            <Text as="span" display={{ base: 'none', sm: 'inline' }}>
              Menoo
            </Text>
          </NavLink>
          <HStack ml="auto" gap={2}>
            <NavLink
              to="/ingredients"
              color={isActive('/ingredients') ? 'fg.default' : 'fg.muted'}
              bg={isActive('/ingredients') ? 'bg.subtle' : 'transparent'}
            >
              <Package size={16} />
              <Text as="span">Ingredients</Text>
            </NavLink>
            <NavLink
              to="/recipes"
              color={isActive('/recipes') ? 'fg.default' : 'fg.muted'}
              bg={isActive('/recipes') ? 'bg.subtle' : 'transparent'}
            >
              <Utensils size={16} />
              <Text as="span">Recipes</Text>
            </NavLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
