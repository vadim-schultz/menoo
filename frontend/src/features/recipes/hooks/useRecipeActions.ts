import { useState, useCallback } from 'preact/hooks';
import type { RecipeDetail, RecipeCreate } from '../../../shared/types';
import { loadRecipeForEdit, saveRecipe, confirmAndDeleteRecipe } from '../services/recipeActions';

interface UseRecipeActionsDeps {
  createRecipe: (data: RecipeCreate) => Promise<any>;
  updateRecipe: (id: number, data: RecipeCreate) => Promise<any>;
  deleteRecipe: (id: number) => Promise<any>;
  refetch: () => void;
}

export interface UseRecipeActionsReturn {
  isModalOpen: boolean;
  editingRecipe: RecipeDetail | null;
  initialData: RecipeFormInitialData | null;
  setInitialData: (data: RecipeFormInitialData | null) => void;
  openCreate: () => void;
  handleEdit: (recipe: RecipeDetail) => Promise<void>;
  handleCreate: (data: RecipeCreate) => Promise<void>;
  handleUpdate: (id: number, data: RecipeCreate) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  closeModal: () => void;
}

export interface RecipeFormInitialData {
  ingredientIds?: number[];
  name?: string;
  description?: string;
}

export function useRecipeActions({ createRecipe, updateRecipe, deleteRecipe, refetch }: UseRecipeActionsDeps): UseRecipeActionsReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDetail | null>(null);
  const [initialData, setInitialData] = useState<RecipeFormInitialData | null>(null);

  const openCreate = useCallback(() => {
    setInitialData(null);
    setEditingRecipe(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback(async (recipe: RecipeDetail) => {
    const full = await loadRecipeForEdit(recipe.id);
    setEditingRecipe(full);
    setIsModalOpen(true);
  }, []);

  const handleCreate = useCallback(
    async (data: RecipeCreate) => {
      try {
        await saveRecipe(null, data, createRecipe, updateRecipe);
        refetch();
      } finally {
        setIsModalOpen(false);
      }
    },
    [createRecipe, updateRecipe, refetch]
  );

  const handleUpdate = useCallback(
    async (id: number, data: RecipeCreate) => {
      try {
        await saveRecipe({ id } as RecipeDetail, data, createRecipe, updateRecipe);
        refetch();
      } finally {
        setIsModalOpen(false);
        setEditingRecipe(null);
      }
    },
    [createRecipe, updateRecipe, refetch]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await confirmAndDeleteRecipe(id, deleteRecipe, (msg) => confirm(msg));
      refetch();
    },
    [deleteRecipe, refetch]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRecipe(null);
    setInitialData(null);
  }, []);

  return {
    isModalOpen,
    editingRecipe,
    initialData,
    setInitialData,
    openCreate,
    handleEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    closeModal,
  };
}


