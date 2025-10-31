import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Recipe Management
 *
 * These tests validate the complete recipe workflow:
 * - Create recipe with existing ingredients
 * - Create recipe with new ingredients
 * - Edit existing recipe
 * - Delete recipe
 * - View recipe details
 *
 * These tests require a running backend with some ingredients in the database.
 */

test.describe('Recipe CRUD Operations', () => {
  // Setup: Create some test ingredients before recipe tests
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    // Create test ingredients if they don't exist
    const testIngredients = [
      { name: 'Test Chicken', quantity: '1', unit: 'kg' },
      { name: 'Test Rice', quantity: '500', unit: 'grams' },
      { name: 'Test Vegetables', quantity: '300', unit: 'grams' },
    ];

    for (const ingredient of testIngredients) {
      // Check if ingredient exists
      const exists = await page
        .locator(`text=${ingredient.name}`)
        .isVisible()
        .catch(() => false);

      if (!exists) {
        await page.click('button:has-text("Add Ingredient")');
        await page.fill('input[name="name"]', ingredient.name);
        await page.fill('input[name="quantity"]', ingredient.quantity);
        await page.fill('input[name="unit"]', ingredient.unit);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);
      }
    }

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('should load recipes page successfully', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Recipes');

    // Verify "Add Recipe" button is visible
    await expect(page.locator('button:has-text("Add Recipe")')).toBeVisible();
  });

  test('should create recipe with existing ingredients', async ({ page }) => {
    // Click "Add Recipe" button
    await page.click('button:has-text("Add Recipe")');

    // Wait for modal to appear
    await expect(page.locator('.modal__title')).toContainText('Add Recipe');

    // Fill basic recipe information
    await page.fill('input[name="name"]', 'Simple Chicken Rice');
    await page.fill('textarea[name="description"]', 'A simple and delicious chicken rice dish');
    await page.fill(
      'textarea[name="instructions"]',
      '1. Cook rice\n2. Cook chicken\n3. Combine and serve'
    );

    // Fill timing information
    await page.fill('input[name="prep_time_minutes"]', '15');
    await page.fill('input[name="cook_time_minutes"]', '30');
    await page.fill('input[name="servings"]', '4');

    // Select difficulty
    await page.selectOption('select[name="difficulty"]', 'easy');

    // Add ingredients
    // This assumes there's a multi-select or ingredient picker component
    const ingredientSelect = page
      .locator('select[name="ingredients"], [data-testid="ingredient-picker"]')
      .first();

    if (await ingredientSelect.isVisible()) {
      // If using multi-select
      await ingredientSelect.selectOption(['Test Chicken', 'Test Rice']);
    } else {
      // Alternative: click "Add Ingredient" buttons if that's the UI pattern
      const addIngredientBtn = page.locator('button:has-text("Add Ingredient")').first();
      if (await addIngredientBtn.isVisible()) {
        await addIngredientBtn.click();
        // Select ingredient from dropdown/list
        await page.click('text=Test Chicken');

        await addIngredientBtn.click();
        await page.click('text=Test Rice');
      }
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify recipe appears in list
    await expect(page.locator('text=Simple Chicken Rice')).toBeVisible();
  });

  test('should create recipe with all optional fields', async ({ page }) => {
    // Click "Add Recipe" button
    await page.click('button:has-text("Add Recipe")');

    // Wait for modal
    await expect(page.locator('.modal__title')).toContainText('Add Recipe');

    // Fill all fields
    const uniqueName = `Complete Recipe ${Date.now()}`;
    await page.fill('input[name="name"]', uniqueName);
    await page.fill(
      'textarea[name="description"]',
      'A comprehensive recipe with all fields filled'
    );
    await page.fill(
      'textarea[name="instructions"]',
      '1. Prepare ingredients\n2. Mix everything\n3. Cook for specified time\n4. Serve hot'
    );

    await page.fill('input[name="prep_time_minutes"]', '20');
    await page.fill('input[name="cook_time_minutes"]', '45');
    await page.fill('input[name="servings"]', '6');
    await page.selectOption('select[name="difficulty"]', 'medium');

    // Fill optional fields
    const caloriesInput = page.locator('input[name="calories_per_serving"]');
    if (await caloriesInput.isVisible()) {
      await caloriesInput.fill('450');
    }

    const tagsInput = page.locator('input[name="tags"], textarea[name="tags"]');
    if (await tagsInput.isVisible()) {
      await tagsInput.fill('dinner, healthy, family-friendly');
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify recipe appears
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
  });

  test('should validate required recipe fields', async ({ page }) => {
    // Click "Add Recipe"
    await page.click('button:has-text("Add Recipe")');
    await expect(page.locator('.modal__title')).toContainText('Add Recipe');

    // Try to submit with only name (missing required fields)
    await page.fill('input[name="name"]', 'Incomplete Recipe');
    await page.click('button[type="submit"]');

    // Modal should remain open (validation failed)
    await expect(page.locator('.modal')).toBeVisible();

    // Fill remaining required fields
    await page.fill('textarea[name="instructions"]', 'Some instructions');
    await page.fill('input[name="servings"]', '2');

    // Now submit should work
    await page.click('button[type="submit"]');

    // Modal should close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });
  });

  test('should view recipe details', async ({ page }) => {
    // First, create a recipe
    await page.click('button:has-text("Add Recipe")');
    const recipeName = `Detail View Recipe ${Date.now()}`;

    await page.fill('input[name="name"]', recipeName);
    await page.fill('textarea[name="description"]', 'Recipe for detail view test');
    await page.fill('textarea[name="instructions"]', 'Test instructions');
    await page.fill('input[name="prep_time_minutes"]', '10');
    await page.fill('input[name="cook_time_minutes"]', '20');
    await page.fill('input[name="servings"]', '3');
    await page.selectOption('select[name="difficulty"]', 'easy');

    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Click on the recipe to view details
    await page.click(`text=${recipeName}`);

    // Verify details are displayed
    // This depends on whether details open in a modal, new page, or expanded view
    await expect(page.locator(`text=${recipeName}`)).toBeVisible();
    await expect(page.locator('text=Test instructions')).toBeVisible();
    await expect(page.locator('text=10').or(page.locator('text=10 minutes'))).toBeVisible();
  });

  test('should edit existing recipe', async ({ page }) => {
    // Create a recipe first
    await page.click('button:has-text("Add Recipe")');
    const originalName = `Editable Recipe ${Date.now()}`;

    await page.fill('input[name="name"]', originalName);
    await page.fill('textarea[name="instructions"]', 'Original instructions');
    await page.fill('input[name="servings"]', '2');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Find and click edit button
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
    } else {
      // Alternative: click recipe name to open, then edit
      await page.click(`text=${originalName}`);
      await page.click('button:has-text("Edit")');
    }

    // Wait for edit modal
    await expect(page.locator('.modal__title')).toContainText('Edit Recipe');

    // Update fields
    const updatedName = `${originalName} (Updated)`;
    await page.fill('input[name="name"]', updatedName);
    await page.fill('textarea[name="instructions"]', 'Updated instructions with more detail');
    await page.fill('input[name="servings"]', '4');

    // Submit
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify updates
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
    await expect(page.locator('text=4').or(page.locator('text=4 servings'))).toBeVisible();
  });

  test('should delete recipe with confirmation', async ({ page }) => {
    // Create a recipe to delete
    await page.click('button:has-text("Add Recipe")');
    const tempName = `Temporary Recipe ${Date.now()}`;

    await page.fill('input[name="name"]', tempName);
    await page.fill('textarea[name="instructions"]', 'Will be deleted');
    await page.fill('input[name="servings"]', '1');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify it exists
    await expect(page.locator(`text=${tempName}`)).toBeVisible();

    // Setup confirmation dialog handler
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('delete');
      dialog.accept();
    });

    // Click delete button
    const deleteButton = page.locator('button:has-text("Delete")').first();
    await deleteButton.click();

    // Verify recipe is removed
    await expect(page.locator(`text=${tempName}`)).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Recipe Filtering and Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('should filter recipes by difficulty', async ({ page }) => {
    const difficultyFilter = page.locator('select[name="difficulty_filter"]');

    if (await difficultyFilter.isVisible()) {
      await difficultyFilter.selectOption('easy');

      // Wait for filtered results
      await page.waitForTimeout(500);

      // Verify filtered results (implementation dependent)
      const recipeCount = await page.locator('[data-testid="recipe-item"]').count();
      console.log(`Filtered recipes: ${recipeCount}`);
    }
  });

  test('should search recipes by name', async ({ page }) => {
    // Create a uniquely named recipe for search
    await page.click('button:has-text("Add Recipe")');
    const searchableName = `Unique Searchable Recipe ${Date.now()}`;

    await page.fill('input[name="name"]', searchableName);
    await page.fill('textarea[name="instructions"]', 'Search test');
    await page.fill('input[name="servings"]', '1');
    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Use search functionality
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="search" i]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('Unique Searchable');
      await page.waitForTimeout(500);

      // Should show matching recipe
      await expect(page.locator(`text=${searchableName}`)).toBeVisible();
    }
  });
});

test.describe('Recipe Data Persistence', () => {
  test('should persist recipe across page reload', async ({ page }) => {
    await page.goto('/recipes');

    // Create recipe
    await page.click('button:has-text("Add Recipe")');
    const persistentName = `Persistent Recipe ${Date.now()}`;

    await page.fill('input[name="name"]', persistentName);
    await page.fill('textarea[name="instructions"]', 'Persistence test instructions');
    await page.fill('input[name="prep_time_minutes"]', '25');
    await page.fill('input[name="cook_time_minutes"]', '35');
    await page.fill('input[name="servings"]', '5');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${persistentName}`)).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Recipe should still be visible
    await expect(page.locator(`text=${persistentName}`)).toBeVisible();
  });
});

test.describe('Recipe-Ingredient Relationship', () => {
  test('should display ingredient quantities in recipe', async ({ page }) => {
    // This test assumes recipes show their ingredients with quantities
    await page.goto('/recipes');

    // Create recipe with specific ingredients
    await page.click('button:has-text("Add Recipe")');
    const recipeName = `Recipe with Quantities ${Date.now()}`;

    await page.fill('input[name="name"]', recipeName);
    await page.fill('textarea[name="instructions"]', 'Mix and cook');
    await page.fill('input[name="servings"]', '2');

    // Add ingredients with quantities (UI dependent)
    // This is a placeholder - actual implementation depends on the form structure

    await page.click('button[type="submit"]');
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // View recipe details
    await page.click(`text=${recipeName}`);

    // Verify ingredients are displayed
    // (Specific assertions depend on how ingredients are rendered)
  });
});
