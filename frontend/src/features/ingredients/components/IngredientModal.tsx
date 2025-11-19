import React from 'react';
import { Modal, Input } from '../../../shared/components';
import { Box, IconButton } from '@chakra-ui/react';
import { VStack } from '../../../shared/components/ui/Layout';
import { CircleCheckBig, CircleX } from 'lucide-react';

interface IngredientDraft {
  name: string;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IngredientDraft) => Promise<void>;
  loading: boolean;
}

export const IngredientModal = ({ isOpen, onClose, onSubmit, loading }: Props) => {
  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState<number | ''>('');
  const [errors, setErrors] = React.useState<{ name?: string; quantity?: string }>({});

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setName('');
      setQuantity('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { name?: string; quantity?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (quantity === '' || quantity === null || quantity === undefined) {
      newErrors.quantity = 'Quantity is required';
    } else if (typeof quantity === 'number' && quantity < 0) {
      newErrors.quantity = 'Quantity must be non-negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      quantity: typeof quantity === 'number' ? quantity : 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Ingredient"
    >
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" gap={4}>
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={setName}
            error={errors.name}
            required
            placeholder="e.g., Fresh Basil"
          />

          <Input
            label="Quantity (grams)"
            name="quantity"
            type="number"
            value={quantity === '' ? '' : String(quantity)}
            onChange={(value) => setQuantity(value === '' ? '' : parseFloat(value) || '')}
            error={errors.quantity}
            required
            placeholder="e.g., 100"
          />

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <IconButton
              aria-label="Cancel"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              <CircleX size={16} />
            </IconButton>
            <IconButton
              aria-label={loading ? 'Adding...' : 'Add Ingredient'}
              variant="ghost"
              type="submit"
              disabled={loading}
            >
              <CircleCheckBig size={16} />
            </IconButton>
          </Box>
        </VStack>
      </form>
    </Modal>
  );
};
