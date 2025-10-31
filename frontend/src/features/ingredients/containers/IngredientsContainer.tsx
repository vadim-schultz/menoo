import { useState } from 'preact/hooks';
import type {
  IngredientRead,
  IngredientCreate,
  IngredientFilters,
  StorageLocation,
} from '../../../shared/types/ingredient';
import { Button } from '../../../shared/components';
import { useIngredients } from '../hooks/useIngredients';
import {
  IngredientGrid,
  IngredientModal,
  IngredientFilterPanel,
  IngredientPagination,
} from '../components';

export const IngredientsContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IngredientRead | null>(null);

  // Filters & pagination UI state
  const [nameContains, setNameContains] = useState<string>('');
  const [storageLocation, setStorageLocation] = useState<StorageLocation | ''>('');
  const [expiringBefore, setExpiringBefore] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  const [appliedFilters, setAppliedFilters] = useState<IngredientFilters>({ page: 1, page_size: 100 });

  const { ingredients, loading, error, create, update, remove, isSubmitting } = useIngredients(
    appliedFilters
  );

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

  const applyFilters = () => {
    const nextFilters: IngredientFilters = {
      page,
      page_size: pageSize,
      name_contains: nameContains || undefined,
      storage_location: (storageLocation as StorageLocation) || undefined,
      expiring_before: expiringBefore || undefined,
    };
    setAppliedFilters(nextFilters);
  };

  const resetFilters = () => {
    setNameContains('');
    setStorageLocation('');
    setExpiringBefore('');
    setPage(1);
    setPageSize(100);
    setAppliedFilters({ page: 1, page_size: 100 });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.detail}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>Ingredients</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Ingredient</Button>
      </div>

      <IngredientFilterPanel
        nameContains={nameContains}
        storageLocation={storageLocation}
        expiringBefore={expiringBefore}
        onNameContainsChange={setNameContains}
        onStorageLocationChange={setStorageLocation}
        onExpiringBeforeChange={setExpiringBefore}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <IngredientPagination
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
        }}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setAppliedFilters((prev) => ({ ...prev, page_size: nextPageSize }));
        }}
      />

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
