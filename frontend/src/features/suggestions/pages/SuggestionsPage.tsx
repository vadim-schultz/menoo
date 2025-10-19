import { useState } from 'preact/hooks';
import { useApiMutation } from '../../../shared/hooks';
import { suggestionService } from '../../../shared/services';
import type {
  SuggestionRequest,
  SuggestionResponse,
  ShoppingListResponse,
} from '../../../shared/types';
import { SuggestionForm, SuggestionList, ShoppingList } from '../components';

export function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);

  const { mutate: getSuggestions, loading: loadingSuggestions } = useApiMutation(
    suggestionService.getSuggestions
  );

  const { mutate: generateShoppingList, loading: loadingShoppingList } = useApiMutation(
    suggestionService.generateShoppingList
  );

  const handleGetSuggestions = async (request: SuggestionRequest) => {
    try {
      const response = await getSuggestions(request);
      setSuggestions(response);
      setSelectedRecipes([]);
      setShoppingList(null);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      alert('Failed to get recipe suggestions. Please try again.');
    }
  };

  const handleToggleRecipe = (recipeId: number) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleGenerateShoppingList = async () => {
    if (selectedRecipes.length === 0) {
      alert('Please select at least one recipe');
      return;
    }

    try {
      const response = await generateShoppingList({ recipe_ids: selectedRecipes });
      setShoppingList(response);
    } catch (err) {
      console.error('Failed to generate shopping list:', err);
      alert('Failed to generate shopping list. Please try again.');
    }
  };

  const handleCloseShoppingList = () => {
    setShoppingList(null);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Cooking Suggestions</h1>

      <SuggestionForm onSubmit={handleGetSuggestions} loading={loadingSuggestions} />

      {suggestions && suggestions.suggestions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {shoppingList ? (
            <ShoppingList shoppingList={shoppingList} onClose={handleCloseShoppingList} />
          ) : (
            <SuggestionList
              suggestions={suggestions.suggestions}
              selectedRecipes={selectedRecipes}
              onToggleRecipe={handleToggleRecipe}
              onGenerateShoppingList={handleGenerateShoppingList}
              loading={loadingShoppingList}
            />
          )}
        </div>
      )}

      {suggestions && suggestions.suggestions.length === 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
            No recipes found with your selected ingredients. Try selecting more ingredients or
            adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
