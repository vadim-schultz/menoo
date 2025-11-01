import { useCallback } from 'preact/hooks';

type Column = 'name' | 'quantity' | 'storage_location' | 'expiry_date';

export function useTableSort(
  sortColumn: Column | null | undefined,
  sortDirection: 'asc' | 'desc' | undefined,
  onSortChange: (column: Column | null) => void
) {
  return useCallback(
    (column: Column) => {
      if (sortColumn === column) {
        // Toggle direction if same column, or remove sort if already desc
        if (sortDirection === 'desc') {
          onSortChange(null);
        } else {
          onSortChange(column); // Will toggle to desc in container logic
        }
      } else {
        onSortChange(column);
      }
    },
    [sortColumn, sortDirection, onSortChange]
  );
}


