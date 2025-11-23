import type { RecipeDetail } from '../../../shared/types';
import { Button, Text, HStack } from '@chakra-ui/react';
import { formatDifficulty } from '../services/recipeFormatting';
import { TableRoot as Table, TableHeader as Thead, TableBody as Tbody, TableRow as Tr, TableColumnHeader as Th, TableCell as Td, Box } from '@chakra-ui/react';

interface RecipeTableContentProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeTableContent({ recipes, onEdit, onDelete }: RecipeTableContentProps) {
  const formatMealTypes = (mealTypes?: string[]): string => {
    if (!mealTypes || mealTypes.length === 0) return '-';
    return mealTypes.join(', ');
  };

  const formatDietaryRequirements = (dietary?: string[]): string => {
    if (!dietary || dietary.length === 0) return '-';
    return dietary.join(', ');
  };

  const formatCuisine = (cuisineTypes?: string[]): string => {
    if (!cuisineTypes || cuisineTypes.length === 0) return '-';
    return cuisineTypes.join(', ');
  };

  return (
    <Box overflowX="auto" bg="bg.surface" borderRadius="lg" borderWidth="1px" borderColor="border.subtle">
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Name</Text>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Meal Type</Text>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Dietary Preference</Text>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Cuisine</Text>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Difficulty</Text>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Actions</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {recipes.map((recipe) => (
            <Tr key={recipe.id} _hover={{ bg: 'bg.subtle' }}>
              <Td>
                <Text>{recipe.name}</Text>
              </Td>
              <Td>
                <Text>{formatMealTypes(recipe.meal_types)}</Text>
              </Td>
              <Td>
                <Text>{formatDietaryRequirements(recipe.dietary_requirements)}</Text>
              </Td>
              <Td>
                <Text>{formatCuisine(recipe.cuisine_types)}</Text>
              </Td>
              <Td>
                <Text>{formatDifficulty(recipe.difficulty)}</Text>
              </Td>
              <Td>
                <HStack gap={2}>
                  <Button size="sm" variant="ghost" onClick={() => onEdit(recipe)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" colorPalette="red" onClick={() => onDelete(recipe.id)}>
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}


