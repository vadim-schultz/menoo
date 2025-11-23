import type { IngredientRead } from '../../../shared/types/ingredient';
import { StorageLocationTableEmpty } from './StorageLocationTableEmpty';
import { TableRoot as Table, TableHeader as Thead, TableBody as Tbody, TableRow as Tr, TableColumnHeader as Th, TableCell as Td, Box } from '@chakra-ui/react';

interface StorageLocationMiniTableProps {
  ingredients: IngredientRead[];
}

function sortByExpiryDate(ingredients: IngredientRead[]): IngredientRead[] {
  return [...ingredients].sort((a, b) => {
    const aDate = a.expiry_date ? new Date(a.expiry_date).getTime() : Number.POSITIVE_INFINITY;
    const bDate = b.expiry_date ? new Date(b.expiry_date).getTime() : Number.POSITIVE_INFINITY;
    return aDate - bDate;
  });
}

export function StorageLocationMiniTable({ ingredients }: StorageLocationMiniTableProps) {
  if (ingredients.length === 0) {
    return <StorageLocationTableEmpty />;
  }

  const sorted = sortByExpiryDate(ingredients);

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Box fontWeight="600" fontSize="xs" color="fg.muted">Name</Box>
            </Th>
            <Th>
              <Box fontWeight="600" fontSize="xs" color="fg.muted">Quantity</Box>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((ingredient) => (
            <Tr key={ingredient.id}>
              <Td>
                <Box fontSize="sm">{ingredient.name}</Box>
              </Td>
              <Td>
                <Box fontSize="sm">
                  {ingredient.quantity ?? '-'}
                  {ingredient.unit ? ` ${ingredient.unit}` : ''}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}



