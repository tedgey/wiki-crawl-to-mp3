const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");
const axios = require('axios');

describe('Wiki crawling', function() {
  let driver;
  const fs = require('fs');

  const names = [
    "Joe DiMaggio",
    "Mookie Betts",
  ]

  before(async function() {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  after(async function() {
    await driver.quit();
  });

  // Loop through names array
  names.forEach(name => {
    it(`should grab text from wikipedia for ${name}`, async function() {
      let wikiName = name.replace(/\s/g, '_');
      await driver.get(`https://en.wikipedia.org/wiki/${wikiName}`)

      let title = await driver.getTitle();
      assert.equal(`${name} - Wikipedia`, title);

      let firstHeading = await driver.findElement(By.id('firstHeading'));
      let expectedHeading = await firstHeading.getText();
      assert.equal(`${name}`, expectedHeading);

      let articleText = await driver.findElement(By.id('mw-content-text'));
      let recievedText = await articleText.getText();

      // In recievedText IF we see "See also" cut out all text after that
      let finalText = recievedText.split('See also')[0];

      if (finalText.length > 1) { 
        console.log('finalText length:', finalText.length);
      }
      
      // Send the finalText to a file
      try {
        let formattedName = name.replace(/\s/g, '');
        fs.writeFileSync(`./scraped_articles/${formattedName}.txt`, finalText);
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });

  it('should run the generate files script', async function() {
    this.timeout(60000); // Set timeout to 60 seconds (60000 milliseconds) - still figuring out an optimal value
    try {
      const response = await axios.post('http://localhost:3000/generate-files', { nameArr: names });
      assert.equal(response.status, 200);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      assert.fail('Failed to run the generated files script');
    }
  });
});