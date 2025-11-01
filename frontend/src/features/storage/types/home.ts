import type { IngredientRead } from '../../../shared/types/ingredient';

export type StorageLocationKey = 'fridge' | 'cupboard' | 'pantry' | 'counter' | 'unspecified' | string;

export interface LocationToIngredientsMap {
  [location: string]: IngredientRead[];
}

export const DEFAULT_LOCATION_ORDER: StorageLocationKey[] = [
  'fridge',
  'cupboard',
  'pantry',
  'counter',
  'unspecified',
];


