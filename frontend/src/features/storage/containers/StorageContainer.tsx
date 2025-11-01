import { HomeLoading, HomeError, IngredientsByStorageLocation } from '../components';
import { useIngredients } from '../../ingredients/hooks/useIngredients';
import { useHomeIngredients, useHomeActions } from '../hooks';

export function StorageContainer() {
  const { create, update, remove, isSubmitting } = useIngredients({ page_size: 1000 });
  const { grouped, loading, error } = useHomeIngredients();
  const { isModalOpen, editing, openEditModal, closeModal, handleSubmit, handleDelete } = useHomeActions({
    create,
    update,
    remove,
  });

  if (loading) {
    return <HomeLoading />;
  }

  if (error) {
    return <HomeError message={error?.detail || 'Failed to load ingredients'} />;
  }

  return (
    <IngredientsByStorageLocation
      grouped={grouped}
      onEdit={openEditModal}
      onDelete={handleDelete}
      isModalOpen={isModalOpen}
      editing={editing}
      onCloseModal={closeModal}
      onSubmit={handleSubmit}
      loadingSubmit={isSubmitting}
    />
  );
}


