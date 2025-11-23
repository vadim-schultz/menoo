import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../shared/hooks';
import { recipeService } from '../../../shared/services';
import { RecipesLoading, RecipesError } from '../components';
import { RecipeView } from '../components/RecipeView';
import { Button } from '../../../shared/components';
import { VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

export function RecipeDetailContainer() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { data: recipe, loading, error } = useApi(
    () => recipeService.get(Number(recipeId!)),
    [recipeId]
  );

  if (loading) return <RecipesLoading />;
  if (error) return <RecipesError message={error.detail || 'An error occurred'} />;
  if (!recipe) return <RecipesError message="Recipe not found" />;

  return (
    <VStack align="stretch" gap={6}>
      <Button
        icon={ArrowLeft}
        variant="outline"
        colorPalette="gray"
        onClick={() => navigate('/recipes')}
        aria-label="Back to Recipes"
      >
        Back to Recipes
      </Button>
      <RecipeView recipe={recipe} showActions={false} />
    </VStack>
  );
}

