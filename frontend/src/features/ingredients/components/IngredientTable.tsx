import type { IngredientRead } from '../../../shared/types/ingredient';
import { Trash, ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton, Flex, Text } from '@chakra-ui/react';
import { EmptyState } from './EmptyState';
import { formatDate, formatStorageLocation } from '../services/formatting';
import { useTableSort } from '../hooks/useTableSort';
import { TableRoot as Table, TableHeader as Thead, TableBody as Tbody, TableRow as Tr, TableColumnHeader as Th, TableCell as Td, Box } from '@chakra-ui/react';

interface IngredientTableProps {
  ingredients: IngredientRead[];
  onDelete: (id: number) => void;
  // Sort props
  sortColumn?: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (column: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null) => void;
}

export const IngredientTable = ({
  ingredients,
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
      >
        {isDesc ? <ChevronDown size={14} /> : isAsc ? <ChevronUp size={14} /> : <ChevronUp size={14} style={{ opacity: 0.3 }} />}
      </IconButton>
    );
  };

  if (ingredients.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box overflowX="auto">
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
                <IconButton
                  aria-label="Delete ingredient"
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(ingredient.id)}
                >
                  <Trash size={16} />
                </IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

