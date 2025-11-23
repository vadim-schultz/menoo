import { useQuery } from '@tanstack/react-query'
import { recipeService } from '../../../shared/services/recipes'
import type { RecipeListResponse } from '../../../shared/types'

export function useRecipesTable(params?: {
  cuisine?: string
  max_prep_time_minutes?: number
  max_cook_time_minutes?: number
  name_contains?: string
  page?: number
  page_size?: number
}) {
  return useQuery<RecipeListResponse>({
    queryKey: ['recipes', params],
    queryFn: () => recipeService.list(params),
  })
}
