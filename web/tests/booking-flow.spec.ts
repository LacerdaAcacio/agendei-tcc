import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read JSON fixtures
const readFixture = (filename: string) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8'));
};

const servicesData = readFixture('services.json');
const serviceDetailsData = readFixture('service-details.json');
const slotsData = readFixture('slots.json');

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Home Page Data
    await page.route('**/api/v1/home', async (route) => {
      console.error('Mocking /api/home');
      await route.fulfill({
        json: {
          categories: [
            { id: 'cleaning', name: 'Limpeza', icon: 'Sparkles', services: servicesData.data.services },
            { id: 'maintenance', name: 'Manutenção', icon: 'Wrench' },
          ],
          featuredServices: servicesData.data.services,
        },
      });
    });

    // Mock Services List
    await page.route('**/api/v1/services', async (route) => {
      console.error('Mocking /api/services');
      await route.fulfill({ json: servicesData });
    });

    // Mock Service Details
    await page.route('**/api/v1/services/service-1', async (route) => {
      console.error('Mocking /api/services/service-1');
      await route.fulfill({ json: serviceDetailsData });
    });

    // Mock Slots
    await page.route('**/api/v1/services/service-1/slots*', async (route) => {
      console.error('Mocking /api/services/service-1/slots');
      await route.fulfill({ json: slotsData });
    });

    // Mock Booking Creation
    await page.route('**/api/v1/bookings', async (route) => {
      console.error('Mocking /api/bookings');
      await route.fulfill({
        status: 201,
        json: { status: 'success', data: { id: 'booking-1' } },
      });
    });
  });

  test('should complete booking flow when not logged in (redirect to login)', async ({ page }) => {
    console.log('Starting test: not logged in');
    // 1. Navigate to Home
    await page.goto('/');
    console.log('Navigated to home');

    // Verify Home loaded
    await expect(page.getByText('Buscar')).toBeVisible();
    console.log('Home verified');

    // 2. Click on Service
    await page.getByText('Limpeza Residencial Premium').click();
    console.log('Clicked service');

    // Verify Service Details loaded
    await expect(page).toHaveURL(/\/services\/service-1/);
    console.log('Service details URL verified');
    await expect(page.getByRole('heading', { name: 'Limpeza Residencial Premium' })).toBeVisible();

    // 3. Select Date
    // Open calendar
    await page.getByRole('button', { name: /adicionar data/i }).click();
    console.error('Clicked open calendar');

    // Wait for calendar to be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    console.error('Calendar visible');

    // Click a day
    // Try to find any enabled day button
    const dayButton = page.locator('.rdp-day:not([disabled])').first();

    if ((await dayButton.count()) > 0) {
      await dayButton.click();
      console.error('Clicked day');
    } else {
      console.error('No enabled day found, trying next month');
      await page.getByRole('button', { name: 'Next month' }).click();
      await page.locator('.rdp-day:not([disabled])').first().click();
    }

    // 4. Select Time
    // Wait for slots to load
    await expect(page.getByText('09:00')).toBeVisible();

    // Click time slot
    await page.getByText('09:00').click();

    // 5. Click Reserve
    await page.getByRole('button', { name: /reservar/i }).click();

    // 6. Verify Redirect to Login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should complete booking flow when logged in', async ({ page }) => {
    // Mock Authenticated User
    await page.addInitScript(() => {
      window.localStorage.setItem('@agendei:token', 'fake-token');
      window.localStorage.setItem(
        '@agendei:user',
        JSON.stringify({
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
        }),
      );
    });

    // 1. Navigate to Service Page directly
    await page.goto('/services/service-1');

    // 2. Select Date & Time
    await page.getByRole('button', { name: /adicionar data/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.locator('button[name="day"]:not([disabled])').nth(5).click(); // Pick a day further in future
    await page.getByText('09:00').click();

    // 3. Click Reserve
    await page.getByRole('button', { name: /reservar/i }).click();

    // 4. Verify Redirect to My Bookings (or Success Page)
    // The app should redirect to /my-bookings after successful booking
    await expect(page).toHaveURL(/\/my-bookings/);
  });
});
