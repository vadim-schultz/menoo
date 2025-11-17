import { useState } from 'react';
import { useForm } from '../../../shared/hooks';
import type { RecipeCreate, RecipeDetail, RecipeIngredientCreate } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';
import { Textarea } from '../../../shared/components/Input';
import { RecipeIngredientInput } from './RecipeIngredientInput';
// Removed RecipeAIAssistant; field-level generation triggers are used instead
import { useRecipeFormAI } from '../hooks/useRecipeFormAI';
import { difficultyOptions } from '../services/recipeOptions';
import { validateRecipe } from '../services/recipeValidation';
import { Box, Stack, SimpleGrid, Heading, Flex, IconButton, Text, FieldsetRoot, FieldsetLegend } from '@chakra-ui/react';
import { Sparkles } from 'lucide-react';

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
      <Stack gap={6}>
        {/* Ingredient selection moved to top */}
        <Box>
          <RecipeIngredientInput ingredients={ingredients} onChange={setIngredients} />
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontWeight={500}>Recipe Name</Text>
            <IconButton
              type="button"
              onClick={handleEnhanceRecipe}
              aria-label="Generate recipe with AI"
              variant="ghost"
              size="sm"
            >
              <Sparkles size={16} />
            </IconButton>
          </Flex>
          {generating && (
            <Text mb={2} color="gray.600" fontSize="sm">
              loading ...
            </Text>
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
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontWeight={500}>Description</Text>
            <IconButton
              type="button"
              onClick={handleEnhanceRecipe}
              aria-label="Generate description with AI"
              variant="ghost"
              size="sm"
            >
              <Sparkles size={16} />
            </IconButton>
          </Flex>
          <Textarea
            name="description"
            value={form.values.description || ''}
            onChange={(value) => form.handleChange('description', value || null)}
            onBlur={() => form.handleBlur('description')}
            placeholder="Brief description of the recipe (optional)"
            rows={2}
          />
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontWeight={500}>Instructions</Text>
            <IconButton
              type="button"
              onClick={handleEnhanceRecipe}
              aria-label="Generate instructions with AI"
              variant="ghost"
              size="sm"
            >
              <Sparkles size={16} />
            </IconButton>
          </Flex>
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
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
        </SimpleGrid>

        {/* Dietary */}
        <FieldsetRoot>
          <FieldsetLegend>Dietary</FieldsetLegend>
          <Stack gap={4}>
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
          </Stack>
        </FieldsetRoot>

        {/* Equipment */}
        <FieldsetRoot>
          <FieldsetLegend>Equipment</FieldsetLegend>
          <EquipmentEditor
            items={(form.values as any).equipment_requirements || []}
            onChange={(items) => form.handleChange('equipment_requirements', items)}
          />
        </FieldsetRoot>

        {/* Storage */}
        <FieldsetRoot>
          <FieldsetLegend>Storage</FieldsetLegend>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
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
          </SimpleGrid>
          <Stack gap={4} mt={3}>
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
          </Stack>
        </FieldsetRoot>

        {/* Nutrition */}
        <FieldsetRoot>
          <FieldsetLegend>Nutrition (per serving)</FieldsetLegend>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
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
          </SimpleGrid>
        </FieldsetRoot>

        {/* Removed RecipeAIAssistant; generation is triggered via ✨ buttons above */}

        <Flex gap={2} justify="flex-end" mt={6}>
          <Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </Flex>
      </Stack>
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
    <Box>
      <Flex justify="flex-end" mb={2}>
        <Button type="button" onClick={addItem}>
          Add equipment
        </Button>
      </Flex>
      {(items || []).length === 0 ? (
        <Text color="gray.600">No equipment listed.</Text>
      ) : (
        <Stack gap={3}>
          {(items || []).map((it, idx) => (
            <SimpleGrid key={idx} columns={{ base: 1, md: 4 }} gap={2} alignItems="end">
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
              <Box>
                <Button type="button" variant="secondary" onClick={() => removeItem(idx)}>
                  Remove
                </Button>
              </Box>
            </SimpleGrid>
          ))}
        </Stack>
      )}
    </Box>
  );
}
