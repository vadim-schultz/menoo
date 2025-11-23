import { Box, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { useIngredientsTable } from '../hooks/useIngredientsTable'
import { IngredientsTable } from '../components/IngredientsTable'
import { AddIngredientModal } from '../components/AddIngredientModal'

export function IngredientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: ingredients = [], isLoading } = useIngredientsTable()

  return (
    <Box>
      <Heading size="xl" mb={8}>
        Ingredients
      </Heading>
      <IngredientsTable
        ingredients={ingredients}
        isLoading={isLoading}
        onAddClick={() => setIsModalOpen(true)}
      />
      <AddIngredientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  )
}

