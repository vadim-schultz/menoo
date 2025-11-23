import React from 'react';
import { Input } from '../../../shared/components';
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  Button,
  VStack,
  Flex,
} from '@chakra-ui/react';
import type { IngredientRead } from '../../../shared/types/ingredient';

interface IngredientDraft {
  name: string;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IngredientDraft) => Promise<void>;
  loading: boolean;
  ingredient?: IngredientRead | null;
}

export const IngredientModal = ({ isOpen, onClose, onSubmit, loading, ingredient }: Props) => {
  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState<number | ''>('');
  const [errors, setErrors] = React.useState<{ name?: string; quantity?: string }>({});

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setQuantity('');
      setErrors({});
      return;
    }

    if (ingredient) {
      setName(ingredient.name || '');
      setQuantity(
        typeof ingredient.quantity === 'number' && !Number.isNaN(ingredient.quantity)
          ? ingredient.quantity
          : ''
      );
    } else {
      setName('');
      setQuantity('');
    }
  }, [isOpen, ingredient]);

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
        maxW="lg"
        w="90%"
        maxH="90vh"
      >
        <DialogHeader p={6}>
          <Flex justify="space-between" align="center">
            <DialogTitle>{ingredient ? 'Edit Ingredient' : 'Add Ingredient'}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Close
            </Button>
          </Flex>
        </DialogHeader>
        <DialogBody p={6}>
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

              <Flex justify="flex-end" gap={2}>
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : ingredient ? 'Update Ingredient' : 'Add Ingredient'}
                </Button>
              </Flex>
            </VStack>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
