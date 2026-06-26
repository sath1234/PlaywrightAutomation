const { test, chromium, expect } = require('@playwright/test');

test.setTimeout(120000);

// ================= CONFIG =================
const REWARDS_URL = "https://rewards.santabrowser.com";
const CLID = "8da91acc7b09930";

// ================= WEEKLY API =================
const API_URL =
`https://api.santabrowser.com/quests/bff/v1/quests/q.santa.system.usage/system-status?clid=${CLID}`;

// ================= LOCATORS =================
const QUESTS = "//nav[@class='flex-1 pr-1']//span[text()='Quests']";

const FILTER = "//button[text()='Filter']";
const USAGE = "//button[text()='Usage']";
const APPLY = "//button[text()='Apply']";

// 🔁 CHANGED HERE → Weekly Usage
const WEEKLY_USAGE =
"//div[@class='w-full px-3 md:px-6 lg:px-8 py-3 box-border']//h3[text()='Weekly Usage']";

const CLOSE = "//span[text()='Close']";

// ================= SAFE CLICK =================
async function safeClick(page, xpath, name) {
    const locator = page.locator(xpath).first();

    await locator.waitFor({
        state: "visible",
        timeout: 30000
    });

    await locator.scrollIntoViewIfNeeded();

    await locator.click({ force: true });

    console.log(`Clicked: ${name}`);

    await page.waitForTimeout(1500);
}

// ================= API FUNCTION =================
async function getWeeklyUsageStatus() {

    try {
        const res = await fetch(API_URL);
        const json = await res.json();

        console.log("\n📡 WEEKLY API RESPONSE:", json);

        return {
            ready: json.ready,
            progress: json.progress,
            goal: json.goal,
            percent: json.percent,
            period: json.period_key
        };

    } catch (err) {
        console.log("❌ API Error:", err);
        return null;
    }
}

// ================= TEST =================
test('Weekly Usage Flow', async () => {

    const browser = await chromium.launch({
        headless: false,
        executablePath: "C:\\Users\\DELL\\AppData\\Local\\Santa\\Application\\santa.exe"
    });

    const context = await browser.newContext();

    // CLID COOKIE
    await context.addCookies([
        {
            name: "clid",
            value: CLID,
            domain: "rewards.santabrowser.com",
            path: "/"
        }
    ]);

    const page = await context.newPage();

    // ================= OPEN APP =================
    await page.goto(REWARDS_URL, {
        waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(5000);

    // ================= UI FLOW =================

    await safeClick(page, QUESTS, "Quests");

    await safeClick(page, FILTER, "Filter");

    await safeClick(page, USAGE, "Usage");

    await safeClick(page, APPLY, "Apply");

    // 🔁 WEEKLY USAGE CLICK
    await safeClick(page, WEEKLY_USAGE, "Weekly Usage");

    await page.waitForTimeout(2000);

    // CLOSE
    await safeClick(page, CLOSE, "Close");

    // ================= API CHECK =================

    const status = await getWeeklyUsageStatus();

    console.log("\n📊 FINAL WEEKLY STATUS:");
    console.log("Progress:", status?.progress);
    console.log("Goal:", status?.goal);
    console.log("Percent:", status?.percent);
    console.log("Ready:", status?.ready);

    expect(status).not.toBeNull();
    expect(typeof status.percent).toBe("number");

    // ================= SCREENSHOT =================

    await page.screenshot({
        path: "weekly_usage_flow.png",
        fullPage: true
    });

    console.log("🎉 Weekly Usage Flow Completed");

    await browser.close();
});