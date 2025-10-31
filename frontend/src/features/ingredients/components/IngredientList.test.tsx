import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { IngredientList } from './IngredientList';
import type { IngredientRead } from '../../../shared/types/ingredient';

describe('IngredientList', () => {
  const ingredients: IngredientRead[] = [
    {
      id: 1,
      name: 'Apple',
      quantity: 100,
      storage_location: 'fridge',
      expiry_date: null,
      created_at: '',
      updated_at: '',
      is_deleted: false,
    },
    {
      id: 2,
      name: 'Banana',
      quantity: 200,
      storage_location: 'pantry',
      expiry_date: null,
      created_at: '',
      updated_at: '',
      is_deleted: false,
    },
  ];

  it('renders ingredient items when list is non-empty', () => {
  render(<IngredientList ingredients={ingredients} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('renders EmptyState when list is empty', () => {
  render(<IngredientList ingredients={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no ingredients/i)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete when respective buttons are clicked', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
    render(<IngredientList ingredients={ingredients} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(onEdit).toHaveBeenCalledWith(ingredients[0]);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith(ingredients[0].id);
  });
});
