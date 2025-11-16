import type { IngredientRead } from '../../../shared/types/ingredient';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-preact';
import { Button, Input } from '../../../shared/components';
import { EmptyState } from './EmptyState';
import { formatDate, formatStorageLocation } from '../services/formatting';
import { useTableSort } from '../hooks/useTableSort';

interface IngredientTableProps {
  ingredients: IngredientRead[];
  onEdit: (ingredient: IngredientRead) => void;
  onDelete: (id: number) => void;
  // Filter props
  nameContains: string;
  storageLocation: string | '';
  expiringBefore: string;
  onNameContainsChange: (value: string) => void;
  onStorageLocationChange: (value: string | '') => void;
  onExpiringBeforeChange: (value: string) => void;
  // Sort props
  sortColumn?: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (column: 'name' | 'quantity' | 'storage_location' | 'expiry_date' | null) => void;
}

export const IngredientTable = ({
  ingredients,
  onEdit,
  onDelete,
  nameContains,
  storageLocation,
  expiringBefore,
  onNameContainsChange,
  onStorageLocationChange,
  onExpiringBeforeChange,
  sortColumn,
  sortDirection,
  onSortChange,
}: IngredientTableProps) => {
  const handleSort = useTableSort(sortColumn || null, sortDirection || 'asc', onSortChange);

  const SortButton = ({ column }: { column: 'name' | 'quantity' | 'storage_location' | 'expiry_date' }) => {
    const isActive = sortColumn === column;
    const isAsc = isActive && sortDirection === 'asc';
    const isDesc = isActive && sortDirection === 'desc';

    return (
      <button
        type="button"
        onClick={() => handleSort(column)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          marginLeft: '0.5rem',
        }}
        aria-label={`Sort by ${column}`}
      >
        {isDesc ? <ChevronDown size={14} /> : isAsc ? <ChevronUp size={14} /> : <ChevronUp size={14} style={{ opacity: 0.3 }} />}
      </button>
    );
  };

  if (ingredients.length === 0) {
    return <EmptyState />;
  }

  return (
    <figure style={{ overflowX: 'auto', margin: 0 }}>
      <table role="grid">
        <thead>
          <tr>
            <th scope="col" style={{ verticalAlign: 'bottom' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Name</span>
                <SortButton column="name" />
              </div>
              <Input name="name_filter" value={nameContains} onChange={onNameContainsChange} placeholder="Filter by name..." />
            </th>
            <th scope="col" style={{ verticalAlign: 'bottom' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Quantity</span>
                <SortButton column="quantity" />
              </div>
            </th>
            <th scope="col" style={{ verticalAlign: 'bottom' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Storage Location</span>
                <SortButton column="storage_location" />
              </div>
              <Input name="storage_filter" value={storageLocation} onChange={(v) => onStorageLocationChange(v)} placeholder="Filter by location..." />
            </th>
            <th scope="col" style={{ verticalAlign: 'bottom' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Expiry Date</span>
                <SortButton column="expiry_date" />
              </div>
              <Input name="expiry_filter" type="date" value={expiringBefore} onChange={onExpiringBeforeChange} placeholder="Expiring before..." />
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>
                {ingredient.quantity ?? '-'}
                {ingredient.unit ? ` ${ingredient.unit}` : ''}
              </td>
              <td>{formatStorageLocation(ingredient.storage_location)}</td>
              <td>{formatDate(ingredient.expiry_date)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    icon={Pencil}
                    variant="secondary"
                    onClick={() => onEdit(ingredient)}
                    type="button"
                    aria-label="Edit ingredient"
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    onClick={() => onDelete(ingredient.id)}
                    type="button"
                    aria-label="Delete ingredient"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

