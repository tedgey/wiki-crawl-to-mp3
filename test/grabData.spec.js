const { By, Builder, Browser } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const assert = require('assert')
const axios = require('axios')
const fs = require('fs')

describe('Wiki crawling', function () {
  let driver

  const topic = ['baseball']

  const names = ['Albert Pujols']

  before(async function () {
    // Set Chrome options to run in headless mode
    let options = new chrome.Options()
    options.addArguments('headless')
    options.addArguments('disable-gpu')
    options.addArguments('window-size=1920,1080')

    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build()
  })

  after(async function () {
    await driver.quit()
  })

  // Loop through names array and create tests dynamically
  names.forEach((name) => {
    it(`should grab text from wikipedia for ${name}`, async function () {
      this.timeout(60000) // Set timeout to 60 seconds (60000 milliseconds)
      let wikiName = name.replace(/\s/g, '_')
      await driver.get(`https://en.wikipedia.org/wiki/${wikiName}`)

      let title = await driver.getTitle()
      assert.equal(`${name} - Wikipedia`, title)

      let firstHeading = await driver.findElement(By.id('firstHeading'))
      let expectedHeading = await firstHeading.getText()
      assert.equal(`${name}`, expectedHeading)

      let articleText = await driver.findElement(By.id('mw-content-text'))
      let recievedText = await articleText.getText()

      // In recievedText IF we see "See also" cut out all text after that
      let finalText = recievedText.split('See also')[0]

      if (finalText.length > 1) {
        console.log('finalText length:', finalText.length)
      }

      // Send the finalText to a file
      try {
        let formattedName = name.replace(/\s/g, '')
        fs.writeFileSync(
          `./content/scraped_articles/${formattedName}.txt`,
          finalText
        )
      } catch (error) {
        console.error('Error:', error)
      }
    })
  })

  it('should run the generate files script', async function () {
    this.timeout(60000) // Set timeout to 60 seconds (60000 milliseconds)
    console.log('nameArr:', names)
    console.log('topic:', topic)
    try {
      const response = await axios.post(
        'http://localhost:3000/generate-files',
        { nameArr: names, topic: topic }
      )
      console.log('Request payload:', { nameArr: names, topic: topic })
      assert.equal(response.status, 200)
      console.log('Response:', response.data)
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      )
      assert.fail('Failed to run the generated files script')
    }
  })
})
