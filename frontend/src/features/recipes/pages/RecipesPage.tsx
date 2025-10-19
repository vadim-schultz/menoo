import { useState } from 'preact/hooks';
import { useApi, useApiMutation } from '../../../shared/hooks';
import { recipeService } from '../../../shared/services';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { Button, Modal } from '../../../shared/components';
import { RecipeForm, RecipeList } from '../components';

export function RecipesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDetail | null>(null);

  const { data, loading, error, refetch } = useApi(() => recipeService.list(), []);

  const { mutate: createRecipe, loading: creating } = useApiMutation(recipeService.create);

  const { mutate: updateRecipe, loading: updating } = useApiMutation(recipeService.update);

  const { mutate: deleteRecipe } = useApiMutation(recipeService.delete);

  // Fetch full recipe details when editing
  const loadRecipeForEdit = async (id: number) => {
    try {
      const recipe = await recipeService.get(id);
      setEditingRecipe(recipe);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to load recipe:', err);
    }
  };

  const handleCreate = async (data: RecipeCreate) => {
    try {
      await createRecipe(data);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  const handleUpdate = async (id: number, data: RecipeCreate) => {
    try {
      await updateRecipe(id, data);
      setIsModalOpen(false);
      setEditingRecipe(null);
      refetch();
    } catch (err) {
      console.error('Failed to update recipe:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete recipe:', err);
      }
    }
  };

  const handleEdit = (recipe: RecipeDetail) => {
    loadRecipeForEdit(recipe.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecipe(null);
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.detail || 'An error occurred'}</div>;
  }

  // Note: The list endpoint returns RecipeRead[], but we need RecipeDetail[] for the list
  // The backend should be updated to include ingredients in the list response
  // For now, we'll cast and handle missing ingredients gracefully
  const recipes = (data?.items || []) as RecipeDetail[];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1>Recipes</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Recipe</Button>
      </div>

      <RecipeList recipes={recipes} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRecipe ? 'Edit Recipe' : 'Add Recipe'}
      >
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={(data) =>
            editingRecipe ? handleUpdate(editingRecipe.id, data) : handleCreate(data)
          }
          onCancel={handleCloseModal}
          loading={creating || updating}
        />
      </Modal>
    </div>
  );
}
