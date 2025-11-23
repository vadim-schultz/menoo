import { useQuery } from '@tanstack/react-query'
import { ingredientService } from '../../../shared/services/ingredients'
import type { IngredientResponse } from '../../../shared/types'

export function useIngredientsTable(params?: {
  category?: string
  storage_location?: string
  expiring_before?: string
  name_contains?: string
  page?: number
  page_size?: number
}) {
  return useQuery<IngredientResponse[]>({
    queryKey: ['ingredients', params],
    queryFn: () => ingredientService.list(params),
  })
}

