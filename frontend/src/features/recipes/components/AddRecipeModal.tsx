import {
  Accordion,
  Box,
  Button,
  Dialog,
  Field,
  Select,
  Text,
  Checkbox,
  Table,
  Flex,
  createListCollection,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useCreateRecipe } from '../hooks/useCreateRecipe'
import { recipeService } from '../../../shared/services/recipes'
import { ingredientService } from '../../../shared/services/ingredients'
import type {
  CuisineType,
  DietaryRequirement,
  MealType,
  Recipe,
  RecipeResponse,
} from '../../../shared/types'
import { useQuery } from '@tanstack/react-query'

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddRecipeModal({ isOpen, onClose }: AddRecipeModalProps) {
  const [cuisine, setCuisine] = useState<CuisineType | ''>('')
  const [dietaryPreference, setDietaryPreference] = useState<DietaryRequirement | ''>('')
  const [mealtime, setMealtime] = useState<MealType | ''>('')
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<number>>(new Set())
  const [suggestedRecipe, setSuggestedRecipe] = useState<RecipeResponse | null>(null)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const createMutation = useCreateRecipe()

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients', 'all'],
    queryFn: () => ingredientService.list({ page_size: 1000 }),
  })

  const handleToggleIngredient = (id: number) => {
    const newSet = new Set(selectedIngredientIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIngredientIds(newSet)
  }

  const handleGetSuggestion = async () => {
    if (!cuisine || !dietaryPreference || !mealtime) {
      return
    }

    setIsSuggesting(true)
    try {
      const recipe: Recipe = {
        cuisine_types: cuisine ? [cuisine as CuisineType] : [],
        dietary_requirements: dietaryPreference ? [dietaryPreference as DietaryRequirement] : [],
        meal_types: mealtime ? [mealtime as MealType] : [],
        ingredients:
          selectedIngredientIds.size > 0
            ? Array.from(selectedIngredientIds).map((id) => ({
                ingredient_id: id,
                quantity: 100,
                unit: 'g',
              }))
            : [],
      }

      const response = await recipeService.suggest({
        recipe,
        n_completions: 1,
      })

      if (response.recipes && response.recipes.length > 0) {
        setSuggestedRecipe(response.recipes[0])
      }
    } catch (error) {
      console.error('Failed to get suggestion:', error)
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSave = async () => {
    if (!suggestedRecipe) {
      return
    }

    try {
      await createMutation.mutateAsync({
        recipe: suggestedRecipe,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to create recipe:', error)
    }
  }

  const handleClose = () => {
    setCuisine('')
    setDietaryPreference('')
    setMealtime('')
    setSelectedIngredientIds(new Set())
    setSuggestedRecipe(null)
    onClose()
  }

  const cuisineOptions: CuisineType[] = [
    'italian',
    'indian',
    'japanese',
    'chinese',
    'french',
    'mexican',
    'thai',
    'mediterranean',
    'american',
    'middle_eastern',
    'korean',
    'vietnamese',
    'greek',
    'spanish',
    'turkish',
    'moroccan',
    'ethiopian',
    'fusion',
    'other',
  ]

  const dietaryOptions: DietaryRequirement[] = [
    'vegetarian',
    'vegan',
    'pescatarian',
    'gluten_free',
    'dairy_free',
    'nut_free',
    'soy_free',
    'egg_free',
    'kosher',
    'halal',
    'low_carb',
    'keto',
    'paleo',
    'whole30',
    'low_sodium',
    'low_fat',
    'low_calorie',
  ]

  const mealtimeOptions: MealType[] = [
    'breakfast',
    'brunch',
    'lunch',
    'dinner',
    'snack',
    'appetizer',
    'side_dish',
    'main_course',
    'dessert',
    'beverage',
  ]

  const cuisineCollection = createListCollection({ items: cuisineOptions })
  const dietaryCollection = createListCollection({ items: dietaryOptions })
  const mealtimeCollection = createListCollection({ items: mealtimeOptions })

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="4xl">
          <Dialog.Header>Add Recipe</Dialog.Header>
          <Dialog.Body>
            {!suggestedRecipe ? (
              <>
                <Field.Root mb={4}>
                  <Field.Label>Cuisine</Field.Label>
                  <Select.Root
                    collection={cuisineCollection}
                    value={cuisine ? [cuisine] : []}
                    onValueChange={(e) => setCuisine((e.value[0] as CuisineType) || '')}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select cuisine" />
                    </Select.Trigger>
                    <Select.Content>
                      {cuisineOptions.map((opt) => (
                        <Select.Item key={opt} item={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root mb={4}>
                  <Field.Label>Dietary Preference</Field.Label>
                  <Select.Root
                    collection={dietaryCollection}
                    value={dietaryPreference ? [dietaryPreference] : []}
                    onValueChange={(e) => setDietaryPreference((e.value[0] as DietaryRequirement) || '')}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select dietary preference" />
                    </Select.Trigger>
                    <Select.Content>
                      {dietaryOptions.map((opt) => (
                        <Select.Item key={opt} item={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root mb={4}>
                  <Field.Label>Mealtime</Field.Label>
                  <Select.Root
                    collection={mealtimeCollection}
                    value={mealtime ? [mealtime] : []}
                    onValueChange={(e) => setMealtime((e.value[0] as MealType) || '')}
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select mealtime" />
                    </Select.Trigger>
                    <Select.Content>
                      {mealtimeOptions.map((opt) => (
                        <Select.Item key={opt} item={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Accordion.Root mb={4}>
                  <Accordion.Item value="ingredients">
                    <Accordion.ItemTrigger>
                      <Text>Available Ingredients ({ingredients.length})</Text>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Box maxH="300px" overflowY="auto">
                        <Table.Root>
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader>Select</Table.ColumnHeader>
                              <Table.ColumnHeader>Name</Table.ColumnHeader>
                              <Table.ColumnHeader>Quantity (g)</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {ingredients.map((ingredient) => (
                              <Table.Row key={ingredient.id}>
                                <Table.Cell>
                                  <Checkbox.Root
                                    checked={selectedIngredientIds.has(ingredient.id)}
                                    onCheckedChange={() => handleToggleIngredient(ingredient.id)}
                                  >
                                    <Checkbox.Control />
                                  </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell>{ingredient.name}</Table.Cell>
                                <Table.Cell>{ingredient.quantity}</Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>

                <Flex gap={2} justify="flex-end">
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={handleGetSuggestion}
                    loading={isSuggesting}
                    colorPalette="blue"
                    disabled={!cuisine || !dietaryPreference || !mealtime}
                  >
                    Get Recipe Suggestion
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <Box mb={4} p={4} bg="bg.muted" borderRadius="md">
                  <Text fontWeight="semibold" fontSize="lg" mb={2}>
                    {suggestedRecipe.name}
                  </Text>
                  <Text mb={2}>
                    <strong>Cuisine:</strong>{' '}
                    {suggestedRecipe.cuisine_types?.join(', ') || '-'}
                  </Text>
                  <Text mb={2}>
                    <strong>Dietary Requirements:</strong>{' '}
                    {suggestedRecipe.dietary_requirements?.join(', ') || '-'}
                  </Text>
                  <Text mb={2}>
                    <strong>Mealtime:</strong>{' '}
                    {suggestedRecipe.meal_types?.join(', ') || '-'}
                  </Text>
                  {suggestedRecipe.ingredients && suggestedRecipe.ingredients.length > 0 && (
                    <Box mb={2}>
                      <Text fontWeight="semibold" mb={1}>
                        Ingredients:
                      </Text>
                      {suggestedRecipe.ingredients.map((ing, idx) => (
                        <Text key={idx}>
                          - {ing.quantity} {ing.unit} (ingredient ID: {ing.ingredient_id})
                        </Text>
                      ))}
                    </Box>
                  )}
                  {suggestedRecipe.timing && (
                    <Box mb={2}>
                      <Text>
                        <strong>Prep Time:</strong>{' '}
                        {suggestedRecipe.timing.prep_time_minutes || 0} minutes
                      </Text>
                      <Text>
                        <strong>Cook Time:</strong>{' '}
                        {suggestedRecipe.timing.cook_time_minutes || 0} minutes
                      </Text>
                    </Box>
                  )}
                  {suggestedRecipe.instructions && (
                    <Box mt={2}>
                      <Text fontWeight="semibold" mb={1}>
                        Instructions:
                      </Text>
                      <Text whiteSpace="pre-wrap">{suggestedRecipe.instructions}</Text>
                    </Box>
                  )}
                </Box>

                <Flex gap={2} justify="flex-end">
                  <Button onClick={() => setSuggestedRecipe(null)}>Back</Button>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={handleSave}
                    loading={createMutation.isPending}
                    colorPalette="blue"
                  >
                    Save Recipe
                  </Button>
                </Flex>
              </>
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
