import type { IngredientRead } from '../../../shared/types/ingredient';
import { SquarePen, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton, HStack, Flex, Text } from '@chakra-ui/react';
import { EmptyState } from './EmptyState';
import { formatDate, formatStorageLocation } from '../services/formatting';
import { useTableSort } from '../hooks/useTableSort';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../../shared/components/ui/Table';

interface IngredientTableProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
  // Sort props
  sortColumn?: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (column: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null) => void;
}

export const IngredientTable = ({
  ingredients,
  onEdit,
  onDelete,
  sortColumn,
  sortDirection,
  onSortChange,
}: IngredientTableProps) => {
  const handleSort = useTableSort(sortColumn || null, sortDirection || 'asc', onSortChange);

  const SortButton = ({ column }: { column: 'name' | 'quantity' | 'storage_location' | 'expiry_date' }) => {
    const isActive = sortColumn === column;
    const isAsc = isActive && sortDirection === 'asc';
    const isDesc = isActive && sortDirection === 'desc';

    return (
      <IconButton
        type="button"
        onClick={() => handleSort(column)}
        aria-label={`Sort by ${column}`}
        variant="ghost"
        size="xs"
        ml={2}
      >
        {isDesc ? <ChevronDown size={14} /> : isAsc ? <ChevronUp size={14} /> : <ChevronUp size={14} style={{ opacity: 0.3 }} />}
      </IconButton>
    );
  };

  if (ingredients.length === 0) {
    return <EmptyState />;
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th scope="col">
              <Flex align="center" justify="space-between">
                <Text>Name</Text>
                <SortButton column="name" />
              </Flex>
            </Th>
            <Th scope="col">
              <Flex align="center" justify="space-between">
                <Text>Quantity</Text>
                <SortButton column="quantity" />
              </Flex>
            </Th>
            <Th scope="col">
              <Flex align="center" justify="space-between">
                <Text>Storage Location</Text>
                <SortButton column="storage_location" />
              </Flex>
            </Th>
            <Th scope="col">
              <Flex align="center" justify="space-between">
                <Text>Expiry Date</Text>
                <SortButton column="expiry_date" />
              </Flex>
            </Th>
            <Th scope="col">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients.map((ingredient) => (
            <Tr key={ingredient.id}>
              <Td>{ingredient.name}</Td>
              <Td>
                {ingredient.quantity ?? '-'}
                {ingredient.unit ? ` ${ingredient.unit}` : ''}
              </Td>
              <Td>{formatStorageLocation(ingredient.storage_location)}</Td>
              <Td>{formatDate(ingredient.expiry_date)}</Td>
              <Td>
                <HStack gap={1}>
                  <IconButton
                    aria-label="Edit ingredient"
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(ingredient)}
                  >
                    <SquarePen size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete ingredient"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(ingredient.id)}
                  >
                    <Trash size={16} />
                  </IconButton>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

