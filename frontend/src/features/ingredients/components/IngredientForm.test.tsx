import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { IngredientForm } from './IngredientForm';
import type { IngredientRead } from '../../../shared/types/ingredient';

describe('IngredientForm', () => {
  const ingredient: IngredientRead = {
    id: 1,
    name: 'Apple',
    quantity: 100,
    storage_location: 'fridge',
    expiry_date: null,
    created_at: '',
    updated_at: '',
    is_deleted: false,
  };

  it('renders all input fields with correct initial values', () => {
    render(
      <IngredientForm
        ingredient={ingredient}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        loading={false}
      />
    );
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Apple');
    expect(screen.getByLabelText(/Quantity/i)).toHaveValue(100);
    expect(screen.getByLabelText(/Storage Location/i)).toHaveValue('fridge');
  });

  it('handles input changes and form submission', () => {
    const onSubmit = vi.fn();
    render(
      <IngredientForm
        ingredient={ingredient}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        loading={false}
      />
    );
    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'Banana' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <IngredientForm
        ingredient={ingredient}
        onSubmit={vi.fn()}
        onCancel={onCancel}
        loading={false}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
