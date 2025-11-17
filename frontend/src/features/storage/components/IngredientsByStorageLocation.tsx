import type { IngredientRead } from '../../../shared/types/ingredient';
import type { LocationToIngredientsMap } from '../types';
import { StorageLocationGrid } from './StorageLocationGrid';
import { IngredientModal } from '../../ingredients/components';
import { Box } from '../../../shared/components/ui/Box';
import { Heading, Text } from '../../../shared/components/ui/Typography';
import { Stack } from '../../../shared/components/ui/Layout';

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
    <Box>
      <Stack gap={1} mb={4}>
        <Heading as="h1" size="lg">
          Storage
        </Heading>
      </Stack>

      <StorageLocationGrid grouped={grouped} onEdit={onEdit} onDelete={onDelete} />

      <IngredientModal
        isOpen={isModalOpen}
        ingredient={editing}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        loading={loadingSubmit}
      />
    </Box>
  );
}


