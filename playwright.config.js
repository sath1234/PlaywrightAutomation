// @ts-check
const config = {
  testDir: './testrewards',
  timeout: 50 * 1000,

  expect: {
    timeout: 5000,
  },

  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,  

  
  },
};

module.exports = config;