import { useCallback, useState } from 'react';
import type { IngredientRead } from '../../../shared/types/ingredient';
import type {
  CreateIngredientFn,
  RemoveIngredientFn,
} from '../services/ingredientActions';
import { confirmAndDelete } from '../services/ingredientActions';

interface IngredientDraft {
  name: string;
  quantity: number;
}

export interface UseIngredientActionsDeps {
  create: CreateIngredientFn;
  remove: RemoveIngredientFn;
}

export interface UseIngredientActionsReturn {
  isModalOpen: boolean;
  openCreateModal: () => void;
  closeModal: () => void;
  handleSubmit: (data: IngredientDraft) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
}

export function useIngredientActions({ create, remove }: UseIngredientActionsDeps): UseIngredientActionsReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: IngredientDraft) => {
      try {
        // Convert draft to IngredientCreate format (only name and quantity)
        await create({
          name: data.name,
          quantity: data.quantity,
        });
        closeModal();
      } catch (err) {
        console.error('Failed to create ingredient:', err);
        throw err;
      }
    },
    [create, closeModal]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await confirmAndDelete(id, remove, (msg) => confirm(msg), (err) => console.error('Failed to delete:', err));
    },
    [remove]
  );

  return { isModalOpen, openCreateModal, closeModal, handleSubmit, handleDelete };
}


