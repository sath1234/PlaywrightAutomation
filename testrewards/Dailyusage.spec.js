const { test, chromium, expect } = require('@playwright/test');

test.setTimeout(120000);

// ================= CONFIG =================
const REWARDS_URL = "https://rewards.santabrowser.com";
const CLID = "8da91acc7b09930";

const API_URL =
`https://api.santabrowser.com/quests/bff/v1/quests/q.santa.system.usage-daily/system-status?clid=${CLID}`;

// ================= LOCATORS =================
const QUESTS = "//nav[@class='flex-1 pr-1']//span[text()='Quests']";

const FILTER = "//button[text()='Filter']";
const USAGE = "//button[text()='Usage']";
const APPLY = "//button[text()='Apply']";

const DAILY_USAGE =
"//div[@class='w-full px-3 md:px-6 lg:px-8 py-3 box-border']//h3[text()='Daily Usage']";

const CLOSE =
"//span[text()='Close']";

// ================= SAFE CLICK =================
async function safeClick(page, xpath, name) {
    const locator = page.locator(xpath).first();

    await locator.waitFor({
        state: "visible",
        timeout: 30000
    });

    await locator.click({ force: true });

    console.log(`Clicked: ${name}`);

    await page.waitForTimeout(1500);
}

// ================= API FUNCTION =================
async function getUsageStatus() {

    try {

        const res = await fetch(API_URL);
        const json = await res.json();

        console.log("\n📡 API RESPONSE:", json);

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
test('Daily Usage Flow', async () => {

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

    await safeClick(page, DAILY_USAGE, "Daily Usage");

    await page.waitForTimeout(2000);

    await safeClick(page, CLOSE, "Close");

    // ================= API CHECK =================

    const status = await getUsageStatus();

    console.log("\n📊 FINAL STATUS:");
    console.log("Progress:", status?.progress);
    console.log("Goal:", status?.goal);
    console.log("Percent:", status?.percent);
    console.log("Ready:", status?.ready);

    // validation
    expect(status).not.toBeNull();
    expect(typeof status.percent).toBe("number");

    // ================= SCREENSHOT =================

    await page.screenshot({
        path: "daily_usage_flow.png",
        fullPage: true
    });

    console.log("🎉 Daily Usage Flow Completed");

    await browser.close();
});