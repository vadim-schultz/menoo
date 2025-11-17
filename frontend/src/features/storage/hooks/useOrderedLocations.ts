import { useMemo } from 'react';
import type { LocationToIngredientsMap, StorageLocationKey } from '../types';
import { getOrderedLocations } from '../services';

export function useOrderedLocations(
  grouped: LocationToIngredientsMap,
  locationOrder: StorageLocationKey[]
): string[] {
  return useMemo(() => getOrderedLocations(grouped, locationOrder), [grouped, locationOrder]);
}


