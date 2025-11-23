import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationGrid } from './StorageLocationGrid';
import { IngredientModal } from '../../ingredients/components';
import { Heading, VStack } from '@chakra-ui/react';

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
    <VStack align="stretch" gap={6}>
      <Heading as="h1" size="lg">
        Storage
      </Heading>

      <StorageLocationGrid grouped={grouped} onEdit={onEdit} onDelete={onDelete} />

      <IngredientModal
        isOpen={isModalOpen}
        ingredient={editing}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        loading={loadingSubmit}
      />
    </VStack>
  );
}


