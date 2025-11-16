import { Button, Modal } from '../../../shared/components';
import { Plus } from 'lucide-preact';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { RecipeForm } from './index';
import { RecipeList } from './RecipeList';

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1>Recipes</h1>
        <Button icon={Plus} onClick={onOpenCreate} aria-label="Add Recipe" />
      </div>

      <RecipeList recipes={recipes} onEdit={onEdit} onDelete={onDelete} />

      <Modal isOpen={isModalOpen} onClose={onCloseModal} title={editingRecipe ? 'Edit Recipe' : 'Add Recipe'}>
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={(data) => (editingRecipe ? onUpdate(editingRecipe.id, data) : onCreate(data))}
          onCancel={onCloseModal}
          loading={creating || updating}
          initialData={initialData}
        />
      </Modal>
    </div>
  );
}


