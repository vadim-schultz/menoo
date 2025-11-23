import {
  Box,
  Button,
  Table,
  Text,
  Flex,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import type { RecipeResponse } from '../../../shared/types'

interface RecipesTableProps {
  recipes: RecipeResponse[]
  isLoading?: boolean
  onAddClick: () => void
}

export function RecipesTable({ recipes, isLoading, onAddClick }: RecipesTableProps) {
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (recipes.length === 0) {
    return (
      <Box>
        <Text mb={4}>No recipes found.</Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Recipe
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="lg" fontWeight="semibold">
          Recipes ({recipes.length})
        </Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Recipe
        </Button>
      </Flex>
      <Box borderRadius="md" borderWidth="1px" borderColor="border" overflow="hidden">
        <Table.Root variant="outline" size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Name
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Cuisine
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Dietary Preferences
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Mealtime
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recipes.map((recipe) => (
              <Table.Row key={recipe.id} _hover={{ bg: 'bg.muted' }}>
                <Table.Cell px={4} py={3}>{recipe.name || '-'}</Table.Cell>
                <Table.Cell px={4} py={3}>
                  {recipe.cuisine_types && recipe.cuisine_types.length > 0
                    ? recipe.cuisine_types.join(', ')
                    : '-'}
                </Table.Cell>
                <Table.Cell px={4} py={3}>
                  {recipe.dietary_requirements && recipe.dietary_requirements.length > 0
                    ? recipe.dietary_requirements.join(', ')
                    : '-'}
                </Table.Cell>
                <Table.Cell px={4} py={3}>
                  {recipe.meal_types && recipe.meal_types.length > 0
                    ? recipe.meal_types.join(', ')
                    : '-'}
                </Table.Cell>
                <Table.Cell px={4} py={3}>
                  <ChakraLink asChild colorPalette="blue">
                    <RouterLink to={`/recipes/${recipe.id}`}>View</RouterLink>
                  </ChakraLink>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
