import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/preact-hooks';
import { useIngredientForm } from './useIngredientForm';

describe('useIngredientForm', () => {
  it('should initialize with empty values if no ingredient', () => {
  const onSubmit = vi.fn();
    const { result } = renderHook(() => useIngredientForm(null, onSubmit));
    expect(result.current).toBeDefined();
    expect(result.current?.values.name).toBe('');
    expect(result.current?.values.quantity).toBe(0);
    expect(result.current?.values.storage_location).toBeNull();
    expect(result.current?.values.expiry_date).toBeNull();
  });

  it('should initialize with ingredient values', () => {
  const onSubmit = vi.fn();
    const ingredient = {
      id: 1,
      name: 'Apple',
      quantity: 10,
      storage_location: 'fridge' as const,
      expiry_date: '2025-12-31',
      created_at: '',
      updated_at: '',
      is_deleted: false,
    };
    const { result } = renderHook(() => useIngredientForm(ingredient, onSubmit));
    expect(result.current).toBeDefined();
    expect(result.current?.values.name).toBe('Apple');
    expect(result.current?.values.quantity).toBe(10);
    expect(result.current?.values.storage_location).toBe('fridge');
    expect(result.current?.values.expiry_date).toBe('2025-12-31');
  });

  it('should validate required fields', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useIngredientForm(null, onSubmit));
    await act(async () => {
      if (result.current) {
        result.current.handleChange('name', '');
        result.current.handleChange('quantity', -1);
        result.current.handleSubmit({ preventDefault: () => {} } as any);
      }
    });
    expect(result.current).toBeDefined();
    expect(result.current?.errors.name).toBe('Name is required');
    expect(result.current?.errors.quantity).toBe('Quantity cannot be negative');
  });
});
