import type { RecipeDetail } from '../../../shared/types';
import { Button } from '../../../shared/components';
import { Pencil, Trash2 } from 'lucide-react';
import { formatTime } from '../services/recipeFormatting';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card';
import { Heading, Text } from '../../../shared/components/ui/Typography';
import { SimpleGrid, HStack, VStack } from '../../../shared/components/ui/Layout';
import { Box } from '../../../shared/components/ui/Box';
import { Stack } from '../../../shared/components/ui/Layout';
import { Badge } from '../../../shared/components/ui/Badge';

interface RecipeCardProps {
  recipe: RecipeDetail;
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const totalIngredients = recipe.ingredients?.length || 0;
  const cuisines = (recipe.cuisine_types || []).join(', ');
  const meals = (recipe.meal_types || []).join(', ');
  const allergens = (recipe.contains_allergens || []).join(', ');

  return (
    <Card>
      <CardHeader p={6}>
        <HStack justify="space-between" align="center">
          <Box>
            <Heading as="h3" size="md">
              {recipe.name}
            </Heading>
            {recipe.description && (
              <Text color="gray.600" fontSize="sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {recipe.description}
              </Text>
            )}
            <HStack flexWrap="wrap" gap={2} mt={2}>
              {recipe.author && (
                <Text color="gray.600" fontSize="xs">
                  By {recipe.author}
                </Text>
              )}
              {recipe.source && (
                <Text color="gray.600" fontSize="xs">
                  Source: {recipe.source}
                </Text>
              )}
            </HStack>
          </Box>
          <HStack gap={2}>
            <Button icon={Pencil} variant="secondary" onClick={() => onEdit(recipe)} aria-label="Edit recipe" />
            <Button icon={Trash2} variant="danger" onClick={() => onDelete(recipe.id)} aria-label="Delete recipe" />
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody p={6}>
        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={4}>
            <Box>
              <Text color="gray.600" fontSize="xs">
                Prep
              </Text>
              <Text>{formatTime((recipe as any).prep_time ?? recipe.timing_full?.prep_time_minutes)}</Text>
            </Box>
            <Box>
              <Text color="gray.600" fontSize="xs">
                Cook
              </Text>
              <Text>{formatTime((recipe as any).cook_time ?? recipe.timing_full?.cook_time_minutes)}</Text>
            </Box>
            <Box>
              <Text color="gray.600" fontSize="xs">
                Servings
              </Text>
              <Text>{recipe.servings || '-'}</Text>
            </Box>
            <Box>
              <Text color="gray.600" fontSize="xs">
                Ingredients
              </Text>
              <Text>{totalIngredients}</Text>
            </Box>
            {recipe.cooking_method && (
              <Box>
                <Text color="gray.600" fontSize="xs">
                  Method
                </Text>
                <Text>{recipe.cooking_method}</Text>
              </Box>
            )}
            {cuisines && (
              <Box>
                <Text color="gray.600" fontSize="xs">
                  Cuisine
                </Text>
                <Text>{cuisines}</Text>
              </Box>
            )}
            {meals && (
              <Box>
                <Text color="gray.600" fontSize="xs">
                  Meal
                </Text>
                <Text>{meals}</Text>
              </Box>
            )}
          </SimpleGrid>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <Box>
              <Heading as="h4" size="sm" mb={2}>
                Ingredients
              </Heading>
              <Stack as="ul" gap={1}>
                {recipe.ingredients.map((ing) => (
                  <Box as="li" key={ing.id}>
                    {ing.ingredient_name}: {ing.quantity} {ing.unit}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <Heading as="h4" size="sm" mb={2}>
              Preparation
            </Heading>
            <Text whiteSpace="pre-wrap" fontFamily="inherit">
              {recipe.instructions}
            </Text>
          </Box>

          {(allergens || (recipe.allergen_warnings || '')).length > 0 && (
            <Box>
              <Heading as="h4" size="sm" mb={2}>
                Allergens
              </Heading>
              <Stack gap={1}>
                {allergens && (
                  <Text>
                    <Text as="span" fontWeight="semibold">
                      Contains:
                    </Text>{' '}
                    {allergens}
                  </Text>
                )}
                {recipe.allergen_warnings && (
                  <Text>
                    <Text as="span" fontWeight="semibold">
                      Warnings:
                    </Text>{' '}
                    {recipe.allergen_warnings}
                  </Text>
                )}
              </Stack>
            </Box>
          )}

          {recipe.tags && recipe.tags.length > 0 && (
            <HStack wrap="wrap" gap={2}>
              {recipe.tags.map((t) => (
                <Badge key={t} colorScheme="gray" variant="subtle">
                  {t}
                </Badge>
              ))}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
