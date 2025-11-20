import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  IconButton,
} from '@chakra-ui/react';
import { CircleX } from 'lucide-react';
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
        <IconButton
          aria-label="Close"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          position="absolute"
          top={3}
          right={3}
          zIndex={1}
          disabled={loading}
        >
          <CircleX size={16} />
        </IconButton>
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

