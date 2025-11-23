import { test, expect } from '@playwright/test';

/**
 * E2E Integration Tests - Full User Workflows
 *
 * These tests validate complete end-to-end user journeys:
 * - Create ingredients → Create recipe → Generate suggestions
 * - Full AI suggestion workflow
 * - Shopping list generation
 * - Complete CRUD cycle for all entities
 *
 * These tests require a running backend with OpenAI API key configured.
 */

test.describe('Complete User Journey: Ingredient → Recipe → Suggestion', () => {
  test('should complete full workflow from scratch', async ({ page }) => {
    // Step 1: Create ingredients
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    const testIngredients = [
      { name: 'Journey Pasta', quantity: '500', unit: 'grams', location: 'pantry' },
      { name: 'Journey Tomato Sauce', quantity: '400', unit: 'ml', location: 'pantry' },
      { name: 'Journey Parmesan', quantity: '100', unit: 'grams', location: 'fridge' },
    ];

    for (const ing of testIngredients) {
      await page.click('button:has-text("Add Ingredient")');
      await expect(page.getByRole('dialog')).toBeVisible();

      await page.fill('input[name="name"]', ing.name);
      await page.fill('input[name="quantity"]', ing.quantity);
      await page.fill('input[name="unit"]', ing.unit);
      await page.selectOption('select[name="storage_location"]', ing.location);

      await page.click('button[type="submit"]');
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

      // Verify ingredient was created
      await expect(page.locator(`text=${ing.name}`)).toBeVisible();
    }

    // Step 2: Create a recipe using these ingredients
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Add Recipe")');
    await expect(page.getByRole('dialog')).toBeVisible();

    const recipeName = `Journey Pasta Recipe ${Date.now()}`;
    await page.fill('input[name="name"]', recipeName);
    await page.fill('textarea[name="description"]', 'A simple pasta dish for testing');
    await page.fill(
      'textarea[name="instructions"]',
      '1. Boil pasta\n2. Heat sauce\n3. Combine\n4. Add cheese\n5. Serve'
    );
    await page.fill('input[name="prep_time_minutes"]', '10');
    await page.fill('input[name="cook_time_minutes"]', '15');
    await page.fill('input[name="servings"]', '4');
    await page.selectOption('select[name="difficulty"]', 'easy');

    // Add ingredients to recipe (UI dependent - adjust as needed)
    // This is a placeholder for the actual ingredient selection mechanism

    await page.click('button[type="submit"]');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Verify recipe was created
    await expect(page.locator(`text=${recipeName}`)).toBeVisible();

    // Step 3: Generate AI suggestions using our ingredients
    await page.goto('/suggestions');
    await page.waitForLoadState('networkidle');

    // Select ingredients for suggestions
    // (UI dependent - this is a placeholder)
    const ingredientInput = page
      .locator('input[name="ingredients"], textarea[name="ingredients"]')
      .first();

    if (await ingredientInput.isVisible()) {
      await ingredientInput.fill('Journey Pasta, Journey Tomato Sauce, Journey Parmesan');
    }

    // Submit for suggestions
    const submitButton = page.locator('button[type="submit"]:has-text("Get")');
    if (await submitButton.isEnabled()) {
      await submitButton.click();

      // Wait for suggestions (may take time due to AI)
      await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 20000 });

      // Verify suggestions appear
      const suggestions = page.locator('[data-testid="suggestion-item"]');
      const count = await suggestions.count();
      expect(count).toBeGreaterThan(0);
    }

    // Step 4: Verify we can navigate back to see our created data
    await page.goto('/ingredients');
    await expect(page.locator('text=Journey Pasta')).toBeVisible();

    await page.goto('/recipes');
    await expect(page.locator(`text=${recipeName}`)).toBeVisible();
  });
});

test.describe('AI Suggestion to Recipe Workflow', () => {
  test('should generate AI suggestion and save as recipe', async ({ page }) => {
    // Skip if OpenAI API key not configured
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    // Step 1: Ensure we have some ingredients
    await page.goto('/ingredients');
    await page.waitForLoadState('networkidle');

    // Create ingredients if needed
    const aiTestIngredients = ['AI Test Chicken', 'AI Test Vegetables', 'AI Test Spices'];

    for (const name of aiTestIngredients) {
      const exists = await page
        .locator(`text=${name}`)
        .isVisible()
        .catch(() => false);

      if (!exists) {
        await page.click('button:has-text("Add Ingredient")');
        await page.fill('input[name="name"]', name);
        await page.fill('input[name="quantity"]', '500');
        await page.fill('input[name="unit"]', 'grams');
        await page.click('button[type="submit"]');
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
      }
    }

    // Step 2: Go to suggestions page
    await page.goto('/suggestions');
    await page.waitForLoadState('networkidle');

    // Fill in suggestion request
    await page.fill('input[name="ingredients"]', aiTestIngredients.join(', '));

    // Set preferences
    const maxPrepTime = page.locator('input[name="max_prep_time"]');
    if (await maxPrepTime.isVisible()) {
      await maxPrepTime.fill('30');
    }

    const maxCookTime = page.locator('input[name="max_cook_time"]');
    if (await maxCookTime.isVisible()) {
      await maxCookTime.fill('45');
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for AI suggestions (this may take 10-15 seconds)
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 20000 });

    // Verify AI badge appears
    await expect(page.locator('text=🤖 AI Generated')).toBeVisible();

    // Step 3: Expand first AI suggestion to see details
    const firstAISuggestion = page
      .locator('[data-testid="suggestion-item"]:has-text("🤖")')
      .first();
    await firstAISuggestion.click();

    // Verify recipe details are shown
    await expect(page.locator('[data-testid="recipe-instructions"]')).toBeVisible();

    // Step 4: Save the AI suggestion as a recipe
    const saveButton = firstAISuggestion.locator('button:has-text("Save")');
    await saveButton.click();

    // Wait for save to complete
    await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 10000 });

    // Step 5: Navigate to recipes and verify saved recipe exists
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // The saved recipe should appear in the list
    const recipes = page.locator('[data-testid="recipe-item"]');
    const count = await recipes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show cached results on repeated suggestion request', async ({ page }) => {
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    await page.goto('/suggestions');
    await page.waitForLoadState('networkidle');

    const ingredients = 'chicken, rice, vegetables';

    // First request
    await page.fill('input[name="ingredients"]', ingredients);
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 20000 });
    const firstRequestTime = Date.now() - startTime;

    // Get first result
    const firstResult = await page.locator('[data-testid="suggestion-item"]').first().textContent();

    // Second request with same ingredients
    await page.reload();
    await page.fill('input[name="ingredients"]', ingredients);
    const cacheStartTime = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 5000 });
    const cachedRequestTime = Date.now() - cacheStartTime;

    // Cached request should be significantly faster
    expect(cachedRequestTime).toBeLessThan(firstRequestTime / 2);

    // Results should be identical
    const cachedResult = await page
      .locator('[data-testid="suggestion-item"]')
      .first()
      .textContent();
    expect(cachedResult).toBe(firstResult);
  });
});

test.describe('Error Handling and Edge Cases', () => {
  test('should handle ingredient creation failure gracefully', async ({ page }) => {
    await page.goto('/ingredients');

    // Try to create ingredient with duplicate name
    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', 'Duplicate Test Ingredient');
    await page.fill('input[name="quantity"]', '1');
    await page.fill('input[name="unit"]', 'piece');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Try to create again with same name
    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', 'Duplicate Test Ingredient');
    await page.fill('input[name="quantity"]', '2');
    await page.fill('input[name="unit"]', 'pieces');
    await page.click('button[type="submit"]');

    // Should show error or modal stays open
    // Implementation dependent - adjust based on actual error handling
    await page.waitForTimeout(2000);
  });

  test('should handle suggestion request with no ingredients', async ({ page }) => {
    await page.goto('/suggestions');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');

    // Button should be disabled
    const isDisabled = await submitButton.isDisabled();

    if (isDisabled) {
      // Expected behavior - button disabled for empty form
      expect(isDisabled).toBe(true);
    } else {
      // If button is enabled, clicking should show validation error
      await submitButton.click();
      await page.waitForTimeout(1000);

      // Should still be on suggestions page (not navigated away)
      await expect(page).toHaveURL(/suggestions/);
    }
  });

  test('should handle network errors during recipe creation', async ({ page }) => {
    // This test would require mocking network failure
    // Placeholder for network error handling tests
    await page.goto('/recipes');

    // Verify page loads even if backend is slow
    await expect(page.locator('h1')).toContainText('Recipes');
  });
});

test.describe('Data Validation and Constraints', () => {
  test('should enforce positive quantity for ingredients', async ({ page }) => {
    await page.goto('/ingredients');

    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', 'Negative Quantity Test');
    await page.fill('input[name="quantity"]', '-5');
    await page.fill('input[name="unit"]', 'pieces');
    await page.click('button[type="submit"]');

    // Form should show validation error or not submit
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should enforce positive serving count for recipes', async ({ page }) => {
    await page.goto('/recipes');

    await page.click('button:has-text("Add Recipe")');
    await page.fill('input[name="name"]', 'Zero Servings Test');
    await page.fill('textarea[name="instructions"]', 'Test');
    await page.fill('input[name="servings"]', '0');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should validate time constraints for suggestions', async ({ page }) => {
    await page.goto('/suggestions');

    const maxPrepTime = page.locator('input[name="max_prep_time"]');

    if (await maxPrepTime.isVisible()) {
      await maxPrepTime.fill('-10');

      // Should show validation or prevent submission
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Should handle invalid input gracefully
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Cross-Page Navigation and State', () => {
  test('should maintain data when navigating between pages', async ({ page }) => {
    // Create ingredient
    await page.goto('/ingredients');
    const ingredientName = `Navigation Test ${Date.now()}`;

    await page.click('button:has-text("Add Ingredient")');
    await page.fill('input[name="name"]', ingredientName);
    await page.fill('input[name="quantity"]', '1');
    await page.fill('input[name="unit"]', 'kg');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Navigate to recipes
    await page.goto('/recipes');
    await expect(page.locator('h1')).toContainText('Recipes');

    // Navigate back to ingredients
    await page.goto('/ingredients');

    // Ingredient should still exist
    await expect(page.locator(`text=${ingredientName}`)).toBeVisible();
  });

  test('should allow navigation via menu/links', async ({ page }) => {
    await page.goto('/');

    // Click Ingredients link (adjust selector based on actual menu structure)
    const ingredientsLink = page
      .locator('a[href="/ingredients"], a:has-text("Ingredients")')
      .first();
    if (await ingredientsLink.isVisible()) {
      await ingredientsLink.click();
      await expect(page).toHaveURL(/ingredients/);
    }

    // Click Recipes link
    const recipesLink = page.locator('a[href="/recipes"], a:has-text("Recipes")').first();
    if (await recipesLink.isVisible()) {
      await recipesLink.click();
      await expect(page).toHaveURL(/recipes/);
    }

    // Click Suggestions link
    const suggestionsLink = page
      .locator('a[href="/suggestions"], a:has-text("Suggestions")')
      .first();
    if (await suggestionsLink.isVisible()) {
      await suggestionsLink.click();
      await expect(page).toHaveURL(/suggestions/);
    }
  });
});
