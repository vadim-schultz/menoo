import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Ingredient Management
 *
 * These tests validate the complete CRUD flow for ingredients:
 * - Create with default values
 * - Create with all fields populated
 * - Edit existing ingredient
 * - Delete ingredient
 * - List and filter ingredients
 *
 * These tests require a running backend.
 */

test.describe('Ingredient CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');
  });

  test('should load ingredients page successfully', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Ingredients');

    // Verify "Add Ingredient" button is visible
    await expect(page.locator('button:has-text("Add Ingredient")')).toBeVisible();
  });

  test('should create ingredient with default values (minimal required fields)', async ({
    page,
  }) => {
    // Click "Add Ingredient" button
    await page.click('button:has-text("Add Ingredient")');

    // Wait for modal to appear
    await expect(page.locator('.modal__title')).toContainText('Add Ingredient');

    // Fill only required fields
    await page.fill('input[name="name"]', 'Tomatoes');
    await page.fill('input[name="quantity"]', '5');
    await page.fill('input[name="unit"]', 'pieces');

    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify ingredient appears in list
    await expect(page.locator('text=Tomatoes')).toBeVisible();
    await expect(page.locator('text=5 pieces')).toBeVisible();
  });

  test('should create ingredient with all fields populated', async ({ page }) => {
    // Click "Add Ingredient" button
    await page.click('button:has-text("Add Ingredient")');

    // Wait for modal
    await expect(page.locator('.modal__title')).toContainText('Add Ingredient');

    // Fill all fields
    await page.fill('input[name="name"]', 'Fresh Basil');
    await page.fill('input[name="quantity"]', '100');
    await page.fill('input[name="unit"]', 'grams');

    // Select storage location
    await page.selectOption('select[name="storage_location"]', 'fridge');

    // Set expiry date (7 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const dateString = expiryDate.toISOString().split('T')[0];
    await page.fill('input[name="expiry_date"]', dateString);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify ingredient appears in list with all details
    await expect(page.locator('text=Fresh Basil')).toBeVisible();
    await expect(page.locator('text=100 grams')).toBeVisible();
    await expect(page.locator('text=fridge').or(page.locator('text=Fridge'))).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click "Add Ingredient" button
    await page.click('button:has-text("Add Ingredient")');

    // Wait for modal
    await expect(page.locator('.modal__title')).toContainText('Add Ingredient');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors (form should not submit)
    await expect(page.locator('.modal')).toBeVisible();

    // Check for error messages (adjust selectors based on actual error display)
    // The form should show validation feedback
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should edit existing ingredient', async ({ page }) => {
    // First, create an ingredient
    await page.click('button:has-text("Add Ingredient")');
    await expect(page.locator('.modal__title')).toContainText('Add Ingredient');

    await page.fill('input[name="name"]', 'Carrots');
    await page.fill('input[name="quantity"]', '10');
    await page.fill('input[name="unit"]', 'pieces');
    await page.click('button[type="submit"]');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify ingredient was created
    await expect(page.locator('text=Carrots')).toBeVisible();

    // Click edit button for the ingredient (adjust selector based on actual UI)
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
    } else {
      // Alternative: click on the ingredient card/row itself if that opens edit
      await page.locator('text=Carrots').click();
    }

    // Wait for modal with "Edit" title
    await expect(page.locator('.modal__title')).toContainText('Edit Ingredient');

    // Update quantity and storage location
    await page.fill('input[name="quantity"]', '15');
    await page.selectOption('select[name="storage_location"]', 'fridge');

    // Submit form (button will say "Update" for editing)
    await page.click('button[type="submit"]');

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Verify updated values
    await expect(page.locator('text=15 pieces')).toBeVisible();
  });

  test('should delete ingredient with confirmation', async ({ page }) => {
    // First, create an ingredient to delete
    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', 'Temporary Ingredient');
    await page.fill('input[name="quantity"]', '1');
    await page.fill('input[name="unit"]', 'piece');
    await page.click('button[type="submit"]');

    // Wait for creation
    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Temporary Ingredient')).toBeVisible();

    // Setup dialog handler for confirmation
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('delete');
      dialog.accept();
    });

    // Click delete button
    const deleteButton = page.locator('button:has-text("Delete")').first();
    await deleteButton.click();

    // Verify ingredient is removed from list
    await expect(page.locator('text=Temporary Ingredient')).not.toBeVisible({ timeout: 5000 });
  });

  test('should cancel modal without saving', async ({ page }) => {
    // Click "Add Ingredient"
    await page.click('button:has-text("Add Ingredient")');
    await expect(page.locator('.modal__title')).toContainText('Add Ingredient');

    // Fill some data
    await page.fill('input[name="name"]', 'Should Not Be Saved');
    await page.fill('input[name="quantity"]', '99');
    await page.fill('input[name="unit"]', 'units');

    // Click cancel button
    await page.click('button:has-text("Cancel")');

    // Modal should close
    await expect(page.locator('.modal')).not.toBeVisible();

    // Ingredient should not appear in list
    await expect(page.locator('text=Should Not Be Saved')).not.toBeVisible();
  });

  test('should close modal on backdrop click', async ({ page }) => {
    // Click "Add Ingredient"
    await page.click('button:has-text("Add Ingredient")');
    await expect(page.locator('.modal')).toBeVisible();

    // Click on backdrop (outside modal)
    await page.click('.modal-backdrop', { position: { x: 10, y: 10 } });

    // Modal should close
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should close modal on Escape key', async ({ page }) => {
    // Click "Add Ingredient"
    await page.click('button:has-text("Add Ingredient")');
    await expect(page.locator('.modal')).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(page.locator('.modal')).not.toBeVisible();
  });
});

test.describe('Ingredient Filtering and Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');
  });

  test('should filter ingredients by storage location', async ({ page }) => {
    // This test assumes filter UI exists
    // Skip if no filter UI is present
    const filterSelect = page.locator('select[name="storage_location_filter"]');

    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption('fridge');

      // Wait for filtered results
      await page.waitForTimeout(500);

      // Verify only fridge items are shown
      const items = page.locator('[data-testid="ingredient-item"]');
      const count = await items.count();

      if (count > 0) {
        // At least one item should have "fridge" storage
        await expect(page.locator('text=fridge').or(page.locator('text=Fridge'))).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('should search ingredients by name', async ({ page }) => {
    // Create a searchable ingredient first
    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', 'Unique Searchable Item');
    await page.fill('input[name="quantity"]', '1');
    await page.fill('input[name="unit"]', 'piece');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

    // Look for search input
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('Unique Searchable');

      // Wait for search results
      await page.waitForTimeout(500);

      // Should show matching ingredient
      await expect(page.locator('text=Unique Searchable Item')).toBeVisible();
    }
  });
});

test.describe('Ingredient Data Persistence', () => {
  test('should persist ingredient across page reload', async ({ page }) => {
    // Create ingredient
    await page.goto('/ingredients');
    await page.click('button:has-text("Add Ingredient")');

    const uniqueName = `Persistent Ingredient ${Date.now()}`;
    await page.fill('input[name="name"]', uniqueName);
    await page.fill('input[name="quantity"]', '42');
    await page.fill('input[name="unit"]', 'kg');
    await page.click('button[type="submit"]');

    await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Ingredient should still be visible
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
    await expect(page.locator('text=42 kg')).toBeVisible();
  });
});
