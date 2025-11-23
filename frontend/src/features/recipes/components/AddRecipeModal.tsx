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
        <Dialog.Content maxW="4xl" bg="bg" borderRadius="lg" boxShadow="xl">
          <Dialog.Header pb={4} borderBottomWidth="1px" borderColor="border">
            <Text fontSize="xl" fontWeight="semibold">Add Recipe</Text>
          </Dialog.Header>
          <Dialog.Body pt={6}>
            {!suggestedRecipe ? (
              <>
                <Field.Root mb={6}>
                  <Field.Label mb={2} fontWeight="medium">Cuisine</Field.Label>
                  <Select.Root
                    collection={cuisineCollection}
                    value={cuisine ? [cuisine] : []}
                    onValueChange={(e) => setCuisine((e.value[0] as CuisineType) || '')}
                    size="md"
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

                <Field.Root mb={6}>
                  <Field.Label mb={2} fontWeight="medium">Dietary Preference</Field.Label>
                  <Select.Root
                    collection={dietaryCollection}
                    value={dietaryPreference ? [dietaryPreference] : []}
                    onValueChange={(e) => setDietaryPreference((e.value[0] as DietaryRequirement) || '')}
                    size="md"
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

                <Field.Root mb={6}>
                  <Field.Label mb={2} fontWeight="medium">Mealtime</Field.Label>
                  <Select.Root
                    collection={mealtimeCollection}
                    value={mealtime ? [mealtime] : []}
                    onValueChange={(e) => setMealtime((e.value[0] as MealType) || '')}
                    size="md"
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

                <Accordion.Root mb={6}>
                  <Accordion.Item value="ingredients">
                    <Accordion.ItemTrigger py={3}>
                      <Text fontWeight="medium">Available Ingredients ({ingredients.length})</Text>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent pt={4}>
                      <Box maxH="300px" overflowY="auto" borderRadius="md" borderWidth="1px" borderColor="border">
                        <Table.Root variant="outline" size="sm">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader px={4} py={2} fontWeight="semibold" bg="bg.subtle">
                                Select
                              </Table.ColumnHeader>
                              <Table.ColumnHeader px={4} py={2} fontWeight="semibold" bg="bg.subtle">
                                Name
                              </Table.ColumnHeader>
                              <Table.ColumnHeader px={4} py={2} fontWeight="semibold" bg="bg.subtle">
                                Quantity (g)
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {ingredients.map((ingredient) => (
                              <Table.Row key={ingredient.id} _hover={{ bg: 'bg.muted' }}>
                                <Table.Cell px={4} py={2}>
                                  <Checkbox.Root
                                    checked={selectedIngredientIds.has(ingredient.id)}
                                    onCheckedChange={() => handleToggleIngredient(ingredient.id)}
                                  >
                                    <Checkbox.Control />
                                  </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell px={4} py={2}>{ingredient.name}</Table.Cell>
                                <Table.Cell px={4} py={2}>{ingredient.quantity}</Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>

                <Flex gap={3} justify="flex-end" pt={4} borderTopWidth="1px" borderColor="border">
                  <Button onClick={handleClose} variant="ghost">Cancel</Button>
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
                <Box mb={6} p={6} bg="bg.muted" borderRadius="md" borderWidth="1px" borderColor="border">
                  <Text fontWeight="bold" fontSize="xl" mb={4}>
                    {suggestedRecipe.name}
                  </Text>
                  <Box as="dl" display="grid" gridTemplateColumns="auto 1fr" gap={3} mb={4}>
                    <Text as="dt" fontWeight="semibold" color="fg.muted">Cuisine:</Text>
                    <Text as="dd">{suggestedRecipe.cuisine_types?.join(', ') || '-'}</Text>
                    <Text as="dt" fontWeight="semibold" color="fg.muted">Dietary Requirements:</Text>
                    <Text as="dd">{suggestedRecipe.dietary_requirements?.join(', ') || '-'}</Text>
                    <Text as="dt" fontWeight="semibold" color="fg.muted">Mealtime:</Text>
                    <Text as="dd">{suggestedRecipe.meal_types?.join(', ') || '-'}</Text>
                  </Box>
                  {suggestedRecipe.ingredients && suggestedRecipe.ingredients.length > 0 && (
                    <Box mb={4}>
                      <Text fontWeight="semibold" mb={2} fontSize="md">
                        Ingredients:
                      </Text>
                      <Box as="ul" pl={4}>
                        {suggestedRecipe.ingredients.map((ing, idx) => (
                          <Text as="li" key={idx} mb={1}>
                            {ing.quantity} {ing.unit} (ingredient ID: {ing.ingredient_id})
                          </Text>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {suggestedRecipe.timing && (
                    <Box mb={4}>
                      <Box as="dl" display="grid" gridTemplateColumns="auto 1fr" gap={2}>
                        <Text as="dt" fontWeight="medium" color="fg.muted">Prep Time:</Text>
                        <Text as="dd">{suggestedRecipe.timing.prep_time_minutes || 0} minutes</Text>
                        <Text as="dt" fontWeight="medium" color="fg.muted">Cook Time:</Text>
                        <Text as="dd">{suggestedRecipe.timing.cook_time_minutes || 0} minutes</Text>
                      </Box>
                    </Box>
                  )}
                  {suggestedRecipe.instructions && (
                    <Box mt={4} pt={4} borderTopWidth="1px" borderColor="border">
                      <Text fontWeight="semibold" mb={2} fontSize="md">
                        Instructions:
                      </Text>
                      <Text whiteSpace="pre-wrap" lineHeight="tall">{suggestedRecipe.instructions}</Text>
                    </Box>
                  )}
                </Box>

                <Flex gap={3} justify="flex-end" pt={4} borderTopWidth="1px" borderColor="border">
                  <Button onClick={() => setSuggestedRecipe(null)} variant="ghost">Back</Button>
                  <Button onClick={handleClose} variant="ghost">Cancel</Button>
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
