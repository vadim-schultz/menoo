import { useCallback, useState } from 'preact/hooks';
import type { IngredientCreate, IngredientRead } from '../../../shared/types/ingredient';
import type {
  CreateIngredientFn,
  UpdateIngredientFn,
  RemoveIngredientFn,
} from '../services/ingredientActions';
import { saveIngredient, confirmAndDelete } from '../services/ingredientActions';

export interface UseIngredientActionsDeps {
  create: CreateIngredientFn;
  update: UpdateIngredientFn;
  remove: RemoveIngredientFn;
}

export interface UseIngredientActionsReturn {
  isModalOpen: boolean;
  editing: IngredientRead | null;
  openEditModal: (ingredient: IngredientRead) => void;
  openCreateModal: () => void;
  closeModal: () => void;
  handleSubmit: (data: IngredientCreate) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
}

export function useIngredientActions({ create, update, remove }: UseIngredientActionsDeps): UseIngredientActionsReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IngredientRead | null>(null);

  const openEditModal = useCallback((ingredient: IngredientRead) => {
    setEditing(ingredient);
    setIsModalOpen(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditing(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditing(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: IngredientCreate) => {
      await saveIngredient(editing, data, create, update, closeModal, (err) =>
        console.error('Failed to save ingredient:', err)
      );
    },
    [editing, create, update, closeModal]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await confirmAndDelete(id, remove, (msg) => confirm(msg), (err) => console.error('Failed to delete:', err));
    },
    [remove]
  );

  return { isModalOpen, editing, openEditModal, openCreateModal, closeModal, handleSubmit, handleDelete };
}


