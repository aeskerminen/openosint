import { test, expect } from "@playwright/test";
import { beforeEach, describe } from "node:test";

describe("OpenOSINT E2E Tests", () => {
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
    await page
      .getByTestId("datapoint-list-container")
      .first()
      .locator(">div")
      .first()
      .click();
    await expect(page.getByTestId("datapoint-viewer-image")).toBeVisible();
  });

  describe("Editing a datapoint's", () => {
    test("name works correctly.", async ({ page }) => {
      await page
        .getByTestId("datapoint-list-container")
        .first()
        .locator(">div")
        .first()
        .click();
      await page.getByRole("button", { name: "Edit" }).click();
      await page.getByRole("textbox", { name: "Name" }).dblclick();
      await page
        .getByRole("textbox", { name: "Name" })
        .fill("test_change_name");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue(
        "test_change_name"
      );
    }),
      test("description works correctly.", async ({ page }) => {
        await page
          .getByTestId("datapoint-list-container")
          .first()
          .locator(">div")
          .first()
          .click();
        await page.getByRole("button", { name: "Edit" }).click();
        await page.getByRole("textbox", { name: "Description" }).click();
        await page
          .getByRole("textbox", { name: "Description" })
          .fill("test_change_description");
        await page.getByRole("button", { name: "Save" }).click();

        await expect(
          page.getByRole("textbox", { name: "Description" })
        ).toHaveValue("test_change_description");
      }),
      test("event time works correctly.", async ({ page }) => {
        await page
          .getByTestId("datapoint-list-container")
          .first()
          .locator(">div")
          .first()
          .click();
        await page.getByRole("button", { name: "Edit" }).click();
        await page.locator('input[name="eventTime"]').click();
        await page.locator('input[name="eventTime"]').fill("2023-01-22T15:40");
        await page.getByRole("button", { name: "Save" }).click();

        await expect(page.locator('input[name="eventTime"]')).toHaveValue(
          "2023-01-22T15:40"
        );
      }),
      test("GPS location works correctly.", async ({ page }) => {
        await page
          .getByTestId("datapoint-list-container")
          .first()
          .locator(">div")
          .first()
          .click();
        await page.getByRole("button", { name: "Edit" }).click();
        await page.getByPlaceholder("Longitude").click();
        await page.getByPlaceholder("Longitude").fill("22");
        await page.getByPlaceholder("Longitude").press("Tab");
        await page.getByPlaceholder("Latitude").fill("13");
        await page.getByRole("button", { name: "Save" }).click();

        await expect(page.getByPlaceholder("Longitude")).toHaveValue("22");
        await expect(page.getByPlaceholder("Latitude")).toHaveValue("13");
      });
  });
});
