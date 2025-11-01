import type { StorageLocation } from '../../../shared/types/ingredient';
import { Button, Input, Select } from '../../../shared/components';

export interface IngredientFilterPanelProps {
  nameContains: string;
  storageLocation: StorageLocation | '';
  expiringBefore: string;
  onNameContainsChange: (value: string) => void;
  onStorageLocationChange: (value: StorageLocation | '') => void;
  onExpiringBeforeChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const IngredientFilterPanel = ({
  nameContains,
  storageLocation,
  expiringBefore,
  onNameContainsChange,
  onStorageLocationChange,
  onExpiringBeforeChange,
  onApply,
  onReset,
}: IngredientFilterPanelProps) => {
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>Filters</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
        <Input
          label="Name contains"
          name="name_contains"
          value={nameContains}
          onChange={onNameContainsChange}
          placeholder="e.g. apple"
        />
        <Select
          label="Storage Location"
          name="storage_location"
          value={storageLocation}
          onChange={(v) => onStorageLocationChange((v || '') as StorageLocation | '')}
          options={[
            { value: '', label: 'Any' },
            { value: 'fridge', label: 'Fridge' },
            { value: 'cupboard', label: 'Cupboard' },
            { value: 'pantry', label: 'Pantry' },
            { value: 'counter', label: 'Counter' },
          ]}
        />
        <Input
          label="Expiring Before"
          name="expiring_before"
          type="date"
          value={expiringBefore}
          onChange={onExpiringBeforeChange}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
          <Button onClick={onApply} type="button">
            Apply
          </Button>
          <Button onClick={onReset} type="button" variant="secondary">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

