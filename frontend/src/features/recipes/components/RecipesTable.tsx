import {
  Box,
  Button,
  Table,
  Text,
  Flex,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
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
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Recipes ({recipes.length})
        </Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Recipe
        </Button>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Cuisine</Table.ColumnHeader>
            <Table.ColumnHeader>Dietary Preferences</Table.ColumnHeader>
            <Table.ColumnHeader>Mealtime</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recipes.map((recipe) => (
            <Table.Row key={recipe.id}>
              <Table.Cell>{recipe.name || '-'}</Table.Cell>
              <Table.Cell>
                {recipe.cuisine_types && recipe.cuisine_types.length > 0
                  ? recipe.cuisine_types.join(', ')
                  : '-'}
              </Table.Cell>
              <Table.Cell>
                {recipe.dietary_requirements && recipe.dietary_requirements.length > 0
                  ? recipe.dietary_requirements.join(', ')
                  : '-'}
              </Table.Cell>
              <Table.Cell>
                {recipe.meal_types && recipe.meal_types.length > 0
                  ? recipe.meal_types.join(', ')
                  : '-'}
              </Table.Cell>
              <Table.Cell>
                <Link to={`/recipes/${recipe.id}`} style={{ color: 'inherit' }}>
                  View
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
