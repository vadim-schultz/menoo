import type { IngredientRead } from '../../../shared/types/ingredient';
import type { SortColumn, SortDirection } from '../hooks/useIngredientFilters';

export function sortIngredients(
  items: IngredientRead[],
  sortColumn: SortColumn,
  sortDirection: SortDirection
): IngredientRead[] {
  if (!sortColumn) return items;
  const sorted = [...items].sort((a, b) => {
    let aVal: any;
    let bVal: any;
    switch (sortColumn) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'quantity':
        aVal = a.quantity;
        bVal = b.quantity;
        break;
      case 'storage_location':
        aVal = (a.storage_location || '').toLowerCase();
        bVal = (b.storage_location || '').toLowerCase();
        break;
      case 'expiry_date':
        aVal = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
        bVal = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}


