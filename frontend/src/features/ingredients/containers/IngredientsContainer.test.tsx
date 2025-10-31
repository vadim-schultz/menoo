import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import '@testing-library/jest-dom/vitest';
import { IngredientsContainer } from './IngredientsContainer';
import { ingredientService } from '../services/ingredientService';

vi.mock('../services/ingredientService', async (orig) => {
  const mod = await import('../services/ingredientService');
  return {
    ...mod,
    ingredientService: {
      ...mod.ingredientService,
      list: vi.fn().mockResolvedValue([]),
    },
  };
});

describe('IngredientsContainer filters & pagination', () => {
  beforeEach(() => {
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockClear();
  });

  it('applies filters and calls list with correct query params', async () => {
    render(<IngredientsContainer />);

    // Defaults on initial mount
    expect(ingredientService.list).toHaveBeenCalledWith({ page: 1, page_size: 100 });

    // Fill filters
    fireEvent.input(screen.getByLabelText(/Name contains/i), { target: { value: 'app' } });
    fireEvent.change(screen.getByLabelText(/Storage Location/i), { target: { value: 'fridge' } });
    fireEvent.input(screen.getByLabelText(/Expiring Before/i), { target: { value: '2025-12-31' } });

    // Apply
    fireEvent.click(screen.getByText('Apply'));

    expect(ingredientService.list).toHaveBeenLastCalledWith({
      page: 1,
      page_size: 100,
      name_contains: 'app',
      storage_location: 'fridge',
      expiring_before: '2025-12-31',
    });
  });

  it('changes page and page size and calls list accordingly', async () => {
    render(<IngredientsContainer />);

    // Next page
    fireEvent.click(screen.getByText('Next'));
    expect(ingredientService.list).toHaveBeenLastCalledWith({ page: 2, page_size: 100 });

    // Change page size
    fireEvent.input(screen.getByLabelText(/Page Size/i), { target: { value: '50' } });
    expect(ingredientService.list).toHaveBeenLastCalledWith({ page: 2, page_size: 50 });
  });
});


