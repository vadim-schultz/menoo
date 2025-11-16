// Backend-aligned ingredient types (kept minimal for UI compatibility)

export type IngredientCategory =
  | 'protein'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'dairy'
  | 'spice'
  | 'herb'
  | 'sauce'
  | 'condiment'
  | 'flavor_enhancer'
  | 'oil_fat'
  | 'sweetener'
  | 'liquid'
  | 'other';

export interface IngredientBase {
  name: string;
  // Backend supports decimals; frontend uses number
  quantity?: number | null;
  unit?: string | null;
  category?: IngredientCategory;
  storage_location?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
}

export interface IngredientCreate extends IngredientBase {}

export interface IngredientPatch {
  name?: string;
  category?: IngredientCategory;
  storage_location?: string | null;
  quantity?: number | null;
  unit?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
}

export interface IngredientRead extends IngredientBase {
  id: number;
  storage_location: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface IngredientFilters {
  category?: IngredientCategory;
  storage_location?: string;
  expiring_before?: string;
  name_contains?: string;
  page?: number;
  page_size?: number;
}

// Shared category values for building UI options elsewhere
export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'protein',
  'vegetable',
  'fruit',
  'grain',
  'dairy',
  'spice',
  'herb',
  'sauce',
  'condiment',
  'flavor_enhancer',
  'oil_fat',
  'sweetener',
  'liquid',
  'other',
];
