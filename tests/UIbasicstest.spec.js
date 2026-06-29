const  {test,expect} = require('@playwright/test');


test('Rahulshetty test', async ({browser})=> 
{  
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = page.locator("[name='username']");   
  const password = page.locator("[name='password']");   
  const signInButton = page.locator("#signInBtn");   
  const cardtitles = page.locator(".card-body a"); 
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");  
  console.log(await page.title());   
  await expect(page).toHaveTitle(/login/i);
  await username.type("Sathya"); 
  await password.type("Learning");
  await signInButton.click();      
  console.log(await page.locator("[style*='display: block']").textContent());
  await expect(page.locator("[style*='display: block']")).toContainText("Incorrect"); 
  
  await username.fill(""); 
  await username.fill("rahulshettyacademy");    
  await password.fill("Learning@830$3mK2")
  await signInButton.click(); 
 // console.log(await cardtitles.first().textContent()); 
 // console.log(await cardtitles.nth(1).textContent()); 
  const allcardtiitles =await cardtitles.allTextContents();  
  console.log(allcardtiitles);

  

  
}); 

test('UI Dropdoewn', async ({page})=>
{
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  const username = page.locator("[name='username']");   
  const password = page.locator("[name='password']");   
  const signInButton = page.locator("#signInBtn");   
  const dropdown = page.locator("select.form-control"); 
  const radiobutton = page.locator(".radiotextsty") 
  const documentlink = page.locator("[href*='request']");  
  const hire = page.locator("[href*='hire']");
  await username.type("rahulshettyacademy"); 
  await password.type("Learning@830$3mK2");
  await dropdown.selectOption("Consultant"); 
  await radiobutton.last().click();      
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  console.log(await page.locator(".radiotextsty").last().isChecked());  
  await page.locator("#okayBtn").click();  
  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();  
  await expect(documentlink).toHaveAttribute("class","blinkingText");
  await expect(hire).toHaveAttribute("class","blinkingText");
  await signInButton.click(); 


});

test.only('child window handling',async ({browser})=>
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");  
   const username = page.locator("[name='username']"); 
  const documentlink = page.locator("[href*='request']");   
  const [newpage] = await  Promise.all([
    context.waitForEvent('page'),
    documentlink.click(),


  ]) 
  const text = await newpage.locator(".red").textContent();  
  const arrtext = text.split("@");
  const domain = arrtext[1].split(" ")[0] 
  console.log(domain);
  await page.pause();

  
  

});



  




