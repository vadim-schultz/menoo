import { useState } from 'preact/hooks';
import type { RecipeSuggestion } from '../../../shared/types';
import { Button } from '../../../shared/components';

interface SuggestionListProps {
  suggestions: RecipeSuggestion[];
  selectedRecipes: number[];
  onToggleRecipe: (recipeId: number) => void;
  onGenerateShoppingList: () => void;
  onSaveAIRecipe?: (suggestion: RecipeSuggestion) => Promise<void>;
  loading?: boolean;
}

export function SuggestionList({
  suggestions,
  selectedRecipes,
  onToggleRecipe,
  onGenerateShoppingList,
  onSaveAIRecipe,
  loading = false,
}: SuggestionListProps) {
  const [savingRecipeKey, setSavingRecipeKey] = useState<string | null>(null);

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
          const recipeKey = suggestion.recipe_id ?? `ai-${suggestion.recipe_name}`;
          const isSelected =
            suggestion.recipe_id !== null && selectedRecipes.includes(suggestion.recipe_id);

          return (
            <div
              key={recipeKey}
              className="card"
              style={{
                cursor: suggestion.is_ai_generated ? 'default' : 'pointer',
                border: isSelected
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-primary-light)' : undefined,
              }}
              onClick={() => suggestion.recipe_id && onToggleRecipe(suggestion.recipe_id)}
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
                        backgroundColor: `var(--color-${
                          suggestion.match_score > 0.7
                            ? 'success'
                            : suggestion.match_score > 0.4
                              ? 'warning'
                              : 'danger'
                        })`,
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {formatMatchScore(suggestion.match_score)} Match
                    </span>
                    {suggestion.is_ai_generated && (
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius)',
                          backgroundColor: 'var(--color-info)',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        🤖 AI Generated
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{suggestion.reason}</p>
                </div>

                {!suggestion.is_ai_generated && suggestion.recipe_id && (
                  <input
                    type="checkbox"
                    aria-label={suggestion.recipe_name}
                    checked={isSelected}
                    style={{ marginLeft: '1rem' }}
                    onChange={(e) => {
                      e.stopPropagation(); // prevent card click
                      onToggleRecipe(suggestion.recipe_id!);
                    }}
                  />
                )}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div
                  style={{
                    display: 'grid',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '0.75rem',
                  }}
                >
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

                {suggestion.is_ai_generated && suggestion.generated_recipe && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--color-background)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <p style={{ marginBottom: '0.75rem', fontStyle: 'italic' }}>
                      {suggestion.generated_recipe.description}
                    </p>
                    <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {suggestion.generated_recipe.prep_time_minutes && (
                        <div>
                          <strong>Prep:</strong> {suggestion.generated_recipe.prep_time_minutes} min
                        </div>
                      )}
                      {suggestion.generated_recipe.cook_time_minutes && (
                        <div>
                          <strong>Cook:</strong> {suggestion.generated_recipe.cook_time_minutes} min
                        </div>
                      )}
                      {suggestion.generated_recipe.servings && (
                        <div>
                          <strong>Servings:</strong> {suggestion.generated_recipe.servings}
                        </div>
                      )}
                      {suggestion.generated_recipe.difficulty && (
                        <div>
                          <strong>Difficulty:</strong> {suggestion.generated_recipe.difficulty}
                        </div>
                      )}
                    </div>
                    <details>
                      <summary
                        style={{
                          cursor: 'pointer',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                        }}
                      >
                        View Full Recipe
                      </summary>
                      <div style={{ marginTop: '0.75rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Ingredients:</h4>
                        <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                          {suggestion.generated_recipe.ingredients.map((ing) => (
                            <li key={ing.ingredient_id ?? ing.name}>
                              {ing.quantity} {ing.unit} {ing.name}
                            </li>
                          ))}
                        </ul>
                        <h4 style={{ marginBottom: '0.5rem' }}>Instructions:</h4>
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {suggestion.generated_recipe.instructions}
                        </div>
                      </div>
                    </details>
                    {onSaveAIRecipe && (
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="secondary"
                          onClick={async () => {
                            setSavingRecipeKey(String(recipeKey));
                            await onSaveAIRecipe(suggestion);
                            setSavingRecipeKey(null);
                          }}
                          disabled={savingRecipeKey === String(recipeKey)}
                        >
                          {savingRecipeKey === String(recipeKey)
                            ? 'Opening...'
                            : '📝 Edit & Save'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
