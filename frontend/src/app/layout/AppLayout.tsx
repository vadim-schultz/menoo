import { Box, Container, Flex, Heading, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { ColorModeButton } from '../../shared/components/ui/ColorModeButton'

export function AppLayout() {
  return (
    <Box minH="100vh" bg="bg" color="fg">
      <Box borderBottomWidth="1px" borderColor="border" bg="bg" shadow="sm">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading size="lg" fontWeight="bold">
              <ChakraLink asChild _hover={{ opacity: 0.8 }}>
                <RouterLink to="/">Menoo</RouterLink>
              </ChakraLink>
            </Heading>
            <Flex gap={6} align="center">
              <ChakraLink asChild fontWeight="medium" _hover={{ color: 'blue.600' }}>
                <RouterLink to="/ingredients">Ingredients</RouterLink>
              </ChakraLink>
              <ChakraLink asChild fontWeight="medium" _hover={{ color: 'blue.600' }}>
                <RouterLink to="/recipes">Recipes</RouterLink>
              </ChakraLink>
              <ColorModeButton />
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8} px={4}>
        <Outlet />
      </Container>
    </Box>
  )
}
