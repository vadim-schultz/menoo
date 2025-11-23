import type { StorageLocation } from '../../../shared/types/ingredient';
import { Button, Input, Select } from '../../../shared/components';
import { Box, Heading, SimpleGrid, HStack } from '@chakra-ui/react';

export interface IngredientFilterPanelProps {
  nameContains: string;
  storageLocation: StorageLocation | '';
  expiringBefore: string;
  onNameContainsChange: (value: string) => void;
  onStorageLocationChange: (value: StorageLocation | '') => void;
  onExpiringBeforeChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const IngredientFilterPanel = ({
  nameContains,
  storageLocation,
  expiringBefore,
  onNameContainsChange,
  onStorageLocationChange,
  onExpiringBeforeChange,
  onApply,
  onReset,
}: IngredientFilterPanelProps) => {
  return (
    <Box bg="bg.surface" borderRadius="lg" borderWidth="1px" borderColor="border.subtle" p={6} mb={4}>
      <Heading as="h3" size="md" mb={4}>
        Filters
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
        <Input
          label="Name contains"
          name="name_contains"
          value={nameContains}
          onChange={onNameContainsChange}
          placeholder="e.g. apple"
        />
        <Select
          label="Storage Location"
          name="storage_location"
          value={storageLocation}
          onChange={(v) => onStorageLocationChange((v || '') as StorageLocation | '')}
          options={[
            { value: '', label: 'Any' },
            { value: 'fridge', label: 'Fridge' },
            { value: 'cupboard', label: 'Cupboard' },
            { value: 'pantry', label: 'Pantry' },
            { value: 'counter', label: 'Counter' },
          ]}
        />
        <Input
          label="Expiring Before"
          name="expiring_before"
          type="date"
          value={expiringBefore}
          onChange={onExpiringBeforeChange}
        />
        <HStack align="flex-end" gap={2}>
          <Button onClick={onApply} type="button">
            Apply
          </Button>
          <Button onClick={onReset} type="button" variant="outline" colorPalette="gray">
            Reset
          </Button>
        </HStack>
      </SimpleGrid>
    </Box>
  );
};

