const { test, chromium, expect } = require('@playwright/test');

test.setTimeout(120000);

//================ CONFIG ================
const REWARDS_URL = "https://rewards.santabrowser.com";
const CLID = "8da91acc7b09930";

//================ LOCATORS ================
const RANK = "//nav[@class='flex-1 pr-1']//span[text()='Rank']";

const CREW_BTN = "//button[normalize-space()='Crew']";

const WEEKLY_BTN = "//button[normalize-space()='weekly' or normalize-space()='Weekly']";
const MONTHLY_BTN = "//button[normalize-space()='monthly' or normalize-space()='Monthly']";
const YEARLY_BTN = "//button[normalize-space()='yearly' or normalize-space()='Yearly']";

const ALL_BTN =
"//div[contains(@class,'inline-flex') and contains(@class,'rounded-full')]//button[normalize-space()='All']";

//================ API ================
const BASE_API = `https://api.santabrowser.com/quests/bff/v1/leaderboard/${CLID}`;

const API = {
    weekly: `${BASE_API}?period=weekly&segment=crew`,
    monthly: `${BASE_API}?period=monthly&segment=crew`,
    yearly: `${BASE_API}?period=yearly&segment=crew`,
    all: `${BASE_API}?period=all&segment=crew`
};

//================ SAFE CLICK ================
async function safeClick(page, xpath, name) {

    const locator = page.locator(xpath).first();

    await locator.waitFor({
        state: "visible",
        timeout: 30000
    });

    await locator.scrollIntoViewIfNeeded();

    await locator.click({ force: true });

    console.log(`✅ Clicked : ${name}`);

    await page.waitForTimeout(1500);
}

//================ API CALL ================
async function fetchLeaderboard(period) {

    const response = await fetch(API[period]);

    expect(response.ok).toBeTruthy();

    const json = await response.json();

    console.log(`\n📡 ${period.toUpperCase()} CREW RESPONSE`);
    console.log(JSON.stringify(json, null, 2));

    return json;
}

//================ VALIDATION ================
function validateResponse(data, period) {

    expect(data).not.toBeNull();

    console.log(`\n========== ${period.toUpperCase()} ==========`);

    console.log("CLID      :", data.clid);
    console.log("Username  :", data.username);
    console.log("Points    :", data.points);
    console.log("Rank      :", data.rank);
    console.log("Key       :", data.key);

    expect(data.clid).toBe(CLID);
    expect(data.username).toBeTruthy();
    expect(typeof data.points).toBe("number");
    expect(typeof data.rank).toBe("number");

    expect(data.key).toContain("leaderboard");
    expect(data.key).toContain("crew");

    // Validate period
    switch (period) {

        case "weekly":
            expect(data.key).toContain("weekly");
            break;

        case "monthly":
            expect(data.key).toContain("monthly");
            break;

        case "yearly":
            expect(data.key).toContain("yearly");
            break;

        case "all":
            // API intentionally returns no ":all"
            expect(data.key).toBe("leaderboard:points:crew");
            break;
    }
}

//================ TEST ================
test("Crew Leaderboard UI + API Validation", async () => {

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

    //================ UI FLOW ================

    await safeClick(page, RANK, "Rank");

    await safeClick(page, CREW_BTN, "Crew");

    // Weekly
    await safeClick(page, WEEKLY_BTN, "Weekly");
    let result = await fetchLeaderboard("weekly");
    validateResponse(result, "weekly");

    // Monthly
    await safeClick(page, MONTHLY_BTN, "Monthly");
    result = await fetchLeaderboard("monthly");
    validateResponse(result, "monthly");

    // Yearly
    await safeClick(page, YEARLY_BTN, "Yearly");
    result = await fetchLeaderboard("yearly");
    validateResponse(result, "yearly");

    // All
    await safeClick(page, ALL_BTN, "All");
    result = await fetchLeaderboard("all");
    validateResponse(result, "all");

    // Screenshot
    await page.screenshot({
        path: "Crew_Leaderboard.png",
        fullPage: true
    });

    console.log("\n🎉 Crew Leaderboard UI + API Validation completed successfully.");

    await browser.close();
});