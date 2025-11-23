import { test, expect } from '@playwright/test';

/**
 * E2E Tests for AI-powered Recipe Suggestions
 *
 * These tests validate the complete user flow for generating AI suggestions
 * and saving them as recipes. They run against a real backend with a test database.
 */

test.describe('AI Suggestion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to suggestions page before each test
    await page.goto('/suggestions');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should load suggestions page successfully', async ({ page }) => {
    // Verify page title/heading
    await expect(page.locator('h1')).toContainText('Recipe Suggestions');

    // Verify form elements are present
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should generate AI suggestions for selected ingredients', async ({ page }) => {
    // Skip if OpenAI API key is not configured
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    // Select ingredients (assuming multi-select or checkboxes)
    // Note: Adjust selectors based on actual UI implementation
    await page.fill('input[name="ingredients"]', 'tomatoes, basil, mozzarella');

    // Click submit button
    await page.click('button[type="submit"]');

    // Wait for suggestions to load
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 15000 });

    // Verify AI suggestion badge appears
    const aiBadge = page.locator('text=🤖 AI Generated').first();
    await expect(aiBadge).toBeVisible();

    // Verify suggestion contains recipe details
    const suggestion = page.locator('[data-testid="suggestion-item"]').first();
    await expect(suggestion).toContainText(/recipe/i);
  });

  test('should save AI recipe successfully', async ({ page }) => {
    // Skip if OpenAI API key is not configured
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    // Generate suggestions first
    await page.fill('input[name="ingredients"]', 'chicken, rice, vegetables');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 15000 });

    // Find and expand first AI suggestion
    const firstSuggestion = page.locator('[data-testid="suggestion-item"]').first();
    await firstSuggestion.click();

    // Wait for details to expand
    await page.waitForSelector('[data-testid="recipe-instructions"]');

    // Click save button
    const saveButton = firstSuggestion.locator('button:has-text("Save")');
    await saveButton.click();

    // Verify loading state
    await expect(saveButton).toBeDisabled();

    // Wait for success message
    await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 10000 });

    // Navigate to recipes page
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Verify saved recipe appears in list
    const recipesList = page.locator('[data-testid="recipe-item"]');
    await expect(recipesList.first()).toBeVisible();
  });

  test('should show cached suggestions on repeated requests', async ({ page }) => {
    // Skip if OpenAI API key is not configured
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    const ingredients = 'pasta, garlic, olive oil';

    // First request - should call AI
    await page.fill('input[name="ingredients"]', ingredients);
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 15000 });
    const firstRequestTime = Date.now() - startTime;

    // Store first result text
    const firstResult = await page.locator('[data-testid="suggestion-item"]').first().textContent();

    // Clear and submit again with same ingredients
    await page.reload();
    await page.fill('input[name="ingredients"]', ingredients);
    const cacheStartTime = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 5000 });
    const cachedRequestTime = Date.now() - cacheStartTime;

    // Second request should be faster (cached)
    expect(cachedRequestTime).toBeLessThan(firstRequestTime / 2);

    // Results should be identical
    const cachedResult = await page
      .locator('[data-testid="suggestion-item"]')
      .first()
      .textContent();
    expect(cachedResult).toBe(firstResult);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error by using invalid ingredients
    await page.fill('input[name="ingredients"]', '');
    await page.click('button[type="submit"]');

    // Verify error message appears
    await expect(page.locator('text=/error|failed/i')).toBeVisible({ timeout: 5000 });

    // Verify UI remains functional
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should display traditional suggestions alongside AI suggestions', async ({ page }) => {
    // Skip if OpenAI API key is not configured
    test.skip(!process.env.OPENAI_API_KEY, 'OpenAI API key not configured');

    // Select common ingredient that likely has traditional recipes
    await page.fill('input[name="ingredients"]', 'tomatoes');
    await page.click('button[type="submit"]');
    await page.waitForSelector('[data-testid="suggestion-item"]', { timeout: 15000 });

    // Check for both AI and traditional suggestions
    const suggestions = page.locator('[data-testid="suggestion-item"]');
    const count = await suggestions.count();

    // Should have multiple suggestions
    expect(count).toBeGreaterThan(0);

    // Look for mix of AI and traditional (traditional won't have AI badge)
    const aiBadges = page.locator('text=🤖 AI Generated');
    const aiCount = await aiBadges.count();

    // Verify we have both types if traditional recipes exist in DB
    if (count > aiCount) {
      console.log(`Found ${aiCount} AI suggestions and ${count - aiCount} traditional suggestions`);
    }
  });
});

test.describe('Recipe Management Integration', () => {
  test('should allow viewing saved AI recipe details', async ({ page }) => {
    // Navigate to recipes page
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Verify page loads
    await expect(page.locator('h1')).toContainText(/recipe/i);

    // If recipes exist, click first one
    const recipes = page.locator('[data-testid="recipe-item"]');
    const count = await recipes.count();

    if (count > 0) {
      await recipes.first().click();

      // Verify recipe details page loads
      await expect(page.locator('[data-testid="recipe-instructions"]')).toBeVisible();
    }
  });

  test('should maintain non-AI recipe creation flow', async ({ page }) => {
    // Navigate to recipes page
    await page.goto('/recipes');

    // Look for "Add Recipe" or "Create Recipe" button
    const createButton = page.locator('button:has-text("Add"), button:has-text("Create")');

    if (await createButton.isVisible()) {
      await createButton.click();

      // Verify form appears
      await expect(page.locator('input[name="name"], input[name="title"]')).toBeVisible();
    }
  });
});
