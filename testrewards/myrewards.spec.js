const { test, chromium, expect } = require('@playwright/test');

test.setTimeout(120000);

// ==================================================
// CONFIG
// ==================================================

const REWARDS_URL = "https://rewards.santabrowser.com";

const CLID = "8da91acc7b09930";

const API_URL =
`https://api.santabrowser.com/quests/bff/v1/quests/q.daily.checkin/checkin-status?clid=${CLID}`;

// ==================================================
// LOCATORS
// ==================================================

const QUEST =
"(//span[@class='truncate'])[1]";

const FILTER =
"[class='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background border px-3 h-9 rounded-full border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10 hover:text-foreground']";

const USAGE =
"//button[@class='whitespace-nowrap rounded-full border px-3 py-1.5 text-xs hover:bg-white/80 dark:hover:bg-white/15 border-sky-200 text-sky-700 bg-sky-50/70 dark:border-sky-400/40 dark:text-sky-200/80 dark:bg-sky-500/10']";

const APPLY =
"[class='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background bg-primary text-primary-foreground hover:opacity-90 h-8 px-3']";

const DAILY_CHECKIN_CARD =
"(//*[@class='tracking-tight font-display text-sm font-semibold mt-5 leading-snug text-slate-900 dark:text-white line-clamp-2'])[4]";

const DAILY_CHECKIN_BUTTON =
"//button[@class='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background bg-primary text-primary-foreground hover:opacity-90 h-10 px-4 py-2 flex-1 rounded-full']";

// ==================================================
// CLICK FUNCTION
// ==================================================

async function clickElement(page, xpath, name) {

    console.log(`Clicking ${name}`);

    const locator = page.locator(xpath).first();

    await locator.waitFor({
        state: "visible",
        timeout: 15000
    });

    await locator.scrollIntoViewIfNeeded();

    await locator.click({
        force: true
    });

    await page.waitForTimeout(2000);

    console.log(`${name} clicked`);
}

// ==================================================
// API FUNCTION
// ==================================================

async function getCheckinStatus() {

    try {

        const response = await fetch(API_URL);

        const json = await response.json();

        console.log(json);

        const data = json.data || json;

        const today = new Date().toISOString().split("T")[0];

        if (data.last_checkin_ymd === today) {
            return "COMPLETED";
        }

        return "NOT_COMPLETED";

    } catch (error) {

        console.log(error);

        return null;
    }
}

// ==================================================
// TEST
// ==================================================

test('Daily Check-in Test', async () => {

    const browser = await chromium.launch({
        headless: false,
        executablePath: "C:\\Users\\DELL\\AppData\\Local\\Santa\\Application\\santa.exe"
    });

    const context = await browser.newContext();

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

    // Quest
    await clickElement(page, QUEST, "Quest");

    // Filter
    await clickElement(page, FILTER, "Filter");

    // Usage
    await clickElement(page, USAGE, "Usage");

    // Apply
    await clickElement(page, APPLY, "Apply");

    // Screenshot
    await page.screenshot({
        path: "usage_filter.png",
        fullPage: true
    });

    // API Status
    const status = await getCheckinStatus();

    console.log("Current Status:", status);

    expect(["COMPLETED", "NOT_COMPLETED"]).toContain(status);

    if (status === "NOT_COMPLETED") {

        await clickElement(
            page,
            DAILY_CHECKIN_CARD,
            "Daily Check-in Card"
        );

        await clickElement(
            page,
            DAILY_CHECKIN_BUTTON,
            "Daily Check-in Button"
        );

        await page.waitForTimeout(10000);

        const updatedStatus = await getCheckinStatus();

        console.log("Updated Status:", updatedStatus);

        expect(updatedStatus).toBe("COMPLETED");

        await page.screenshot({
            path: "daily_checkin_completed.png",
            fullPage: true
        });

        console.log("Daily Check-in completed successfully.");

    } else {

        console.log("Daily Check-in already completed.");
    }

    await browser.close();
});