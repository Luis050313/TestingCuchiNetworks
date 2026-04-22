const { Builder, By, Key, until } = require('selenium-webdriver');

(async function () {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.google.com');

    let input = await driver.findElement(By.name('q'));
    await input.sendKeys('Hola Selenium', Key.RETURN);

    await driver.wait(until.titleContains('Selenium'), 5000);

    console.log("Funciona 👍");
  } catch (e) {
    console.log("Error:", e);
  } finally {
    await driver.quit();
  }
})();