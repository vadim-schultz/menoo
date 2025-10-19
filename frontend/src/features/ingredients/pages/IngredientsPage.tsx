import { useState } from 'preact/hooks';
import { useApi, useApiMutation } from '../../../shared/hooks';
import { ingredientService } from '../../../shared/services';
import type { IngredientRead, IngredientCreate } from '../../../shared/types';
import { Button, Modal } from '../../../shared/components';
import { IngredientForm } from '../components/IngredientForm';
import { IngredientList } from '../components/IngredientList';

export function IngredientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<IngredientRead | null>(null);

  const { data, loading, error, refetch } = useApi(() => ingredientService.list(), []);

  const { mutate: createIngredient, loading: creating } = useApiMutation(ingredientService.create);

  const { mutate: updateIngredient, loading: updating } = useApiMutation(ingredientService.update);

  const { mutate: deleteIngredient } = useApiMutation(ingredientService.delete);

  const handleCreate = async (data: IngredientCreate) => {
    try {
      await createIngredient(data);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to create ingredient:', err);
    }
  };

  const handleUpdate = async (id: number, data: IngredientCreate) => {
    try {
      await updateIngredient(id, data);
      setIsModalOpen(false);
      setEditingIngredient(null);
      refetch();
    } catch (err) {
      console.error('Failed to update ingredient:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await deleteIngredient(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete ingredient:', err);
      }
    }
  };

  const handleEdit = (ingredient: IngredientRead) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  if (loading) {
    return <div className="loading">Loading ingredients...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.detail || 'An error occurred'}</div>;
  }

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
        <h1>Ingredients</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Ingredient</Button>
      </div>

      <IngredientList ingredients={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingIngredient ? 'Edit Ingredient' : 'Add Ingredient'}
      >
        <IngredientForm
          ingredient={editingIngredient}
          onSubmit={(data) =>
            editingIngredient ? handleUpdate(editingIngredient.id, data) : handleCreate(data)
          }
          onCancel={handleCloseModal}
          loading={creating || updating}
        />
      </Modal>
    </div>
  );
}
