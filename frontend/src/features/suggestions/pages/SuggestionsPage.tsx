import { useState } from 'preact/hooks';
import { useApiMutation } from '../../../shared/hooks';
import { suggestionService } from '../../../shared/services';
import type {
  SuggestionRequest,
  SuggestionResponse,
  ShoppingListResponse,
  RecipeSuggestion,
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

  const { mutate: acceptSuggestion } = useApiMutation(suggestionService.acceptSuggestion);

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

  const handleSaveAIRecipe = async (suggestion: RecipeSuggestion) => {
    if (!suggestion.generated_recipe) {
      alert('No recipe data to save');
      return;
    }

    // Instead of immediately saving, navigate to recipe form for editing
    // Extract ingredient IDs from generated recipe
    const ingredientIds = suggestion.generated_recipe.ingredients
      .filter((ing) => ing.ingredient_id > 0)
      .map((ing) => ing.ingredient_id);

    // Use sessionStorage to pass data, then navigate to recipes page
    if (typeof window !== 'undefined') {
      const formData = {
        ingredientIds,
        name: suggestion.generated_recipe.name,
        description: suggestion.generated_recipe.description || undefined,
      };
      sessionStorage.setItem('recipeFormInitialData', JSON.stringify(formData));
      // Navigate to recipes page - it will detect the stored data and open modal
      window.location.href = '/recipes';
    } else {
      // Fallback: save directly if navigation not available
      try {
        const savedRecipe = await acceptSuggestion({
          generated_recipe: suggestion.generated_recipe,
        });

        alert(
          `Recipe "${savedRecipe.name}" saved successfully! You can find it in your recipe collection.`
        );
      } catch (err) {
        console.error('Failed to save AI recipe:', err);
        alert('Failed to save recipe. Please try again.');
      }
    }
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
              onSaveAIRecipe={handleSaveAIRecipe}
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
