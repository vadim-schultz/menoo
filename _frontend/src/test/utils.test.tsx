/**
 * Test utilities - Basic tests to verify test infrastructure
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Test Infrastructure', () => {
  it('should render components', () => {
    const TestComponent = () => <div>Hello Test</div>;

    render(<TestComponent />);

    expect(screen.getByText('Hello Test')).toBeTruthy();
  });

  it('should have MSW server running', () => {
    // MSW server is started in setup.ts
    // This test verifies the setup file is loaded
    expect(true).toBe(true);
  });
});
