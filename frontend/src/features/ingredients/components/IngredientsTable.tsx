import {
  Box,
  Button,
  Table,
  Text,
  Flex,
} from '@chakra-ui/react'
import type { IngredientResponse } from '../../../shared/types'

interface IngredientsTableProps {
  ingredients: IngredientResponse[]
  isLoading?: boolean
  onAddClick: () => void
}

export function IngredientsTable({ ingredients, isLoading, onAddClick }: IngredientsTableProps) {
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (ingredients.length === 0) {
    return (
      <Box>
        <Text mb={4}>No ingredients found.</Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Ingredient
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Ingredients ({ingredients.length})
        </Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Ingredient
        </Button>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Quantity (g)</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Storage Location</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ingredients.map((ingredient) => (
            <Table.Row key={ingredient.id}>
              <Table.Cell>{ingredient.name}</Table.Cell>
              <Table.Cell>{ingredient.quantity}</Table.Cell>
              <Table.Cell>{ingredient.category || '-'}</Table.Cell>
              <Table.Cell>{ingredient.storage_location || '-'}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

