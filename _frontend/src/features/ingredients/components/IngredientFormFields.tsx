import { Input, Select, Textarea } from '../../../shared/components/Input';
import type { UseFormReturn } from '../../../shared/hooks';
import type { IngredientCreate } from '../../../shared/types/ingredient';
import { INGREDIENT_CATEGORIES } from '../../../shared/types/ingredient';

interface Props {
  form: UseFormReturn<IngredientCreate>;
}

const toLabel = (value: string): string => {
  if (value === 'oil_fat') return 'Oil / Fat';
  if (value === 'flavor_enhancer') return 'Flavor Enhancer';
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
};

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
      label="Quantity"
      name="quantity"
      type="number"
      value={form.values.quantity ?? ''}
      onChange={(value: string) => form.handleChange('quantity', value ? parseFloat(value) : null)}
      onBlur={() => form.handleBlur('quantity')}
      error={form.touched.quantity ? form.errors.quantity : undefined}
    />

    <Input
      label="Unit"
      name="unit"
      value={form.values.unit || ''}
      onChange={(value: string) => form.handleChange('unit', value || null)}
      onBlur={() => form.handleBlur('unit')}
    />

    <Input
      label="Storage Location"
      name="storage_location"
      value={form.values.storage_location || ''}
      onChange={(value: string) => form.handleChange('storage_location', value || null)}
      onBlur={() => form.handleBlur('storage_location')}
    />

    <Input
      label="Expiry Date"
      name="expiry_date"
      type="date"
      value={form.values.expiry_date || ''}
      onChange={(value: string) => form.handleChange('expiry_date', value || null)}
    />

    <Select
      label="Category"
      name="category"
      value={form.values.category || ''}
      onChange={(value: string) => form.handleChange('category', (value || '') as any)}
      options={[{ value: '', label: 'Unspecified' }, ...INGREDIENT_CATEGORIES.map((c) => ({ value: c, label: toLabel(c) }))]}
      placeholder="Select category (optional)"
    />

    <Textarea
      name="notes"
      value={form.values.notes || ''}
      onChange={(value) => form.handleChange('notes', value || null)}
      placeholder="Notes (optional)"
      rows={2}
    />
  </>
);
