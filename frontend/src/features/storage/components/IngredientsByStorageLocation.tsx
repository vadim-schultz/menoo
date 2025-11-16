import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationGrid } from './StorageLocationGrid';
import { IngredientModal } from '../../ingredients/components';

interface IngredientsByStorageLocationProps {
  grouped: LocationToIngredientsMap;
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
  isModalOpen: boolean;
  editing: IngredientRead | null;
  onCloseModal: () => void;
  onSubmit: (data: any) => Promise<void>;
  loadingSubmit?: boolean;
}

export function IngredientsByStorageLocation({
  grouped,
  onEdit,
  onDelete,
  isModalOpen,
  editing,
  onCloseModal,
  onSubmit,
  loadingSubmit = false,
}: IngredientsByStorageLocationProps) {
  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Ingredients by Storage Location</h1>
        <p style={{ color: '#4A5568' }}>
          View and manage your ingredients organized by where they're stored.
        </p>
      </header>
      <StorageLocationGrid grouped={grouped} onEdit={onEdit} onDelete={onDelete} />
      <IngredientModal
        isOpen={isModalOpen}
        ingredient={editing}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        loading={loadingSubmit}
      />
    </div>
  );
}


