import { Box, Heading, Text, Spinner, Link as ChakraLink } from '@chakra-ui/react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useRecipeDetail } from '../hooks/useRecipeDetail'
import { RecipeDetailAccordion } from '../components/RecipeDetailAccordion'

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const recipeId = id ? parseInt(id, 10) : 0
  const { data: recipe, isLoading, isError } = useRecipeDetail(recipeId)

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    )
  }

  if (isError || !recipe) {
    return (
      <Box>
        <Text>Recipe not found.</Text>
        <ChakraLink asChild>
          <RouterLink to="/recipes">Back to Recipes</RouterLink>
        </ChakraLink>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="xl" mb={8}>
        {recipe.name || 'Recipe Details'}
      </Heading>
      <RecipeDetailAccordion recipe={recipe} />
    </Box>
  )
}
