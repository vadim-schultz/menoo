import { Input } from '../../../shared/components';
import { CirclePlus } from 'lucide-react';
import type { IngredientRead } from '../../../shared/types/ingredient';

type StorageLocation = string;
import { IngredientTable, IngredientPagination, IngredientModal } from '.';
import type { SortColumn, SortDirection } from '../hooks/useIngredientFilters';
import { Box } from '../../../shared/components/ui/Box';
import { Heading } from '../../../shared/components/ui/Typography';
import { HStack, Stack, VStack } from '../../../shared/components/ui/Layout';
import { IconButton } from '@chakra-ui/react';

interface IngredientDraft {
  name: string;
  quantity: number;
}

interface IngredientsContentProps {
  title?: string;
  ingredients: IngredientRead[];
  onAdd: () => void;
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
  onCloseModal: () => void;
  onSubmit: (data: IngredientDraft) => Promise<void>;
  isSubmitting: boolean;
}

export function IngredientsContent({
  title = 'Ingredients',
  ingredients,
  onAdd,
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
  onCloseModal,
  onSubmit,
  isSubmitting,
}: IngredientsContentProps) {
  return (
    <VStack align="stretch" gap={6}>
      <HStack justify="space-between">
        <Heading as="h1" size="lg">
          {title}
        </Heading>
        <IconButton
          aria-label="Add ingredient"
          size="sm"
          variant="ghost"
          onClick={onAdd}
        >
          <CirclePlus size={18} />
        </IconButton>
      </HStack>

      {/* Action Bar - visible filters above the table */}
      <Box
        bg="gray.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        p={6}
      >
        <Stack
          direction={{ base: 'column', md: 'row' } as any}
          align={{ base: 'stretch', md: 'flex-end' } as any}
          gap={4}
        >
          <Input
            name="name_filter"
            label="Name"
            value={nameContains}
            onChange={onNameContainsChange}
            placeholder="Filter by name..."
          />
          <Input
            name="storage_filter"
            label="Storage location"
            value={storageLocation}
            onChange={onStorageLocationChange as any}
            placeholder="Filter by location..."
          />
          <Input
            name="expiry_filter"
            label="Expiry before"
            type="date"
            value={expiringBefore}
            onChange={onExpiringBeforeChange}
          />
        </Stack>
      </Box>

      <IngredientTable
        ingredients={ingredients}
        onDelete={onDelete}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />

      <IngredientPagination page={page} pageSize={100} onPageChange={onPageChange} onPageSizeChange={() => {}} />

      <IngredientModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        loading={isSubmitting}
      />
    </VStack>
  );
}


