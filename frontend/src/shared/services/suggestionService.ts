import { apiClient } from './apiClient';
import type {
  SuggestionRequest,
  SuggestionResponse,
  SuggestionAcceptRequest,
  ShoppingListRequest,
  ShoppingListResponse,
} from '../types';
import type { RecipeDetail } from '../types/recipe';

export const suggestionService = {
  async getSuggestions(request: SuggestionRequest): Promise<SuggestionResponse> {
    return apiClient.post<SuggestionResponse>('/suggestions/recipes', request);
  },

  async acceptSuggestion(request: SuggestionAcceptRequest): Promise<RecipeDetail> {
    return apiClient.post<RecipeDetail>('/suggestions/accept', request);
  },

  async generateShoppingList(request: ShoppingListRequest): Promise<ShoppingListResponse> {
    return apiClient.post<ShoppingListResponse>('/suggestions/shopping-list', request);
  },
};
