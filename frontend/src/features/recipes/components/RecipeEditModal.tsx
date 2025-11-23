import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  Button,
  Flex,
} from '@chakra-ui/react';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { RecipeForm } from './RecipeForm';

interface RecipeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeDetail;
  onSubmit: (data: RecipeCreate) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  initialData?: { ingredientIds?: number[]; name?: string; description?: string } | null;
}

export function RecipeEditModal({
  isOpen,
  onClose,
  recipe,
  onSubmit,
  onCancel,
  loading,
  initialData,
}: RecipeEditModalProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size="lg"
    >
      <DialogBackdrop />
      <DialogContent
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        maxW="4xl"
        w="90%"
        maxH="90vh"
      >
        <DialogHeader p={6}>
          <Flex justify="space-between" align="center">
            <DialogTitle>Edit Recipe</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
              Close
            </Button>
          </Flex>
        </DialogHeader>
        <DialogBody p={6} maxH="80vh" overflowY="auto">
          <RecipeForm
            recipe={recipe}
            onSubmit={onSubmit}
            onCancel={onCancel}
            loading={loading}
            initialData={initialData}
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

