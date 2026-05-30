const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function loginTest() {

    // Opciones headless para GitHub Actions
    const options = new chrome.Options();

    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    // Crear navegador Chrome headless
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {

        console.log("Abriendo login...");

        // Abrir aplicación
        await driver.get('http://localhost:5173/login#');

        // Esperar input email
        await driver.wait(
            until.elementLocated(By.css('input[type="email"]')),
            10000
        );

        // Email
        await driver.findElement(By.css('input[type="email"]'))
            .sendKeys('eduardo.valdivia.lugo@cuchi.net');

        // Password
        await driver.findElement(By.css('input[type="password"]'))
            .sendKeys('ositoBimbo');

        // Click login
        await driver.findElement(By.css('button[type="submit"]'))
            .click();

        // Esperar dashboard
        await driver.wait(
            until.urlContains('/admin/dashboard'),
            10000
        );

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/admin/dashboard')) {

            console.log("Prueba exitosa");
            console.log("Login correcto");

        } else {

            throw new Error("No redirigió correctamente");

        }

    } catch (error) {

        console.error("Error en prueba Selenium:");
        console.error(error);

        process.exit(1);

    } finally {

        await driver.quit();

    }
}

loginTest();