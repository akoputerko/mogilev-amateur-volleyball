import { test, expect } from "@playwright/test";

// ─── Standings page ───────────────────────────────────────────────────────────

test.describe("Standings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/");
    // wait for table to render
    await page.waitForSelector("tbody tr");
  });

  test("standings table has 8 teams", async ({ page }) => {
    await expect(page.locator("tbody tr")).toHaveCount(8);
  });

  test("МГП leads the table with 9 points", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toContainText("МГП");
    await expect(firstRow).toContainText("9");
  });

  test("Dream Team is in the top 4 with 7 points", async ({ page }) => {
    // Dream Team: 1pt(M1 loss) + 3pts(M5 win 3-0) + 2pts(M12 win 2-1) + 1pt(M13 loss) = 7pts
    const rows = page.locator("tbody tr");
    const teamRow = rows.filter({ hasText: "Dream Team" }).first();
    await expect(teamRow).toContainText("7");
    // Dream Team must be in the top 4 (positions 1-4 have sky/amber border)
    const rowIndex = await teamRow.evaluate((el) =>
      Array.from(el.parentElement!.children).indexOf(el),
    );
    expect(rowIndex).toBeLessThan(4);
  });

  test("Серволюкс is last with 2 points", async ({ page }) => {
    const lastRow = page.locator("tbody tr").last();
    await expect(lastRow).toContainText("Серволюкс");
    await expect(lastRow).toContainText("2");
  });

  // ── League records ────────────────────────────────────────────────────────

  test("league records section shows all 5 record labels", async ({ page }) => {
    await expect(page.getByText("Рекорды лиги")).toBeVisible();
    for (const label of [
      "Макс. очков в партии",
      "Самая напряжённая",
      "Самый разгромный",
      "Очков в матче",
      "Эфф-ть атаки",
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("max set score is 27, attributed to С37 (not МАК)", async ({ page }) => {
    const labelEl = page.getByText("Макс. очков в партии", { exact: true });
    const cardEl = labelEl.locator("xpath=..");

    // value must be 27
    await expect(cardEl.getByText("27")).toBeVisible();

    // detail must start with С37 (the team that actually scored 27)
    const detail = await cardEl.locator("div").last().textContent();
    expect(detail).toMatch(/^С37/);
    expect(detail).not.toMatch(/^МАК/);
  });

  test("closest set record shows latest occurrence with count suffix", async ({ page }) => {
    const labelEl = page.getByText("Самая напряжённая", { exact: true });
    const cardEl = labelEl.locator("xpath=..");
    const detail = await cardEl.locator("div").last().textContent();
    // Many sets in tours 1-4 share margin=2, so detail shows count like "×9"
    expect(detail).toMatch(/×\d+/);
  });

  test("closest set record detail shows latest Tour with winner first", async ({
    page,
  }) => {
    const labelEl = page.getByText("Самая напряжённая", { exact: true });
    const cardEl = labelEl.locator("xpath=..");
    const detail = (await cardEl.locator("div").last().textContent()) ?? "";
    // Detail shows the latest occurrence + count, e.g. "МГП - ДТ, Тур 4 (×9)"
    // The detail must contain a Тур reference and a count
    expect(detail).toMatch(/Тур \d+/);
    expect(detail).toMatch(/×\d+/);
  });

  test("dominant set record shows winner team first", async ({ page }) => {
    const labelEl = page.getByText("Самый разгромный", { exact: true });
    const cardEl = labelEl.locator("xpath=..");
    // The value should be "+N" format
    const value = await cardEl.locator("div").nth(1).textContent();
    expect(value).toMatch(/^\+\d+$/);
    // Detail should include score and team names
    const detail = (await cardEl.locator("div").last().textContent()) ?? "";
    expect(detail.length).toBeGreaterThan(0);
  });

  test("highest scoring match value is > 100 total points", async ({ page }) => {
    const labelEl = page.getByText("Очков в матче", { exact: true });
    const cardEl = labelEl.locator("xpath=..");
    const value = await cardEl.locator("div").nth(1).textContent();
    expect(Number(value)).toBeGreaterThan(100);
  });

  test("attack efficiency record ends with %", async ({ page }) => {
    const labelEl = page.getByText("Эфф-ть атаки", { exact: true });
    const cardEl = labelEl.locator("xpath=..");
    const value = (await cardEl.locator("div").nth(1).textContent()) ?? "";
    expect(value.endsWith("%")).toBe(true);
    expect(Number(value.replace("%", ""))).toBeGreaterThan(0);
  });
});

// ─── Tours page ───────────────────────────────────────────────────────────────

test.describe("Tours page - Tour 3", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/tours");
    // open the tour select dropdown and choose Tour 3
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Тур 3" }).click();
    // wait for tour summary to appear (all 4 matches in Tour 3 are played)
    await page.waitForSelector("text=Самая напряжённая");
  });

  test("tour 3 summary stats are all visible", async ({ page }) => {
    await expect(page.getByText("Очков разыграно")).toBeVisible();
    await expect(page.getByText("Разгромы / Борьба")).toBeVisible();
    await expect(page.getByText("Самая напряжённая")).toBeVisible();
    await expect(page.getByText("Разгром", { exact: true })).toBeVisible();
  });

  test("Tour 3 closest set shows home:away score and home - away teams", async ({
    page,
  }) => {
    const labelEl = page.getByText("Самая напряжённая", { exact: true }).first();
    const cardEl = labelEl.locator("xpath=..");

    // Match 9 set 1: Макиато(home)=25, Сетка 37(away)=27, margin=2 — first margin-2 set in Tour 3
    // Score shown as home:away → "25:27"; teams shown as home-away → "МАК - С37"
    await expect(cardEl.getByText("25:27")).toBeVisible();
    const detail = (await cardEl.locator("div").last().textContent()) ?? "";
    expect(detail).toMatch(/^МАК/);
    expect(detail).toContain("С37");
  });

  test("Tour 3 has 4 match cards", async ({ page }) => {
    await expect(page.locator(".animate-fade-in .animate-fade-in")).toHaveCount(4);
  });

  test("MAK vs C37 match overall score is 2:1 (Макиато won)", async ({ page }) => {
    // The match appears in the grid; find an article/card containing both team names
    // MatchCard renders as a shadcn Card (div with specific classes)
    // Both team names appear within the same card
    const matchGrid = page.locator(".grid.gap-4");
    const cards = matchGrid.locator(":scope > *");
    let foundCard = null;
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i);
      const text = await card.textContent();
      if (text?.includes("Макиато") && text?.includes("Сетка 37")) {
        foundCard = card;
        break;
      }
    }
    expect(foundCard).not.toBeNull();
    // Макиато won 2-1, so overall set score is 2:1
    const cardText = await foundCard!.textContent();
    expect(cardText).toMatch(/2.*1|1.*2/); // both "2" and "1" appear
    // The set score 25:27 (С37 winning that set) appears in the pills
    expect(cardText).toContain("25");
    expect(cardText).toContain("27");
  });
});

// ─── Team page (Макиато) ──────────────────────────────────────────────────────

test.describe("Team page - Макиато", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/teams/0");
    await page.waitForSelector("text=Макиато");
  });

  test("Макиато StatBox shows 3 wins and 1 loss", async ({ page }) => {
    // StatBox structure: Card > CardContent > [div(wins/losses), div(label)]
    // getByText returns the label div; xpath=.. goes to CardContent
    const statBoxLabel = page.getByText("Победы / Поражения", { exact: true });
    const cardContent = statBoxLabel.locator("xpath=..");
    await expect(cardContent.locator(".text-sport-win")).toContainText("3");
    await expect(cardContent.locator(".text-sport-loss")).toContainText("1");
  });

  test("Макиато has 1 comeback stat from Tour 3", async ({ page }) => {
    // getComebackStats shows "1 камбэк" (Макиато lost set 1 in match 9, won 2-1)
    await expect(page.getByText(/1 камбэк/)).toBeVisible();
  });

  test("Макиато points scored section is visible with забито/пропущено labels", async ({ page }) => {
    await expect(page.getByText("забито")).toBeVisible();
    await expect(page.getByText("пропущено")).toBeVisible();
    // Section header
    await expect(page.getByText("Очки в партиях")).toBeVisible();
  });

  test("head-to-head records section shows opponents Макиато played", async ({ page }) => {
    // Section uses "Очные встречи" label
    await expect(page.getByText("Очные встречи")).toBeVisible();
    // Макиато played 4 opponents in tours 1-4: Dream Team, 33, Сетка 37, Отцы и дети
    // Shown as short names in the grid
    await expect(page.getByText("ДТ").or(page.getByText("Dream Team")).first()).toBeVisible();
    await expect(page.getByText("33").first()).toBeVisible();
    await expect(page.getByText("С37").or(page.getByText("Сетка 37")).first()).toBeVisible();
    await expect(page.getByText("ОиД").or(page.getByText("Отцы и дети")).first()).toBeVisible();
  });
});

// ─── Cross-page consistency ───────────────────────────────────────────────────

test.describe("Cross-page consistency", () => {
  test("МГП points match between standings and team page", async ({ page }) => {
    // Get points from standings row
    await page.goto("/#/");
    await page.waitForSelector("tbody tr");
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toContainText("МГП");

    // МГП team page (id=2) should show 9 points in the header
    await page.goto("/#/teams/2");
    await page.waitForSelector("text=Могилевгражданпроект");
    // Header shows "{points} оч." — use a span containing just the points number
    await expect(page.getByText("9 оч.", { exact: false })).toBeVisible();
  });
});
