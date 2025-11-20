import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  IconButton,
} from '@chakra-ui/react';
import { CircleX } from 'lucide-react';
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
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <IconButton
          aria-label="Close"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          position="absolute"
          top={3}
          right={3}
          zIndex={1}
          disabled={loading}
        >
          <CircleX size={16} />
        </IconButton>
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

