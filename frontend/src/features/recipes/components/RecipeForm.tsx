import { useState } from 'preact/hooks';
import { useForm } from '../../../shared/hooks';
import type { RecipeCreate, RecipeDetail, RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Textarea } from '../../../shared/components/Input';
import { RecipeIngredientInput } from './RecipeIngredientInput';
// Removed RecipeAIAssistant; field-level generation triggers are used instead
import { useRecipeFormAI } from '../hooks/useRecipeFormAI';
import { difficultyOptions } from '../services/recipeOptions';
import { validateRecipe } from '../services/recipeValidation';

interface RecipeFormInitialData {
  ingredientIds?: number[];
  name?: string;
  description?: string;
}

interface RecipeFormProps {
  recipe?: RecipeDetail | null;
  onSubmit: (data: RecipeCreate) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: RecipeFormInitialData | null;
}

// options moved to services/recipeOptions

export function RecipeForm({
  recipe,
  onSubmit,
  onCancel,
  loading,
  initialData,
}: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<RecipeIngredientCreate[]>(
    recipe?.ingredients?.map((ing) => ({
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
      is_optional: ing.is_optional,
      note: ing.note,
    })) ||
      (initialData?.ingredientIds || []).map((id) => ({
        ingredient_id: id,
        quantity: 1,
        unit: 'unit',
        is_optional: false,
        note: null,
      })) ||
      []
  );

  // AI handlers moved to hook that uses useRecipeAI internally

  const handleSubmit = (values: RecipeCreate) => {
    // Include ingredients in the submission
    const data = {
      ...values,
      ingredients: ingredients.filter((ing) => ing.ingredient_id > 0),
    };
    onSubmit(data);
  };

  const form = useForm<RecipeCreate>({
    initialValues: recipe
      ? {
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          dietary_requirements: recipe.dietary_requirements || [],
          contains_allergens: recipe.contains_allergens || [],
          allergen_warnings: recipe.allergen_warnings || null,
          equipment_requirements: (recipe as any).equipment_requirements || [],
          storage_instructions: (recipe as any).storage_instructions || null,
          nutrition_info: (recipe as any).nutrition_info || null,
          tags: recipe.tags || [],
          notes: recipe.notes || null,
          variations: recipe.variations || null,
          estimated_cost_per_serving: (recipe as any).estimated_cost_per_serving ?? null,
          seasonality: (recipe as any).seasonality || null,
        }
      : {
          name: initialData?.name || '',
          description: initialData?.description || null,
          instructions: '',
          prep_time: null,
          cook_time: null,
          servings: 4,
          difficulty: null,
          dietary_requirements: [],
          contains_allergens: [],
          allergen_warnings: null,
          equipment_requirements: [],
          storage_instructions: null,
          nutrition_info: null,
          tags: [],
          notes: null,
          variations: null,
          estimated_cost_per_serving: null,
          seasonality: null,
        },
    onSubmit: handleSubmit,
    validate: validateRecipe,
  });

  const { handleEnhanceRecipe, generating } = useRecipeFormAI(form, ingredients, setIngredients);

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Ingredient selection moved to top */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RecipeIngredientInput ingredients={ingredients} onChange={setIngredients} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Recipe Name</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate recipe with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        {generating && (
          <div style={{ margin: '0.25rem 0', color: '#4A5568' }}>
            loading ...
          </div>
        )}
        <Input
          name="name"
          value={form.values.name}
          onChange={(value) => form.handleChange('name', value)}
          onBlur={() => form.handleBlur('name')}
          error={form.touched.name ? form.errors.name : undefined}
          placeholder="e.g., Spaghetti Carbonara"
          required
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Description</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate description with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        <Textarea
          name="description"
          value={form.values.description || ''}
          onChange={(value) => form.handleChange('description', value || null)}
          onBlur={() => form.handleBlur('description')}
          placeholder="Brief description of the recipe (optional)"
          rows={2}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 500 }}>Instructions</label>
          <button type="button" onClick={handleEnhanceRecipe} aria-label="Generate instructions with AI" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✨
          </button>
        </div>
        <Textarea
          name="instructions"
          value={form.values.instructions}
          onChange={(value) => form.handleChange('instructions', value)}
          onBlur={() => form.handleBlur('instructions')}
          error={form.touched.instructions ? form.errors.instructions : undefined}
          placeholder="Step-by-step cooking instructions"
          rows={6}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          label="Prep Time (minutes)"
          name="prep_time"
          type="number"
          value={form.values.prep_time || ''}
          onChange={(value) => form.handleChange('prep_time', value ? parseInt(value) : null)}
          onBlur={() => form.handleBlur('prep_time')}
          error={form.touched.prep_time ? form.errors.prep_time : undefined}
          placeholder="0"
        />

        <Input
          label="Cook Time (minutes)"
          name="cook_time"
          type="number"
          value={form.values.cook_time || ''}
          onChange={(value) => form.handleChange('cook_time', value ? parseInt(value) : null)}
          onBlur={() => form.handleBlur('cook_time')}
          error={form.touched.cook_time ? form.errors.cook_time : undefined}
          placeholder="0"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          label="Servings"
          name="servings"
          type="number"
          value={form.values.servings || ''}
          onChange={(value) => form.handleChange('servings', value ? parseInt(value) : undefined)}
          onBlur={() => form.handleBlur('servings')}
          error={form.touched.servings ? form.errors.servings : undefined}
          placeholder="4"
        />

        <Select
          label="Difficulty"
          name="difficulty"
          value={form.values.difficulty || ''}
          onChange={(value) => form.handleChange('difficulty', value || null)}
          options={difficultyOptions}
          placeholder="Select difficulty (optional)"
        />
      </div>

      {/* Dietary */}
      <section style={{ marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Dietary</h4>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Input
            label="Dietary Requirements (comma-separated)"
            name="dietary_requirements"
            value={(form.values.dietary_requirements || []).join(', ')}
            onChange={(value) =>
              form.handleChange(
                'dietary_requirements',
                value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="vegetarian, gluten_free"
          />
          <Input
            label="Contains Allergens (comma-separated)"
            name="contains_allergens"
            value={(form.values.contains_allergens || []).join(', ')}
            onChange={(value) =>
              form.handleChange(
                'contains_allergens',
                value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="nuts, dairy"
          />
          <Textarea
            label="Allergen Warnings"
            name="allergen_warnings"
            value={form.values.allergen_warnings || ''}
            onChange={(value) => form.handleChange('allergen_warnings', value || null)}
            rows={2}
            placeholder="Cross-contamination warnings, etc."
          />
        </div>
      </section>

      {/* Equipment */}
      <section style={{ marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Equipment</h4>
        <EquipmentEditor
          items={(form.values as any).equipment_requirements || []}
          onChange={(items) => form.handleChange('equipment_requirements', items)}
        />
      </section>

      {/* Storage */}
      <section style={{ marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Storage</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Storage Type"
            name="storage_type"
            value={(form.values.storage_instructions?.storage_type as any) || ''}
            onChange={(value) =>
              form.handleChange('storage_instructions', {
                ...(form.values.storage_instructions || {}),
                storage_type: value || null,
              })
            }
            placeholder="refrigerated, frozen, room_temperature"
          />
          <Input
            label="Shelf Life (days)"
            name="shelf_life_days"
            type="number"
            value={(form.values.storage_instructions?.shelf_life_days as any) || ''}
            onChange={(value) =>
              form.handleChange('storage_instructions', {
                ...(form.values.storage_instructions || {}),
                shelf_life_days: value ? parseInt(value) : null,
              })
            }
            placeholder="3"
          />
        </div>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '0.75rem' }}>
          <Textarea
            label="Reheating Instructions"
            name="reheating_instructions"
            value={(form.values.storage_instructions?.reheating_instructions as any) || ''}
            onChange={(value) =>
              form.handleChange('storage_instructions', {
                ...(form.values.storage_instructions || {}),
                reheating_instructions: value || null,
              })
            }
            rows={2}
          />
          <Textarea
            label="Freezing Instructions"
            name="freezing_instructions"
            value={(form.values.storage_instructions?.freezing_instructions as any) || ''}
            onChange={(value) =>
              form.handleChange('storage_instructions', {
                ...(form.values.storage_instructions || {}),
                freezing_instructions: value || null,
              })
            }
            rows={2}
          />
        </div>
      </section>

      {/* Nutrition */}
      <section style={{ marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Nutrition (per serving)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { key: 'calories', label: 'Calories' },
            { key: 'protein_grams', label: 'Protein (g)' },
            { key: 'carbohydrates_grams', label: 'Carbs (g)' },
            { key: 'fat_grams', label: 'Fat (g)' },
            { key: 'saturated_fat_grams', label: 'Saturated Fat (g)' },
            { key: 'fiber_grams', label: 'Fiber (g)' },
            { key: 'sugar_grams', label: 'Sugar (g)' },
            { key: 'sodium_mg', label: 'Sodium (mg)' },
          ].map((f) => (
            <Input
              key={f.key}
              label={f.label}
              name={`nutrition_${f.key}`}
              type="number"
              value={((form.values.nutrition_info as any)?.[f.key] as any) || ''}
              onChange={(value) =>
                form.handleChange('nutrition_info', {
                  ...(form.values.nutrition_info || {}),
                  [f.key]: value === '' ? null : parseFloat(value),
                })
              }
              placeholder="0"
            />
          ))}
        </div>
      </section>

      {/* Removed RecipeAIAssistant; generation is triggered via ✨ buttons above */}

      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}
      >
        <Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}

interface EquipmentItem {
  name: string;
  is_essential?: boolean;
  notes?: string | null;
}

function EquipmentEditor({
  items,
  onChange,
}: {
  items: EquipmentItem[];
  onChange: (items: EquipmentItem[]) => void;
}) {
  const addItem = () => {
    onChange([...(items || []), { name: '', is_essential: true, notes: null }]);
  };
  const updateItem = (index: number, field: keyof EquipmentItem, value: any) => {
    const next = (items || []).map((it, i) => (i === index ? { ...it, [field]: value } : it));
    onChange(next);
  };
  const removeItem = (index: number) => {
    onChange((items || []).filter((_, i) => i !== index));
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <Button type="button" onClick={addItem}>
          Add equipment
        </Button>
      </div>
      {(items || []).length === 0 ? (
        <p style={{ color: '#4A5568' }}>No equipment listed.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {(items || []).map((it, idx) => (
            <div
              key={idx}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '0.5rem', alignItems: 'end' }}
            >
              <Input
                name={`equipment-name-${idx}`}
                label="Name"
                value={it.name || ''}
                onChange={(v) => updateItem(idx, 'name', v)}
                placeholder="e.g., Dutch oven"
              />
              <Select
                name={`equipment-essential-${idx}`}
                label="Essential"
                value={String(it.is_essential !== false ? 'yes' : 'no')}
                onChange={(v) => updateItem(idx, 'is_essential', v !== 'no')}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <Input
                name={`equipment-notes-${idx}`}
                label="Notes"
                value={it.notes || ''}
                onChange={(v) => updateItem(idx, 'notes', v || null)}
                placeholder="Optional notes"
              />
              <div>
                <Button type="button" variant="secondary" onClick={() => removeItem(idx)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
