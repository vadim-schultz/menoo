// Ingredient validation service
import type { IngredientCreate } from '../../../shared/types';

export const ingredientValidation = {
  name: (value: string): string | undefined => {
    if (!value?.trim()) return 'Name is required';
    if (value.length > 100) return 'Name too long (max 100 chars)';
    return undefined;
  },

  quantity: (value: number): string | undefined => {
    if (value < 0) return 'Quantity cannot be negative';
    if (value > 999999) return 'Quantity too large';
    return undefined;
  },

  expiryDate: (value: string | null): string | undefined => {
    if (!value) return undefined;
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';
    return undefined;
  },
};

export const validateIngredient = (data: Partial<IngredientCreate>): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = ingredientValidation.name(data.name || '');
  if (nameError) errors.name = nameError;

  const quantityError = ingredientValidation.quantity(data.quantity || 0);
  if (quantityError) errors.quantity = quantityError;

  return errors;
};
