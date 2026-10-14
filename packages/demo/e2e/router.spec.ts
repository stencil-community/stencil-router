import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  (page as any).__errors = errors;
});

test.afterEach(async ({ page }) => {
  expect((page as any).__errors).toEqual([]);
});

test("redirects / to /main", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Main");
  await expect(page).toHaveURL(/\/main$/);
});

test("navigates client-side with href() and supports back", async ({ page }) => {
  await page.goto("/main");
  await expect(page.locator("h1")).toHaveText("Main");
  await page.evaluate(() => ((window as any).__noReload = true));

  await page.getByRole("link", { name: "Go to Hello" }).click();
  await expect(page).toHaveURL(/\/blog\/hello$/i);
  await expect(page.locator("h1")).toHaveText("Blog Page hello");
  expect(await page.evaluate(() => (window as any).__noReload)).toBe(true);

  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Main");
});

test("serves prerendered static page state", async ({ page }) => {
  await page.goto("/blog/hello");
  await expect(page.locator("h1")).toHaveText("Blog Page hello");
});

test("re-evaluates routes when component state changes", async ({ page }) => {
  await page.goto("/main");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.locator("app-account h1")).toHaveText("Account");
  await expect(page.locator("app-account p")).toHaveText("/account");
});
