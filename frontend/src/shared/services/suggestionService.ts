import { apiClient } from './apiClient';
import type {
  SuggestionRequest,
  SuggestionResponse,
  ShoppingListRequest,
  ShoppingListResponse,
} from '../types';

export const suggestionService = {
  async getSuggestions(request: SuggestionRequest): Promise<SuggestionResponse> {
    return apiClient.post<SuggestionResponse>('/suggestions/recipes', request);
  },

  async generateShoppingList(request: ShoppingListRequest): Promise<ShoppingListResponse> {
    return apiClient.post<ShoppingListResponse>('/suggestions/shopping-list', request);
  },
};
