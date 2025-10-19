import { useState, useEffect } from 'preact/hooks';
import type { SuggestionRequest, IngredientRead } from '../../../shared/types';
import { Button, Select, Input } from '../../../shared/components';
import { ingredientService } from '../../../shared/services';

interface SuggestionFormProps {
  onSubmit: (request: SuggestionRequest) => void;
  loading: boolean;
}

export function SuggestionForm({ onSubmit, loading }: SuggestionFormProps) {
  const [availableIngredients, setAvailableIngredients] = useState<IngredientRead[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string>('');
  const [maxResults, setMaxResults] = useState<number>(5);

  // Load available ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      setLoadingIngredients(true);
      try {
        const response = await ingredientService.list({ page_size: 1000 });
        setAvailableIngredients(response.items);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoadingIngredients(false);
      }
    };
    loadIngredients();
  }, []);

  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIngredients(availableIngredients.map((ing) => ing.id));
  };

  const deselectAll = () => {
    setSelectedIngredients([]);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient');
      return;
    }

    const request: SuggestionRequest = {
      available_ingredients: selectedIngredients,
      max_prep_time: maxPrepTime,
      max_cook_time: maxCookTime,
      difficulty: difficulty || null,
      max_results: maxResults,
    };

    onSubmit(request);
  };

  const difficultyOptions = [
    { value: '', label: 'Any difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3>Available Ingredients</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              onClick={selectAll}
              disabled={loadingIngredients}
              type="button"
            >
              Select All
            </Button>
            <Button
              variant="secondary"
              onClick={deselectAll}
              disabled={loadingIngredients}
              type="button"
            >
              Deselect All
            </Button>
          </div>
        </div>

        {loadingIngredients ? (
          <p style={{ color: 'var(--color-text-light)' }}>Loading ingredients...</p>
        ) : availableIngredients.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)' }}>
            No ingredients available. Please add some ingredients first.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--color-bg-secondary)',
            }}
          >
            {availableIngredients.map((ingredient) => (
              <label
                key={ingredient.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius)',
                  backgroundColor: selectedIngredients.includes(ingredient.id)
                    ? 'var(--color-primary-light)'
                    : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient.id)}
                  onChange={() => toggleIngredient(ingredient.id)}
                />
                <span style={{ fontSize: '0.875rem' }}>
                  {ingredient.name}
                  <span style={{ color: 'var(--color-text-light)', marginLeft: '0.25rem' }}>
                    ({ingredient.quantity} {ingredient.unit})
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
          {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''}{' '}
          selected
        </p>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filters (Optional)</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Max Prep Time (minutes)"
            name="max_prep_time"
            type="number"
            value={maxPrepTime || ''}
            onChange={(value) => setMaxPrepTime(value ? parseInt(value) : null)}
            placeholder="No limit"
          />

          <Input
            label="Max Cook Time (minutes)"
            name="max_cook_time"
            type="number"
            value={maxCookTime || ''}
            onChange={(value) => setMaxCookTime(value ? parseInt(value) : null)}
            placeholder="No limit"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <Select
            label="Difficulty"
            name="difficulty"
            value={difficulty}
            onChange={(value) => setDifficulty(value)}
            options={difficultyOptions}
          />

          <Input
            label="Max Results"
            name="max_results"
            type="number"
            value={maxResults}
            onChange={(value) => setMaxResults(parseInt(value) || 5)}
            placeholder="5"
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Button
          type="submit"
          disabled={loading || loadingIngredients || selectedIngredients.length === 0}
        >
          {loading ? 'Finding Recipes...' : 'Get Recipe Suggestions'}
        </Button>
      </div>
    </form>
  );
}
