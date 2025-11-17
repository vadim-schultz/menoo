import type { IngredientRead } from '../../../shared/types/ingredient';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/components';
import { formatDate } from '../services';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../../shared/components/ui/Table';
import { HStack } from '../../../shared/components/ui/Layout';

interface StorageLocationTableContentProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
}

export function StorageLocationTableContent({ ingredients, onEdit, onDelete }: StorageLocationTableContentProps) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th scope="col">Name</Th>
            <Th scope="col">Quantity</Th>
            <Th scope="col">Expiry</Th>
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
              <Td>{formatDate(ingredient.expiry_date)}</Td>
              <Td>
                <HStack gap={2}>
                  <Button
                    icon={Pencil}
                    variant="secondary"
                    onClick={() => onEdit(ingredient)}
                    type="button"
                    aria-label="Edit ingredient"
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    onClick={() => onDelete(ingredient.id)}
                    type="button"
                    aria-label="Delete ingredient"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}


