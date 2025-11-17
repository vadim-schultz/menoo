/**
 * Test utilities and helper functions
 *
 * Provides common testing patterns and utilities for component tests.
 */

import { render, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import system from '../theme';

/**
 * Render a component with Chakra UI provider (basic wrapper for common options)
 */
export function renderComponent(ui: ReactElement, renderOptions = {}): RenderResult {
  return render(
    <ChakraProvider value={system}>
      {ui}
    </ChakraProvider>,
    renderOptions
  );
}

/**
 * Wait for specific time (for animations, debouncing, etc.)
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create mock event
 */
export function createMockEvent(type: string, data: Partial<Event> = {}) {
  return {
    type,
    preventDefault: () => {},
    stopPropagation: () => {},
    target: {},
    currentTarget: {},
    ...data,
  } as Event;
}
