import {
  Accordion,
  Box,
  Text,
  Heading,
} from '@chakra-ui/react'
import type { RecipeDetail } from '../../../shared/types'

interface RecipeDetailAccordionProps {
  recipe: RecipeDetail
}

export function RecipeDetailAccordion({ recipe }: RecipeDetailAccordionProps) {
  const mainFields = ['name', 'cuisine_types', 'dietary_requirements', 'ingredients', 'timing', 'instructions']
  
  const formatValue = (_key: string, value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value || '-')
  }

  const getFieldValue = (key: string): any => {
    return (recipe as any)[key]
  }

  const allFields = [
    'name',
    'description',
    'instructions',
    'author',
    'source',
    'cuisine_types',
    'meal_types',
    'cooking_method',
    'dietary_requirements',
    'contains_allergens',
    'allergen_warnings',
    'timing',
    'difficulty_metrics',
    'servings',
    'yield_description',
    'equipment_requirements',
    'oven_temperature_celsius',
    'oven_settings',
    'nutrition_info',
    'storage_instructions',
    'tags',
    'notes',
    'variations',
    'estimated_cost_per_serving',
    'seasonality',
    'ingredients',
  ]

  return (
    <Accordion.Root defaultValue={mainFields} multiple>
      {allFields.map((field) => {
        const value = getFieldValue(field)
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          return null
        }

        return (
          <Accordion.Item key={field} value={field}>
            <Accordion.ItemTrigger>
              <Heading size="sm" textTransform="capitalize">
                {field.replace(/_/g, ' ')}
              </Heading>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              {field === 'ingredients' && Array.isArray(value) ? (
                <Box>
                  {value.map((ing: any, idx: number) => (
                    <Box key={idx} mb={2} p={2} bg="bg.muted" borderRadius="md">
                      <Text fontWeight="bold">
                        {ing.ingredient_name || `Ingredient ${ing.ingredient_id}`}
                      </Text>
                      <Text>Quantity: {ing.quantity} {ing.unit}</Text>
                      {ing.is_optional && <Text color="fg.muted">(Optional)</Text>}
                    </Box>
                  ))}
                </Box>
              ) : field === 'timing' && typeof value === 'object' ? (
                <Box>
                  {value.prep_time_minutes && (
                    <Text>Prep Time: {value.prep_time_minutes} minutes</Text>
                  )}
                  {value.cook_time_minutes && (
                    <Text>Cook Time: {value.cook_time_minutes} minutes</Text>
                  )}
                  {value.total_time_minutes && (
                    <Text>Total Time: {value.total_time_minutes} minutes</Text>
                  )}
                  {value.resting_time_minutes && (
                    <Text>Resting Time: {value.resting_time_minutes} minutes</Text>
                  )}
                </Box>
              ) : (
                <Text whiteSpace="pre-wrap">{formatValue(field, value)}</Text>
              )}
            </Accordion.ItemContent>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
