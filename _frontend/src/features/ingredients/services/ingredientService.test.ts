import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../../shared/services/apiClient';
import { ingredientService } from './ingredientService';

describe('ingredientService.list', () => {
  beforeEach(() => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce([] as any);
  });

  it('sends no params when filters not provided (backend will apply defaults)', async () => {
    const spy = vi.spyOn(apiClient, 'get');
    await ingredientService.list();
    expect(spy).toHaveBeenCalledWith('/ingredients/', undefined);
  });

  it('sends sparsely populated filters (only defined fields)', async () => {
    const spy = vi.spyOn(apiClient, 'get');
    await ingredientService.list({
      name_contains: 'app',
      storage_location: 'fridge',
      expiring_before: '2025-12-31',
      page: 2,
      page_size: 50,
    });
    expect(spy).toHaveBeenCalledWith('/ingredients/', {
      name_contains: 'app',
      storage_location: 'fridge',
      expiring_before: '2025-12-31',
      page: 2,
      page_size: 50,
    });
  });

  it('filters out undefined and null values', async () => {
    const spy = vi.spyOn(apiClient, 'get');
    await ingredientService.list({
      name_contains: 'app',
      storage_location: undefined,
      expiring_before: null,
      page: 1,
      page_size: 100,
    });
    expect(spy).toHaveBeenCalledWith('/ingredients/', {
      name_contains: 'app',
      page: 1,
      page_size: 100,
    });
  });
});


