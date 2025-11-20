import type { RecipeDetail } from '../../../shared/types';
import { Pencil, Trash2 } from 'lucide-react';
import { IconButton, Text } from '@chakra-ui/react';
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
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th scope="col">
              <Text>Name</Text>
            </Th>
            <Th scope="col">
              <Text>Meal Type</Text>
            </Th>
            <Th scope="col">
              <Text>Dietary Preference</Text>
            </Th>
            <Th scope="col">
              <Text>Cuisine</Text>
            </Th>
            <Th scope="col">
              <Text>Difficulty</Text>
            </Th>
            <Th scope="col">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {recipes.map((recipe) => (
            <Tr key={recipe.id}>
              <Td>{recipe.name}</Td>
              <Td>{formatMealTypes(recipe.meal_types)}</Td>
              <Td>{formatDietaryRequirements(recipe.dietary_requirements)}</Td>
              <Td>{formatCuisine(recipe.cuisine_types)}</Td>
              <Td>{formatDifficulty(recipe.difficulty)}</Td>
              <Td>
                <IconButton
                  aria-label="Edit recipe"
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(recipe)}
                >
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  aria-label="Delete recipe"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(recipe.id)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}


