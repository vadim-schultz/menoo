export type StorageLocation = 'fridge' | 'cupboard' | 'pantry' | 'counter';

export interface IngredientBase {
  name: string;
  quantity: number; // Always in GRAMS (no unit field)
  storage_location?: StorageLocation | null;
  expiry_date?: string | null;
}

export interface IngredientCreate extends IngredientBase {}

export interface IngredientPatch {
  name?: string;
  quantity?: number;
  storage_location?: StorageLocation | null;
  expiry_date?: string | null;
}

export interface IngredientRead extends IngredientBase {
  id: number;
  storage_location: StorageLocation | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface IngredientFilters {
  storage_location?: StorageLocation;
  expiring_before?: string;
  name_contains?: string;
  page?: number;
  page_size?: number;
}
