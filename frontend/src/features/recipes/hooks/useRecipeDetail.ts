import { useQuery } from '@tanstack/react-query'
import { recipeService } from '../../../shared/services/recipes'
import type { RecipeDetail } from '../../../shared/types'

export function useRecipeDetail(id: number) {
  return useQuery<RecipeDetail>({
    queryKey: ['recipes', id],
    queryFn: () => recipeService.get(id),
    enabled: !!id,
  })
}
