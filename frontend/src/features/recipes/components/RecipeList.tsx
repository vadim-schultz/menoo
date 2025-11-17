import type { RecipeDetail } from '../../../shared/types';
import { RecipeCard } from './RecipeCard';
import { Text, SimpleGrid } from '@chakra-ui/react';

interface RecipeListProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeList({ recipes, onEdit, onDelete }: RecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return <Text color="gray.600">No recipes yet.</Text>;
  }
  return (
    <SimpleGrid columns={{ base: 1 }} gap={6}>
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </SimpleGrid>
  );
}


