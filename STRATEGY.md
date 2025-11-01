# Frontend Refactoring Strategy: Migration to Pico CSS + Lucide Icons

## Overview

This document outlines the strategy for refactoring the frontend to use Pico CSS, a lightweight (~10KB) CSS framework, and Lucide Icons, a modern icon library, while improving the UI/UX with table-based layouts and consolidated modal dialogs. The goal is to maintain a lightweight, modern, and maintainable frontend.

## Objectives

1. **Replace custom CSS with Pico CSS** - Remove `main.css` and integrate Pico CSS
2. **Integrate Lucide Icons** - Add modern, lightweight icons throughout the application
3. **Refactor Ingredients View** - Convert grid/card layout to table with modal dialog
4. **Refactor Recipes View** - Convert card layout to table with single modal (consolidating "Add Recipe" and "Create with AI" buttons)

## Prerequisites

- Pico CSS will be installed via npm
- Lucide Icons (lucide-preact) will be installed via npm
- All existing functionality must be preserved
- Components should use Pico CSS semantic HTML patterns
- Modal dialogs should leverage Pico CSS styling
- Icons should be used consistently throughout the UI for better visual communication

---

## Phase 1: Install and Configure Dependencies

### Task 1.1: Install Pico CSS
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 10 minutes

**Steps:**
1. Add Pico CSS via npm: `npm install @picocss/pico`
   
2. Import in `frontend/src/main.tsx`:
   ```typescript
   import '@picocss/pico/css/pico.min.css';
   ```

3. Remove the import of `main.css` in `frontend/src/main.tsx`

**Verification:**
- Run `npm run dev` and verify Pico CSS styles are applied
- Check browser dev tools to confirm Pico CSS is loaded

---

### Task 1.2: Install Lucide Icons
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 5 minutes

**Steps:**
1. Install Lucide Icons for Preact: `npm install lucide-preact`
   
2. Verify installation:
   ```bash
   npm list lucide-preact
   ```

**Verification:**
- Package appears in `package.json` dependencies
- Can import icons in components: `import { Plus, Edit, Trash2 } from 'lucide-preact'`

**Dependencies:** None

---

## Phase 2: Update Shared Components

### Task 2.1: Update Button Component with Icon Support
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 25 minutes

**Steps:**
1. Read `frontend/src/shared/components/Button.tsx`
2. Refactor to use Pico CSS button classes:
   - Primary: Use Pico's default button (no class needed or `role="button"`)
   - Secondary: Add `data-variant="secondary"` or use `button.secondary` class
   - Danger: Add `data-variant="danger"` or use `button.danger` class (may need custom CSS for danger)
3. Remove custom CSS classes (`button`, `button--primary`, etc.)
4. Add optional `icon` prop to Button component:
   - Accept Lucide icon component as prop
   - Render icon before text content
   - Support `iconPosition` prop ('left' | 'right') - default 'left'
   - Support icon-only buttons (when only icon is provided)
5. Update component to use Pico CSS semantic patterns

**Example Usage:**
```typescript
<Button icon={Plus}>Add Recipe</Button>
<Button icon={Trash2} iconPosition="left" variant="danger">Delete</Button>
<Button icon={Edit} iconPosition="right">Edit</Button>
```

**Files to Modify:**
- `frontend/src/shared/components/Button.tsx`

**Dependencies:** Task 1.1, Task 1.2

---

### Task 2.2: Update Input Component
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 20 minutes

**Steps:**
1. Read `frontend/src/shared/components/Input.tsx`
2. Refactor to use Pico CSS form inputs:
   - Use Pico's native input styling (no wrapper classes needed)
   - Remove custom CSS classes (`input-wrapper`, `input`, `input__label`, etc.)
   - Keep error display functionality but style with Pico patterns
   - Use Pico's `input-group` or `label` patterns for layout

**Files to Modify:**
- `frontend/src/shared/components/Input.tsx`

**Dependencies:** Task 1.1

---

### Task 2.3: Update Select Component
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 15 minutes

**Steps:**
1. Read `frontend/src/shared/components/Select.tsx` (if exists) or check Input.tsx for select handling
2. Refactor to use Pico CSS select styling
3. Remove custom CSS classes
4. Use Pico's native select element styling

**Files to Modify:**
- `frontend/src/shared/components/Select.tsx` (or relevant component)

**Dependencies:** Task 1.1

---

### Task 2.4: Update Modal Component
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 30 minutes

**Steps:**
1. Read `frontend/src/shared/components/Modal.tsx`
2. Refactor to use Pico CSS dialog/modal patterns:
   - Use `<dialog>` element with Pico CSS classes or styling
   - Replace custom `.modal-backdrop`, `.modal`, `.modal__header`, etc. classes
   - Maintain existing functionality (Escape key, backdrop click, body scroll lock)
   - Use Pico CSS article or card patterns for modal content

**Note:** Pico CSS uses `<dialog>` element for modals. May need polyfill for older browsers.

**Files to Modify:**
- `frontend/src/shared/components/Modal.tsx`

**Dependencies:** Task 1.1

---

### Task 2.5: Update Layout and Navigation Components
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 25 minutes

**Steps:**
1. Read `frontend/src/shared/components/Layout.tsx`
2. Read `frontend/src/shared/components/Navigation.tsx`
3. Update to use Pico CSS layout patterns:
   - Use `<nav>` with Pico CSS navigation classes
   - Use `<main>` and `<header>` for layout structure
   - Remove custom CSS classes
4. Optionally add icons to navigation links:
   - Consider adding icons like `Utensils` or `ChefHat` for Recipes
   - Consider adding `Package` or `ShoppingCart` for Ingredients
   - Icons are optional but can enhance visual hierarchy

**Icons to Consider (Optional):**
- Recipes: `Utensils` or `ChefHat` from `lucide-preact`
- Ingredients: `Package` or `ShoppingCart` from `lucide-preact`
- Home: `Home` from `lucide-preact`

**Files to Modify:**
- `frontend/src/shared/components/Layout.tsx`
- `frontend/src/shared/components/Navigation.tsx`

**Dependencies:** Task 1.1, Task 1.2

---

## Phase 3: Refactor Ingredients View

### Task 3.1: Create Ingredients Table Component
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 50 minutes

**Steps:**
1. Create new component `frontend/src/features/ingredients/components/IngredientTable.tsx`
2. Replace `IngredientGrid` usage with table-based layout
3. Table columns should display:
   - Name
   - Quantity (grams)
   - Storage Location
   - Expiry Date (formatted)
   - Actions (Edit, Delete buttons with icons)
4. Use Pico CSS table styling (`<table>`, `<thead>`, `<tbody>`, etc.)
5. Add Lucide icons to action buttons:
   - Edit button: Use `Pencil` or `Edit` icon
   - Delete button: Use `Trash2` or `X` icon
6. Handle empty state: Show message when no ingredients (with icon if appropriate)
7. Add responsive behavior (Pico CSS tables are responsive)

**Icons to Use:**
- Edit: `Pencil` or `Edit` from `lucide-preact`
- Delete: `Trash2` from `lucide-preact`

**Files to Create:**
- `frontend/src/features/ingredients/components/IngredientTable.tsx`

**Files to Modify:**
- `frontend/src/features/ingredients/containers/IngredientsContainer.tsx` (replace IngredientGrid import/usage)

**Dependencies:** Task 2.1, Task 2.4, Task 1.2

**Acceptance Criteria:**
- Table displays all ingredient data clearly
- Edit and Delete actions have icons and are accessible
- Empty state is handled gracefully
- Responsive on mobile devices

---

### Task 3.2: Update Ingredients Container to Use Table with Icons
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 15 minutes

**Steps:**
1. Read `frontend/src/features/ingredients/containers/IngredientsContainer.tsx`
2. Replace `IngredientGrid` with `IngredientTable`
3. Update "Add Ingredient" button to use `Plus` icon from Lucide
4. Update component to pass table-specific props if needed
5. Ensure modal functionality remains intact

**Icons to Add:**
- "Add Ingredient" button: `Plus` icon from `lucide-preact`

**Files to Modify:**
- `frontend/src/features/ingredients/containers/IngredientsContainer.tsx`
- `frontend/src/features/ingredients/components/index.ts` (export IngredientTable)

**Dependencies:** Task 3.1, Task 1.2

---

### Task 3.3: Ensure Ingredient Modal Works with Pico CSS
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Steps:**
1. Read `frontend/src/features/ingredients/components/IngredientModal.tsx`
2. Verify modal uses updated Modal component (from Task 2.4)
3. Verify form fields use updated Input/Select components (from Tasks 2.2, 2.3)
4. Test add/edit ingredient flow
5. Ensure validation errors display correctly with Pico CSS

**Files to Verify:**
- `frontend/src/features/ingredients/components/IngredientModal.tsx`
- `frontend/src/features/ingredients/components/IngredientFormFields.tsx`

**Dependencies:** Task 2.2, Task 2.3, Task 2.4

---

## Phase 4: Refactor Recipes View

### Task 4.1: Create Recipes Table Component
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 65 minutes

**Steps:**
1. Create new component `frontend/src/features/recipes/components/RecipeTable.tsx`
2. Replace `RecipeList` card-based layout with table
3. Table columns should display:
   - Name
   - Description (truncated if long)
   - Difficulty
   - Prep Time / Cook Time (formatted)
   - Servings
   - Ingredients Count
   - Actions (Edit, Delete buttons with icons)
4. Use Pico CSS table styling
5. Add Lucide icons to action buttons:
   - Edit button: Use `Pencil` or `Edit` icon
   - Delete button: Use `Trash2` icon
6. Handle empty state (with icon if appropriate)
7. Make responsive

**Icons to Use:**
- Edit: `Pencil` or `Edit` from `lucide-preact`
- Delete: `Trash2` from `lucide-preact`

**Files to Create:**
- `frontend/src/features/recipes/components/RecipeTable.tsx`

**Files to Modify:**
- `frontend/src/features/recipes/pages/RecipesPage.tsx` (replace RecipeList)
- `frontend/src/features/recipes/components/index.ts` (export RecipeTable)

**Dependencies:** Task 2.1, Task 2.4, Task 1.2

**Acceptance Criteria:**
- Table displays recipe data clearly
- All relevant recipe information is visible
- Edit and Delete actions have icons and work correctly
- Responsive design

---

### Task 4.2: Consolidate Recipe Buttons to Single "Plus" Button with Icon
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 30 minutes

**Steps:**
1. Read `frontend/src/features/recipes/pages/RecipesPage.tsx`
2. Remove the two separate buttons:
   - "Add Recipe" button (variant="secondary")
   - "Create with AI" button
3. Replace with a single button with `Plus` icon:
   - Use Lucide `Plus` icon
   - Button text: "Add Recipe" or just icon with aria-label
   - This button should open the modal dialog
4. Inside the modal, the AI suggestions should be available (existing RecipeAIAssistant component)

**Icons to Use:**
- Add Recipe button: `Plus` icon from `lucide-preact`

**Note:** The RecipeForm already has AI assistant functionality integrated. We just need to consolidate the entry point.

**Files to Modify:**
- `frontend/src/features/recipes/pages/RecipesPage.tsx`

**Dependencies:** Task 2.1, Task 1.2

**Acceptance Criteria:**
- Only one button visible to add/create recipes
- Button has Plus icon and opens modal with recipe form
- AI suggestions are accessible within the modal (via RecipeAIAssistant component)

---

### Task 4.3: Update Recipe Modal to Support AI Suggestions
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 15 minutes

**Steps:**
1. Verify `frontend/src/features/recipes/components/RecipeForm.tsx` includes RecipeAIAssistant
2. Ensure the modal properly displays the form with AI assistant
3. Test that AI suggestions work within the consolidated modal
4. The modal should support:
   - Adding a new recipe manually
   - Adding a recipe with AI suggestions (via the AI assistant inside the form)

**Files to Verify:**
- `frontend/src/features/recipes/pages/RecipesPage.tsx`
- `frontend/src/features/recipes/components/RecipeForm.tsx`

**Dependencies:** Task 4.2, Task 2.4

**Acceptance Criteria:**
- Modal opens with recipe form
- AI assistant is visible and functional within modal
- Can create recipe with or without AI assistance

---

## Phase 5: Cleanup and Polish

### Task 5.1: Remove Custom CSS File
**Status:** `pending`  
**Priority:** Low  
**Estimated Time:** 10 minutes

**Steps:**
1. Remove import of `main.css` from `frontend/src/main.tsx` (if not already done)
2. Delete or archive `frontend/src/styles/main.css`
3. Verify no components reference custom CSS classes
4. Check for any inline styles that should be converted to Pico CSS patterns

**Files to Modify:**
- `frontend/src/main.tsx`
- Delete: `frontend/src/styles/main.css` (or archive it)

**Dependencies:** All previous tasks

---

### Task 5.2: Add Pico CSS Custom Variables (Optional)
**Status:** `pending`  
**Priority:** Low  
**Estimated Time:** 20 minutes

**Steps:**
1. If needed, create minimal custom CSS file for brand colors/spacing
2. Use Pico CSS custom properties: `[data-theme]` attributes
3. Override only what's necessary for branding
4. Keep custom CSS minimal (< 5KB)

**Files to Create (Optional):**
- `frontend/src/styles/custom.css` (only if needed)

**Dependencies:** All previous tasks

---

### Task 5.3: Update Tests
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 30 minutes

**Steps:**
1. Update component tests that reference custom CSS classes
2. Update tests to use Pico CSS selectors where needed
3. Verify all tests pass after refactoring
4. Update snapshots if using snapshot testing

**Files to Check:**
- `frontend/src/features/ingredients/**/*.test.tsx`
- `frontend/src/features/recipes/**/*.test.tsx`
- `frontend/src/shared/components/**/*.test.tsx`

**Dependencies:** All previous tasks

---

### Task 5.4: Verify Responsive Design
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Steps:**
1. Test on mobile viewport (< 768px)
2. Test on tablet viewport (768px - 1024px)
3. Test on desktop viewport (> 1024px)
4. Verify tables are responsive (Pico CSS tables scroll horizontally on mobile)
5. Verify modals are usable on mobile

**Dependencies:** All previous tasks

---

## Phase 6: Final Testing

### Task 6.1: Integration Testing
**Status:** `pending`  
**Priority:** High  
**Estimated Time:** 30 minutes

**Steps:**
1. Test complete ingredient CRUD flow
2. Test complete recipe CRUD flow
3. Test AI recipe generation from modal
4. Verify filters and pagination still work
5. Test navigation between pages

**Dependencies:** All previous tasks

---

### Task 6.2: Visual Regression Check
**Status:** `pending`  
**Priority:** Medium  
**Estimated Time:** 20 minutes

**Steps:**
1. Compare UI before and after migration
2. Verify all functionality remains intact
3. Check for any visual inconsistencies
4. Verify accessibility (keyboard navigation, screen readers)

**Dependencies:** All previous tasks

---

## Task Summary

| Phase | Task ID | Task Description | Status | Dependencies |
|-------|---------|------------------|--------|--------------|
| 1 | 1.1 | Install and Configure Pico CSS | `pending` | - |
| 1 | 1.2 | Install Lucide Icons | `pending` | - |
| 2 | 2.1 | Update Button Component with Icon Support | `pending` | 1.1, 1.2 |
| 2 | 2.2 | Update Input Component | `pending` | 1.1 |
| 2 | 2.3 | Update Select Component | `pending` | 1.1 |
| 2 | 2.4 | Update Modal Component | `pending` | 1.1 |
| 2 | 2.5 | Update Layout and Navigation | `pending` | 1.1, 1.2 |
| 3 | 3.1 | Create Ingredients Table Component | `pending` | 2.1, 2.4, 1.2 |
| 3 | 3.2 | Update Ingredients Container | `pending` | 3.1, 1.2 |
| 3 | 3.3 | Ensure Ingredient Modal Works | `pending` | 2.2, 2.3, 2.4 |
| 4 | 4.1 | Create Recipes Table Component | `pending` | 2.1, 2.4, 1.2 |
| 4 | 4.2 | Consolidate Recipe Buttons | `pending` | 2.1, 1.2 |
| 4 | 4.3 | Update Recipe Modal for AI | `pending` | 4.2, 2.4 |
| 5 | 5.1 | Remove Custom CSS File | `pending` | All previous |
| 5 | 5.2 | Add Custom Variables (Optional) | `pending` | All previous |
| 5 | 5.3 | Update Tests | `pending` | All previous |
| 5 | 5.4 | Verify Responsive Design | `pending` | All previous |
| 6 | 6.1 | Integration Testing | `pending` | All previous |
| 6 | 6.2 | Visual Regression Check | `pending` | All previous |

---

## Execution Notes for Agents

### When Starting a Task:

1. **Read the task description carefully** - Understand what needs to be done
2. **Check dependencies** - Ensure all prerequisite tasks are completed
3. **Read relevant files** - Use `read_file` to understand current implementation
4. **Make incremental changes** - One task at a time
5. **Update task status** - Mark as `in_progress` when starting, `completed` when done

### Task Status Values:
- `pending` - Not started
- `in_progress` - Currently being worked on
- `completed` - Finished successfully
- `blocked` - Cannot proceed due to dependency or issue
- `cancelled` - No longer needed

### Testing Checklist:
After completing each phase, verify:
- [ ] Components render without errors
- [ ] Functionality remains intact
- [ ] Styling looks correct
- [ ] No console errors
- [ ] Responsive design works

### Rollback Plan:
If issues arise:
1. Git commit frequently
2. Keep `main.css` backed up
3. Can revert to previous commit if needed
4. Pico CSS is additive - can coexist with custom CSS during transition

---

## Success Criteria

The refactoring is complete when:
- ✅ Pico CSS is installed and active
- ✅ Lucide Icons are installed and integrated
- ✅ All custom CSS classes removed
- ✅ Icons are used consistently throughout the UI (buttons, actions, navigation)
- ✅ Ingredients view displays in table format with modal and icon-enhanced actions
- ✅ Recipes view displays in table format with single modal and icon-enhanced actions
- ✅ AI suggestions accessible within recipe modal
- ✅ All existing functionality preserved
- ✅ Responsive design works on all viewports
- ✅ All tests pass
- ✅ No visual regressions

---

## Additional Resources

- [Pico CSS Documentation](https://picocss.com/docs)
- [Pico CSS Examples](https://picocss.com/examples)
- [Lucide Icons Documentation](https://lucide.dev)
- [Lucide Icons Preact Guide](https://lucide.dev/guide/packages/lucide-preact)
- Current project uses Preact for UI library
- Current project structure: Feature-based organization

---

## Notes

- Pico CSS is framework-agnostic and works well with Preact
- Pico CSS uses semantic HTML - leverage native elements
- Tables in Pico CSS are responsive by default (horizontal scroll on mobile)
- Modals can use `<dialog>` element or custom implementation with Pico styling
- Lucide Icons are tree-shakeable - only imported icons are included in bundle
- Icons should be used consistently: Edit actions use Pencil/Edit, Delete uses Trash2, Add uses Plus
- Minimal custom CSS should be needed if any

