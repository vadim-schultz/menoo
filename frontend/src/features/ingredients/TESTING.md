# Ingredients Feature Unit Testing Strategy

## Overview

This document outlines the unit testing strategy for the ingredients feature in `frontend/src/features/ingredients`. The goal is to ensure robust, maintainable, and reliable tests for all key components, hooks, and services.

## Scope

Unit tests should cover:

- Stateless atomic components (IngredientList, IngredientForm, IngredientFormFields, EmptyState)
- Smart/container components (IngredientsContainer)
- Custom hooks (useIngredients, useIngredientForm)
- Services (validation, storageOptions)

## Principles

- **Isolation:** Each test should focus on a single unit (component, hook, or function) and mock dependencies as needed.
- **Statelessness:** Atomic components should be tested for correct rendering and prop handling, without business logic.
- **Behavior:** Smart components and hooks should be tested for correct state management, API interaction, and event handling.
- **Validation:** Services should be tested for correct output given valid and invalid input.

## Tools

- **Test Runner:** Vitest
- **Component Testing:** @testing-library/preact
- **Hook Testing:** @testing-library/preact-hooks
- **Mocking:** MSW (for API calls)

## Test Structure

- Place all test files alongside their source files, named as `*.test.ts(x)`.
- Use descriptive test names and group related tests with `describe` blocks.

## Component Testing

### IngredientList

- Renders ingredient items when list is non-empty
- Renders EmptyState when list is empty
- Calls `onEdit` and `onDelete` when respective buttons are clicked

### IngredientForm & IngredientFormFields

- Renders all input fields with correct initial values
- Handles input changes and form submission
- Displays validation errors
- Calls `onSubmit` and `onCancel` appropriately

### EmptyState

- Renders empty state message and visuals

## Hook Testing

### useIngredients

- Returns correct initial state
- Handles add, edit, delete operations
- Interacts with API (mocked)
- Updates state on API success/failure

### useIngredientForm

- Manages form state and validation
- Handles input changes and submission

## Service Testing

### validation

- Returns errors for invalid input
- Returns no errors for valid input

### storageOptions

- Returns correct storage location options

## Coverage Goals

- 100% coverage for atomic components and services
- > 90% coverage for smart components and hooks

## Example Test File Structure

```
frontend/src/features/ingredients/components/IngredientList.test.tsx
frontend/src/features/ingredients/components/IngredientForm.test.tsx
frontend/src/features/ingredients/hooks/useIngredients.test.ts
frontend/src/features/ingredients/services/validation.test.ts
```

## Best Practices

- Use data-testid attributes for querying elements when necessary
- Prefer user-centric queries (getByText, getByRole) over implementation details
- Mock API and external dependencies
- Keep tests fast and deterministic

---

This strategy should be reviewed and updated as the feature evolves.

# Progress Tracker

## Implemented Tests

- IngredientList: Created basic render and interaction tests
- IngredientForm: Created input, change, and cancel tests
- EmptyState: Created render test
- useIngredients: Created initial state and API mock test
- useIngredientForm: Created form state and validation test
- validation service: Created valid/invalid input tests

## Next Steps

- Fix type errors in test data (add missing IngredientRead fields)
- Add missing matchers (e.g., @testing-library/jest-dom)
- Expand hook and service tests for edge cases and error handling
- Review and update as feature evolves

---

See individual test files for details. All tests are located alongside their source files as per strategy.
