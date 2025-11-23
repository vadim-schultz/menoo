import { useQuery } from '@tanstack/react-query'
import { ingredientService } from '../../../shared/services/ingredients'
import { recipeService } from '../../../shared/services/recipes'

export function useDashboard() {
  const ingredientsQuery = useQuery({
    queryKey: ['ingredients', 'count'],
    queryFn: async () => {
      const ingredients = await ingredientService.list({ page_size: 1000 })
      return ingredients.length
    },
  })

  const recipesQuery = useQuery({
    queryKey: ['recipes', 'count'],
    queryFn: async () => {
      const data = await recipeService.list({ page_size: 1 })
      return data.total
    },
  })

  return {
    ingredientsCount: ingredientsQuery.data ?? 0,
    recipesCount: recipesQuery.data ?? 0,
    isLoading: ingredientsQuery.isLoading || recipesQuery.isLoading,
    isError: ingredientsQuery.isError || recipesQuery.isError,
  }
}

