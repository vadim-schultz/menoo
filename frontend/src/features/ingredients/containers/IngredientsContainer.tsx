import { IngredientsLoading, IngredientsError, IngredientsContent } from '../components';
import { useIngredientFilters } from '../hooks/useIngredientFilters';
import { useIngredientList } from '../hooks/useIngredientList';
import { useIngredientActions } from '../hooks/useIngredientActions';

export const IngredientsContainer = () => {
  const {
    nameContains,
    storageLocation,
    expiringBefore,
    page,
    sortColumn,
    sortDirection,
    appliedFilters,
    setNameContains,
    setStorageLocation,
    setExpiringBefore,
    setPage,
    handleSortChange,
  } = useIngredientFilters();

  const { ingredients, loading, error, create, update, remove, isSubmitting } = useIngredientList(
    appliedFilters,
    sortColumn,
    sortDirection
  );

  const { isModalOpen, editing, openEditModal, openCreateModal, closeModal, handleSubmit, handleDelete } =
    useIngredientActions({
      create,
      update,
      remove,
    });

  if (loading) return <IngredientsLoading />;
  if (error) return <IngredientsError message={error.detail} />;

  return (
    <IngredientsContent
      ingredients={ingredients}
      onAdd={openCreateModal}
      onEdit={openEditModal}
      onDelete={handleDelete}
      nameContains={nameContains}
      storageLocation={storageLocation}
      expiringBefore={expiringBefore}
      onNameContainsChange={setNameContains}
      onStorageLocationChange={setStorageLocation}
      onExpiringBeforeChange={setExpiringBefore}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      page={page}
      onPageChange={setPage}
      isModalOpen={isModalOpen}
      editing={editing}
      onCloseModal={closeModal}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
