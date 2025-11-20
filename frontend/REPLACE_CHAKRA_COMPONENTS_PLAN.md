# Plan: Replace Non-Native Chakra UI Components

## Overview
Replace custom wrapper components with native Chakra UI v3 components to reduce code complexity, improve maintainability, and leverage Chakra UI's built-in features directly.

## Analysis Summary

### Category 1: Pure Re-export Wrappers (High Priority - Easy Wins)
These components add no value and can be directly replaced with Chakra UI imports:

1. **`shared/components/ui/Box.tsx`** - Just re-exports `Box` from Chakra UI
   - Used in: 2 files (IngredientsContent, IngredientsByStorageLocation)
   - Replace with: Direct import from `@chakra-ui/react`

2. **`shared/components/ui/Typography.tsx`** - Just re-exports `Heading` and `Text`
   - Used in: 3 files (IngredientsContent, IngredientsByStorageLocation, StorageLocationCard)
   - Replace with: Direct import from `@chakra-ui/react`

3. **`shared/components/ui/Badge.tsx`** - Just re-exports `Badge`
   - Used in: 0 files (unused - RecipeCard was deleted)
   - Replace with: Delete file (unused)

4. **`shared/components/ui/Card.tsx`** - Just re-exports Card components
   - Used in: 1 file (StorageLocationCard)
   - Replace with: Direct import from `@chakra-ui/react`

5. **`shared/components/ui/Layout.tsx`** - Just re-exports Stack, HStack, VStack, Flex, Grid, SimpleGrid
   - Used in: 8 files (multiple components)
   - Replace with: Direct import from `@chakra-ui/react`

6. **`shared/components/ui/Textarea.tsx`** - Just re-exports Textarea
   - Used in: 0 files (not used directly, only via Input.tsx)
   - Replace with: Direct import from `@chakra-ui/react`

### Category 2: Components with Added Value (Medium Priority - Evaluate)
These components add some functionality but could potentially be replaced:

1. **`shared/components/Button.tsx`** - Adds variant mapping (primary/secondary/danger) and icon support
   - Used in: Multiple files throughout the app
   - Decision: Use Chakra UI Button directly with proper variant/colorScheme props

2. **`shared/components/Input.tsx`** - Wraps Input/Textarea/Select with FormField for labels/errors
   - Used in: 2 files (RecipeForm, IngredientFormFields)
   - Decision: Use Chakra UI FormControl/FormLabel/FormErrorMessage pattern

3. **`shared/components/Modal.tsx`** - Adds custom close button and styling
   - Used in: 1 file (IngredientModal)
   - Decision: Replace with native Chakra UI Dialog components (already used in RecipeEditModal, RecipeViewModal)
   - Note: RecipeEditModal and RecipeViewModal already use Dialog directly

4. **`shared/components/Layout.tsx`** - Simple wrapper around Container/Box
   - Used in: 1 file (app.tsx)
   - Decision: Replace with direct Chakra UI Container/Box usage

5. **`shared/components/ui/FormField.tsx`** - Adds label/error display logic
   - Used in: Input.tsx wrapper
   - Decision: Replace with Chakra UI FormControl/FormLabel/FormErrorMessage pattern

6. **`shared/components/ui/Table.tsx`** - Adds TableContainer wrapper and aliases (Thead, Tbody, etc.)
   - Used in: 5 files (multiple table components)
   - Decision: Use Chakra UI Table components with Box wrapper for container

7. **`shared/components/ui/Select.tsx`** - Has fallback Select component
   - Used in: 0 files directly
   - Decision: Remove unused fallback, use NativeSelect directly

### Category 3: Components Needing Proper Implementation (Low Priority)
1. **`shared/components/ui/Toast.ts`** - Currently just console.log fallback
   - Used in: 1 file (useRecipeFormAI)
   - Decision: Implement proper Chakra UI v3 toast system or use a toast library
   - Note: Chakra UI v3 may have different toast API than v2

## Replacement Strategy

### Phase 1: Remove Pure Re-export Wrappers ✅ COMPLETED
1. ✅ Replace imports in all files:
   - `shared/components/ui/Box` → `@chakra-ui/react`
   - `shared/components/ui/Typography` → `@chakra-ui/react`
   - `shared/components/ui/Badge` → `@chakra-ui/react`
   - `shared/components/ui/Card` → `@chakra-ui/react`
   - `shared/components/ui/Layout` → `@chakra-ui/react`
   - `shared/components/ui/Textarea` → `@chakra-ui/react`

2. ✅ Delete the wrapper files after replacement

### Phase 2: Replace Modal Component ✅ COMPLETED
1. ✅ Update `IngredientModal.tsx` to use Dialog components directly (like RecipeEditModal)
2. ✅ Update `RecipeCreationDialog.tsx` to use Dialog components
3. ✅ Remove `shared/components/Modal.tsx`
4. ✅ Update `shared/components/index.ts` to remove Modal export

### Phase 3: Replace Layout Component ✅ COMPLETED
1. ✅ Update `app.tsx` to use Container/Box directly
2. ✅ Remove `shared/components/Layout.tsx`
3. ✅ Update `shared/components/index.ts` to remove Layout export

### Phase 4: Simplify Table Component ✅ COMPLETED
1. ✅ Replace Table imports with direct Chakra UI table imports
2. ✅ Replace TableContainer with Box wrapper (overflowX="auto")
3. ✅ Update all table components to use native Chakra table components

### Phase 5: Replace Form Components (PENDING)
1. Replace Input/Select/Textarea wrappers with Chakra UI FormControl pattern
2. Update FormField to use FormControl/FormLabel/FormErrorMessage
3. Update RecipeForm and IngredientFormFields to use new pattern

### Phase 6: Implement Toast System (PENDING)
1. Research Chakra UI v3 toast API
2. Implement proper toast notifications
3. Replace console.log fallback in Toast.ts

## Progress Summary

✅ **Completed Phases:**
- Phase 1: Removed all pure re-export wrappers (Box, Typography, Badge, Card, Layout, Textarea)
- Phase 2: Replaced Modal with Dialog components
- Phase 3: Replaced Layout wrapper with direct Container/Box usage
- Phase 4: Simplified Table component usage (replaced TableContainer with Box)

⏳ **Remaining Phases:**
- Phase 5: Replace form components with FormControl pattern
- Phase 6: Implement proper Toast system

## Files to Update

### Import Replacements Needed:
- `features/ingredients/components/IngredientsContent.tsx` - Box, Heading, HStack, Stack, VStack
- `features/storage/components/IngredientsByStorageLocation.tsx` - Box, Heading, Text, Stack, VStack
- `features/storage/components/StorageLocationCard.tsx` - Card, CardHeader, CardBody, CardFooter, Heading, Text, HStack
- `features/storage/components/StorageLocationTableContent.tsx` - HStack, Table components
- `features/storage/components/StorageLocationListContent.tsx` - SimpleGrid
- `features/recipes/components/RecipeCreationDialog.tsx` - VStack, Table components
- `features/recipes/containers/RecipeDetailContainer.tsx` - VStack
- `features/recipes/components/RecipesContent.tsx` - VStack
- `features/ingredients/components/IngredientModal.tsx` - VStack, Modal → Dialog
- `features/ingredients/components/IngredientTable.tsx` - Table components
- `features/recipes/components/RecipeTableContent.tsx` - Table components
- `features/storage/components/StorageLocationMiniTable.tsx` - Table components
- `app.tsx` - Layout → Container/Box

## Benefits
1. Reduced code complexity - fewer wrapper layers
2. Better IDE support - direct Chakra UI types and autocomplete
3. Easier updates - no need to maintain wrapper components
4. Better performance - one less layer of indirection
5. Standard patterns - using Chakra UI as intended

## Risks & Considerations
1. Some wrappers provide convenience (Button variants, FormField)
2. Need to ensure visual consistency after replacement
3. Toast implementation needs proper Chakra UI v3 API research
4. Test thoroughly after each phase

## Estimated Impact
- Files modified: 15+ files ✅
- Components removed: 9 wrapper files ✅
- Lines of code reduction: ~250+ lines ✅

## Implementation Status

### ✅ Completed (Phases 1-4)
- All pure re-export wrappers removed and replaced with direct Chakra UI imports
- Modal component replaced with Dialog components
- Layout wrapper replaced with direct Container/Box usage
- Table components simplified to use native Chakra UI table components with Box wrapper

### ⏳ Remaining (Phases 5-6)
- Phase 5: Form components replacement (Input/Select/Textarea → FormControl pattern)
- Phase 6: Toast system implementation

## Files Modified
1. `features/ingredients/components/IngredientsContent.tsx`
2. `features/storage/components/IngredientsByStorageLocation.tsx`
3. `features/storage/components/StorageLocationCard.tsx`
4. `features/storage/components/StorageLocationTableContent.tsx`
5. `features/storage/components/StorageLocationListContent.tsx`
6. `features/recipes/components/RecipeCreationDialog.tsx`
7. `features/recipes/containers/RecipeDetailContainer.tsx`
8. `features/recipes/components/RecipesContent.tsx`
9. `features/ingredients/components/IngredientModal.tsx`
10. `features/ingredients/components/IngredientTable.tsx`
11. `features/recipes/components/RecipeTableContent.tsx`
12. `features/storage/components/StorageLocationMiniTable.tsx`
13. `app.tsx`
14. `shared/components/index.ts`

## Files Deleted
1. `shared/components/ui/Box.tsx`
2. `shared/components/ui/Typography.tsx`
3. `shared/components/ui/Badge.tsx`
4. `shared/components/ui/Card.tsx`
5. `shared/components/ui/Layout.tsx`
6. `shared/components/ui/Textarea.tsx`
7. `shared/components/ui/Table.tsx`
8. `shared/components/Modal.tsx`
9. `shared/components/Layout.tsx`

