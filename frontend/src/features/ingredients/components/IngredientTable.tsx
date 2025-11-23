import type { IngredientRead } from '../../../shared/types/ingredient';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button, Flex, Text, Box } from '@chakra-ui/react';
import { EmptyState } from './EmptyState';
import { formatDate, formatStorageLocation } from '../services/formatting';
import { useTableSort } from '../hooks/useTableSort';
import { TableRoot as Table, TableHeader as Thead, TableBody as Tbody, TableRow as Tr, TableColumnHeader as Th, TableCell as Td } from '@chakra-ui/react';

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
      <Button
        type="button"
        onClick={() => handleSort(column)}
        variant="ghost"
        size="xs"
      >
        {isDesc ? <ChevronDown size={14} /> : isAsc ? <ChevronUp size={14} /> : <Box opacity={0.3}><ChevronUp size={14} /></Box>}
      </Button>
    );
  };

  if (ingredients.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box overflowX="auto" bg="bg.surface" borderRadius="lg" borderWidth="1px" borderColor="border.subtle">
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Flex align="center" justify="space-between">
                <Text fontWeight="600" fontSize="sm" color="fg.muted">Name</Text>
                <SortButton column="name" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center" justify="space-between">
                <Text fontWeight="600" fontSize="sm" color="fg.muted">Quantity</Text>
                <SortButton column="quantity" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center" justify="space-between">
                <Text fontWeight="600" fontSize="sm" color="fg.muted">Storage Location</Text>
                <SortButton column="storage_location" />
              </Flex>
            </Th>
            <Th>
              <Flex align="center" justify="space-between">
                <Text fontWeight="600" fontSize="sm" color="fg.muted">Expiry Date</Text>
                <SortButton column="expiry_date" />
              </Flex>
            </Th>
            <Th>
              <Text fontWeight="600" fontSize="sm" color="fg.muted">Actions</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients.map((ingredient) => (
            <Tr key={ingredient.id} _hover={{ bg: 'bg.subtle' }}>
              <Td>
                <Text>{ingredient.name}</Text>
              </Td>
              <Td>
                <Text>
                  {ingredient.quantity ?? '-'}
                  {ingredient.unit ? ` ${ingredient.unit}` : ''}
                </Text>
              </Td>
              <Td>
                <Text>{formatStorageLocation(ingredient.storage_location)}</Text>
              </Td>
              <Td>
                <Text>{formatDate(ingredient.expiry_date)}</Text>
              </Td>
              <Td>
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => onDelete(ingredient.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

