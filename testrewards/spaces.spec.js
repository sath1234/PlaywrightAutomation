const { test, chromium } = require('@playwright/test');

test.setTimeout(120000);

// ================= CONFIG =================
const REWARDS_URL = "https://rewards.santabrowser.com";
const CLID = "8da91acc7b09930";

// ================= LOCATORS =================
const SPACES = "//nav[@class='flex-1 pr-1']//span[text()='Spaces']";
const SANTA = "//h3[text()='Santa']";
const HOME = "//nav[@class='flex-1 pr-1']//span[text()='Home']";
const APTOS = "//h3[text()='Aptos']";

// ================= SAFE CLICK =================
async function safeClick(page, xpath, name) {
    console.log(`Clicking: ${name}`);

    const locator = page.locator(xpath).first();

    await locator.waitFor({
        state: "attached",
        timeout: 30000
    });

    await locator.waitFor({
        state: "visible",
        timeout: 30000
    }).catch(() => {});

    await locator.click({ force: true });

    console.log(`Clicked: ${name}`);

    // important wait for UI re-render
    await page.waitForTimeout(2000);
}

// ================= TEST =================
test('Spaces Navigation Flow with CLID', async () => {

    const browser = await chromium.launch({
        headless: false,
        executablePath: "C:\\Users\\DELL\\AppData\\Local\\Santa\\Application\\santa.exe"
    });

    const context = await browser.newContext();

    // CLID cookie
    await context.addCookies([
        {
            name: "clid",
            value: CLID,
            domain: "rewards.santabrowser.com",
            path: "/"
        }
    ]);

    const page = await context.newPage();

    await page.goto(REWARDS_URL, {
        waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(5000);

    // ================= FLOW =================

    await safeClick(page, SPACES, "Spaces");

    await safeClick(page, SANTA, "Santa");

    await safeClick(page, HOME, "Home");

    await safeClick(page, SPACES, "Spaces");

    await safeClick(page, APTOS, "Aptos");

    await safeClick(page, HOME, "Home");

    await page.screenshot({
        path: "spaces_flow.png",
        fullPage: true
    });

    console.log("🎉 Flow completed");

    await browser.close();
});