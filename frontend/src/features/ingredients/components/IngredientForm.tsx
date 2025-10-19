import { useForm } from '../../../shared/hooks';
import type { IngredientCreate, IngredientRead } from '../../../shared/types';
import { Button, Input, Select } from '../../../shared/components';

interface IngredientFormProps {
  ingredient?: IngredientRead | null;
  onSubmit: (data: IngredientCreate) => void;
  onCancel: () => void;
  loading: boolean;
}

const storageLocationOptions = [
  { value: 'fridge', label: 'Fridge' },
  { value: 'freezer', label: 'Freezer' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'counter', label: 'Counter' },
];

export function IngredientForm({ ingredient, onSubmit, onCancel, loading }: IngredientFormProps) {
  const validate = (values: IngredientCreate) => {
    const errors: Record<string, string> = {};

    if (!values.name || values.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!values.quantity || values.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (!values.unit || values.unit.trim() === '') {
      errors.unit = 'Unit is required';
    }

    return errors;
  };

  const form = useForm<IngredientCreate>({
    initialValues: ingredient
      ? {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          storage_location: ingredient.storage_location,
          expiry_date: ingredient.expiry_date,
        }
      : {
          name: '',
          quantity: 0,
          unit: '',
          storage_location: null,
          expiry_date: null,
        },
    onSubmit,
    validate,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Input
        label="Name"
        name="name"
        value={form.values.name}
        onChange={(value) => form.handleChange('name', value)}
        onBlur={() => form.handleBlur('name')}
        error={form.touched.name ? form.errors.name : undefined}
        required
      />

      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={form.values.quantity}
        onChange={(value) => form.handleChange('quantity', parseFloat(value) || 0)}
        onBlur={() => form.handleBlur('quantity')}
        error={form.touched.quantity ? form.errors.quantity : undefined}
        required
      />

      <Input
        label="Unit"
        name="unit"
        value={form.values.unit}
        onChange={(value) => form.handleChange('unit', value)}
        onBlur={() => form.handleBlur('unit')}
        error={form.touched.unit ? form.errors.unit : undefined}
        placeholder="e.g., kg, pieces, liters"
        required
      />

      <Select
        label="Storage Location"
        name="storage_location"
        value={form.values.storage_location || ''}
        onChange={(value) => form.handleChange('storage_location', value || undefined)}
        options={storageLocationOptions}
        placeholder="Select location (optional)"
      />

      <Input
        label="Expiry Date"
        name="expiry_date"
        type="date"
        value={form.values.expiry_date || ''}
        onChange={(value) => form.handleChange('expiry_date', value || undefined)}
      />

      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}
      >
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : ingredient ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
