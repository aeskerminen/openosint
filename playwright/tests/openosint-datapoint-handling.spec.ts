import { test, expect } from "@playwright/test";
import { beforeEach, describe } from "node:test";

export default function createTests() {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://172.19.0.6:5173/");
  });

  test("Uploading image file works correctly.", async ({ page }) => {
    await page.getByRole("button", { name: "Choose File" }).click();
    await page
      .getByRole("button", { name: "Choose File" })
      .setInputFiles("./test-input-files/leopard2_test.png");
    await page.getByRole("button", { name: "Upload Datapoint" }).click();
    await expect(page.getByTestId("upload-status-container")).toHaveText(
      /Status:\s*done/i,
      {
        timeout: 10000,
      }
    );

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
    await page.getByTestId("datapoint-list-remove-button").click();

    await page
      .getByTestId("datapoint-list-container")
      .first()
      .evaluate((el) => el.childElementCount)
      .then((count) => expect(count).toBe(0));
  });
}
