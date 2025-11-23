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
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="lg" fontWeight="semibold">
          Ingredients ({ingredients.length})
        </Text>
        <Button onClick={onAddClick} colorPalette="blue">
          Add Ingredient
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
                Quantity (g)
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Category
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} fontWeight="semibold" bg="bg.subtle">
                Storage Location
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ingredients.map((ingredient) => (
              <Table.Row key={ingredient.id} _hover={{ bg: 'bg.muted' }}>
                <Table.Cell px={4} py={3}>{ingredient.name}</Table.Cell>
                <Table.Cell px={4} py={3}>{ingredient.quantity}</Table.Cell>
                <Table.Cell px={4} py={3}>{ingredient.category || '-'}</Table.Cell>
                <Table.Cell px={4} py={3}>{ingredient.storage_location || '-'}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}

