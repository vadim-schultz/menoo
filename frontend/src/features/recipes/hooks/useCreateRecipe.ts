import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '../../../shared/services/recipes'
import type { RecipeCreateRequest, RecipeDetail } from '../../../shared/types'

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation<RecipeDetail, Error, RecipeCreateRequest>({
    mutationFn: (data) => recipeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipes', 'count'] })
    },
  })
}
