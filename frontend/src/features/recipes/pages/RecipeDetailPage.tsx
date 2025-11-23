import { Box, Heading, Text, Spinner } from '@chakra-ui/react'
import { useParams, Link } from 'react-router-dom'
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
        <Link to="/recipes">Back to Recipes</Link>
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
