import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Button,
  Flex,
} from '@chakra-ui/react';
import { RecipeView } from './RecipeView';
import type { RecipeCreate, RecipeDetail } from '../../../shared/types';

interface RecipeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeCreate | RecipeDetail;
  onAccept?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function RecipeViewModal({
  isOpen,
  onClose,
  recipe,
  onAccept,
  onCancel,
  loading = false,
}: RecipeViewModalProps) {
  const handleAccept = () => {
    if (onAccept && !loading) {
      onAccept();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      size="xl"
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
            <DialogTitle>Recipe</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
              Close
            </Button>
          </Flex>
        </DialogHeader>
        <DialogBody p={8} maxH="90vh" overflowY="auto">
          <RecipeView
            recipe={recipe}
            onAccept={handleAccept}
            onCancel={handleCancel}
            showActions={true}
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

