import type { RecipeSuggestion } from '../../../shared/types';
import { Button } from '../../../shared/components';

interface SuggestionListProps {
  suggestions: RecipeSuggestion[];
  selectedRecipes: number[];
  onToggleRecipe: (recipeId: number) => void;
  onGenerateShoppingList: () => void;
  loading?: boolean;
}

export function SuggestionList({
  suggestions,
  selectedRecipes,
  onToggleRecipe,
  onGenerateShoppingList,
  loading = false,
}: SuggestionListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
          No recipe suggestions yet. Select your available ingredients and click "Get Recipe
          Suggestions" to find recipes you can make!
        </p>
      </div>
    );
  }

  const formatMatchScore = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2>Recipe Suggestions ({suggestions.length})</h2>
        {selectedRecipes.length > 0 && (
          <Button onClick={onGenerateShoppingList} disabled={loading}>
            Generate Shopping List ({selectedRecipes.length})
          </Button>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {suggestions.map((suggestion) => {
          const isSelected = selectedRecipes.includes(suggestion.recipe_id);

          return (
            <div
              key={suggestion.recipe_id}
              className="card"
              style={{
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-primary-light)' : undefined,
              }}
              onClick={() => onToggleRecipe(suggestion.recipe_id)}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <h3>{suggestion.recipe_name}</h3>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius)',
                        backgroundColor:
                          suggestion.match_score >= 0.8
                            ? 'var(--color-success)'
                            : suggestion.match_score >= 0.5
                              ? 'var(--color-warning)'
                              : 'var(--color-danger)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {formatMatchScore(suggestion.match_score)} Match
                    </span>
                  </div>

                  {suggestion.reason && (
                    <p
                      style={{
                        color: 'var(--color-text-light)',
                        marginBottom: '0.75rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {suggestion.reason}
                    </p>
                  )}

                  <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                    {suggestion.matched_ingredients.length > 0 && (
                      <div>
                        <strong style={{ color: 'var(--color-success)' }}>
                          ✓ You have ({suggestion.matched_ingredients.length}):
                        </strong>{' '}
                        <span style={{ color: 'var(--color-text-light)' }}>
                          {suggestion.matched_ingredients.join(', ')}
                        </span>
                      </div>
                    )}

                    {suggestion.missing_ingredients.length > 0 && (
                      <div>
                        <strong style={{ color: 'var(--color-danger)' }}>
                          ✗ Missing ({suggestion.missing_ingredients.length}):
                        </strong>{' '}
                        <span style={{ color: 'var(--color-text-light)' }}>
                          {suggestion.missing_ingredients.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginLeft: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleRecipe(suggestion.recipe_id);
                    }}
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRecipes.length > 0 && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
            Click "Generate Shopping List" to see what you need to buy for the selected recipes
          </p>
        </div>
      )}
    </div>
  );
}
