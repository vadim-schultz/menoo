/**
 * Test utilities and helper functions
 *
 * Provides common testing patterns and utilities for component tests.
 */

import { render, RenderResult } from '@testing-library/preact';
import { ComponentChildren } from 'preact';

/**
 * Render a component (basic wrapper for common options)
 */
export function renderComponent(ui: ComponentChildren, renderOptions = {}): RenderResult {
  return render(ui as any, renderOptions);
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
