import { Button } from '../../../shared/components';
import { Plus } from 'lucide-react';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { RecipeList } from './RecipeList';
import { RecipeCreationDialog } from './RecipeCreationDialog';
import { RecipeViewModal } from './RecipeViewModal';
import { RecipeEditModal } from './RecipeEditModal';
import { Heading, Flex } from '@chakra-ui/react';
import { VStack } from '../../../shared/components/ui/Layout';
import { useRecipeCreation } from '../hooks/useRecipeCreation';
import { useState } from 'react';

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
  const { generateFromPayload, suggestion, generating, clearSuggestion } = useRecipeCreation();
  const [showCreationDialog, setShowCreationDialog] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const handleOpenCreate = () => {
    setShowCreationDialog(true);
    onOpenCreate();
  };

  const handleCloseCreationDialog = () => {
    setShowCreationDialog(false);
    onCloseModal();
    clearSuggestion();
  };

  const handleGenerate = async (payload: {
    ingredientIds: number[];
    cuisine?: string;
    dietaryRequirements: string[];
  }) => {
    const result = await generateFromPayload(payload);
    if (result) {
      setShowCreationDialog(false);
      setShowSuggestionModal(true);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (suggestion) {
      await onCreate(suggestion);
      setShowSuggestionModal(false);
      clearSuggestion();
    }
  };

  const handleCancelSuggestion = () => {
    setShowSuggestionModal(false);
    clearSuggestion();
    // Optionally reopen creation dialog
    // setShowCreationDialog(true);
  };

  return (
    <VStack align="stretch" gap={6}>
      <Flex align="center" justify="space-between">
        <Heading as="h1" size="lg">Recipes</Heading>
        <Button icon={Plus} onClick={handleOpenCreate} aria-label="Add Recipe" />
      </Flex>

      <RecipeList recipes={recipes} onEdit={onEdit} onDelete={onDelete} />

      {/* Show creation dialog when creating (not editing) */}
      {showCreationDialog && !editingRecipe && (
        <RecipeCreationDialog
          isOpen={showCreationDialog}
          onClose={handleCloseCreationDialog}
          onGenerate={handleGenerate}
          loading={generating}
        />
      )}

      {/* Show edit modal when editing */}
      {editingRecipe && (
        <RecipeEditModal
          isOpen={!!editingRecipe}
          onClose={onCloseModal}
          recipe={editingRecipe}
          onSubmit={(data) => onUpdate(editingRecipe.id, data)}
          onCancel={onCloseModal}
          loading={updating}
          initialData={initialData}
        />
      )}

      {/* Show suggestion modal when recipe is generated */}
      {suggestion && showSuggestionModal && (
        <RecipeViewModal
          isOpen={showSuggestionModal}
          onClose={handleCancelSuggestion}
          recipe={suggestion}
          onAccept={handleAcceptSuggestion}
          onCancel={handleCancelSuggestion}
          loading={creating}
        />
      )}
    </VStack>
  );
}


