import { useState } from 'preact/hooks';
import { useApi, useApiMutation } from '../../../shared/hooks';
import { recipeService } from '../../../shared/services';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { Button, Modal } from '../../../shared/components';
import { RecipeForm, RecipeList } from '../components';

interface RecipeFormInitialData {
  ingredientIds?: number[];
  name?: string;
  description?: string;
}

export function RecipesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDetail | null>(null);
  const [initialData, setInitialData] = useState<RecipeFormInitialData | null>(null);

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
      refetch();
    } catch (err) {
      console.error('Failed to create recipe:', err);
      // TODO: Show error message to user
    } finally {
      // Always close modal, even on error
      setIsModalOpen(false);
    }
  };

  const handleUpdate = async (id: number, data: RecipeCreate) => {
    try {
      await updateRecipe(id, data);
      refetch();
    } catch (err) {
      console.error('Failed to update recipe:', err);
      // TODO: Show error message to user
    } finally {
      // Always close modal and clear editing state
      setIsModalOpen(false);
      setEditingRecipe(null);
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
    setInitialData(null);
  };

  // Handle initial data passed via sessionStorage (e.g., from external integrations)
  if (typeof window !== 'undefined') {
    // Check for initial data passed from other pages/features
    const storedData = sessionStorage.getItem('recipeFormInitialData');
    if (storedData && !initialData) {
      try {
        const parsed = JSON.parse(storedData) as RecipeFormInitialData;
        setInitialData(parsed);
        setIsModalOpen(true);
        sessionStorage.removeItem('recipeFormInitialData');
      } catch (e) {
        console.error('Failed to parse initial data:', e);
      }
    }

    // Export function to set initial data from external sources
    (window as any).createRecipeFromSuggestion = (data: RecipeFormInitialData) => {
      setInitialData(data);
      setIsModalOpen(true);
    };
  }

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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Add Recipe
          </Button>
          <Button
            onClick={() => {
              setInitialData(null);
              setIsModalOpen(true);
            }}
          >
            Create with AI
          </Button>
        </div>
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
          initialData={initialData}
        />
      </Modal>
    </div>
  );
}
