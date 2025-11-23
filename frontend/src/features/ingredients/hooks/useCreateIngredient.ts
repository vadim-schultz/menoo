import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientService } from '../../../shared/services/ingredients'
import type { IngredientCreateRequest, IngredientResponse } from '../../../shared/types'

export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation<IngredientResponse, Error, IngredientCreateRequest>({
    mutationFn: (data) => ingredientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredients', 'count'] })
    },
  })
}

