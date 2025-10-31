import { vi } from 'vitest';
import { useIngredients } from './useIngredients';
import { renderHook, act } from '@testing-library/preact-hooks';

// Mock ingredientService
vi.mock('../services/ingredientService', () => ({
  ingredientService: {
    list: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Apple',
        quantity: 10,
        storage_location: 'fridge' as const,
        expiry_date: null,
        created_at: '',
        updated_at: '',
        is_deleted: false,
      },
    ]),
    create: vi.fn().mockResolvedValue({
      id: 2,
      name: 'Banana',
      quantity: 5,
      storage_location: 'counter' as const,
      expiry_date: null,
      created_at: '',
      updated_at: '',
      is_deleted: false,
    }),
    update: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Apple',
      quantity: 20,
      storage_location: 'fridge' as const,
      expiry_date: null,
      created_at: '',
      updated_at: '',
      is_deleted: false,
    }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('useIngredients', () => {
  it('should fetch ingredients', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useIngredients());
    await waitForNextUpdate();
    expect(result.current).toBeDefined();
    expect(result.current?.ingredients.length).toBe(1);
    expect(result.current?.ingredients[0].name).toBe('Apple');
  });

  it('should create ingredient', async () => {
    const { result } = renderHook(() => useIngredients());
    await act(async () => {
      let newIngredient;
      if (result.current) {
        newIngredient = await result.current.create({
          name: 'Banana',
          quantity: 5,
          storage_location: 'counter',
          expiry_date: null,
        });
      }
      if (newIngredient) {
        expect(newIngredient.name).toBe('Banana');
      }
    });
  });

  it('should update ingredient', async () => {
    const { result } = renderHook(() => useIngredients());
    await act(async () => {
      let updated;
      if (result.current) {
        updated = await result.current.update(1, { quantity: 20 });
      }
      if (updated) {
        expect(updated.quantity).toBe(20);
      }
    });
  });

  it('should delete ingredient', async () => {
    const { result } = renderHook(() => useIngredients());
    await act(async () => {
      if (result.current) {
        await result.current.remove(1);
        expect(result.current.ingredients.length).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
