import { useState } from 'preact/hooks';
import type { IngredientRead, IngredientCreate } from '../../../shared/types/ingredient';
import { Button } from '../../../shared/components';
import { useIngredients } from '../hooks/useIngredients';
import { IngredientGrid } from '../components/IngredientGrid';
import { IngredientModal } from '../components/IngredientModal';

export const IngredientsContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IngredientRead | null>(null);

  const { ingredients, loading, error, create, update, remove, isSubmitting } = useIngredients();

  const handleSubmit = async (data: IngredientCreate) => {
    try {
      if (editing) {
        await update(editing.id, data);
      } else {
        await create(data);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save ingredient:', err);
      // TODO: Show toast notification
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ingredient?')) return;
    try {
      await remove(id);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const openEditModal = (ingredient: IngredientRead) => {
    setEditing(ingredient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.detail}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>Ingredients</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Ingredient</Button>
      </div>
      <IngredientGrid ingredients={ingredients} onEdit={openEditModal} onDelete={handleDelete} />
      <IngredientModal
        isOpen={isModalOpen}
        ingredient={editing}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={isSubmitting}
      />
    </div>
  );
};
