import { apiClient } from './apiClient';
import type {
  SuggestionRequest,
  SuggestionResponse,
} from '../types';

export const suggestionService = {
  async getSuggestions(request: SuggestionRequest): Promise<SuggestionResponse> {
    return apiClient.post<SuggestionResponse>('/suggestions/recipes', request);
  },
};
