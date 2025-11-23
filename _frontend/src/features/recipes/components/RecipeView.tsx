import type { RecipeCreate, RecipeDetail } from '../../../shared/types';
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  TableRoot as Table,
  TableHeader as Thead,
  TableBody as Tbody,
  TableRow as Tr,
  TableColumnHeader as Th,
  TableCell as Td,
  Separator,
} from '@chakra-ui/react';
import { formatTime } from '../services/recipeFormatting';

interface RecipeViewProps {
  recipe: RecipeCreate | RecipeDetail;
  onAccept?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function RecipeView({ recipe, onAccept, onCancel, showActions = false }: RecipeViewProps) {
  const isDetail = 'id' in recipe;
  const ingredients = isDetail ? (recipe as RecipeDetail).ingredients : recipe.ingredients || [];

  return (
    <VStack align="stretch" gap={6}>
      {/* Recipe Title */}
      <Box>
        <Heading as="h1" size="2xl" mb={2} fontWeight="bold">
          {recipe.name}
        </Heading>
        {recipe.description && (
          <Text fontSize="lg" color="fg.muted" mt={2}>
            {recipe.description}
          </Text>
        )}
        <Separator mt={4} />
      </Box>

      {/* Accordion Sections */}
      <AccordionRoot defaultValue={['ingredients', 'timing', 'instructions']} multiple>
        {/* Ingredients Section */}
        <AccordionItem value="ingredients">
          <AccordionItemTrigger>
            <Heading as="h2" size="xl" fontWeight="bold">
              Ingredients
            </Heading>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <Separator mb={4} />
            {ingredients.length > 0 ? (
              <Box overflowX="auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Quantity</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ingredients.map((ing, idx) => {
                      const ingredientName = isDetail && 'ingredient_name' in ing 
                        ? (ing as any).ingredient_name 
                        : (ing as any).ingredient_name || `Ingredient ${idx + 1}`;
                      return (
                        <Tr key={idx}>
                          <Td>
                            {ingredientName}
                            {ing.is_optional && <Text as="span" color="fg.subtle" ml={2}>(optional)</Text>}
                          </Td>
                          <Td>
                            {ing.quantity} {ing.unit}
                            {ing.note && <Text as="span" color="fg.muted" ml={2}>- {ing.note}</Text>}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Text color="fg.muted">No ingredients listed.</Text>
            )}
          </AccordionItemContent>
        </AccordionItem>

        {/* Prep Times Section */}
        <AccordionItem value="timing">
          <AccordionItemTrigger>
            <Heading as="h2" size="xl" fontWeight="bold">
              Prep Times
            </Heading>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <Separator mb={4} />
            <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                  Prep Time
                </Text>
                <Text fontSize="lg">{formatTime(recipe.prep_time)}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                  Cook Time
                </Text>
                <Text fontSize="lg">{formatTime(recipe.cook_time)}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                  Servings
                </Text>
                <Text fontSize="lg">{recipe.servings || '-'}</Text>
              </Box>
            </SimpleGrid>
          </AccordionItemContent>
        </AccordionItem>

        {/* Instructions Section */}
        <AccordionItem value="instructions">
          <AccordionItemTrigger>
            <Heading as="h2" size="xl" fontWeight="bold">
              Instructions
            </Heading>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <Separator mb={4} />
            <Box fontSize="md" lineHeight="1.8">
              {recipe.instructions?.split('\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                return (
                  <Text key={idx} mb={3}>
                    {trimmed}
                  </Text>
                );
              })}
            </Box>
          </AccordionItemContent>
        </AccordionItem>

        {/* Other Sections - Collapsed by default */}
        {(recipe.cuisine_types && recipe.cuisine_types.length > 0) ||
        (recipe.dietary_requirements && recipe.dietary_requirements.length > 0) ? (
          <AccordionItem value="classification">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Classification
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <VStack align="stretch" gap={2}>
                {recipe.cuisine_types && recipe.cuisine_types.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={1}>
                      Cuisine:
                    </Text>
                    <Text>{recipe.cuisine_types.join(', ')}</Text>
                  </Box>
                )}
                {recipe.dietary_requirements && recipe.dietary_requirements.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={1}>
                      Dietary Requirements:
                    </Text>
                    <Text>{recipe.dietary_requirements.join(', ')}</Text>
                  </Box>
                )}
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}

        {recipe.nutrition_info ? (
          <AccordionItem value="nutrition">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Nutrition
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                {recipe.nutrition_info.calories && (
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                      Calories
                    </Text>
                    <Text fontSize="lg">{recipe.nutrition_info.calories}</Text>
                  </Box>
                )}
                {recipe.nutrition_info.protein_grams && (
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                      Protein (g)
                    </Text>
                    <Text fontSize="lg">{recipe.nutrition_info.protein_grams}</Text>
                  </Box>
                )}
                {recipe.nutrition_info.carbohydrates_grams && (
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                      Carbs (g)
                    </Text>
                    <Text fontSize="lg">{recipe.nutrition_info.carbohydrates_grams}</Text>
                  </Box>
                )}
                {recipe.nutrition_info.fat_grams && (
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
                      Fat (g)
                    </Text>
                    <Text fontSize="lg">{recipe.nutrition_info.fat_grams}</Text>
                  </Box>
                )}
              </SimpleGrid>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}

        {recipe.equipment_requirements && recipe.equipment_requirements.length > 0 ? (
          <AccordionItem value="equipment">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Equipment
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <VStack align="stretch" gap={2}>
                {recipe.equipment_requirements.map((eq, idx) => (
                  <Text key={idx}>
                    {eq.name}
                    {eq.is_essential === false && <Text as="span" color="fg.subtle"> (optional)</Text>}
                    {eq.notes && <Text as="span" color="fg.muted"> - {eq.notes}</Text>}
                  </Text>
                ))}
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}

        {recipe.notes ? (
          <AccordionItem value="notes">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Notes
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <Text whiteSpace="pre-wrap">{recipe.notes}</Text>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}

        {recipe.variations ? (
          <AccordionItem value="variations">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Variations
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <Text whiteSpace="pre-wrap">{recipe.variations}</Text>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}

        {recipe.storage_instructions ? (
          <AccordionItem value="storage">
            <AccordionItemTrigger>
              <Heading as="h2" size="xl" fontWeight="bold">
                Storage
              </Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <Separator mb={4} />
              <VStack align="stretch" gap={2}>
                {recipe.storage_instructions.storage_type && (
                  <Text>
                    <Text as="span" fontWeight="semibold">Type:</Text> {recipe.storage_instructions.storage_type}
                  </Text>
                )}
                {recipe.storage_instructions.shelf_life_days && (
                  <Text>
                    <Text as="span" fontWeight="semibold">Shelf Life:</Text> {recipe.storage_instructions.shelf_life_days} days
                  </Text>
                )}
                {recipe.storage_instructions.reheating_instructions && (
                  <Text>
                    <Text as="span" fontWeight="semibold">Reheating:</Text> {recipe.storage_instructions.reheating_instructions}
                  </Text>
                )}
                {recipe.storage_instructions.freezing_instructions && (
                  <Text>
                    <Text as="span" fontWeight="semibold">Freezing:</Text> {recipe.storage_instructions.freezing_instructions}
                  </Text>
                )}
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        ) : null}
      </AccordionRoot>

      {/* Action Buttons */}
      {showActions && (onAccept || onCancel) && (
        <HStack justify="flex-end" gap={2} mt={4}>
          {onCancel && (
            <Button onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onAccept && (
            <Button onClick={onAccept}>
              Accept
            </Button>
          )}
        </HStack>
      )}
    </VStack>
  );
}

