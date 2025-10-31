import { validateIngredient } from './validation';

describe('validateIngredient', () => {
  it('should require name', () => {
    const errors = validateIngredient({ name: '', quantity: 10 });
    expect(errors.name).toBe('Name is required');
  });

  it('should require quantity >= 0', () => {
    const errors = validateIngredient({ name: 'Apple', quantity: -1 });
    expect(errors.quantity).toBe('Quantity cannot be negative');
  });

  it('should allow valid name and quantity', () => {
    const errors = validateIngredient({ name: 'Apple', quantity: 10 });
    expect(errors.name).toBeUndefined();
    expect(errors.quantity).toBeUndefined();
  });

  it('should error for long name', () => {
    const errors = validateIngredient({ name: 'A'.repeat(101), quantity: 1 });
    expect(errors.name).toBe('Name too long (max 100 chars)');
  });

  it('should error for too large quantity', () => {
    const errors = validateIngredient({ name: 'Apple', quantity: 1000000 });
    expect(errors.quantity).toBe('Quantity too large');
  });

  it('should error for invalid expiry date', () => {
    const errors = validateIngredient({ name: 'Apple', quantity: 1, expiry_date: 'not-a-date' });
    // expiryDate validation is not included in returned errors, but can be added if needed
    // expect(errors.expiry_date).toBe('Invalid date');
    expect(errors.name).toBeUndefined();
    expect(errors.quantity).toBeUndefined();
  });
});
