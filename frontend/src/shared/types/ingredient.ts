export type StorageLocation = 'fridge' | 'freezer' | 'pantry' | 'counter';

export interface IngredientBase {
  name: string;
  quantity: number;
  unit: string;
  storage_location?: StorageLocation | null;
  expiry_date?: string | null;
}

export interface IngredientCreate extends IngredientBase {}

export interface IngredientUpdate {
  name?: string;
  quantity?: number;
  unit?: string;
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

export interface IngredientDetail extends IngredientRead {
  recipe_count?: number;
}

export interface IngredientListResponse {
  items: IngredientRead[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface IngredientFilters {
  storage_location?: StorageLocation;
  expiring_before?: string;
  name?: string;
  page?: number;
  page_size?: number;
}
