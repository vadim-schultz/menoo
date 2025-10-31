import { Input, Select } from '../../../shared/components';
import type { UseFormReturn } from '../../../shared/hooks';
import type { IngredientCreate } from '../../../shared/types/ingredient';

interface Props {
  form: UseFormReturn<IngredientCreate>;
}

import { STORAGE_OPTIONS } from '../services/storageOptions';

export const IngredientFormFields = ({ form }: Props) => (
  <>
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
      label="Quantity (grams)"
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
  </>
);
