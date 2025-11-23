import { Box, Button, Card, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { ingredientsCount, recipesCount, isLoading } = useDashboard()

  return (
    <Box>
      <Heading size="xl" mb={8}>
        Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Card.Root p={6}>
          <Card.Header pb={4}>
            <Heading size="md">Ingredients</Heading>
          </Card.Header>
          <Card.Body>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {isLoading ? '...' : ingredientsCount}
            </Text>
            <Text color="fg.muted" mb={4} fontSize="sm">
              Total ingredients in your inventory
            </Text>
            <Link to="/ingredients">
              <Button colorPalette="blue" size="sm">View Ingredients</Button>
            </Link>
          </Card.Body>
        </Card.Root>

        <Card.Root p={6}>
          <Card.Header pb={4}>
            <Heading size="md">Recipes</Heading>
          </Card.Header>
          <Card.Body>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {isLoading ? '...' : recipesCount}
            </Text>
            <Text color="fg.muted" mb={4} fontSize="sm">
              Total recipes in your collection
            </Text>
            <Link to="/recipes">
              <Button colorPalette="blue" size="sm">View Recipes</Button>
            </Link>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  )
}
