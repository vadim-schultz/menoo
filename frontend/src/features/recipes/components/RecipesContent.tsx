import { Button } from '../../../shared/components';
import { Plus } from 'lucide-preact';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { RecipeForm } from './index';
import { RecipeList } from './RecipeList';
import { Card, CardBody, CardHeader } from '../../../shared/components/ui/Card';
import { Heading, Flex } from '@chakra-ui/react';

interface RecipeFormInitialData {
  ingredientIds?: number[];
  name?: string;
  description?: string;
}

interface RecipesContentProps {
  recipes: RecipeDetail[];
  isModalOpen: boolean;
  editingRecipe: RecipeDetail | null;
  initialData: RecipeFormInitialData | null;
  onOpenCreate: () => void;
  onEdit: (recipe: RecipeDetail) => void;
  onDelete: (id: number) => void;
  onCloseModal: () => void;
  onCreate: (data: RecipeCreate) => Promise<void>;
  onUpdate: (id: number, data: RecipeCreate) => Promise<void>;
  creating: boolean;
  updating: boolean;
}

export function RecipesContent({
  recipes,
  isModalOpen,
  editingRecipe,
  initialData,
  onOpenCreate,
  onEdit,
  onDelete,
  onCloseModal,
  onCreate,
  onUpdate,
  creating,
  updating,
}: RecipesContentProps) {
  return (
    <div>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading as="h1" size="lg">Recipes</Heading>
        <Button icon={Plus} onClick={onOpenCreate} aria-label="Add Recipe" />
      </Flex>

      <RecipeList recipes={recipes} onEdit={onEdit} onDelete={onDelete} />

      {(isModalOpen || editingRecipe) && (
        <Card aria-label={editingRecipe ? 'Edit Recipe' : 'Add Recipe'} mt={8}>
          <CardHeader display="flex" alignItems="center" justifyContent="space-between" pb={2}>
            <Heading as="h2" size="md" m={0}>
              {editingRecipe ? 'Edit Recipe' : 'Add Recipe'}
            </Heading>
            <Button variant="secondary" onClick={onCloseModal}>Close</Button>
          </CardHeader>
          <CardBody pt={0}>
            <RecipeForm
              recipe={editingRecipe}
              onSubmit={(data) => (editingRecipe ? onUpdate(editingRecipe.id, data) : onCreate(data))}
              onCancel={onCloseModal}
              loading={creating || updating}
              initialData={initialData}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}


