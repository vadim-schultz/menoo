export type IngredientCategory =
  | 'protein'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'dairy'
  | 'spice'
  | 'herb'
  | 'sauce'
  | 'condiment'
  | 'flavor_enhancer'
  | 'oil_fat'
  | 'sweetener'
  | 'liquid'
  | 'other'

export interface Ingredient {
  name: string
  quantity: number
  category?: IngredientCategory | null
  storage_location?: string | null
  expiry_date?: string | null
  notes?: string | null
}

export interface IngredientResponse extends Ingredient {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface IngredientListResponse {
  items: IngredientResponse[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

export interface IngredientCreateRequest {
  ingredient: Ingredient
}

export interface IngredientSuggestionRequest {
  ingredient: Ingredient
  prompt?: string | null
  n_completions?: number
}

export interface IngredientSuggestionResponse {
  ingredients: IngredientResponse[]
}

