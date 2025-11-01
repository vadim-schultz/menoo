import { useEffect } from 'preact/hooks';
import { useApi, useApiMutation } from '../../../shared/hooks';
import { recipeService } from '../../../shared/services';
import type { RecipeDetail } from '../../../shared/types';
import { RecipesLoading, RecipesError, RecipesContent } from '../components';
import { useRecipeActions } from '../hooks/useRecipeActions';

export function RecipesContainer() {
  const { data, loading, error, refetch } = useApi(() => recipeService.list(), []);
  const { mutate: createRecipe, loading: creating } = useApiMutation(recipeService.create);
  const { mutate: updateRecipe, loading: updating } = useApiMutation(recipeService.update);
  const { mutate: deleteRecipe } = useApiMutation(recipeService.delete);

  const {
    isModalOpen,
    editingRecipe,
    initialData,
    setInitialData,
    openCreate,
    handleEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    closeModal,
  } = useRecipeActions({ createRecipe, updateRecipe, deleteRecipe, refetch });

  // Handle initial data via sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedData = sessionStorage.getItem('recipeFormInitialData');
    if (storedData && !initialData) {
      try {
        const parsed = JSON.parse(storedData);
        setInitialData(parsed);
        openCreate();
        sessionStorage.removeItem('recipeFormInitialData');
      } catch (e) {
        console.error('Failed to parse initial data:', e);
      }
    }

    (window as any).createRecipeFromSuggestion = (data: any) => {
      setInitialData(data);
      openCreate();
    };
  }, [initialData, setInitialData, openCreate]);

  if (loading) return <RecipesLoading />;
  if (error) return <RecipesError message={error.detail || 'An error occurred'} />;

  const recipes = (data?.items || []) as RecipeDetail[];

  return (
    <RecipesContent
      recipes={recipes}
      isModalOpen={isModalOpen}
      editingRecipe={editingRecipe}
      initialData={initialData}
      onOpenCreate={openCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCloseModal={closeModal}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      creating={creating}
      updating={updating}
    />
  );
}


