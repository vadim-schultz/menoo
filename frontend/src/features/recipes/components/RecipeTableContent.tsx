import type { RecipeDetail } from '../../../shared/types';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/components';
import { formatDifficulty, formatTime, truncateText } from '../services/recipeFormatting';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '../../../shared/components/ui/Table';

interface RecipeTableContentProps {
  recipes: RecipeDetail[];
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
}

export function RecipeTableContent({ recipes, onEdit, onDelete }: RecipeTableContentProps) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th scope="col">Name</Th>
            <Th scope="col">Description</Th>
            <Th scope="col">Difficulty</Th>
            <Th scope="col">Prep Time</Th>
            <Th scope="col">Cook Time</Th>
            <Th scope="col">Servings</Th>
            <Th scope="col">Ingredients</Th>
            <Th scope="col">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {recipes.map((recipe) => (
            <Tr key={recipe.id}>
              <Td>{recipe.name}</Td>
              <Td>{truncateText(recipe.description)}</Td>
              <Td>{formatDifficulty(recipe.difficulty)}</Td>
              <Td>{formatTime(recipe.prep_time)}</Td>
              <Td>{formatTime(recipe.cook_time)}</Td>
              <Td>{recipe.servings || '-'}</Td>
              <Td>{recipe.ingredients?.length || 0}</Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    icon={Pencil}
                    variant="secondary"
                    onClick={() => onEdit(recipe)}
                    type="button"
                    aria-label="Edit recipe"
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    onClick={() => onDelete(recipe.id)}
                    type="button"
                    aria-label="Delete recipe"
                  />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}


