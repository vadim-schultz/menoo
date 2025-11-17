import { Modal, Button } from '../../../shared/components';
import type { IngredientRead, IngredientCreate } from '../../../shared/types/ingredient';
import { useIngredientForm } from '../hooks/useIngredientForm';
import { IngredientFormFields } from './IngredientFormFields';
import { Box } from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  ingredient: IngredientRead | null;
  onClose: () => void;
  onSubmit: (data: IngredientCreate) => Promise<void>;
  loading: boolean;
}

export const IngredientModal = ({ isOpen, ingredient, onClose, onSubmit, loading }: Props) => {
  const form = useIngredientForm(ingredient, onSubmit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
    >
      <form onSubmit={form.handleSubmit}>
        <IngredientFormFields form={form} />
        <Box
          display="flex"
          gap={2}
          justifyContent="flex-end"
          mt={6}
        >
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : ingredient ? 'Update' : 'Create'}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};
