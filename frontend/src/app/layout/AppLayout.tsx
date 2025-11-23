import { Box, Container, Flex, Heading } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'
import { ColorModeButton } from '../../shared/components/ui/ColorModeButton'

export function AppLayout() {
  return (
    <Box minH="100vh" bg="bg" color="fg">
      <Box borderBottomWidth="1px" borderColor="border">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading size="lg">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Menoo
              </Link>
            </Heading>
            <Flex gap={4} align="center">
              <Link to="/ingredients" style={{ textDecoration: 'none' }}>
                Ingredients
              </Link>
              <Link to="/recipes" style={{ textDecoration: 'none' }}>
                Recipes
              </Link>
              <ColorModeButton />
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  )
}
