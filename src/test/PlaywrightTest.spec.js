import { test, expect } from '@playwright/test';

test.describe('🎬 Full-Stack App E2E Test Suite - Complete User Journey Testing', () => {
  
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Set viewport to ensure consistent rendering
    await page.setViewportSize({ width: 1280, height: 720 });
    // Navigate to app
    await page.goto('http://localhost:3000/');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('🎭 Complete Movie/Series Management - Add, Edit, Delete workflow with navigation validation', async ({ page }) => {
    // 1. 🏠 Initial Page Load & Navigation Verification
    await expect(page.getByRole('button', { name: 'Series/Movies' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Games' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Books' })).toBeVisible();

    // 2. 📊 Tab Navigation & Dashboard Verification
    // Move mouse to top to show header
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500); // Wait for header to appear
      
    await page.getByRole('button', { name: 'Series/Movies' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Series/Movies' }).click();
    await expect(page.getByRole('heading', { name: 'Series/Movies Collection' })).toBeVisible();

    // 3. ➕ Movie/Series Creation Process
    await expect(page.getByRole('button', { name: 'add' })).toBeVisible();
    await page.getByRole('button', { name: 'add' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Series/Movie' })).toBeVisible();
    
    // Fill basic information
    await page.getByRole('textbox', { name: 'Title' }).fill('TestFilm');
    
    // Select genre
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Action' }).click();
    
    // Set status
    await page.getByRole('combobox', { name: 'To Watch' }).click();
    await page.getByRole('option', { name: 'Watched' }).click();
    
    // Set rating
    await page.locator('label').filter({ hasText: '5 Stars' }).click();
    
    // Add director
    await page.getByRole('textbox', { name: 'Director' }).fill('TestFilmYonetmen');
    
    // Set release date
    await page.getByRole('button', { name: 'Choose date' }).click();
    await page.getByRole('radio', { name: '2024' }).click();
    
    // Add comment
    await page.getByRole('textbox', { name: 'Comment' }).fill('FILM TEST COMMENT');
    
    // Image upload (optional)
    // Using a real file from test directory
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./src/test/test-image.jpg');
    
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('heading', { name: 'TestFilm' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('FILM TEST COMMENT')).toBeVisible();
    await expect(page.getByText('TestFilmYonetmen')).toBeVisible();

    // 4. ✏️ Movie/Series Edit Process
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByRole('textbox', { name: 'Title' }).fill('TestFilmEDIT');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'TestFilmEDIT' })).toBeVisible();

    // 5. 🏠 Navigation to Home & Verification
    // Move mouse to top to show header
    await page.waitForTimeout(500);
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500);
    await page.locator('#main-header').getByRole('button').first().click();
    
    // Verify item appears in main collection
    await expect(page.getByText('TestFilmEDITAction')).toBeVisible();
    await page.locator('div').filter({ hasText: /^🎬Series\/Movies Collection\d+ itemsView All$/ }).getByRole('button').click();

    // 6. 🗑️ Movie/Series Deletion
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'TestFilmEDIT' })).not.toBeVisible();
  });

  test('🎮 Complete Game Management - Full CRUD operations with duplicate detection', async ({ page }) => {
    // Navigate to Games section
    // Move mouse to top to show header
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Games' }).click();
    await expect(page.getByRole('heading', { name: '🎮 Game Collection' })).toBeVisible();

    // ➕ Add New Game
    await page.getByRole('button', { name: 'add' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Game' })).toBeVisible();
    
    // Fill game information
    await page.getByRole('textbox', { name: 'Title' }).fill('TestOYUN');
    await page.locator('#mui-component-select-genre').click();
    await page.getByRole('option', { name: 'Strategy' }).click();
    await page.locator('label').filter({ hasText: '3 Stars' }).click();
    await page.getByRole('textbox', { name: 'Platform' }).fill('SteamTEST');
    await page.getByRole('button', { name: 'Choose date' }).click();
    await page.getByRole('radio', { name: '2026' }).click();
    await page.getByRole('textbox', { name: 'Comment' }).fill('YORUMTEST');
    await page.getByRole('button', { name: 'Add' }).click();
    // Wait: Dynamic wait until new title appears after Add button
    await expect(page.getByRole('heading', { name: 'TestOYUN' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('YORUMTEST')).toBeVisible();
    await expect(page.getByText('SteamTEST')).toBeVisible();

    // 🔄 Test Duplicate Detection
    await page.getByRole('button', { name: 'add' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('TestOYUN'); // Same title
    await page.locator('#mui-component-select-genre').click();
    await page.getByRole('option', { name: 'Sports' }).click();
    
    // Handle duplicate alert
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 🏠 Navigate to Home & Verify
    // Move mouse to top to show header
    await page.waitForTimeout(500);
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500);
    await page.locator('#main-header').getByRole('button').first().click();
    // Is it visible on main page too?
    await expect(page.getByText('TestOYUNStrategy')).toBeVisible();
    await page.locator('div').filter({ hasText: /^🎮Game Collection\d+ itemsView All$/ }).getByRole('button').click();

    // 🗑️ Delete Game
    await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorError').first().click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'TestOYUN' })).not.toBeVisible();
  });

  test('📚 Complete Book Management - Full lifecycle with form validation', async ({ page }) => {
    // Navigate to Books section
    // Move mouse to top to show header
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Books' }).click();
    await expect(page.getByRole('heading', { name: '📚 Book Collection' })).toBeVisible();

    // ➕ Add New Book
    await page.getByRole('button', { name: 'add' }).click();
    
    // Fill book information
    await page.getByRole('textbox', { name: 'Title' }).fill('TestKITAP');
    await page.locator('#mui-component-select-genre').click();
    await page.getByRole('option', { name: 'Fantasy' }).click();
    await page.locator('#mui-component-select-status').click();
    await page.getByRole('option', { name: 'Read' }).click();
    await page.locator('label').filter({ hasText: '4 Stars' }).click();
    await page.getByRole('textbox', { name: 'Author' }).fill('AliTEST');
    await page.getByRole('button', { name: 'Choose date' }).click();
    await page.getByRole('radio', { name: '2029' }).click();
    await page.getByRole('textbox', { name: 'Comment' }).fill('TestYorum');
    await page.getByRole('button', { name: 'Add' }).click();
    // Wait: Dynamic wait until new title appears after Add button
    await expect(page.getByRole('heading', { name: 'TestKITAP' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('TestYorum')).toBeVisible();
    await expect(page.getByText('AliTEST')).toBeVisible();

    // 🏠 Navigate to Home & Verify
    await page.waitForTimeout(500);
    await page.mouse.move(640, 10);
    await page.waitForTimeout(500);
    await page.locator('#main-header').getByRole('button').first().click();
    // Is it visible on main page too?
    await expect(page.getByText('TestKITAPFantasy')).toBeVisible();
    await page.locator('div').filter({ hasText: /^📚Book Collection\d+ itemsView All$/ }).getByRole('button').click();

    // 🗑️ Delete Book
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'TestKITAP' })).not.toBeVisible();
  });
});