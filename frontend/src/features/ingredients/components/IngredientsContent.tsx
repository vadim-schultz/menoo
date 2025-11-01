import { Button } from '../../../shared/components';
import { Plus } from 'lucide-preact';
import type { IngredientRead, IngredientCreate, StorageLocation } from '../../../shared/types/ingredient';
import { IngredientTable, IngredientPagination, IngredientModal } from '.';
import type { SortColumn, SortDirection } from '../hooks/useIngredientFilters';

interface IngredientsContentProps {
  title?: string;
  ingredients: IngredientRead[];
  onAdd: () => void;
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
  // Filters & sorting
  nameContains: string;
  storageLocation: StorageLocation | '';
  expiringBefore: string;
  onNameContainsChange: (v: string) => void;
  onStorageLocationChange: (v: StorageLocation | '') => void;
  onExpiringBeforeChange: (v: string) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSortChange: (c: Exclude<SortColumn, null> | null) => void;
  // Pagination
  page: number;
  onPageChange: (p: number) => void;
  // Modal
  isModalOpen: boolean;
  editing: IngredientRead | null;
  onCloseModal: () => void;
  onSubmit: (data: IngredientCreate) => Promise<void>;
  isSubmitting: boolean;
}

export function IngredientsContent({
  title = 'Ingredients',
  ingredients,
  onAdd,
  onEdit,
  onDelete,
  nameContains,
  storageLocation,
  expiringBefore,
  onNameContainsChange,
  onStorageLocationChange,
  onExpiringBeforeChange,
  sortColumn,
  sortDirection,
  onSortChange,
  page,
  onPageChange,
  isModalOpen,
  editing,
  onCloseModal,
  onSubmit,
  isSubmitting,
}: IngredientsContentProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>{title}</h1>
        <Button icon={Plus} onClick={onAdd}>
          Add Ingredient
        </Button>
      </div>

      <IngredientTable
        ingredients={ingredients}
        onEdit={onEdit}
        onDelete={onDelete}
        nameContains={nameContains}
        storageLocation={storageLocation}
        expiringBefore={expiringBefore}
        onNameContainsChange={onNameContainsChange}
        onStorageLocationChange={onStorageLocationChange}
        onExpiringBeforeChange={onExpiringBeforeChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />

      <IngredientPagination page={page} pageSize={100} onPageChange={onPageChange} onPageSizeChange={() => {}} />

      <IngredientModal
        isOpen={isModalOpen}
        ingredient={editing}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        loading={isSubmitting}
      />
    </div>
  );
}


