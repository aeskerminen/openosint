import { test, expect } from "@playwright/test";
import { describe } from "node:test";

describe("OpenOSINT E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://172.19.0.6:5173/");
  });

  test("Uploading image file works correctly.", async ({ page }) => {
    await page.getByRole("button", { name: "Choose File" }).click();
    await page
      .getByRole("button", { name: "Choose File" })
      .setInputFiles("leopard2_test.png");
    await page.getByRole("button", { name: "Upload Datapoint" }).click();
  });
});
