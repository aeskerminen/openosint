import { test, expect } from "@playwright/test";
import { createTestDatapoint } from "../utils/testUtils";

export default function createTests() {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:443/");
  });

  test("Uploading image file works correctly.", async ({ page }) => {
    await createTestDatapoint(page);

    await page
      .getByTestId("datapoint-list-container")
      .first()
      .evaluate((el) => el.childElementCount)
      .then((count) => expect(count).toBe(1));
  });

  test("Selecting a datapoint displays its image.", async ({ page }) => {
    await page.getByTestId("datapoint-list-entry").first().click();
    await expect(page.getByTestId("datapoint-viewer-image")).toBeVisible();
  });

  test("Removing a datapoint works correctly.", async ({ page }) => {
    await page.getByTestId("datapoint-list-remove-button").first().click();

    await page
      .getByTestId("datapoint-list-container")
      .first()
      .evaluate((el) => el.childElementCount)
      .then((count) => expect(count).toBe(0));
  });
}
