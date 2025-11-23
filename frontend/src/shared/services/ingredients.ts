import httpClient from './http'
import type {
  IngredientCreateRequest,
  IngredientResponse,
  IngredientSuggestionRequest,
  IngredientSuggestionResponse,
} from '../types'

export const ingredientService = {
  list: async (params?: {
    category?: string
    storage_location?: string
    expiring_before?: string
    name_contains?: string
    page?: number
    page_size?: number
  }): Promise<IngredientResponse[]> => {
    const response = await httpClient.get<IngredientResponse[]>('/ingredients', { params })
    return response.data
  },

  get: async (id: number): Promise<IngredientResponse> => {
    const response = await httpClient.get<IngredientResponse>(`/ingredients/${id}`)
    return response.data
  },

  create: async (data: IngredientCreateRequest): Promise<IngredientResponse> => {
    const response = await httpClient.post<IngredientResponse>('/ingredients', data)
    return response.data
  },

  update: async (id: number, data: Partial<IngredientResponse>): Promise<IngredientResponse> => {
    const response = await httpClient.patch<IngredientResponse>(`/ingredients/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/ingredients/${id}`)
  },

  suggest: async (data: IngredientSuggestionRequest): Promise<IngredientSuggestionResponse> => {
    const response = await httpClient.post<IngredientSuggestionResponse>(
      '/suggestions/ingredient',
      data
    )
    return response.data
  },
}

