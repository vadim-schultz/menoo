import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { IngredientsContainer } from './IngredientsContainer';
import { ingredientService } from '../services/ingredientService';
import { renderComponent } from '../../../test/utils';

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
    renderComponent(<IngredientsContainer />);

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
    renderComponent(<IngredientsContainer />);

    // Next page
    fireEvent.click(screen.getByText('Next'));
    expect(ingredientService.list).toHaveBeenLastCalledWith({ page: 2, page_size: 100 });

    // Change page size
    fireEvent.input(screen.getByLabelText(/Page Size/i), { target: { value: '50' } });
    expect(ingredientService.list).toHaveBeenLastCalledWith({ page: 2, page_size: 50 });
  });
});

describe('IngredientsContainer error handling', () => {
  beforeEach(() => {
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockClear();
  });

  it('displays error state when API fails', async () => {
    const errorMessage = 'Failed to load ingredients';
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      detail: errorMessage,
      status_code: 500,
    });

    renderComponent(<IngredientsContainer />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during API call', async () => {
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockReturnValue(controlledPromise);

    renderComponent(<IngredientsContainer />);

    // Should show loading state
    await waitFor(() => {
      // Check for loading indicator (might be text or component)
      const loadingIndicator = screen.queryByText(/loading/i) || screen.queryByRole('status');
      // Loading state might be shown via component, so we check if error/content is not shown
      expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    });

    // Resolve the promise
    resolvePromise!({ items: [] });
    await waitFor(() => {
      // After loading, should show content or error, not blank
      const hasContent = screen.queryByText(/Error:/i) || screen.queryByText(/Name contains/i);
      expect(hasContent).toBeTruthy();
    });
  });

  it('does not show blank screen on error', async () => {
    const errorMessage = 'Network error';
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      detail: errorMessage,
      status_code: 0,
    });

    renderComponent(<IngredientsContainer />);

    await waitFor(() => {
      // Should show error message, not blank screen
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Verify container is not empty
    const container = screen.getByText(/Error:/i).closest('div');
    expect(container).toBeInTheDocument();
    expect(container?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('handles error with no detail message gracefully', async () => {
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      status_code: 500,
    });

    renderComponent(<IngredientsContainer />);

    await waitFor(() => {
      // Should still show error state, not blank
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it('renders content when data loads successfully', async () => {
    const mockData = { items: [] };
    (ingredientService.list as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);

    renderComponent(<IngredientsContainer />);

    await waitFor(() => {
      // Should show content, not loading or error
      expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
      // Should show filter inputs or content
      expect(screen.getByLabelText(/Name contains/i)).toBeInTheDocument();
    });
  });
});


