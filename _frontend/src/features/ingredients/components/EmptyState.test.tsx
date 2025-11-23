import { screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { renderComponent } from '../../../test/utils';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    renderComponent(<EmptyState />);
    expect(screen.getByText(/no ingredients/i)).toBeInTheDocument();
  });
});
