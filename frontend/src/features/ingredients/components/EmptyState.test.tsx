import { render, screen } from '@testing-library/preact';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState />);
    expect(screen.getByText(/no ingredients/i)).toBeInTheDocument();
  });
});
