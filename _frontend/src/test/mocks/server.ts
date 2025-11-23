/**
 * MSW Server setup for Node.js test environment
 *
 * This sets up a mock server for intercepting HTTP requests in tests.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create mock server with default handlers
export const server = setupServer(...handlers);

// Export for use in tests
export { handlers };
