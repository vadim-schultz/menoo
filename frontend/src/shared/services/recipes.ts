import httpClient from './http'
import type {
  RecipeCreateRequest,
  RecipeDetail,
  RecipeListResponse,
  RecipeResponse,
  SuggestionRequest,
  SuggestionResponse,
} from '../types'

export const recipeService = {
  list: async (params?: {
    cuisine?: string
    max_prep_time_minutes?: number
    max_cook_time_minutes?: number
    name_contains?: string
    page?: number
    page_size?: number
  }): Promise<RecipeListResponse> => {
    const response = await httpClient.get<RecipeListResponse>('/recipes', { params })
    return response.data
  },

  get: async (id: number): Promise<RecipeDetail> => {
    const response = await httpClient.get<RecipeDetail>(`/recipes/${id}`)
    return response.data
  },

  create: async (data: RecipeCreateRequest): Promise<RecipeDetail> => {
    const response = await httpClient.post<RecipeDetail>('/recipes', data)
    return response.data
  },

  update: async (id: number, data: Partial<RecipeResponse>): Promise<RecipeDetail> => {
    const response = await httpClient.patch<RecipeDetail>(`/recipes/${id}`, { recipe: data })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/recipes/${id}`)
  },

  suggest: async (data: SuggestionRequest): Promise<SuggestionResponse> => {
    const response = await httpClient.post<SuggestionResponse>('/suggestions/recipes', data)
    return response.data
  },
}

