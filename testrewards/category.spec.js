const { test, chromium } = require('@playwright/test');

test('RewardscategoryTest', async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: "C:\\Users\\DELL\\AppData\\Local\\Santa\\Application\\santa.exe"
    // OR
    // executablePath: "C:/Users/DELL/AppData/Local/Santa/Application/santa.exe"
  });

  const context = await browser.newContext();

  await context.addCookies([
    {
      name: 'clid',
      value: '8da91acc7b09930',
      domain: 'rewards.santabrowser.com',
      path: '/',
    },
  ]);

  const page = await context.newPage();

  await page.goto('https://rewards.santabrowser.com', {
    waitUntil: 'networkidle',
  });

  const quests = page.locator("//nav[@class='flex-1 pr-1']//span[text()='Quests']");
  const spaces = page.locator("//nav[@class='flex-1 pr-1']//span[text()='Spaces']");
  const myRewards = page.locator("//span[text()='My Rewards']");
  const rank = page.locator("//nav[@class='flex-1 pr-1']//span[text()='Rank']");


  await quests.click();  


  await spaces.click();


  await myRewards.click();


  await rank.click();


  await browser.close();
});