const {test,expect} = require('@playwright/test');  

test('OrangeHRM test', async ({browser})=> 
{
    const context = await browser.newContext();  
    const page = await context.newPage();  
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");  
    console.log(await page.title());  
    await expect(page).toHaveTitle(/Orange/i);      
    const username = page.locator("[name='username']");    
    const password= page.locator("[name='password']"); 
    const login = page.locator("[type='Submit']");      
    const closebutton = page.locator("//button[@class='oxd-icon-button oxd-main-menu-button']");      
    const clock= page.locator("//i[@class='oxd-icon bi-stopwatch']"); 
    await username.type("Admin");  
    await password.type("admin123");  
    await login.click();   
    await closebutton.click();      
    await clock.click();

    

});  


test('Orange test', async({page})=> 
{   
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");  
     const username = page.locator("[name='username']");    
    const password= page.locator("[name='password']"); 
    const login = page.locator("[type='Submit']");    
    const clock = page.locator("//i[@class='oxd-icon bi-stopwatch']");
     await username.type("Admin");  
    await password.type("admin123");  
    await login.click();       
    await clock.click(); 


    


});  

test('Orangepunch test', async ({page})=> 
{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");   
    const box= page.locator("[placeholder='Type here']");   
    const submit = page.locator("[type='submit']")
    box.type("good"); 
    submit.click();


});