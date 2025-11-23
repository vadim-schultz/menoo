import { Box, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { useRecipesTable } from '../hooks/useRecipesTable'
import { RecipesTable } from '../components/RecipesTable'
import { AddRecipeModal } from '../components/AddRecipeModal'

export function RecipesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, isLoading } = useRecipesTable()

  return (
    <Box>
      <Heading size="xl" mb={8}>
        Recipes
      </Heading>
      <RecipesTable
        recipes={data?.items || []}
        isLoading={isLoading}
        onAddClick={() => setIsModalOpen(true)}
      />
      <AddRecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  )
}

