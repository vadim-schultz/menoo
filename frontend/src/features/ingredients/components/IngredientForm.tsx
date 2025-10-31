

import { Input, Select, Button } from '../../../shared/components';

import type { IngredientCreate, IngredientRead } from '../../../shared/types/ingredient';

type IngredientFormProps = {
  ingredient?: IngredientRead | null;
  onSubmit: (data: IngredientCreate) => void;
  onCancel: () => void;
  loading: boolean;
};
import { useForm } from '../../../shared/hooks';
import { validateIngredient } from '../services/validation';
import { STORAGE_OPTIONS } from '../services/storageOptions';

export function IngredientForm({ ingredient, onSubmit, onCancel, loading }: IngredientFormProps) {
  const form = useForm<IngredientCreate>({
    initialValues: ingredient
      ? {
          name: ingredient.name,
          quantity: ingredient.quantity,
          storage_location: ingredient.storage_location ?? null,
          expiry_date: ingredient.expiry_date ?? null,
        }
      : {
          name: '',
          quantity: 0,
          storage_location: null,
          expiry_date: null,
        },
    onSubmit,
    validate: validateIngredient,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Input
        label="Name"
        name="name"
        value={form.values.name}
        onChange={(value: string) => form.handleChange('name', value)}
        onBlur={() => form.handleBlur('name')}
        error={form.touched.name ? form.errors.name : undefined}
        required
      />

      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={form.values.quantity}
        onChange={(value: string) => form.handleChange('quantity', parseFloat(value) || 0)}
        onBlur={() => form.handleBlur('quantity')}
        error={form.touched.quantity ? form.errors.quantity : undefined}
        required
      />

      <Select
        label="Storage Location"
        name="storage_location"
        value={form.values.storage_location || ''}
        onChange={(value: string) => form.handleChange('storage_location', value || null)}
        options={STORAGE_OPTIONS}
        placeholder="Select location (optional)"
      />

      <Input
        label="Expiry Date"
        name="expiry_date"
        type="date"
        value={form.values.expiry_date || ''}
        onChange={(value: string) => form.handleChange('expiry_date', value || null)}
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
