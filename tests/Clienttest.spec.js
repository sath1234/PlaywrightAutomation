const {test,expect} = require('@playwright/test');

test('client test', async ({page}) =>

{
  const username = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const loginButton = page.locator("#login"); 
  const cardtitles = page.locator(".card-body b"); 
  const addidas = page.locator("//b[text()='ADIDAS ORIGINAL']/following::button[1]"); 
  const addtocart = page.locator("[class='btn btn-primary']"); 
  const home = page.locator("//button[@class='btn btn-custom']//i[@class='fa fa-home']"); 
  const search = page.locator("//div[@class='py-2 border-bottom ml-3']//input[@placeholder='search']"); 
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login"); 
  console.log(await page.title());
  await username.type("sathyakarthikeyan70@gmail.com"); 
  await password.type("Sathya1512@"); 
  await loginButton.click();   
  //console.log(await cardtitles.first().textContent());   
  //console.log(await cardtitles.nth(1).textContent());  
  await page.locator(".card-body b").first().waitFor();   
  const allcardtitles = await cardtitles.allTextContents();  
  console.log(allcardtitles);   
  await addidas.click(); 
  await addtocart.click();  
  await home.click();  
  await search.type("Adidas");   
});





  

  
  



