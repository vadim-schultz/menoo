import { useEffect, useState } from 'react';
import type { IngredientFilters } from '../../../shared/types/ingredient';

export type SortColumn = 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null;
export type SortDirection = 'asc' | 'desc';

export interface UseIngredientFiltersReturn {
  // state
  nameContains: string;
  storageLocation: string | '';
  expiringBefore: string;
  page: number;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  appliedFilters: IngredientFilters;
  // handlers
  setNameContains: (v: string) => void;
  setStorageLocation: (v: string | '') => void;
  setExpiringBefore: (v: string) => void;
  setPage: (p: number) => void;
  handleSortChange: (column: Exclude<SortColumn, null> | null) => void;
}

export function useIngredientFilters(): UseIngredientFiltersReturn {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialStorageLocation = searchParams?.get('storage_location') ?? '';

  const [nameContains, setNameContains] = useState<string>('');
  const [storageLocation, setStorageLocation] = useState<string | ''>(initialStorageLocation);
  const [expiringBefore, setExpiringBefore] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [appliedFilters, setAppliedFilters] = useState<IngredientFilters>({
    page: 1,
    page_size: 100,
    storage_location: initialStorageLocation || undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextFilters: IngredientFilters = {
        page: 1,
        page_size: 100,
        name_contains: nameContains || undefined,
        storage_location: storageLocation || undefined,
        expiring_before: expiringBefore || undefined,
      };
      setAppliedFilters(nextFilters);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [nameContains, storageLocation, expiringBefore]);

  useEffect(() => {
    setAppliedFilters((prev) => ({ ...prev, page }));
  }, [page]);

  const handleSortChange = (column: Exclude<SortColumn, null> | null) => {
    if (column === null) {
      setSortColumn(null);
      setSortDirection('asc');
    } else if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    nameContains,
    storageLocation,
    expiringBefore,
    page,
    sortColumn,
    sortDirection,
    appliedFilters,
    setNameContains,
    setStorageLocation,
    setExpiringBefore,
    setPage,
    handleSortChange,
  };
}


